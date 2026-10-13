"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { bubble, flameShapes, mug, peek, textWidth } from "@/lib/art/creatures";
import { bigPines, camp, pineBase, trailY } from "@/lib/art/footer";
import { crouchFrame, sitFrames, standFrames, STRIDE, turnFrame, waveFrames, walkFrames, type Frame, type Look } from "@/lib/art/people";
import { Birds, type Bird } from "@/components/art/life/birds";
import { Hit, Poke } from "@/components/art/life/poke";
import { Trees } from "@/components/art/life/trees";
import { useLoop } from "@/components/art/life/use-loop";

// ─── The people on the trail ────────────────────────────────────────────

const looks: Look[] = [
  { h: 53, hat: "brim", pack: true, pole: false, seed: "hiker-a" },
  { h: 50, hat: "beanie", pack: true, pole: true, seed: "hiker-b" },
  { h: 55, hat: "none", pack: true, pole: false, seed: "hiker-c" },
  { h: 48, hat: "brim", pack: false, pole: true, seed: "hiker-d" },
  { h: 52, hat: "beanie", pack: true, pole: false, seed: "hiker-e" },
];

/** Where each starts: along the trail, which way, and what it is doing. */
const starts: { x: number; dir: 1 | -1; at?: "sit" | "look"; cruise: number; lane: number }[] = [
  { x: 560, dir: 1, cruise: 27, lane: 1 },
  { x: 706, dir: 1, cruise: 24, lane: -3 },
  { x: 930, dir: -1, cruise: 28, lane: 3 },
  { x: 1050, dir: 1, cruise: 25, lane: -1 },
  { x: camp.fire - 30, dir: 1, at: "sit", cruise: 26, lane: 2 },
];

const says = ["Hi!", "Nice day for it.", "Nearly there.", "Mind the roots.", "Is that coffee?", "Fire's lit.", "Look up!", "Drawn by hand.", "Shh, the birds."];
const mugSays = ["Still hot.", "Black, no sugar.", "Camp coffee."];
const tentSays = ["Five more minutes.", "Is it morning?", "Zzz... oh. Hi."];

/** The seats round the fire, nearest first, and where those who only stop to look stand. */
const seats = [camp.fire - 46, camp.fire - 80];
const lookouts = [camp.fire - 124, camp.fire - 156, camp.fire - 188];

type Mode = "walk" | "stand" | "turn" | "crouch" | "sit" | "rise" | "wave" | "gone";
type Plan = { goal: number; seat: number | null };

type Hiker = {
  look: Look;
  x: number;
  dir: 1 | -1;
  mode: Mode;
  /** Seconds in this mode. */
  t: number;
  /** How far through a stride the feet are, in whole strides. */
  phase: number;
  v: number;
  cruise: number;
  lane: number;
  plan: Plan;
  /** A pointer is over it, or it is being talked to: it stops and waits. */
  held: boolean;
  /** The phase it is stopping at. */
  stopAt: number | null;
  /** It has got to where it was going, and is stopping there. */
  atGoal: boolean;
  /** What it does when it next stands still: wave, if it was poked. */
  waving: number;
  /** Seconds until it gets going again. */
  rest: number;
  shown: Frame | null;
};

const N = 12;
const scaleAt = (x: number) => 0.8 + 0.32 * Math.min(1, Math.max(0, (x - camp.trailFrom) / (camp.trailTo - camp.trailFrom)));
/** The angle of the ground under a walker, so feet stay on it. */
const slopeAt = (x: number) => Math.atan2(trailY(x + 8) - trailY(x - 8), 16);

/** A moment between `a` and `b` seconds: nobody keeps the same time as anybody else. */
const between = (a: number, b: number) => a + Math.random() * (b - a);
const wrap = (n: number) => ((n % 1) + 1) % 1;
/** The next phase at which the feet are under the body (a mid-stance), at least a little way on. */
const nextPlanted = (phase: number) => Math.ceil((phase + 0.1 - 0.25) * 2) / 2 + 0.25;

