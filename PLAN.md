# sitegen-landing-ui-005 — temna različica Lumiere

## Kontekst

`sitegen-landing-ui-004` je svetla izvedba teme **Lumiera** (beauty / spa). Ta repozitorij je
njena temna dvojnica: **ista tema, temna paleta**, s svojim `theme.id` v čarovniku
`ptlabTadej/sitegen_v2`. Razmerje je enako, kot ga ima `ui-003` do `ui-002`.

Cilj: `ui-005` se od `ui-004` **ne razlikuje v ničemer razen v barvah**. Isti `website.json`,
isti core major, isti pogoji prikaza sekcij, iste poti in sidra, isti SEO, isti razmiki in
ista tipografija.

## Izhodišče (23. 9. 2026)

Repozitorij je nastal kot izvoz sledenih datotek `ui-004` na commitu `01f0d94`, brez
`node_modules`, `.next` in `out`. Preimenovani so samo identifikatorji: `package.json`,
`sitegen-ui.json` (`uiId` 005), `.sitegen-meta/manifest.json`, `refresh.cjs` in kanonični
naslovi v `src/data/primary-seo.json`.

## Zakaj to ni prepis, ampak paleta

Prešteto v tej kopiji, preden se je začelo delo:

| vrednost | rab | kaj mora narediti dark |
|---|---|---|
| `surfaces.border` | 37 | temna črta na temnem, ne svetla |
| `surfaces.placeholder` | 19 | nadomestek manjkajoče slike |
| `surfaces.onImage` | 15 | besedilo in ploskve nad fotografijo — **ostanejo svetle** |
| `background.default` | 13 | podlaga strani |
| `surfaces.bgAlt` | 11 | izmenična podlaga sekcij |
| `surfaces.mint` | 10 | wash pod karticami ekipe in mnenj |
| `background.paper` | 8 | kartice |
| `surfaces.rose` | 8 | rose wash |
| `surfaces.surface` | 7 | svetlejša ploskev nad podlago |
| `surfaces.scrim` | 7 | prekriv čez fotografije |
| `common.white` | 3 | belo nad fotografijo — **ostane belo** |
| `surfaces.glass` | 1 | frosted glava |

V 174 komponentah **ni nobene trdo zapisane barve**; edini zadetek na `#...` je omemba v
komentarju. Pravilo iz `ui-004` — vse skozi paleto — je torej zdržalo in delo je v treh
datotekah: `src/app/theme/colors.ts`, `src/app/theme/brand.ts` in `src/theme.ts`.

Dodatno olajšanje: `brand.ts` vse izpelje iz treh barv, ki jih izbere stranka (primary,
secondary, text), plus nekaj fiksnih Lumierinih tokenov (mint, hairline, overlay, slate,
white). Temna različica mora torej ostati **izpeljava**, ne seznam novih vrednosti, sicer
stranka s svojo barvo dobi razpadel videz.

## Vir dizajna

Načrt `ui-004` je predvideval, da so dark variante že narisane v Figmi. Ob pregledu 23. 9. 2026
jih ni: datoteka _Lumiera Template_ (`HD2qzS66trb08YEzlolH8T`) ima le strani **HOMEPAGES**
(svetle predloge `01-spa-salon`, `02-beauty-salon` …) in **DESING SYSTEM**, čigar barve so
generične (`#2E5BFF`, `#1A202C`), ne Lumierine. Iskanje po imenih vozlišč ne najde nobenega
`dark` ali `temn`. Strani „sitegen — Lumiera“ s 23 sekcijami v tej datoteki ni.

Zato se dark variante **najprej narišejo** (odločitev Petre, 23. 9. 2026), in sicer toliko,
kolikor jih paleta potrebuje: en frame s tokeni in štiri sekcije, ki pokrijejo vse vrste
ploskev — banner s fotografijo, sekcija z izmenično podlago, mreža kartic in footer. Preostale
sekcije se izrisujejo iz kode, ker so iste ploskve v drugačni razporeditvi.

## Cena, ki jo je treba poznati

Ločen repozitorij pomeni podvojenih 174 komponent, ki so identične. Vsak popravek v `ui-004`
je treba od danes prenesti tudi sem, sicer se temi razideta. Enako je bilo odločeno pri
`ui-003` in je zapisano zato, da ni presenečenje čez tri mesece.

## Faze

### 0 — izhodišče in načrt (ta commit)

Kopija `ui-004`, preimenovani identifikatorji, ta načrt. Brez sprememb v videzu.

### 1 — paleta iz Figme

