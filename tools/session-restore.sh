#!/usr/bin/env bash
# session-restore.sh — self-heal the checkout, then run every release gate.
#
# Usage:
#   bash tools/session-restore.sh            # heal + audit, never mutates history
#   bash tools/session-restore.sh --rebase   # additionally rebase current branch onto origin/master
#
# Exit code: 0 = all gates green, 1 = at least one gate failed (or a blocker).
# This script is read-only with respect to the remote: it fetches, it never pushes.

set -uo pipefail

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null) || {
  echo "FATAL: not inside a git repository" >&2; exit 1; }
cd "$REPO_ROOT"

REBASE=0
[ "${1:-}" = "--rebase" ] && REBASE=1

BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null || echo "(detached)")
EXPECTED_BRANCH_PREFIX="arena/"
PAGES_BRANCH_EXPECTED="master"

pass=0; fail=0; warn=0
ok()   { printf '  \033[32mPASS\033[0m  %s\n' "$1"; pass=$((pass+1)); }
bad()  { printf '  \033[31mFAIL\033[0m  %s\n' "$1"; fail=$((fail+1)); }
note() { printf '  \033[33mWARN\033[0m  %s\n' "$1"; warn=$((warn+1)); }
head2(){ printf '\n\033[1m%s\033[0m\n' "$1"; }

have() { command -v "$1" >/dev/null 2>&1; }

# ---------------------------------------------------------------- self-heal
head2 "Self-heal ($BRANCH)"

if [ "$(git rev-parse --is-shallow-repository)" = "true" ]; then
  echo "  · shallow clone detected (ancestry checks lie) — unshallowing"
  git fetch --unshallow origin --quiet 2>/dev/null || git fetch --deepen=200 origin --quiet
  ok "history deepened for accurate ancestry checks"
else
  ok "full history present"
fi

git fetch origin --tags --quiet 2>/dev/null || bad "could not reach origin (offline? gh auth expired?)"

# A checkout whose ref is missing from origin cannot be published yet; that is not a failure.
live_sha=$(git ls-remote origin "refs/heads/$BRANCH" 2>/dev/null | cut -f1)
if git rev-parse --verify -q "origin/$BRANCH" >/dev/null 2>&1; then
  ahead=$(git rev-list --count "origin/$BRANCH"..HEAD)
  behind=$(git rev-list --count "HEAD..origin/$BRANCH")
  [ "$ahead$behind" = "00" ] && ok "in sync with origin/$BRANCH" \
                             || note "diverged from origin/$BRANCH (ahead=$ahead behind=$behind)"
elif [ -n "$live_sha" ]; then
  # A single-branch clone has no origin/<branch> ref, so the naive check below
  # would wrongly report "nothing published". Ask the remote directly.
  note "origin/$BRANCH not tracked locally (restricted refspec) — querying remote"
  ahead=$(git rev-list --count "$live_sha"..HEAD 2>/dev/null || echo "?")
  behind=$(git rev-list --count "HEAD..$live_sha" 2>/dev/null || echo "?")
  [ "$ahead$behind" = "00" ] && ok "in sync with origin/$BRANCH (live)" \
                             || note "ahead=$ahead behind=$behind vs origin/$BRANCH ($(git rev-parse --short "$live_sha"))"
else
  note "origin/$BRANCH does not exist yet — nothing published from this branch"
fi

if [ -n "$(git status --porcelain)" ]; then
  note "working tree is dirty — gates below run against the dirty tree, not HEAD"
else
  ok "working tree clean"
fi

if [ "$REBASE" = "1" ]; then
  if [ -n "$(git status --porcelain)" ]; then
    bad "--rebase refused with a dirty tree"
  else
    echo "  · rebasing $BRANCH onto origin/$PAGES_BRANCH_EXPECTED"
    git rebase "origin/$PAGES_BRANCH_EXPECTED" >/dev/null 2>&1 \
      && ok "rebased onto origin/$PAGES_BRANCH_EXPECTED" \
      || { git rebase --abort 2>/dev/null; bad "rebase conflicted — left untouched"; }
  fi
