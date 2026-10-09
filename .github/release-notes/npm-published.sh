#!/usr/bin/env bash
# Prints "true" when <name>@<version> is on npm, "false" when npm answers 404.
# Any other failure (network, registry outage) exits non-zero instead of
# guessing, so release.yml never mistakes an outage for "not published".
set -uo pipefail

ERR="$(mktemp)"
if npm view "$1" version > /dev/null 2> "$ERR"; then
  echo true
elif grep -q E404 "$ERR"; then
  echo false
else
  cat "$ERR" >&2
  exit 1
fi