Prebrati dark variante ključnih sekcij (banner, sekcija z izmenično podlago, kartice, footer)
in iz njih določiti: podlago strani, ploskev kartice, izmenično podlago, obrobo, besedilo
primarno in mirno, mint in rose wash, scrim čez fotografije. Zapisati kot izpeljavo iz treh
znamčnih barv v `brand.ts` in privzetke v `colors.ts`.

### 2 — kontrast in preverjanje

Vsaka kombinacija besedilo/podlaga mora doseči WCAG AA (4,5:1 za besedilo, 3:1 za velike
naslove in ikone). Preveriti tudi stanja gumbov, obrobe polj in fokus.

### 3 — vizualno preverjanje

Posnetki vseh 23 sekcij pri 1440 in 390 px, primerjava s Figmo. Sekcije s fotografijami
posebej: scrim in belo besedilo nad njimi se v temni temi hitro zlijeta.

### 4 — QA in objava

`pnpm verify`, gradnja, izvoz, demo stran na `gh-pages` z lastnim `basePath`.

## Odločeno (23. 9. 2026)

1. Paleta se vzame iz Figme; ker dark variant ni, se najprej narišejo.
2. `ui-005` je **javen** repozitorij z demo stranjo na `gh-pages`, enako kot `ui-004`.
3. Commiti gredo sproti na `main`, brez vmesnega ustavljanja do konca vizualnega preverjanja.

## Odprto

- Ali dark različica dobi svoj `theme.id` v čarovniku `sitegen_v2` že zdaj ali šele ob objavi.
- Ali ostane izbira fotografij enaka kot v `ui-004` (predlog: da, ker gre za paleto).
- Ali se popravki iz `ui-004` od danes prenašajo tudi sem, kot je bilo dogovorjeno pri `ui-003`.

## Kaj poleg palete (ugotovljeno ob pregledu kode, 23. 9. 2026)

Paleta doseže vseh 174 komponent, ker v njih ni nobene trdo zapisane barve. Zunaj palete pa
je šest stvari, ki jih temna tema razgali in vsaka potrebuje svojo odločitev:

1. **`src/app/globals.css`** — `:root { color-scheme: light }` (in komentar, ki razlaga, zakaj
   je svetla fiksna) ter trdo zapisani barvi na panelu `#sitegen-language-recovery`
   (`#faf7f6` / `#1a1a1a`), ki se izriše čez cel zaslon.
2. **Logotipi strank** (`public/images/clients/*.webp`, 7 datotek) — temna risba na
   neprosojni beli podlagi. Na temni strani vsak postane bela kartica. V kodi že obstaja
   vzorec za to: `--logo-filter` v `HeaderLayout.tsx`.
3. **Portreti ekipe** (`public/images/ekipa-*.webp`) — beli izrez na beli podlagi, položen na
   `surfaces.mint`. V temni temi bo portret lebdel kot bela packa.
4. **`public/images/image-fallback.webp`** — svetla ikona na belem, nadomestek manjkajoče slike.
5. **`website.json`** (postavke `experience`) — trije naslovi `placehold.co/...FFFFFF/1A1A1A`,
   torej belina zapisana v URL.
6. **Dve mesti v komponentah, ki nista barva, a se obnašata kot ena** — senca
   `alpha(text.primary, 0.08)` v `HoverDropdown.tsx` (v temni temi postane bel sij) in veja
   `--logo-filter` v `HeaderLayout.tsx` (v temni temi je pokvarjena ravno druga veja).

Trije tokeni se **ne smejo** obrniti, ker so besedilo nad fotografijo: `surfaces.onImage`,
`header.onImage` / `header.glassBorder` in `common.white`.

## Orodje za preverjanje, ki že obstaja

`pnpm test:variants` (`scripts/testVariants.mjs`) zna izrisati fixture različice pri poljubnih
širinah (`--widths 390,1440`), v `scripts/variants/checks.mjs` pa sta dve funkciji, ki ju
temna tema potrebuje: `capturePageWithBoxes` (celostranski posnetek pri dani širini) in
`findInvisibleText` (prek ffmpeg izmeri razpon svetlosti v vsakem besedilnem okvirju in
javi besedilo, ki se zliva s podlago — pisano za belo na belem, deluje enako za temno na
temnem). Harness zahteva čisto delovno drevo, ker med tekom prepisuje `website.json`.

Med fixture-i ni takega, ki bi preizkusil **temno strankino barvo besedila**; za temno temo
ga je treba dodati.

## Izid (23. 9. 2026)

**Faza 1 — paleta.** Dark variant v Figmi ni bilo, zato so narisane: nova stran
**`dark — Lumiera`** v datoteki Lumiere ima frame s tokeni (12 vrednosti, vsaka z imenom,
hexom in razmerjem kontrasta) in štiri sekcije, ki pokrijejo vse vrste ploskev — banner s
fotografijo in scrimom, sekcija z izmenično podlago, mreža kartic z mint in rose washem ter
noga.

