# SolidnaWitryna

Marketing site for **solidnawitryna.pl**: brand and website design for small local service businesses in Poland, by Serhii Orlenko. It is also a project for the GoIT "AI UI/UX Engineering" course.

Status: work in progress. Only the first screen (hero) is built. The site language is Polish.

## Stack

Plain HTML, CSS and JavaScript. No framework, no build step, no dependencies.

## Run locally

Start any static server in the project folder, for example:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. (`npx serve` works too.)

## Structure

```
index.html        page markup
css/styles.css    styles; all colours are variables at the top of the file
js/main.js        splash intro, rotating word, animated scene
assets/img/       photo
```

## Notes

- Light and dark theme follow the system setting.
- With `prefers-reduced-motion: reduce` the intro and animations are skipped.
- Buttons and menu links are placeholders until the other sections exist.
