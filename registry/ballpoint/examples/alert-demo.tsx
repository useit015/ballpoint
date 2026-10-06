import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/registry/ballpoint/ui/alert";
import { Button } from "@/registry/ballpoint/ui/button";

function Note() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden="true">
      <path d="M10 3.4C5.8 3.2 3.3 6.2 3.5 10.1c.2 3.8 3 6.6 6.8 6.4 3.8-.2 6.3-3.1 6.2-6.7C16.4 6.1 13.8 3.6 10 3.4Z" />
      <path d="M10.1 9.2l-.1 4.4M10 6.3v.3" />
    </svg>
  );
}

export default function AlertDemo() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-6">
      <Alert seed="alert-note">
        <Note />
        <AlertTitle>The ink is still wet</AlertTitle>
        <AlertDescription>Changes save as you type; give it a second before closing the tab.</AlertDescription>
      </Alert>
      <Alert variant="destructive" seed="alert-error">
        <Note />
        <AlertTitle>The page couldn&apos;t be saved</AlertTitle>
        <AlertDescription>The connection dropped halfway. Nothing was lost; try again.</AlertDescription>
        <AlertAction>
          <Button size="xs" variant="destructive" seed="alert-retry">
            Retry
          </Button>
        </AlertAction>
      </Alert>
    </div>
  );
}
