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

---

## Building the Android app (APK) — no Chrome needed

The web version renders through Chrome. This one doesn't: Capacitor packages
every file inside the APK and loads them through Android's System WebView, which
is a separate component from the Chrome browser app. It installs as a normal
app, works with no network at any point, and doesn't need Chrome installed or
enabled.

**You don't need Android Studio.** `.github/workflows/android.yml` builds the
APK on GitHub's servers.

1. Push the project to your repo. **There is no `android/` folder to commit** —
   the workflow generates it during the build. Only `android-res/` (16 icon
   files) and `capacitor.config.ts` need to be in the repo.
2. Go to the **Actions** tab and open the **Build Android APK** run.
3. When it finishes, download the **marine-science-apk** artifact from the
   bottom of that page. It's a zip containing `app-debug.apk`.
4. Unzip it, put the `.apk` on the phone (email, cable, or a cloud folder).
5. Tap it. Android will ask you to allow installing from that source — this is
   the normal warning for any app not from the Play Store.

Every push to `main` builds a fresh APK, so updating means push, download,
install over the top. Progress is kept.

### Why there is no android/ folder

Capacitor's Android project is several hundred boilerplate files, and it is
regenerated identically from `capacitor.config.ts` every time. Committing it
would blow past GitHub's 100-file web-upload limit and bury your real changes.

The only genuinely custom native files are the launcher icons, which live in
`android-res/` and get copied over the generated project during the build.

### Building it locally instead

Needs Android Studio, or the Android SDK plus Java 21.

```bash
npm run build
npx cap add android            # first time only
cp -r android-res/. android/app/src/main/res/
npx cap sync android
cd android && ./gradlew assembleDebug
# APK lands in android/app/build/outputs/apk/debug/
```

`npx cap open android` opens the project in Android Studio if you'd rather use
the GUI.

### Notes on the Android build

- **It is genuinely offline.** Fonts are bundled into the app rather than
  fetched from Google, and there are no other remote requests. Verified: no
  `http` URLs appear anywhere in the packaged assets.
- **The `INTERNET` permission** is still declared in
  `android/app/src/main/AndroidManifest.xml`, because Capacitor's local file
  server uses the `https://localhost` scheme. The app makes no network requests.
  If you want the hard guarantee that it *cannot*, delete that
  `<uses-permission>` line — but test the APK afterwards, because on some
  Android versions the WebView needs it even for purely local content.
- **The service worker is skipped** inside the app. It exists only for the web
  version; in the APK every file is already on the device.
- **A debug APK is unsigned for the Play Store** but installs fine by hand. You
  only need a signing keystore if you want to publish it.

### Which build should you use?

| | Web (GitHub Pages) | Android APK |
| --- | --- | --- |
| Needs Chrome | yes | no |
| Needs internet | first visit only | never |
| Install | Add to Home screen | sideload the APK |
| Updating | automatic | download and reinstall |

Both come from the same `src/App.jsx`, so a content change updates both.

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
