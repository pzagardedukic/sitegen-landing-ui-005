import {
  brandBase,
  footerPalette,
  headerPalette,
  type BrandColors,
} from "./brand";

/*
 * Defaults only — the site's theme settings override primary, secondary and text.
 * Everything else on the palette is derived from those three in ./brand.ts, so a
 * customer's colors reach the whole page and not just the buttons.
 *
 * The three defaults are the Lumiera Figma tokens: primary #b48e5a (gold), secondary
 * #d9a7a0 (rose) and text #1a1a1a.
 *
 * DARK (ui-005): the trio is the same as in ui-004 — it is the same theme. What changes is
 * what gets built out of it: the page ground is the far dark end of primary, page type its
 * far light end, and the customer's `text` is kept for type laid on their own light
 * colours. The derivation lives in brandBase() so the override path matches exactly.
 */
export const brandDefaults: BrandColors = {
  primary: "#B48E5A",
  secondary: "#D9A7A0",
  text: "#1A1A1A",
};

export const colorConfig = {
  ...brandBase(brandDefaults),
  header: headerPalette(brandDefaults),
  footer: footerPalette(),
};
