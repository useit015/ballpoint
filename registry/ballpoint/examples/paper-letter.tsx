import { Paper } from "@/registry/ballpoint/ui/paper";

export default function PaperLetter() {
  return (
    <Paper lifted variant="ruled" margin edge="dog-ear" stains={1} seed="pl-letter" tilt={-1} className="w-full max-w-md py-8">
      <p className="text-ink-3">Tuesday</p>
      <p>Dear Ada,</p>
      <p>The ink arrived, and the cream notebooks are exactly the shade I hoped for. I have already filled four pages.</p>
      <p>More soon,</p>
      <p className="font-bold">Grace</p>
    </Paper>
  );
}
