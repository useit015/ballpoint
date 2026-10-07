import { Button } from "@/registry/ballpoint/ui/button";
import { InkIcon } from "@/registry/ballpoint/ui/ink-icons";

export default function InkIconsButtons() {
  return (
    <div className="flex flex-wrap items-center gap-5">
      <Button variant="outline" seed="iib-star">
        <InkIcon name="star" /> Star
      </Button>
      <Button variant="outline" seed="iib-bookmark">
        <InkIcon name="bookmark" /> Save
      </Button>
      <Button size="icon" variant="ghost" aria-label="Notifications" seed="iib-bell">
        <InkIcon name="bell" />
      </Button>
      <Button size="icon" variant="ghost" aria-label="Favourite" seed="iib-heart">
        <InkIcon name="heart" />
      </Button>
    </div>
  );
}
