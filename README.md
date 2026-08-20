# aira — landing page

Marketing/landing page for **aira**, a voice-native RAG (Retrieval-Augmented
Generation) assistant. This is a static site — no backend, no build step.

It's intentionally a **separate repo** from the main app
([Voice-RAG-Pipeline](https://github.com/) on Render) — this only exists to
explain the product and send people to the live app.

## Structure

```
index.html      hero, how-it-works, final CTA
style.css       all styling — light-glass aesthetic matching the app
app.js          hero demo animation loop + scroll reveal for how-it-works
favicon/        same favicon set as the app, for brand consistency
```

## Local dev

Just open `index.html` in a browser, or serve it:

```
python3 -m http.server 8000
```

## Deploying

Any static host works — Vercel, Netlify, Cloudflare Pages, GitHub Pages.
No build command needed; the site is plain HTML/CSS/JS.

The "Launch aira" button links directly to:
https://voice-rag-pipeline.onrender.com/

If that URL changes, update it in `index.html` (header CTA, hero CTA, final
CTA — three places) and `app.js` is unaffected.

## Notes

- Respects `prefers-reduced-motion` throughout.
- The hero demo card and the how-it-works reveal are both built so a JS
  failure or unsupported API leaves content *visible*, never blank.
