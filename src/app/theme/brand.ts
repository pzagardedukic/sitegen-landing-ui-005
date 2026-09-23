import { alpha, darken, getContrastRatio, lighten } from "@mui/material/styles";

/*
 * Everything in this file is derived from the three colors a customer can actually
 * choose — primary, secondary and text — or is a fixed Lumiera token.
 *
 * It exists because createPreviewTheme() has an early `if (!hasOverrides) return baseTheme`,
 * which means the theme is built along two different paths. Anything computed from the
 * brand colors has to be computed identically on both, or the site freezes on the
 * defaults while still looking correct locally. Both paths call the functions below,
 * so there is only one definition to keep right.
 *
 * DARK (ui-005). This is the dark twin of ui-004: the same design, the same three brand
 * colors, the palette mirrored to a dark ground. Every value below stays a derivation, so a
 * customer who picks their own primary and secondary still gets a coherent dark page —
 * `darken(primary, …)` where the light theme had `lighten(primary, …)`, at amounts fitted
 * so the defaults land on the tokens drawn on the Figma page `dark — Lumiera`:
 * background #0D0A06, bg-alt #16110B, paper #1B150E, surface #201A10, placeholder #362B1B.
 *
 * The customer's `text` colour is deliberately NOT used as page type here (it is dark by
 * definition — the default is #1A1A1A, which would vanish). Dark type comes from the
 * light end of the primary instead; `text` still drives the header pill, where the ground
 * is light.
 */

export type BrandColors = {
  primary: string;
  secondary: string;
  text: string;
};

/*
 * Fixed Lumiera tokens. They are part of the theme rather than of the customer's brand:
 * mint is the wash under team and review cards, the hairline is the one neutral border the
 * whole design uses, overlay is the colour laid over photographs, and the slate is the
 * footer ground. A customer's colours do not reach them, on purpose — they are what keeps
 * any brand colour looking like this theme.
 *
 * In the dark twin the two light-ground tokens (mint, slate) are used as the *tint* that
 * is mixed into the dark ground rather than as the ground itself; `border` is no longer a
 * light hairline at all, so it is computed from primary instead (see brandSurfaces).
 */
const LUMIERA = {
  mint: "#ECF5F4",
  overlay: "#1A1A1A",
  slate: "#4C5C68",
  white: "#FFFFFF",
} as const;

/** Page ground of the dark theme — every other surface is measured against it. */
export function darkGround(primary: string): string {
  return darken(primary, 0.93);
}

/*
 * The four palette blocks that the light theme could take straight from the customer's
 * colours and the dark one cannot: on a dark ground the page needs a light type colour and
 * a ground derived from the brand, and the customer's own `text` (dark by definition) can
 * only be used ON their light colours, never as page type.
 *
 * Both theme paths call this — src/app/theme/colors.ts for the defaults and
 * createPreviewTheme() for a customer's overrides — so there is one definition, the same
 * reason headerPalette/footerPalette/brandSurfaces exist.
 */
/*
 * Lift a brand colour until it is readable on the dark ground.
 *
 * A fixed lift is not enough: it was fitted on Lumiera's gold (#B48E5A), and a customer
 * with a darker brand — #6E5A3C, say — landed at 4.07:1 for links and 3.95:1 for the badge
 * text laid on it, both under AA. The loop keeps the customer's hue and raises only as far
 * as it must; the cap stops a near-black brand from being lightened into a different colour
 * altogether (at which point nothing can save it and the page still reads, just without the
 * brand accent at small sizes).
 */
function liftToContrast(
  colour: string,
  ground: string,
  target: number,
): string {
  /*
   * The 12 % floor is the theme, not the contrast rule: it is what makes a light-theme
   * brand colour read as itself on a dark ground, and it is the value drawn on the Figma
   * page (Lumiera gold #B48E5A becomes #BD9C6E). The loop raises it further only when the
   * floor is not enough.
   */
  let lifted = lighten(colour, 0.12);
  for (let step = 1; step < 40; step += 1) {
    if (getContrastRatio(lifted, ground) >= target) break;
    lifted = lighten(colour, 0.12 + step * 0.02);
  }
  return lifted;
}

