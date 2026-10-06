import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/registry/ballpoint/ui/select";

const pens = [
  { label: "Blue ballpoint", value: "blue" },
  { label: "Black fineliner", value: "black" },
  { label: "Green ink", value: "green" },
];

const pencils = [
  { label: "HB pencil", value: "hb" },
  { label: "2B pencil", value: "2b" },
];

export default function SelectDemo() {
  return (
    <div className="flex flex-wrap items-center gap-5">
      <Select items={[...pens, ...pencils]} defaultValue="blue">
        <SelectTrigger aria-label="Pen" className="w-52" seed="select">
          <SelectValue />
        </SelectTrigger>
        <SelectContent seed="select-list">
          <SelectGroup>
            <SelectLabel>Pens</SelectLabel>
            {pens.map((pen) => (
              <SelectItem key={pen.value} value={pen.value}>
                {pen.label}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Pencils</SelectLabel>
            {pencils.map((pen) => (
              <SelectItem key={pen.value} value={pen.value}>
                {pen.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select items={pens}>
        <SelectTrigger aria-label="Pen, small" size="sm" className="w-44" seed="select-sm">
          <SelectValue placeholder="Pick a pen" />
        </SelectTrigger>
        <SelectContent seed="select-sm-list">
          {pens.map((pen) => (
            <SelectItem key={pen.value} value={pen.value}>
              {pen.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
