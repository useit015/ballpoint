// Slips of paper laid on the page.

export type SlipKind = "plain" | "ruled";

/**
 * The paper of a slip laid on the page. Every code slip is the same ruled
 * notebook paper and every example slip is the same plain card, so the page
 * reads as one set. (The coffee rings, dog-ears and tape of an earlier pass
 * are kept in globals.css, switched on with data-slip="stained", "folded" or
 * "taped", if a slip ever wants one.)
 */
export function slipProps(kind: SlipKind): { "data-slip": SlipKind } {
  return { "data-slip": kind };
}
