# Behavior Recorder

A phone app for recording behavior by **frequency**, **duration**, or **interval** and exporting
time-binned CSV files. Works on iPhone and Android, and offline once installed.

## Assessment types

Choose the type at the top of the setup screen. Every type supports up to 6 behaviors, a session
label, an observer name, and an optional fixed session length (blank means stop manually).

### Frequency
Tap a button each time the behavior occurs. Buttons can be marked **Response** or **Reinforcement**;
the event log then shows how long after each response a reinforcer occurred. **Undo last** removes
a mistaken press. Keys 1 to 6 also work on a keyboard.

### Duration
Hold a button down while the behavior is happening and release it when the behavior stops.
Each behavior has its own button and its own clock, so several can be timed at the same time
(use a different finger for each). A setting lets observers **tap to start and tap to stop**
instead of holding, which is easier for long episodes. Any behavior still running when the session
ends is closed at the end time. **Undo last** removes the most recently started episode.

### Interval
The session is divided into repeating cycles: **observe** for the interval length, then a
**signal**, then a short **record time** in which the observer taps the button for every behavior
that occurred during the interval just watched (tap again to undo). Buttons are dimmed and ignore
presses during the observe period so the observer can keep watching. The unmarked default is
"did not occur".

- Signal choices (any combination): a beep, vibration, and a screen color change that lasts through
  the record time. The color is user selectable, and **Test signal** previews the choices.
- iPhone Safari cannot vibrate, and the iPhone silent switch mutes the beep, so use screen color on
  iPhones. Keep the screen on and the app in front while recording.
- A cycle is the interval length plus the record time (10 s + 5 s = every 15 s). With a fixed session
  length, only whole cycles are recorded. If the observer stops during an observe period, that
  unfinished interval is left out. If they stop during a record time, that interval is kept with the
  marks made so far.

## CSV files

Each session exports two files. Every row carries the session label and observer so files from
many students can be pooled.

| Type | File | Contents |
|---|---|---|
| Frequency | `..._binned.csv` | One row per time bin, one count column per button. |
| Frequency | `..._events.csv` | One row per press with exact time, bin, role, `since_last_response_s`, UTC timestamp. |
| Duration | `..._duration_binned.csv` | One row per time bin. For each behavior: `<name>_duration_s` (seconds of behavior in the bin), `<name>_pct` (percent of the bin), `<name>_episodes` (episodes that began in the bin). |
| Duration | `..._duration_episodes.csv` | One row per episode: `button, start_s, end_s, duration_s, bin, start_timestamp_utc`. |
| Interval | `..._interval_binned.csv` | One row per scored interval, one 1/0 column per behavior. `bin_start_s` and `bin_end_s` are the observation window. |
| Interval | `..._interval_summary.csv` | One row per behavior: `intervals_observed, intervals_with_behavior, percent_intervals`. |

The binned files share the columns `session, observer, bin, bin_start_s, bin_end_s`. An event or
episode boundary exactly on a bin edge counts in the later bin; an episode that crosses a bin edge
is split between the bins. The last bin may be partial and its `bin_end_s` is the real end of the
session, so percentages for it use the shorter length.

If the page is closed or the phone locks mid-session, the session is saved and resumes when
reopened (any behavior being held at that moment is closed at the time of the reload).
Finished sessions stay on screen until "Start a new session" is pressed, so export before clearing.

## Getting it onto phones (no app store)

The app is a Progressive Web App. Put these files in one folder on any HTTPS web server:

    index.html  manifest.json  sw.js  icon-192.png  icon-512.png  apple-touch-icon.png

(`LICENSE` and this README can go along with them.) Then each student opens the web address once
and installs it:

- **iPhone (Safari):** Share button, then "Add to Home Screen".
- **Android (Chrome):** menu, then "Install app" (or "Add to Home screen").

After the first load it runs offline from the home screen like a normal app.
Any static host works: GitHub Pages, Netlify, Cloudflare Pages, or your own server.
It must be HTTPS (or localhost) for installation and offline use. A subfolder is fine.

**Pushing an update:** upload the changed files. When a phone is online the app always loads the
newest files, and it falls back to its saved copy when offline or on a very slow connection.
If a phone ever hangs on the splash screen after an update, clearing the app's storage in Android
settings (long-press the icon, then App info, then Storage) and reopening fixes it.

## License

Copyright (C) 2026 David Widman and Juniata College

This program is free software: you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version. It is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the `LICENSE` file for the full text.

## Without any hosting

`index.html` is self-contained and also works if opened directly in a browser
(for example from Files on Android, or on a laptop). Without hosting it cannot be installed
to the home screen or used offline, and file sharing on phones is less reliable.
