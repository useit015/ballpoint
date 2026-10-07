import { Paper } from "@/registry/ballpoint/ui/paper";

export default function PaperLetter() {
  return (
    <Paper lifted variant="ruled" margin stains={1} seed="pl-letter" className="w-full max-w-md py-8">
      <p className="text-ink-3">Tuesday</p>
      <p>Dear Ada,</p>
      <p>The ink arrived, and the cream notebooks are exactly the shade I hoped for. I have already filled four pages.</p>
      <p>More soon,</p>
      <p>Grace</p>
    </Paper>
  );
}
