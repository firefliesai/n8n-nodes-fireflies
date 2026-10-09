#!/usr/bin/env bash
# Validates the release notes file for the version in package.json.
# Prints the release title on success. Used by ci.yml and release.yml.
set -euo pipefail

VERSION="$(node -p "require('./package.json').version")"
FILE=".github/release-notes/${VERSION}.md"

if [ ! -f "$FILE" ]; then
  echo "::error::Missing $FILE. Every version bump needs release notes (see .github/release-notes/README.md)." >&2
  exit 1
fi

FIRST_LINE="$(head -n 1 "$FILE")"
case "$FIRST_LINE" in
  "# v${VERSION} — "?*) ;;
  *)
    echo "::error file=$FILE,line=1::First line must be '# v${VERSION} — <title>', got: $FIRST_LINE" >&2
    exit 1
    ;;
esac

if [ -z "$(tail -n +2 "$FILE" | tr -d '[:space:]')" ]; then
  echo "::error file=$FILE::Release notes body is empty." >&2
  exit 1
fi

echo "${FIRST_LINE#\# }"
