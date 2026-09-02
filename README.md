# Earth and Oceans — Marine Science IGCSE Unit 1

An installable web app (PWA). On Android it gets a real icon, opens full screen
with no browser bars, and works with no signal.

The `dist/` folder is already built. If you just want it on a phone, you don't
need to install anything or touch a terminal — go straight to Option B.

---

## Option A — GitHub Pages (recommended if you have a GitHub account)

`.github/workflows/deploy.yml` is already set up. Push the project to a repo and
every push to `main` rebuilds and republishes automatically — you never upload
`dist` by hand.

```bash
git init
git add .
git commit -m "Marine Science Unit 1"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/marine-unit1.git
git push -u origin main
```

Then, once only: on GitHub go to **Settings → Pages → Build and deployment**
and set **Source** to **GitHub Actions**. The first run takes a minute; after
that your link is:

```
https://YOUR-USERNAME.github.io/marine-unit1/
```

Pages serves over https, so the install prompt and offline mode both work. The
app is built with `base: "./"`, so it runs correctly from that subfolder without
any config change.

To update it later: change the code, commit, push. That's the whole loop.

Note that a GitHub Pages site on a free account is public. Fine for this, but
don't put anything private in the repo.

## Option B — Netlify Drop (no account, no terminal)

1. Go to **https://app.netlify.com/drop** on a laptop.
2. Drag the **`dist`** folder onto the page. Not the zip, not the project folder — `dist`.
3. Netlify gives you a link like `https://calm-otter-123abc.netlify.app`.
4. Open that link on the Android phone in Chrome.

That link is public to anyone who has it, and it's free. Making a Netlify
account (also free) lets you rename the site and re-upload later; without one
the site still works but you can't come back and change it.

**Vercel** and **Cloudflare Pages** work the same way if you prefer them. Any
host is fine as long as it serves over **https** — service workers and the
install prompt don't work over plain http.

## Install it on Android

1. Open the link in **Chrome**.
2. Tap the **⋮** menu.
3. Tap **Add to Home screen** (or **Install app** if it's offered).
4. Confirm.

It now sits in the app drawer with the ocean icon and opens like any other app.
Chrome often shows an "Install" banner on its own after a few seconds.

On iPhone the equivalent is Safari → Share → Add to Home Screen. Chrome on iOS
can't install it; it has to be Safari.

---

## Option C — run and change it locally

You'll need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev       # local preview, opens on http://localhost:5173
npm run build     # rebuilds dist/ for uploading
```

To test the install prompt on your phone while developing on the same wifi:

```bash
npm run build
npm run preview   # prints a network address you can open on the phone
```

Install prompts need https, so the phone won't offer to install from
`localhost` — deploy it (Option A) to test that part properly.

---

## Where the content lives

All 42 questions are in `src/App.jsx` in the `ITEMS` array, near the top. Each
one is a plain object, so adding Unit 2 means adding more objects and more
entries to `TOPICS`. The five shapes are:

| `type`   | What the student does                          |
| -------- | ---------------------------------------------- |
| `choice` | Picks one of four                              |
| `gap`    | Fills blanks from a word bank                  |
| `multi`  | Selects every correct option                   |
| `match`  | Pairs terms with descriptions                  |
| `chain`  | Puts explanation steps in the right order      |

The creature cards are in `CREATURES`, with drawings in `CreatureArt`.

## How the scheduling works

Every question carries a box (0–4) and a due date, saved in the browser.

- Answered correctly → moves up a box, next due in 1, 3, 7 then 21 days.
- Missed → drops to box 0, due tomorrow, and reappears at the end of that lesson.
- A topic reads as mastered once its questions average box 3 or better.

There are no timers, no lives and no streaks anywhere in the app, by design.

## Progress and privacy

Progress is stored in the browser's `localStorage` on that one device. Nothing
is uploaded and there's no account. That also means:

- Clearing Chrome's site data wipes progress.
- Two people using the same link on different phones keep separate progress.
- Progress doesn't follow you from phone to tablet.

`exportProgress()` in `src/App.jsx` returns the saved data as a string if you
later want a backup or transfer feature.

## Updating a live site

Change the code, run `npm run build`, and upload `dist` again. Bump `CACHE` in
`public/sw.js` (e.g. `marine-u1-v2`) so installed phones drop the old cached
files instead of showing a stale version.