fi

# ---------------------------------------------------------------- repo hygiene
head2 "Branch safety"

case "$BRANCH" in
  "$EXPECTED_BRANCH_PREFIX"*) ok "on a session branch ($BRANCH)" ;;
  master|main)  bad "refusing to work directly on $BRANCH — cut a branch first" ;;
  *)            note "branch '$BRANCH' does not match the $EXPECTED_BRANCH_PREFIX* convention" ;;
esac

# Never let a plan silently target someone else's branch.
for ref in $(git config --get-all arena.push-target 2>/dev/null); do
  [ "$ref" = "$BRANCH" ] || bad "configured push target '$ref' != current branch '$BRANCH'"
done

for f in tools/session-restore.sh SKILL.md index.html script.js styles.css; do
  [ -f "$f" ] && ok "present: $f" || bad "missing: $f"
done

# ---------------------------------------------------------------- content gates
head2 "Content gates"

if have node; then
  node --check script.js >/dev/null 2>&1 && ok "G1 script.js parses (node --check)" \
                                          || bad "G1 script.js has a syntax error"
else
  note "G1 skipped — node not on PATH"
fi

# G2: every id the JS reaches for must exist in the markup it drives.
missing_ids=$(python3 - <<'PY' 2>/dev/null
import re,sys,pathlib
try:
    js = pathlib.Path("script.js").read_text(encoding="utf8")
    html = pathlib.Path("index.html").read_text(encoding="utf8") + pathlib.Path("wiki.html").read_text(encoding="utf8")
except OSError:
    sys.exit(0)
have = set(re.findall(r'id="([^"]+)"', html))
want = set(re.findall(r"""getElementById\(\s*['"]([^'"]+)['"]""", js))
want |= set(re.findall(r"""\$\(\s*['"]#([A-Za-z][\w-]*)['"]""", js))
print(" ".join(sorted(want - have)))
PY
)
if [ -z "${missing_ids:-}" ]; then
  ok "G2 all JS-referenced element ids exist in markup"
else
  bad "G2 dangling ids: $missing_ids"
fi

# G3: no link to a file that isn't tracked.
dead_links=$(git ls-files | grep -Eo '(href|src)="[^"#]+\.(html|md|pdf|css|js)"' 2>/dev/null \
  | sed -E 's/.*="([^"]+)"/\1/' | sort -u \
  | while read -r f; do [ -e "$f" ] || echo "$f"; done)
[ -z "${dead_links:-}" ] && ok "G3 no dead local href/src targets" \
                         || bad "G3 dead links: $(echo $dead_links | tr '\n' ' ')"

# G4: the version string must agree everywhere it is advertised.
vers=$(for f in SKILL.md README.md index.html wiki.html; do
         [ -f "$f" ] || continue
         grep -o -E 'Version: *[0-9]+\.[0-9]+|v[0-9]+\.[0-9]+' "$f" | head -1 | grep -o -E '[0-9]+\.[0-9]+'
       done | sort -u | tr '\n' ' ')
set -- $vers
if [ "${#@}" -eq 0 ]; then
  note "G4 no version marker found — nothing to check"
elif [ "${#@}" -eq 1 ]; then
  ok "G4 single advertised version across files: v$1"
else
  bad "G4 version drift across files: $vers (collapse to one)"
fi

