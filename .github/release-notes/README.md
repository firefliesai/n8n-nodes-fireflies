# Release notes

Merging a version bump to `main` publishes it: `release.yml` publishes the
package to npm, then creates the `vX.Y.Z` tag and GitHub release.

Every version bump needs a notes file here, named after the version
(`2.4.0.md`). CI fails the pull request without one.

- **Line 1:** `# vX.Y.Z — Short title`. It becomes the release title and is removed from the body.
- **Body:** Markdown. Use `2.3.0.md` as the template: a short Highlights section, a table when many
  operations change, then Fixes. The workflow appends the Full Changelog link and the pull request links.
