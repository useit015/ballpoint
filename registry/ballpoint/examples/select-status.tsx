import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/ballpoint/ui/select";

const statuses = [
  { label: "Draft", value: "draft", note: "Only you" },
  { label: "In review", value: "review", note: "Shared with editors" },
  { label: "Published", value: "published", note: "Anyone with the link" },
  { label: "Archived", value: "archived", note: "Hidden" },
];

export default function SelectStatus() {
  return (
    <Select items={statuses} defaultValue="review">
      <SelectTrigger aria-label="Status" className="w-64" seed="ss-status">
        <SelectValue />
      </SelectTrigger>
      <SelectContent seed="ss-list" className="w-64">
        {statuses.map((status) => (
          <SelectItem key={status.value} value={status.value}>
            <span className="flex flex-col leading-tight">
              {status.label}
              <span className="text-sm text-ink-3">{status.note}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
