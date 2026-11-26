# HavenArc Realty — responsive property landing page

Single-page React frontend for browsing six featured property listings and completing a local-only enquiry check. Built with Vite, semantic HTML, and CSS Modules.

## Requirements

- Node.js 20.19 or newer
- npm 10 or newer

## Run locally

```bash
npm install
npm run dev
```

Create a production build and serve it locally:

```bash
npm run build
npm run preview
```

The production output is written to `dist/`. Deploy that static output to a static hosting provider. No environment variables or server-side services are required.

## Project structure

```text
src/
  components/       Header, Hero, PropertyGrid, Benefits, Process, RegistrationForm, Footer
  data/             Featured property content
  styles/           Global design tokens and browser defaults
public/
  images/           Original HavenArc logo and six optimized WebP illustrations
  privacy.html      Local privacy information
  terms.html        Local terms information
```

### Component responsibilities

- `Header` provides desktop links and an accessible mobile menu with Escape-key support.
- `Hero` introduces the property discovery experience and links to listings and process details.
- `PropertyGrid` renders all six fixture records with their IDs, details, and descriptive illustration text alternatives.
- `Benefits` explains the three search benefits.
- `Process` presents the three enquiry steps.
- `RegistrationForm` validates controlled fields and reports a local-only result.
- `Footer` links to local legal pages and the enquiry section.

Styles are isolated in adjacent CSS Modules. Shared colors, typography, focus treatment, and reduced-motion behavior live in `src/styles/global.css`.

## Form and privacy limits

The form checks name, email, city, layout, and consent in the browser. A successful check clears entered values and displays a confirmation. It does not create an account, save data, write to storage, log values, or contact an external service. The consent label is included because it is required by the supplied brief; this static preview does not submit a lead.

Property values are display content from the supplied fixture, not offers or confirmed availability. Property images are illustrations, not photographs.

## Verification

Run `npm run build` for production compilation. `ACCEPTANCE_TEST_MATRIX.csv` records the browser and viewport checks actually completed. Checks that need another browser or external account remain marked `BLOCKED`.

With the Vite server running, capture full-page Chromium screenshots at the five required widths:

```bash
npm run capture
```

Set `CHROME_BIN` if Chrome is installed at a non-default path. Set `PAGE_URL` if the dev server uses another local URL. Screenshots are written to `evidence/`.

## Deployment handoff

Production site: <https://havenarc-realty.vercel.app>.
Source repository: <https://github.com/Jaganravi131/HavenArc----Digital-Real-Estate-Agency>.

Vercel builds the project with `npm ci` and `npm run build`, then serves `dist/`. `.vercelignore` excludes the confidential brief, screenshots, local environment files, and submission-only documents from deployment uploads.

`.gitignore` excludes the confidential brief and local Vercel credentials from Git. Grant write access to the target repository or provide a writable remote to publish the source. No authorized Google Drive review folder was supplied. Do not describe the local form as a working lead-submission service.
