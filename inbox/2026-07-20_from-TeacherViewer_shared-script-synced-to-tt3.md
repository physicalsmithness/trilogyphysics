# From TeacherViewer Architecture, 2026-07-20: `app/teacher-tracking.gs` synced to tt-3

For: whichever Trilogy chat next touches the shared tracking script.

The canonical copy at `Trilogy Physics\app\teacher-tracking.gs` has been synced to tt-3, matching what is now LIVE in the shared Apps Script (deployed by Smith 2026-07-20). What changed: a teacher read surface was added (doGet serves an allowlist-gated viewer under a separate teacher deployment; TeacherViewer d007 Google-sign-in allowlist, d009 per-teacher cohort visibility). **doPost is behaviourally unchanged** and the pupil deployment and every driller's REPORT_URL are untouched; the one doPost-adjacent addition is a guard preventing payloads writing into the reserved `classes`/`teachers` tabs, which only bites when the pupil deployment is next version-bumped. Do NOT paste an older copy of this file over the live script: it would remove the teacher surface. Questions to `TeacherViewer\inter_chat\` or its inbox.