# G5: the version we are about to ship must have a tag, and the tag must be released.
ver=${1:-}
if [ -n "$ver" ]; then
  if git rev-parse -q --verify "refs/tags/v$ver" >/dev/null; then
    ok "G5 tag v$ver exists"
    # An annotated tag's ref is a 'tag' object; a lightweight tag points straight at a
    # commit. Comparing rev-parse output against v..^{commit} gets this backwards.
    case "$(git cat-file -t "refs/tags/v$ver" 2>/dev/null)" in
      tag) ok "G5 v$ver is annotated ($(git for-each-ref --format='%(taggerdate:short)' "refs/tags/v$ver"))" ;;
      *)   note "G5 v$ver is a lightweight tag — prefer annotated for releases" ;;
    esac
    # A release tag must be on the shipped line, not on whoever's branch.
    tag_commit=$(git rev-parse "v$ver^{commit}" 2>/dev/null)
    if git rev-parse -q --verify origin/master >/dev/null 2>&1; then
      if git merge-base --is-ancestor "$tag_commit" origin/master; then
        ok "G5 v$ver ($(git rev-parse --short "$tag_commit")) is an ancestor of origin/master"
      else
        bad "G5 v$ver ($(git rev-parse --short "$tag_commit")) is NOT on origin/master — tagged the wrong branch/commit"
      fi
    fi
  else
    note "G5 no tag for v$ver yet — HEAD=$(git rev-parse --short HEAD) is unreleased"
  fi
fi

# G9: browser code must not use root-absolute paths — Pages serves this site
# from /aiskills-photog/, so fetch('/api/x') escapes the project and 404s.
root_abs=$(grep -nE "fetch\(['\"]/|src=['\"]/[^/]|href=['\"]/[^/]" index.html wiki.html script.js styles.css 2>/dev/null \
  | grep -v '^\s*$' || true)
[ -z "$root_abs" ] && ok "G9 no root-absolute asset/API paths in browser code" \
                   || bad "G9 subpath-hostile root-absolute paths: $(echo "$root_abs" | cut -c1-70 | tr '\n' ';')"

# G10: generated artifacts mirror their source (v5.0 drifted: wiki.html said
# 'v5.0 · 6 domains' while SKILL.md said 5.0 / 7 domains).
if [ -f SKILL.md ] && [ -f wiki.html ]; then
  src_v=$(grep -o -E 'Version: *[0-9]+\.[0-9]+' SKILL.md | head -1 | grep -o -E '[0-9]+\.[0-9]+')
  wiki_v=$(grep -o -E 'v[0-9]+\.[0-9]+ · [A-Z][a-z]+( [0-9]{1,2},)? [0-9]{4}' wiki.html | head -1 | grep -o -E '[0-9]+\.[0-9]+')
  if [ -n "$src_v" ] && [ "$src_v" = "$wiki_v" ]; then
    ok "G10 wiki.html advertises v$wiki_v, matching SKILL.md"
  else
    bad "G10 generated wiki.html is stale (SKILL.md v${src_v:-?} vs wiki v${wiki_v:-?}) — run python3 tools/build-wiki.py"
  fi
fi

# G11: generators must derive their bound/counts from the document; a hard-coded
# domain ceiling is what silently dropped Domain 07 from wiki.html and skills.pdf.
hard_bound=$(grep -n '1 <= int(m.group(1)) <= [0-9]' tools/build-wiki.py tools/build-pdf.py 2>/dev/null || true)
[ -z "$hard_bound" ] && ok "G11 no hard-coded domain bound in generators" \
                     || bad "G11 hard-coded domain ceiling in tools/: $(echo "$hard_bound" | cut -c1-60 | tr '\n' ';')"

# G12: no tracked file may link to an untracked (deleted) sibling.
if have git; then
  orphan_targets=$(grep -rhoE 'github\.io/aiskills-photog/[A-Za-z0-9_.-]+' --include='*.py' --include='*.md' --include='*.html' . 2>/dev/null \
    | sed 's#.*/##' | grep -E '\.[a-z]+$' | sort -u | while read -r f; do git ls-files --error-unmatch "$f" >/dev/null 2>&1 || echo "$f"; done)
  [ -z "${orphan_targets:-}" ] && ok "G12 no links to deleted project files" \
                               || bad "G12 references untracked file(s): $orphan_targets"
