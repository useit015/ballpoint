import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "@/registry/ballpoint/ui/alert-dialog";
import { Button } from "@/registry/ballpoint/ui/button";
import { InkIcon } from "@/registry/ballpoint/ui/ink-icons";

export default function AlertDialogSmall() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline" seed="ads-open" />}>Leave the page</AlertDialogTrigger>
      <AlertDialogContent size="sm" seed="ads">
        <AlertDialogHeader>
          <AlertDialogMedia>
            <InkIcon name="save" />
          </AlertDialogMedia>
          <AlertDialogTitle>Leave without saving?</AlertDialogTitle>
          <AlertDialogDescription>Your last three lines will be lost.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel seed="ads-stay">Stay</AlertDialogCancel>
          <AlertDialogAction seed="ads-leave">Leave</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
