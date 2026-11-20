# Physics Visualizations

Interactive physics simulations served as a static GitHub Pages site. The simulations are **AI-generated** and intended for **illustration and education** — they build intuition but are not rigorously validated reference tools.

Live site: **https://JonaThe1st.github.io/physics_visualization/**

## Structure

```
physics_visualization/
├── index.html            Landing page + auto-generated simulation menu
├── simulations.json      Manifest — one entry per simulation (menu source)
├── simulations/
│   └── ewald-konstruktion/
│       └── index.html    A complete simulation (self-contained)
└── README.md
```

## How to add a new simulation

A simulation is one self-contained HTML file (all CSS and JS inline, no
external dependencies) so that every sim runs fully offline in a browser tab.

### 1. Create the file

Make a folder under `simulations/` named after a short lowercase slug (use
`-` between words), and place your `index.html` inside it:

```
simulations/<slug>/index.html
```

Example:

```
simulations/bragg-law/index.html
```

There is no required template — any valid HTML works. The only conventions:

- **Self-contained**: inline all `<style>` and `<script>`; avoid loading
  external fonts/libraries (keep it fast, private, and offline-friendly).
- **Full-screen canvas** for anything graphical, with the control panel in a
  side column (see `simulations/ewald-konstruktion/index.html` for a good
  reference layout).
- Optionally support dark mode via the CSS custom properties used across the
  site (`--bg`, `--fg`, `--mut`, `--card`, `--bd`, `--sph`, …).

### 2. Register it in the manifest

Add a JSON object to the top-level `simulations.json` array:

```json
{
  "slug": "bragg-law",
  "title": "Bragg's Law",
  "desc": "One or two sentences describing what the simulation shows.",
  "tags": ["crystallography", "interference"],
  "on": true
}
```

| Field  | Meaning                                                        |
|--------|----------------------------------------------------------------|
| `slug` | Must match the folder name (this becomes the URL).             |
| `title`| Shown as the card heading on the landing page.                 |
| `desc` | Short description, shown under the title.                       |
| `tags` | Optional list of topic labels displayed on the card.            |
| `on`   | `true` = active link; `false` = greyed out "Coming soon" card.  |

The landing page loads `simulations.json` and builds the menu automatically,
so no other edits are needed.

### 3. Commit and push

```bash
git add simulations/<slug>/ simulations.json
git commit -m "Add <title> simulation"
git push
```

GitHub Actions deploys the latest `main` to GitHub Pages automatically
(see `.github/workflows/deploy.yml`). The live site updates within ~1 minute.

## Local preview

Any static file server works, the sims need no build step:

```bash
python3 -m http.server 8000
# open http://localhost:8000/
```

> Tip: opening the HTML files directly via `file://` works for the simulations
> themselves. The landing page still renders, but uses a built-in fallback list
> because browsers block `fetch()` of the manifest on `file://`.

## Deployment

We use GitHub Actions to build and publish the `main` branch to the Pages site
under `/physics_visualization`. To publish a manual draft, set the sim's `on`
field to `false` (it shows as "Coming soon" without a broken link).
