import { cn } from "@/lib/utils";

/*
 * Static ASCII/glitch texture placeholder. Codex is building a real
 * image-to-ASCII generator in parallel (see .agent/inbox); this fixed block
 * is a stand-in with the right visual weight and register until that lands
 * — swap the <pre> content for generated output, keep the frame.
 */
const BLOCK = String.raw`
+--------------------------------------+
|  ..  ::  ##  ::  ..  ::  ##  ::  ..   |
|  ##  ::  ..  ##  ::  ..  ##  ::  ##   |
|  ::  ##  ::  ..  ##  ::  ..  ##  ::   |
+--------------------------------------+
`.trim();

export function AsciiBlock({ className }: { className?: string }) {
  return (
    <pre aria-hidden className={cn("overflow-hidden font-mono leading-tight text-accent", className)}>
      {BLOCK}
    </pre>
  );
}
