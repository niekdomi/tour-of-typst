import { Button } from "./ui/button";

export function NotFound(props: { onGoHome: () => void }) {
  return (
    <div class="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
      <div class="text-6xl">🍞</div>
      <h1 class="text-2xl font-bold">Oopsie daisy!</h1>
      <p class="text-muted-foreground max-w-md">
        That chapter slid off the plate, buttered-side down. The page you're looking for isn't part
        of this tour.
      </p>
      <Button onClick={props.onGoHome}>Back to the first chapter</Button>
    </div>
  );
}
