/**
 * What a sheet picks up on a desk: a coffee ring where a cup was set down
 * (twice, the second fainter) and a scatter of age spots. Painted behind
 * everything and scrolled with the page; purely decorative, no JS, and only
 * where there is room for them (see .paper-marks).
 */
export function PaperMarks() {
  return (
    <div aria-hidden="true" className="paper-marks pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <span className="paper-stain" style={{ top: 1180, left: "min(calc(50% + 28rem), calc(100% - 6rem))", width: 250, height: 250, rotate: "-18deg" }} />
      <span
        className="paper-stain opacity-55"
        style={{ top: "74%", left: "max(calc(50% - 42rem), -8rem)", width: 210, height: 210, rotate: "140deg" }}
      />
      <span className="paper-foxing" />
    </div>
  );
}
