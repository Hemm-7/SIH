import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/*
 * Scaffold-only placeholder. Every route below resolves so the shell can be run
 * and navigated end-to-end before any feature work starts — but nothing here is
 * a design decision. Each page is replaced wholesale by its own task, which must
 * run the design-brief brainstorm -> critique -> build loop first.
 */
export function PlaceholderPage({
  title,
  task,
  builds,
}: {
  title: string;
  task: string;
  builds: string[];
}) {
  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Not built yet — {task}.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          {builds.map((b) => (
            <li key={b}>
              <code className="font-mono text-xs">{b}</code>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
