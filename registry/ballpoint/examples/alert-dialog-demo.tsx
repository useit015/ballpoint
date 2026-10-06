import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/registry/ballpoint/ui/alert-dialog";
import { Button } from "@/registry/ballpoint/ui/button";
import { InkGlyph } from "@/registry/ballpoint/lib/ink-glyphs";

export default function AlertDialogDemo() {
  return (
    <div className="flex flex-wrap gap-5">
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="destructive" seed="alert-open" />}>Delete notebook</AlertDialogTrigger>
        <AlertDialogContent seed="alert">
          <AlertDialogHeader>
            <AlertDialogMedia seed="alert-media" className="text-destructive">
              <InkGlyph name="alert" />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete this notebook?</AlertDialogTitle>
            <AlertDialogDescription>All 48 pages go with it. This can&apos;t be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel seed="alert-cancel">Keep it</AlertDialogCancel>
            <AlertDialogAction variant="destructive" seed="alert-delete">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="outline" seed="alert-sm-open" />}>Small</AlertDialogTrigger>
        <AlertDialogContent size="sm" seed="alert-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Leave without saving?</AlertDialogTitle>
            <AlertDialogDescription>Your last few lines will be lost.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel seed="alert-sm-cancel">Stay</AlertDialogCancel>
            <AlertDialogAction seed="alert-sm-leave">Leave</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
