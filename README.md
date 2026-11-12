BOOK LOG — how to put it online so anyone can install it
==========================================================

This folder is a complete phone app (an installable web app). It needs to be
hosted at an https:// address once; after that, anyone can open the link and
add it to their home screen. No Claude, account, or app store needed.

OPTION A — Netlify Drop (easiest, free, ~1 minute, use a computer)
  1. Unzip book-log.zip.
  2. Go to https://app.netlify.com/drop
  3. Drag the "booklog" folder onto the page.
  4. You get a link like https://something.netlify.app — share it.
     (Make a free Netlify account to keep the site and rename the link.)

OPTION B — GitHub Pages (free)
  1. Create a new public repository on github.com.
  2. "Add file" > "Upload files", and upload everything inside the booklog folder
     (index.html, manifest.json, sw.js, and the icons folder).
  3. Settings > Pages > Source: "Deploy from a branch", branch "main", folder "/ (root)".
  4. After a minute your app is at https://YOUR-NAME.github.io/REPO-NAME/

INSTALLING ON A PHONE
  iPhone (Safari): open the link > Share button > "Add to Home Screen".
  Android (Chrome): open the link > "Install app" prompt, or menu ⋮ > "Install app".

GOOD TO KNOW
  • Each person's log is saved privately on their own phone. Nothing is uploaded.
  • Settings > "Back up my log" saves a file that can be restored on a new phone.
  • Book search, covers and reader ratings come from Open Library (openlibrary.org),
    which is free and needs no API key.
  • The app works offline for your log; searching needs an internet connection.
  • If you change the app files later, bump VERSION in sw.js so phones pick up the update.
