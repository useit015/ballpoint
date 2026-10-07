import { Button } from "@/registry/ballpoint/ui/button";
import { InkIcon } from "@/registry/ballpoint/ui/ink-icons";

export default function ButtonIcons() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-5">
        <Button seed="bi-send">
          <InkIcon name="send" /> Send
        </Button>
        <Button variant="outline" seed="bi-download">
          <InkIcon name="download" /> Download
        </Button>
        <Button variant="secondary" seed="bi-mail">
          Email me <InkIcon name="mail" />
        </Button>
        <Button variant="ghost" seed="bi-copy">
          <InkIcon name="copy" /> Copy link
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-5">
        <Button size="icon-xs" variant="outline" seed="bi-xs" aria-label="Bookmark">
          <InkIcon name="bookmark" />
        </Button>
        <Button size="icon-sm" variant="outline" seed="bi-sm" aria-label="Star">
          <InkIcon name="star" />
        </Button>
        <Button size="icon" variant="outline" seed="bi-md" aria-label="Settings">
          <InkIcon name="settings" />
        </Button>
        <Button size="icon-lg" variant="outline" seed="bi-lg" aria-label="Delete">
          <InkIcon name="trash" />
        </Button>
        <Button size="icon" variant="destructive" seed="bi-destructive" aria-label="Delete forever">
          <InkIcon name="trash" />
        </Button>
      </div>
    </div>
  );
}