function newPlan(seatsTaken: (number | null)[], from: number): Plan {
  const free = seatsTaken.findIndex((s, i) => s === null && seats[i] > from);
  if (free >= 0) return { goal: seats[free], seat: free };
  return { goal: lookouts[Math.floor(Math.abs(from * 7.3)) % lookouts.length], seat: null };
}

function makeHikers(): Hiker[] {
  const taken: (number | null)[] = seats.map(() => null);
  return looks.map((look, i) => {
    const s = starts[i];
    const sitting = s.at === "sit";
    const plan: Plan = sitting ? { goal: seats[0], seat: 0 } : newPlan(taken, s.x);
    if (plan.seat !== null) taken[plan.seat] = i;
    return {
      look,
      x: sitting ? seats[0] : s.x,
      dir: 1,
      mode: sitting ? "sit" : "walk",
      t: i * 0.37,
      phase: i * 0.31,
      v: sitting ? 0 : s.cruise,
      cruise: s.cruise,
      lane: s.lane,
      plan,
      held: false,
      stopAt: null,
      atGoal: false,
      waving: 0,
      rest: sitting ? 6 : 0,
      shown: null,
    };
  });
}

type Say = { text: string; key: number };

function Hikers() {
  const frames = useMemo(
    () =>
      looks.map((look) => ({
        walk: walkFrames(look, N),
        stand: standFrames(look),
        wave: waveFrames(look),
        sit: sitFrames(look),
        crouch: crouchFrame(look),
        turn: turnFrame(look),
      })),
    [],
  );
  const folk = useRef<Hiker[]>(makeHikers());
  const seatOf = useRef<(number | null)[]>(seats.map((_, i) => (i === 0 ? 4 : null)));
  const root = useRef<(SVGGElement | null)[]>([]);
  const fig = useRef<(SVGGElement | null)[]>([]);
  const far = useRef<(SVGPathElement | null)[]>([]);
  const near = useRef<(SVGPathElement | null)[]>([]);
  const group = useRef<SVGGElement>(null);
  const [said, setSaid] = useState<(Say | null)[]>(looks.map(() => null));
  const sayTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const turns = useRef(0);
  const active = useRef(0);
  useEffect(() => {
    const held = sayTimers.current;
    return () => held.forEach(clearTimeout);
  }, []);

  const frameFor = (h: Hiker, f: (typeof frames)[number]): Frame => {
    switch (h.mode) {
      case "walk":
        return f.walk[Math.floor(wrap(h.phase) * N) % N];
      case "stand":
        return f.stand[Math.floor(h.t * 1.1) % 2];
      case "wave":
        return f.wave[Math.floor(h.t * 5) % 2];
      case "sit":
        return f.sit[Math.floor(h.t * 1.3) % 2];
      case "crouch":
      case "rise":
        return f.crouch;
      case "turn":
        return f.turn;
      default:
        return f.stand[0];
    }
  };

  /** Put a hiker where its state says. */
  const show = (i: number) => {
    const h = folk.current[i];
    const r = root.current[i];
    const g = fig.current[i];
    if (!r || !g) return;
    const s = scaleAt(h.x);
    const sk = (slopeAt(h.x) * 180) / Math.PI;
    r.setAttribute("transform", `translate(${h.x.toFixed(1)} ${(trailY(h.x) + h.lane).toFixed(1)})`);
    g.setAttribute("transform", `skewY(${sk.toFixed(2)}) scale(${(s * h.dir).toFixed(3)} ${s.toFixed(3)})`);
    const frame = frameFor(h, frames[i]);
    if (frame !== h.shown) {
      far.current[i]?.setAttribute("d", frame.far);
      near.current[i]?.setAttribute("d", frame.near);
      h.shown = frame;
    }
    const gone = h.mode === "gone" && h.t > 0.05;
    r.style.opacity = gone ? "0" : "1";
  };

  const stopPlanted = (h: Hiker) => {
    if (h.stopAt === null) h.stopAt = nextPlanted(h.phase);
  };

  const think = (i: number, dt: number) => {
    const h = folk.current[i];
    h.t += dt;
    const sc = scaleAt(h.x);
    const stride = STRIDE * h.look.h * sc;
    switch (h.mode) {
      case "walk": {
        // It starts to stop half a stride short, so it comes to rest about where it was going.
        const arrived = h.dir > 0 ? h.x >= h.plan.goal - 0.5 * stride : h.x <= camp.trailFrom;
        if (arrived && h.dir < 0) {
          h.mode = "gone";
          h.t = 0;
          h.rest = between(3, 12);
          return;
        }
        if (arrived) h.atGoal = true;
        if (arrived || h.held) stopPlanted(h);
        let want = h.cruise;
        if (h.stopAt !== null) {
          // Slow so that the feet come to rest under the body, on the pose a stand begins from.
          const left = Math.max(0, (h.stopAt - h.phase) * stride);
          want = Math.min(want, Math.sqrt(2 * 70 * left) + 1.5);
          if (left < 0.4) {
            h.stopAt = null;
            h.v = 0;
            h.mode = "stand";
            h.t = 0;
            // Somebody who is only looking at the view looks a good while.
            h.rest = h.atGoal ? between(1.2, 3) + (h.plan.seat === null ? between(2, 6) : 0) : 0.05;
            return;
          }
        }
        h.v += Math.max(-110 * dt, Math.min(60 * dt, want - h.v));
        const dist = h.v * dt;
        h.x += h.dir * dist;
        h.phase += dist / stride;
        break;
      }
      case "stand": {
        if (h.waving > 0) {
          h.mode = "wave";
          h.t = 0;
          return;
        }
        if (h.held) return;
        h.rest -= dt;
        if (h.rest > 0) return;
        if (h.atGoal && h.plan.seat !== null) {
          h.mode = "crouch";
          h.t = 0;
        } else if (h.atGoal) {
          // Had a look at the view: back the way it came.
          h.mode = "turn";
          h.t = 0;
        } else {
          h.mode = "walk";
          h.t = 0;
        }
        break;
      }
      case "wave":
        if (h.t > 1.7) {
          h.waving = 0;
          h.mode = "stand";
          h.t = 0;
          h.rest = 0.3;
        }
        break;
      case "crouch":
        if (h.t > 0.22) {
          h.mode = "sit";
          h.t = 0;
          h.rest = between(6, 15);
        }
        break;
      case "sit":
        h.rest -= dt;
        if (h.rest < 0 && !h.held) {
          h.mode = "rise";
          h.t = 0;
        }
        break;
      case "rise":
        if (h.t > 0.22) {
          if (h.plan.seat !== null) seatOf.current[h.plan.seat] = null;
          h.plan = { goal: camp.trailFrom, seat: null };
          h.atGoal = false;
          h.mode = "turn";
          h.t = 0;
        }
        break;
      case "turn":
        if (h.t > 0.34) {
          h.dir = h.dir > 0 ? -1 : 1;
          h.atGoal = false;
          h.mode = "walk";
          h.t = 0;
          h.phase = 0.25;
          if (h.dir > 0) {
            h.plan = newPlan(seatOf.current, h.x);
            if (h.plan.seat !== null) seatOf.current[h.plan.seat] = i;
          } else h.plan = { goal: camp.trailFrom, seat: null };
        }
        break;
      case "gone":
        if (h.t > h.rest) {
          h.x = camp.trailFrom;
          h.dir = 1;
          h.atGoal = false;
          h.mode = "walk";
          h.t = 0;
          h.v = 0;
          h.phase = 0.25;
          h.plan = newPlan(seatOf.current, h.x);
          if (h.plan.seat !== null) seatOf.current[h.plan.seat] = i;
        }
        break;
    }
  };

  useLoop(group, (dt) => {
    for (let i = 0; i < looks.length; i++) {
      think(i, dt);
      show(i);
    }
    active.current = 1;
  });

  // Where they stand before the loop (and without it, under reduced motion).
  useEffect(() => {
    for (let i = 0; i < looks.length; i++) {
      const h = folk.current[i];
      if (matchMedia("(prefers-reduced-motion: reduce)").matches && h.mode === "walk") {
        h.mode = "stand";
        h.v = 0;
      }
      show(i);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Arrow keys walk the keyboard from one hiker to the next. */
  const arrows = (e: React.KeyboardEvent<SVGGElement>) => {
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    const all = [...(group.current?.querySelectorAll<SVGGElement>(".hiker-poke") ?? [])];
    const at = all.indexOf(e.target as SVGGElement);
    if (at < 0) return;
    e.preventDefault();
    all[(at + step + all.length) % all.length].focus();
  };

  const speak = (i: number, text?: string) => {
    const h = folk.current[i];
    const t = text ?? says[(turns.current++ + i * 3) % says.length];
    setSaid((all) => all.map((s, k) => (k === i ? { text: t, key: (s?.key ?? 0) + 1 } : s)));
    if (h.mode === "walk" || h.mode === "stand") {
      h.waving = 1;
      h.held = true;
    }
    sayTimers.current.push(
      setTimeout(() => {
        h.held = false;
      }, 1900),
      setTimeout(() => setSaid((all) => all.map((s, k) => (k === i && s && s.text === t ? null : s))), 3100),
    );
  };

  return (
    <g ref={group} className="hikers" onKeyDown={arrows}>
      {looks.map((look, i) => {
        const initial = standFrames(look)[0];
        return (
          <g key={i} ref={(el) => void (root.current[i] = el)} className="hiker">
            <Poke label={`Hiker ${i + 1} of ${looks.length}: say hello`} onPoke={() => speak(i)} className="hiker-poke" tabIndex={i === 0 ? 0 : -1} onPointerEnter={() => (folk.current[i].held = true)} onPointerLeave={() => (folk.current[i].held = false)} onFocus={() => (folk.current[i].held = true)} onBlur={() => (folk.current[i].held = false)}>
              <g ref={(el) => void (fig.current[i] = el)} className="fig">
                <path ref={(el) => void (far.current[i] = el)} className="far" d={initial.far} />
                <path ref={(el) => void (near.current[i] = el)} className="near" d={initial.near} />
                <path className="shadow" d="M-13 1.4L12 1.1M-9 3.2L7 3" />
                <Hit x={-13} y={-look.h * 1.1} width={26} height={look.h * 1.1 + 4} />
              </g>
            </Poke>
            {said[i] && <Say key={said[i]!.key} text={said[i]!.text} seed={`${look.seed}-${said[i]!.key}`} lift={look.h * 1.02 + 6} />}
          </g>
        );
      })}
    </g>
  );
}

/** A few words in a hand-drawn bubble, above a head: the bubble is pulled, then the words written in. */
function Say({ text, seed, lift }: { text: string; seed: string; lift: number }) {
  const size = 12;
  const w = textWidth(text, size) + 8;
  const h = 18;
  return (
    <g className="say" transform={`translate(${(-w / 2 + 4).toFixed(1)} ${(-lift - h - 8).toFixed(1)})`} aria-hidden="true">
      <path className="say-box" d={bubble(seed, w, h, w / 2 - 4)} pathLength={1} style={{ "--w": 0.95 } as CSSProperties} />
      <text className="say-text" x={w / 2} y={h * 0.7} textAnchor="middle" fontSize={size}>
        {text}
      </text>
    </g>
  );
}

// ─── The camp ───────────────────────────────────────────────────────────

const flames = flameShapes(6, "camp-flames");
const sparkSlots = Array.from({ length: 9 }, (_, i) => i);

function Camp() {
  const fire = useRef<SVGGElement>(null);
  const outer = useRef<SVGPathElement>(null);
  const inner = useRef<SVGPathElement>(null);
  const sparks = useRef<(SVGCircleElement | null)[]>([]);
  const pool = useRef(sparkSlots.map(() => ({ x: 0, y: 0, vx: 0, vy: 0, life: 0 })));
  const shape = useRef({ i: 0, next: 0 });
  const stoked = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [open, setOpen] = useState(false);
  const [line, setLine] = useState<Say | null>(null);
  const [sip, setSip] = useState<Say | null>(null);
  const tent = useRef(0);
  const cup = useRef(0);
  const cupParts = useMemo(() => mug(), []);
  useEffect(() => {
    const held = timers.current;
    return () => held.forEach(clearTimeout);
  }, []);
  const base = trailY(camp.fire) + 5;
  const tentBase = trailY(camp.tent) + 4;
  const door = { x: camp.tent + camp.tentW * 0.1, y: tentBase - camp.tentH * 0.28 };
  const peeking = useMemo(() => peek("tent"), []);
  const interior = useMemo(() => {
    const w = camp.tentW;
    const h = camp.tentH;
    const a = camp.tent - w * 0.04;
    const b = camp.tent + w * 0.1;
    const c = camp.tent + w * 0.24;
    let d = "";
    for (let y = tentBase - 1.5; y > tentBase - h * 0.58; y -= 2.3) {
      const t = (tentBase - y) / (h * 0.62);
      d += `M${(a + (b - a) * t + 0.9).toFixed(1)} ${y.toFixed(1)}L${(c + (b - c) * t - 0.9).toFixed(1)} ${(y + 0.3).toFixed(1)}`;
    }
    return d;
  }, [tentBase]);

  useLoop(fire, (dt, clock) => {
    // The flame: each so often a different one of the several drawn.
    if (clock >= shape.current.next) {
      shape.current.i = (shape.current.i + 1 + Math.floor(Math.random() * (flames.length - 1))) % flames.length;
      shape.current.next = clock + 0.08 + Math.random() * 0.1;
      outer.current?.setAttribute("d", flames[shape.current.i].outer);
      inner.current?.setAttribute("d", flames[shape.current.i].inner);
    }
    // Sparks climb, drift and go out.
    const rate = stoked.current > 0 ? 7 : 1.1;
    stoked.current = Math.max(0, stoked.current - dt);
    pool.current.forEach((s, i) => {
      if (s.life <= 0) {
        if (Math.random() < rate * dt) Object.assign(s, { x: (Math.random() - 0.5) * 6, y: -10, vx: (Math.random() - 0.5) * 14, vy: -(18 + Math.random() * 22), life: 0.9 + Math.random() * 0.8 });
      } else {
        s.life -= dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vx += (Math.random() - 0.5) * 30 * dt;
      }
      const el = sparks.current[i];
      if (el) {
        el.setAttribute("cx", s.x.toFixed(1));
        el.setAttribute("cy", s.y.toFixed(1));
        el.style.opacity = s.life > 0 ? String(Math.min(1, s.life * 1.6)) : "0";
      }
    });
  });

  const stoke = () => {
    const el = fire.current;
    if (!el) return;
    stoked.current = 1.6;
    el.removeAttribute("data-stoked");
    void el.getBoundingClientRect();
    el.setAttribute("data-stoked", "");
    timers.current.push(setTimeout(() => el.removeAttribute("data-stoked"), 1700));
  };
  const look = () => {
    if (open) return;
    setOpen(true);
    setLine({ text: tentSays[tent.current++ % tentSays.length], key: tent.current });
    timers.current.push(setTimeout(() => setOpen(false), 3400), setTimeout(() => setLine(null), 3000));
  };

  const sipIt = () => {
    setSip({ text: mugSays[cup.current++ % mugSays.length], key: cup.current });
    timers.current.push(setTimeout(() => setSip(null), 2600));
  };
  const mugAt = { x: camp.fire + 44, y: base + 4 };

  return (
    <>
      <Poke label="The campfire: stoke it" onPoke={stoke} className="fire-poke">
        <g ref={fire} className="fire" transform={`translate(${camp.fire} ${base}) scale(1.55)`}>
          <g className="smoke-wisps">
            {[0, 1, 2].map((k) => (
              <path key={k} className="smoke" d={`M${k * 2 - 2} -19c3 -5 -3 -9 1 -14s-3 -9 1 -14`} style={{ "--w": 0.8, "--k": k } as CSSProperties} />
            ))}
          </g>
          <g className="flames">
            <path ref={outer} className="flame" d={flames[0].outer} style={{ "--w": 1.1 } as CSSProperties} />
            <path ref={inner} className="flame inner" d={flames[0].inner} style={{ "--w": 0.9 } as CSSProperties} />
          </g>
          {sparkSlots.map((i) => (
            <circle key={i} ref={(el) => void (sparks.current[i] = el)} className="spark" r={0.6} cx={0} cy={-10} />
          ))}
          <Hit x={-14} y={-30} width={28} height={36} />
        </g>
      </Poke>
      <Poke label="The tin mug: take a sip" onPoke={sipIt} className="mug-poke">
        <g transform={`translate(${mugAt.x} ${mugAt.y}) scale(0.8)`}>
          <path d={cupParts.stone} style={{ "--w": 0.8 } as CSSProperties} />
          <path className="smoke" d={cupParts.steam} style={{ "--w": 0.75, "--k": 0 } as CSSProperties} />
          <path className="smoke" d={cupParts.steam} transform="translate(2.4 -1)" style={{ "--w": 0.75, "--k": 1.2 } as CSSProperties} />
          <path d={cupParts.body} style={{ "--w": 1 } as CSSProperties} />
          <path d={cupParts.rim} style={{ "--w": 0.9 } as CSSProperties} />
          <path d={cupParts.band} style={{ "--w": 0.7 } as CSSProperties} />
          <path d={cupParts.handle} style={{ "--w": 0.95 } as CSSProperties} />
          <Hit x={-10} y={-26} width={22} height={32} />
        </g>
        {sip && (
          <g transform={`translate(${mugAt.x} ${mugAt.y})`}>
            <Say key={sip.key} text={sip.text} seed={`mug-${sip.key}`} lift={16} />
          </g>
        )}
      </Poke>
      <Poke label="The tent: see who is in" onPoke={look} className="tent-poke" data-open={open ? "" : undefined}>
        <path className="tent-dark" d={interior} style={{ "--w": 0.8 } as CSSProperties} />
        <g transform={`translate(${door.x.toFixed(1)} ${door.y.toFixed(1)}) scale(1.3)`} className="peek">
          <circle className="peek-fill" r={4.4} />
          <path d={peeking.head} style={{ "--w": 0.95 } as CSSProperties} />
          <path d={peeking.cap} style={{ "--w": 0.95 } as CSSProperties} />
          <path d={peeking.face} style={{ "--w": 0.95 } as CSSProperties} />
          <path className="peek-arm" d={peeking.arm} style={{ "--w": 0.95 } as CSSProperties} />
        </g>
        <Hit x={camp.tent - camp.tentW / 2} y={tentBase - camp.tentH - 2} width={camp.tentW + 8} height={camp.tentH + 6} />
        {line && (
          <g transform={`translate(${camp.tent} ${tentBase})`}>
            <Say key={line.key} text={line.text} seed={`tent-${line.key}`} lift={camp.tentH + 8} />
          </g>
        )}
      </Poke>
    </>
  );
}

// ─── The lot ────────────────────────────────────────────────────────────

const birds: Bird[] = [
  { x: 470, y: 70, s: 8, to: [-330, -26], dur: 32, delay: 0, beat: 1.05 },
  { x: 506, y: 54, s: 6.5, to: [-320, -22], dur: 34, delay: 1.2, beat: 0.9 },
  { x: 442, y: 52, s: 5.5, to: [-300, -18], dur: 31, delay: 2.2, beat: 0.82 },
];

/** Everything that lives on the hillside: pines that sway, birds, the people on the trail, the camp. */
export default function FooterLife() {
  return (
    <>
      <Trees trees={bigPines.map((p) => ({ cx: p.cx, base: pineBase(p.cx), h: p.h, fat: p.fat }))} bits={13} />
      <Birds birds={birds} />
      <Camp />
      <Hikers />
    </>
  );
}