export function brandBase({ primary, secondary, text }: BrandColors) {
  const ground = darkGround(primary);
  const pageType = lighten(primary, 0.93);
  const primaryMain = liftToContrast(primary, ground, 4.5);

  return {
    primary: {
      /* Lifted until it is readable on the dark ground — see liftToContrast. */
      main: primaryMain,
      /*
       * Type ON the brand colour, where the ground is light again. The customer's own text
       * colour first; if their brand is dark enough that its own label would fail, the page
       * type takes over — one of the two always clears AA, because the brand sits between.
       */
      contrastText:
        getContrastRatio(text, primaryMain) >= 4.5 ? text : pageType,
    },
    secondary: {
      main: secondary,
      contrastText: text,
    },
    background: {
      default: ground,
      paper: darken(primary, 0.85),
    },
    text: {
      primary: pageType,
      /* Figma `text-muted` — the light theme's slate, lifted onto the dark ground. */
      secondary: lighten(LUMIERA.slate, 0.55),
    },
  };
}

/*
 * Lumiera draws no gradients. The palette keeps its `brandGradient` key only because the
 * sections still to be rebuilt read it; until each one is redone it gets a flat fill of
 * primary, which is what a Lumiera button is.
 */
export function brandFill(primary: string): string {
  return `linear-gradient(${primary}, ${primary})`;
}

/*
 * The header pill. Over the banner photograph it is frosted glass — white at 6 % on a
 * white hairline, with white type; that half is identical to the light theme, because it
 * sits on a photograph either way. Once the page moves, the pill becomes the dark surface
 * with light type, instead of the light theme's solid white.
 */
export function headerPalette({ primary }: BrandColors) {
  return {
    glass: alpha(LUMIERA.white, 0.06),
    glassBorder: LUMIERA.white,
    onImage: LUMIERA.white,
    surface: darken(primary, 0.85),
    border: darken(primary, 0.62),
    text: lighten(primary, 0.93),
  };
}

/*
 * The footer. In the light theme it was the one dark block on a white page; here the page
 * is already dark, so the footer goes a step deeper and cooler than the ground to stay a
 * distinct band. White type and the faint white rule are unchanged.
 */
export function footerPalette() {
  return {
    background: darken(LUMIERA.slate, 0.72),
    text: {
      primary: LUMIERA.white,
      secondary: alpha(LUMIERA.white, 0.85),
    },
    divider: alpha(LUMIERA.white, 0.18),
    buttonBorder: alpha(LUMIERA.white, 0.5),
  };
}

/* Section washes, card grounds, hairlines and image treatments. */
export function brandSurfaces({ primary, secondary }: BrandColors) {
  const ground = darkGround(primary);
  const bgAlt = darken(primary, 0.88);
  /*
   * A wash is the ground with a little of the tint mixed in, not the tint itself: mixing
   * toward the ground keeps mint cool and rose warm and still readable as two different
   * washes, where darkening the light tokens directly collapsed both into the same grey.
   */
  const wash = (tint: string) => alpha(tint, 0.16);

  return {
    /** Section wash, one step above the page ground (bg-alt). */
    bgAlt,
    /** Card ground laid on the section wash (surface). */
    surface: darken(primary, 0.82),
    /** Mint wash under team and review cards, over the dark ground. */
    mint: wash(LUMIERA.mint),
    /** Rose wash from the secondary colour, over the dark ground. */
    rose: wash(secondary),
    /*
     * The hairline is also the outline of buttons and chips (37 uses, mostly
     * `inset 0 0 0 1px`), so it has to clear 3:1 against the LIGHTEST ground it is drawn
     * on — the card surface — not merely be visible on the page ground.
     */
    border: lighten(darken(primary, 0.82), 0.34),
    /** Stand-in shown where a photograph is missing. */
    placeholder: darken(primary, 0.7),
    /*
     * Laid over photographs that carry white copy. Deeper than the light theme's 35 %: on a
     * dark page the eye has no white surround to fall back on, so a photograph needs more
     * cover before white type sits calmly on it.
     */
    scrim: alpha(LUMIERA.overlay, 0.5),
    /*
     * Ground of the glass caption card, under a 12px blur. The Figma frames record this fill
     * as solid overlay, but the card carries a background blur, which only reads on a
     * translucent fill: the opacity was lost when the paint was bound to its variable.
     * Raised for dark, where 45 % black on a dark photograph all but disappeared.
     */
    glass: alpha(LUMIERA.overlay, 0.62),
    onImage: LUMIERA.white,
    /** Hover and selection wash; kept under its old name for the sections not yet rebuilt. */
    tint: ground,
  };
}
