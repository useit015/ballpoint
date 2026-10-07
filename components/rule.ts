/**
 * Each entry of a list is ruled off underneath by hand, the same way the
 * registry's Table and Accordion do it. Put `inkRules` on the list.
 */
export const ruledItem =
  "relative after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-[2.5px] after:h-[5px] after:bg-ink-4 after:[mask-image:var(--ink-rule-1)] after:[mask-size:100%_100%] after:[mask-repeat:no-repeat] nth-[3n+2]:after:[mask-image:var(--ink-rule-2)] nth-[3n]:after:[mask-image:var(--ink-rule-3)] last:after:hidden";
