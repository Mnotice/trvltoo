#!/usr/bin/env bash
set -euo pipefail

cat > replacements.txt <<'EOF'
# Replace secrets with [REDACTED] in git history using git-filter-repo
# Format: literal:<secret>
# Example:
# literal:AIzaSy... <-- actual secret
# replacement:[REDACTED]
EOF

echo "Created replacements.txt. Review and add literal lines for any secrets you want removed."
echo "When ready, to scrub history (destructive) run these commands (example):"
echo "  git clone --mirror <repo-url> repo-mirror.git"
echo "  cd repo-mirror.git"
echo "  git filter-repo --replace-text ../replacements.txt"
echo "  git push --force --all"
echo "  git push --force --tags"

echo "NOTE: This rewrites history. Back up and ensure you understand the consequences before running."