fi

# G13: behaviour of the AI critique drawer (network + storage), jsdom-backed.
if have node && [ -f tools/test-critique.js ]; then
  t_out=$(node tools/test-critique.js 2>/dev/null); t_rc=$?
  case "$t_rc" in
    0) ok "G13 critique drawer behaviour verified" ;;
    2) note "G13 skipped — jsdom not installed (npm install jsdom --no-save)" ;;
    *) bad "G13 critique drawer misbehaves:"
       echo "$t_out" | grep -E '^\s*FAIL' | sed 's/^\s*/        /' ;;
  esac
fi

# G14: smoke-test the real page interactions (builder, search, theme, menu).
if have node && [ -f tools/test-site.js ]; then
  site_out=$(node tools/test-site.js 2>/dev/null); site_rc=$?
  case "$site_rc" in
    0) ok "G14 static page interactions verified" ;;
    2) note "G14 skipped — jsdom not installed (npm install jsdom --no-save)" ;;
    *) bad "G14 static page interactions misbehave:"
       echo "$site_out" | grep -E '^\s*FAIL' | sed 's/^\s*/        /' ;;
  esac
fi

# G15: exercise the stdlib server-side proxy without making a network request.
if have python3 && [ -f tools/test-critique-api.py ]; then
  api_out=$(python3 tools/test-critique-api.py 2>/dev/null); api_rc=$?
  if [ "$api_rc" -eq 0 ]; then
    ok "G15 critique proxy validation and transport verified"
  else
    bad "G15 critique proxy misbehaves:"
    echo "$api_out" | grep -E '^\s*FAIL' | sed 's/^\s*/        /'
  fi
fi

# ---------------------------------------------------------------- release gates
head2 "Release gates (live GitHub)"

if have gh && gh auth status >/dev/null 2>&1; then
  slug=$(git remote get-url origin | sed -E 's#.*[:/]([^/]+/[^/.]+)(\.git)?$#\1#')

  pages=$(gh api "repos/$slug/pages" --jq .source.branch 2>/dev/null)
  if [ "$pages" = "$PAGES_BRANCH_EXPECTED" ]; then
    ok "G6 Pages builds from '$pages'"
  else
    bad "G6 Pages source branch is '${pages:-unknown}', expected '$PAGES_BRANCH_EXPECTED'"
  fi

  def=$(gh api "repos/$slug" --jq .default_branch 2>/dev/null)
  [ "$def" = "$PAGES_BRANCH_EXPECTED" ] && ok "G7 default branch is '$def'" \
                                        || note "G7 default branch is '${def:-unknown}', Pages points at '$PAGES_BRANCH_EXPECTED'"

  n=$(gh pr list --repo "$slug" --head "$BRANCH" --state open --json number --jq 'length' 2>/dev/null)
  [ "${n:-0}" = "0" ] && ok "G8 no open PR from $BRANCH (safe to push)" \
                      || note "G8 PR #$n already open for $BRANCH — push updates it, do not re-create"

  merged=$(gh pr list --repo "$slug" --head "$BRANCH" --state merged --json number --jq '.[0].number' 2>/dev/null)
  if [ -n "${merged:-}" ]; then
    unpub=$(git rev-list --count "${live_sha:-HEAD}..HEAD" 2>/dev/null || echo "?")
    note "G8 head branch was merged once already (PR #$merged) — reusable if you push new commits ($unpub local-only)"
  fi
else
  note "G6-G8 skipped — gh unavailable or unauthenticated"
fi

# ---------------------------------------------------------------- summary
head2 "Summary"
printf '  %d passed · %d warnings · %d failed\n' "$pass" "$warn" "$fail"
if [ "$fail" -gt 0 ]; then
  echo "  → gates are RED. Fix the failures above; nothing here should be pushed or merged."
  exit 1
fi
echo "  → gates are GREEN for the checks above. Publishing (push / PR / tag) is still your call."
