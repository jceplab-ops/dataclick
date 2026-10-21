# Behavior Recorder

A phone app for recording the timing of behavior events and exporting time-binned CSV files.
Works on iPhone and Android, and offline once installed.

## What students do

1. Open the app, enter an observer name and session label, set the bin size (seconds) and optional session length (minutes).
2. Choose buttons. "Response + Reinforcement" is a one-tap preset. Up to 6 buttons.
3. Open the recorder, press **Start**, and tap a button every time the behavior occurs.
   Keys 1 to 6 also work on a keyboard. **Undo last** removes a mistaken press.
4. Press **Stop** (or let the session length run out). Share or download two CSV files:

   - `..._binned.csv` — one row per time bin, one count column per button.
     Columns: `session, observer, bin, bin_start_s, bin_end_s, <button names...>`.
     The last bin may be partial; its `bin_end_s` is the actual end of the session.
   - `..._events.csv` — one row per press, with exact timestamps.
     Columns: `session, observer, event, time_s, bin, button, role, since_last_response_s, timestamp_utc`.
     For a button marked Reinforcement, `since_last_response_s` is the time since the most recent Response press.

An event exactly on a bin boundary is counted in the later bin (bin 2 covers 60.000 up to, not including, 120.000 s with 60 s bins).

If the page is closed or the phone locks mid-session, the session is saved and resumes when reopened.
Finished sessions stay on screen until "Start a new session" is pressed, so export before clearing.

## Getting it onto phones (no app store)

The app is a Progressive Web App. Put these six files in one folder on any HTTPS web server:

    index.html  manifest.json  sw.js  icon-192.png  icon-512.png  apple-touch-icon.png

Then each student opens the web address once and installs it:

- **iPhone (Safari):** Share button, then "Add to Home Screen".
- **Android (Chrome):** menu, then "Install app" (or "Add to Home screen").

After the first load it runs offline from the home screen like a normal app.
Any static host works: your Juniata web space, GitHub Pages, Netlify, or Cloudflare Pages.
It must be HTTPS (or localhost) for installation and offline use. A subfolder is fine.

**Pushing an update:** upload the new files and change `behavior-recorder-v1` to `-v2` in `sw.js`.
Phones pick up the new version the next time they open the app online.

## License

Copyright (C) 2026 David Widman

This program is free software: you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version. It is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the `LICENSE` file for the full text.

## Without any hosting

`index.html` is self-contained and also works if opened directly in a browser
(for example from Files on Android, or on a laptop). Without hosting it cannot be installed
to the home screen or used offline, and file sharing on phones is less reliable.
