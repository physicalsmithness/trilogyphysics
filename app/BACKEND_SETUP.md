# Tracking backend - one-time setup (shared, multi-project)

`teacher-tracking.gs` is a single Google Apps Script endpoint that serves every
Smithics driller. Each driller POSTs a payload with a `project` field; the script
routes its rows to a tab named after that project. Deploy it once and reuse the one
URL for Trilogy and every future driller. Your existing pressure setup is separate and
untouched.

1. Create a Google Sheet, e.g. "Smithics driller responses".
2. In it: Extensions -> Apps Script. Delete the placeholder, paste all of `teacher-tracking.gs`, Save.
3. Deploy -> New deployment -> type Web app. Execute as: Me. Who has access: **Anyone**. Deploy, authorise.
4. Copy the Web app URL (`https://script.google.com/macros/s/AKfycb.../exec`).
5. Send the URL to me and I'll paste it into `app/index.html` (`REPORT_URL`); or paste it yourself.
6. Test: open `app/index.html`, sign in. A row should appear in a `trilogy_physics` tab.

Notes
- Honour-system sign-in (name + class), not authenticated. Fine for classroom monitoring; not assessment.
- Every driller reuses this URL; new ones just create their own tab automatically.
- Columns match the Electric Circuits Mastery engine schema, with an `extra_json` catch-all.