Paleta, vsa izpeljana iz istih treh strankinih barv:

| token | vrednost | izpeljava |
|---|---|---|
| `background.default` | `#0D0A06` | `darken(primary, 0.93)` |
| `surfaces.bgAlt` | `#16110B` | `darken(primary, 0.88)` |
| `background.paper` | `#1B150E` | `darken(primary, 0.85)` |
| `surfaces.surface` | `#201A10` | `darken(primary, 0.82)` |
| `surfaces.placeholder` | `#362B1B` | `darken(primary, 0.70)` |
| `surfaces.border` | `#7A6445` | `lighten(darken(primary, 0.82), 0.34)` |
| `surfaces.mint` | mint 16 % čez podlago | `alpha(LUMIERA.mint, 0.16)` |
| `surfaces.rose` | secondary 16 % čez podlago | `alpha(secondary, 0.16)` |
| `text.primary` | `#FAF7F3` | `lighten(primary, 0.93)` |
| `text.secondary` | `#AEB6BB` | `lighten(slate, 0.55)` |
| `primary.main` | `#BD9C6E` | `lighten(primary, 0.12)` |
| `footer.background` | `#151A1D` | `darken(slate, 0.72)` |

Obroba ni fiksni token kot v svetli temi: je obris gumbov in čipov (37 rab), zato je
izračunana tako, da doseže 3:1 proti **najsvetlejši** ploskvi, na kateri stoji, ne le proti
podlagi strani. Mint in rose sta primes čez podlago in ne potemnjena svetla tokena — ta sta
se oba sesedla v isto sivo.

**Faza 2 — koda.** Delo je v `colors.ts`, `brand.ts` in `theme.ts` (`mode: "dark"`), plus
`globals.css` (`color-scheme`, panel za obnovitev jezika). Nova `brandBase()` drži primary,
secondary, background in text na enem mestu, ker ju potrebujeta obe poti gradnje teme;
`createPreviewTheme()` strankinih barv ne zapisuje več neposredno na paleto — njena temna
barva besedila bi na temni strani izginila, zato je rezervirana za besedilo **na** njenih
svetlih ploskvah (gumb, glava).

Tri komponente so na beli ploskvi brale barvo besedila strani (`ArrowButton` in
`CircleButton`, ton „white“, ter namig za pomik v `HomeSection`). Zdaj berejo
`primary.contrastText`; v svetli temi je to ista vrednost, zato je popravek prenosljiv v
`ui-004`.

**Slike.** Logotipi strank so dobavljeni kot temna risba na beli podlagi in so bili vrsta
belih tablic; dodane so obrnjene kopije s prosojnim ozadjem
(`public/images/clients/dark/*.png`), demo podatki kažejo nanje. Trije certifikati v „Zakaj
nas“ so imeli belino v naslovu `placehold.co` — zdaj so temni. Portreti ekipe (beli izrezi)
na temni podlagi delujejo in so ostali nespremenjeni. `image-fallback.webp` ni nikjer v
uporabi, zato ni spremenjen.

**Faza 3 — preverjanje.** 15 poti × 1440 in 390 px: nikjer vodoravnega drsenja, nikjer
napake v konzoli. Strojni pregled kontrasta čez vse vidno besedilo (barva besedila proti
dejanski podlagi, meja 4,5 oziroma 3 za velike naslove) — **brez padcev na katerikoli
strani**.

**Faza 4 — objava.** Demo stran teče na
**https://pzagardedukic.github.io/sitegen-landing-ui-005/** (veja `gh-pages`, gradnja
lokalno z `NEXT_PUBLIC_BASE_PATH` in `NEXT_PUBLIC_SITE_URL`, kot pri `ui-004`). Preverjeno
v živo pri 1440 in 390 px: podlaga `rgb(12, 9, 6)`, besedilo `rgb(249, 247, 243)`, brez
neuspelih zahtev.

## Kaj ostaja

- `theme.id` temne različice v čarovniku `sitegen_v2` še ni dodeljen.
- Fixture za **temno strankino barvo besedila** še ni dodan; paleta je za ta primer
  zasnovana (besedilo strani se ne jemlje iz `text`), a to še ni preizkušeno s `test:variants`.
- Popravka treh komponent (`primary.contrastText` na beli ploskvi) **ni mogoče prenesti v `ui-004`**:
  tam je `primary.contrastText` bela (napis na zlatem gumbu), zato bi na beli ploskvi dal belo
  na belem. V `ui-005` je ta token strankina temna barva besedila, zato tam drži. Razlika je
  zavestna in je razlog, da datoteki `colors.ts` v obeh repozitorijih nista zamenljivi.
