import { createTheme, Theme } from "@mui/material/styles";
import baseTheme from "@/theme";
import { ThemeSettings } from "@/core/types";
import { brandDefaults } from "@/app/theme/colors";
import {
  brandBase,
  brandFill,
  brandSurfaces,
  footerPalette,
  headerPalette,
  type BrandColors,
} from "@/app/theme/brand";

type PreviewThemeOptions = {
  primary?: string | null;
  secondary?: string | null;
  text?: string | null;
  fontHeading?: string | null;
  fontBody?: string | null;
  fontBanner?: string | null;
};

type CreatePreviewThemeInput = PreviewThemeOptions | ThemeSettings;

const fontFamily = (font?: string | null, fallback?: string) => {
  if (!font) return fallback;

  return `'${font}', ${fallback || "sans-serif"}`;
};

const normalizeThemeOptions = (
  input: CreatePreviewThemeInput,
): PreviewThemeOptions => {
  if ("colors" in input || "fonts" in input) {
    const themeSettings = input as ThemeSettings;

    return {
      primary: themeSettings.colors?.primary ?? null,
      secondary: themeSettings.colors?.secondary ?? null,
      text: themeSettings.colors?.text ?? null,
      fontHeading: themeSettings.fonts?.heading ?? null,
      fontBody: themeSettings.fonts?.body ?? null,
      fontBanner: themeSettings.fonts?.banner ?? null,
    };
  }

  return input as PreviewThemeOptions;
};

export function createPreviewTheme(input: CreatePreviewThemeInput): Theme {
  const { primary, secondary, text, fontHeading, fontBody, fontBanner } =
    normalizeThemeOptions(input);

  const hasOverrides =
    primary || secondary || text || fontHeading || fontBody || fontBanner;

  // No overrides: baseTheme already carries the derived header, footer, fill and
  // surfaces built from the defaults, so it is complete as it stands.
  if (!hasOverrides) {
    return baseTheme;
  }

  /*
   * Derive from the *resolved* trio, not from the overrides alone. A customer who sets
   * only `primary` still needs surfaces and a header that agree with the secondary and
   * text the base theme supplies — otherwise half the chrome follows the brand and half
   * does not.
   */
  const brand: BrandColors = {
    /* Defaults, not palette values: palette.primary.main is already lifted for dark. */
    primary: primary || brandDefaults.primary,
    secondary: secondary || brandDefaults.secondary,
    /*
     * Falls back to the DEFAULT customer text, not to palette.text.primary: in the dark
     * theme the latter is the light page type, and using it here would put light type on
     * the customer's own light surfaces (the gold button, the header pill).
     */
    text: text || brandDefaults.text,
  };

  const resolvedBody = fontFamily(fontBody, baseTheme.typography.fontFamily);

  const resolvedHeading = fontFamily(
    fontHeading,
    baseTheme.typography.h1?.fontFamily,
  );

  const resolvedBanner = fontFamily(
    fontBanner,
    baseTheme.typography.slogan?.fontFamily,
  );

  /*
   * DARK (ui-005): the trio is not written onto the palette as given. On a dark ground the
   * page type has to be light and the ground itself has to follow the brand, so primary,
   * secondary, background and text all come out of brandBase() — the same function the
   * defaults in app/theme/colors.ts go through. Writing `text` straight onto
   * `palette.text.primary`, as the light theme did, would put the customer's dark type on
   * the dark page and make it disappear.
   */
  const base = brandBase(brand);

  return createTheme(baseTheme, {
    palette: {
      primary: { ...baseTheme.palette.primary, ...base.primary },
      secondary: { ...baseTheme.palette.secondary, ...base.secondary },
      background: { ...baseTheme.palette.background, ...base.background },
      text: { ...baseTheme.palette.text, ...base.text },

      // Kept in step with src/theme.ts — see the note at the top of app/theme/brand.ts.
      header: headerPalette(brand),
      footer: footerPalette(),
      brandGradient: brandFill(brand.primary),
      surfaces: brandSurfaces(brand),
    },

    typography: {
      fontFamily: resolvedBody,

      h1: { ...baseTheme.typography.h1, fontFamily: resolvedHeading },
      h2: { ...baseTheme.typography.h2, fontFamily: resolvedHeading },
      h3: { ...baseTheme.typography.h3, fontFamily: resolvedHeading },
      h4: { ...baseTheme.typography.h4, fontFamily: resolvedHeading },
      h5: { ...baseTheme.typography.h5, fontFamily: resolvedHeading },
      h6: { ...baseTheme.typography.h6, fontFamily: resolvedHeading },

      body1: { ...baseTheme.typography.body1, fontFamily: resolvedBody },
      body2: { ...baseTheme.typography.body2, fontFamily: resolvedBody },
      button: { ...baseTheme.typography.button, fontFamily: resolvedBody },
      subtitle1: {
        ...baseTheme.typography.subtitle1,
        fontFamily: resolvedBody,
      },
      subtitle2: {
        ...baseTheme.typography.subtitle2,
        fontFamily: resolvedBody,
      },
      caption: { ...baseTheme.typography.caption, fontFamily: resolvedBody },
      overline: { ...baseTheme.typography.overline, fontFamily: resolvedBody },

      navLink: {
        ...baseTheme.typography.navLink,
        fontFamily: resolvedBody,
      },

      slogan: {
        ...baseTheme.typography.slogan,
        fontFamily: resolvedBanner,
      },

      // The logo is set in the heading face, so it follows the heading override.
      logo: {
        ...baseTheme.typography.logo,
        fontFamily: resolvedHeading,
      },
    },
  });
}
