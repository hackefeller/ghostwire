#!/bin/bash

# ============================================================================
# Ghostwire Agent Bulk Rename Script
# ============================================================================
# Usage: ./bulk-rename.sh "old-name" "new-name"
# Example: ./bulk-rename.sh "zen-planner" "planner"
# ============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC_DIR="${REPO_ROOT}/src"
TESTS_DIR="${REPO_ROOT}/tests"
DOCS_DIR="${REPO_ROOT}/docs"

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

print_header() {
  echo -e "\n${BLUE}════════════════════════════════════════════════════════${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}════════════════════════════════════════════════════════${NC}\n"
}

print_success() {
  echo -e "${GREEN}✓${NC} $1"
}

print_error() {
  echo -e "${RED}✗${NC} $1"
}

print_info() {
  echo -e "${YELLOW}ℹ${NC} $1"
}

# Generate name permutations
generate_permutations() {
  local old_name="$1"
  local new_name="$2"

  # kebab-case (already input format)
  OLD_KEBAB="$old_name"
  NEW_KEBAB="$new_name"

  # camelCase: convert first part lowercase, rest capitalized
  # void-runner → voidRunner, zen-planner → zenPlanner
  OLD_CAMEL=$(echo "$old_name" | awk -F'-' '{printf "%s", tolower($1); for(i=2;i<=NF;i++) printf "%s", toupper(substr($i,1,1)) substr($i,2); print ""}')
  NEW_CAMEL=$(echo "$new_name" | awk -F'-' '{printf "%s", tolower($1); for(i=2;i<=NF;i++) printf "%s", toupper(substr($i,1,1)) substr($i,2); print ""}')

  # snake_case
  OLD_SNAKE=$(echo "$old_name" | tr '-' '_')
  NEW_SNAKE=$(echo "$new_name" | tr '-' '_')

  # SCREAMING_SNAKE
  OLD_SCREAMING=$(echo "$OLD_SNAKE" | tr 'a-z' 'A-Z')
  NEW_SCREAMING=$(echo "$NEW_SNAKE" | tr 'a-z' 'A-Z')

  # PascalCase: capitalize first char, rest camelCase
  # void-runner → VoidRunner, zen-planner → ZenPlanner
  OLD_PASCAL=$(echo "$old_name" | awk -F'-' '{for(i=1;i<=NF;i++) printf "%s", toupper(substr($i,1,1)) substr($i,2); print ""}')
  NEW_PASCAL=$(echo "$new_name" | awk -F'-' '{for(i=1;i<=NF;i++) printf "%s", toupper(substr($i,1,1)) substr($i,2); print ""}')

  # lowercase with underscores (alternative snake)
  OLD_LOWER_SNAKE=$(echo "$old_name" | tr '-' '_' | tr 'A-Z' 'a-z')
  NEW_LOWER_SNAKE=$(echo "$new_name" | tr '-' '_' | tr 'A-Z' 'a-z')

  # UPPERCASE-KEBAB (for constants)
  OLD_UPPER_KEBAB=$(echo "$old_name" | tr 'a-z' 'A-Z')
  NEW_UPPER_KEBAB=$(echo "$new_name" | tr 'a-z' 'A-Z')
}

# Count references before replacement
count_references() {
  local pattern="$1"
  local count=0

  # Search in src and tests, exclude node_modules and dist
  count=$(grep -r "$pattern" "$SRC_DIR" "$TESTS_DIR" "$DOCS_DIR" \
    --include="*.ts" --include="*.yml" --include="*.yaml" \
    2>/dev/null | wc -l || echo "0")

  echo "$count"
}

# Perform bulk text replacement
bulk_replace() {
  local old_pattern="$1"
  local new_pattern="$2"
  local description="$3"

  # Count before
  local count_before=$(count_references "$old_pattern")

  if [ "$count_before" -eq 0 ]; then
    return 0
  fi

  # Perform replacement
  find "$SRC_DIR" "$TESTS_DIR" "$DOCS_DIR" \
    -type f \( -name "*.ts" -o -name "*.yml" -o -name "*.yaml" \) \
    -not -path "*/node_modules/*" \
    -not -path "*/dist/*" \
    2>/dev/null | \
    xargs sed -i '' "s/${old_pattern}/${new_pattern}/g" 2>/dev/null || true

  # Count after
  local count_after=$(count_references "$old_pattern")
  local replaced=$((count_before - count_after))

  echo "$replaced"
}

# Rename file
rename_file() {
  local old_file="$1"
  local new_file="$2"

  if [ -f "$old_file" ]; then
    mv "$old_file" "$new_file"
    print_success "Renamed: $(basename "$old_file") → $(basename "$new_file")"
    return 0
  fi
  return 1
}

# Rename directory
rename_directory() {
  local old_dir="$1"
  local new_dir="$2"

  if [ -d "$old_dir" ]; then
    mv "$old_dir" "$new_dir"
    print_success "Renamed directory: $(basename "$old_dir") → $(basename "$new_dir")"
    return 0
  fi
  return 1
}

# Verify no orphaned references remain
verify_cleanup() {
  local patterns=("$@")
  local orphaned=0

  for pattern in "${patterns[@]}"; do
    local count=$(grep -r "$pattern" "$SRC_DIR" "$TESTS_DIR" "$DOCS_DIR" \
      --include="*.ts" --include="*.yml" --include="*.yaml" \
      2>/dev/null | wc -l || echo "0")

    if [ "$count" -gt 0 ]; then
      orphaned=$((orphaned + count))
      print_error "Found $count remaining reference(s) to: $pattern"
    fi
  done

  echo "$orphaned"
}

# ============================================================================
# MAIN SCRIPT
# ============================================================================

# Validate arguments
if [ $# -lt 2 ]; then
  print_error "Usage: ./bulk-rename.sh \"old-name\" \"new-name\""
  echo "Example: ./bulk-rename.sh \"zen-planner\" \"planner\""
  exit 1
fi

OLD_NAME="$1"
NEW_NAME="$2"

print_header "Ghostwire Agent Bulk Rename: $OLD_NAME → $NEW_NAME"

# Generate all permutations
generate_permutations "$OLD_NAME" "$NEW_NAME"

print_info "Generated name permutations:"
echo "  kebab-case:      $OLD_KEBAB → $NEW_KEBAB"
echo "  camelCase:       $OLD_CAMEL → $NEW_CAMEL"
echo "  snake_case:      $OLD_SNAKE → $NEW_SNAKE"
echo "  SCREAMING_SNAKE: $OLD_SCREAMING → $NEW_SCREAMING"
echo "  PascalCase:      $OLD_PASCAL → $NEW_PASCAL"
echo "  UPPER-KEBAB:     $OLD_UPPER_KEBAB → $NEW_UPPER_KEBAB"

# ============================================================================
# PHASE 1: RENAME FILES AND DIRECTORIES
# ============================================================================

print_header "Phase 1: File and Directory Renames"

files_renamed=0
hooks_renamed=0

# Rename agent file
AGENT_FILE="${SRC_DIR}/orchestration/agents/${OLD_KEBAB}.ts"
AGENT_NEW_FILE="${SRC_DIR}/orchestration/agents/${NEW_KEBAB}.ts"
if rename_file "$AGENT_FILE" "$AGENT_NEW_FILE"; then
  files_renamed=$((files_renamed + 1))
fi

# Rename agent test file (if exists)
AGENT_TEST_FILE="${SRC_DIR}/orchestration/agents/${OLD_KEBAB}.test.ts"
AGENT_TEST_NEW_FILE="${SRC_DIR}/orchestration/agents/${NEW_KEBAB}.test.ts"
if [ -f "$AGENT_TEST_FILE" ]; then
  rename_file "$AGENT_TEST_FILE" "$AGENT_TEST_NEW_FILE"
  files_renamed=$((files_renamed + 1))
fi

# Rename hook directory (if exists, using pattern: {old-name}-*)
HOOKS_DIR="${SRC_DIR}/orchestration/hooks"
for hook_dir in "$HOOKS_DIR"/"${OLD_KEBAB}"-*; do
  if [ -d "$hook_dir" ]; then
    hook_name=$(basename "$hook_dir")
    new_hook_name="${hook_name//${OLD_KEBAB}/${NEW_KEBAB}}"
    new_hook_path="${HOOKS_DIR}/${new_hook_name}"
    rename_directory "$hook_dir" "$new_hook_path"
    hooks_renamed=$((hooks_renamed + 1))
  fi
done

# Special case: grid-sync hook (directory without suffix)
if [ "$OLD_KEBAB" = "grid-sync" ]; then
  GRID_SYNC_HOOK="${HOOKS_DIR}/grid-sync"
  ORCHESTRATOR_HOOK="${HOOKS_DIR}/orchestrator"
  if [ -d "$GRID_SYNC_HOOK" ]; then
    rename_directory "$GRID_SYNC_HOOK" "$ORCHESTRATOR_HOOK"
    hooks_renamed=$((hooks_renamed + 1))
  fi
fi

print_success "Files renamed: $files_renamed"
print_success "Hook directories renamed: $hooks_renamed"

# ============================================================================
# PHASE 2: BULK TEXT REPLACEMENT
# ============================================================================

print_header "Phase 2: Bulk Text Replacement"

total_replaced=0

# kebab-case
replaced=$(bulk_replace "$OLD_KEBAB" "$NEW_KEBAB" "kebab-case")
echo "  kebab-case ($OLD_KEBAB → $NEW_KEBAB): $replaced references"
total_replaced=$((total_replaced + replaced))

# camelCase
replaced=$(bulk_replace "$OLD_CAMEL" "$NEW_CAMEL" "camelCase")
echo "  camelCase ($OLD_CAMEL → $NEW_CAMEL): $replaced references"
total_replaced=$((total_replaced + replaced))

# snake_case
replaced=$(bulk_replace "$OLD_SNAKE" "$NEW_SNAKE" "snake_case")
echo "  snake_case ($OLD_SNAKE → $NEW_SNAKE): $replaced references"
total_replaced=$((total_replaced + replaced))

# SCREAMING_SNAKE
replaced=$(bulk_replace "$OLD_SCREAMING" "$NEW_SCREAMING" "SCREAMING_SNAKE")
echo "  SCREAMING_SNAKE ($OLD_SCREAMING → $NEW_SCREAMING): $replaced references"
total_replaced=$((total_replaced + replaced))

# PascalCase
replaced=$(bulk_replace "$OLD_PASCAL" "$NEW_PASCAL" "PascalCase")
echo "  PascalCase ($OLD_PASCAL → $NEW_PASCAL): $replaced references"
total_replaced=$((total_replaced + replaced))

# UPPER-KEBAB
replaced=$(bulk_replace "$OLD_UPPER_KEBAB" "$NEW_UPPER_KEBAB" "UPPER-KEBAB")
echo "  UPPER-KEBAB ($OLD_UPPER_KEBAB → $NEW_UPPER_KEBAB): $replaced references"
total_replaced=$((total_replaced + replaced))

print_success "Total references replaced: $total_replaced"

# ============================================================================
# PHASE 3: VERIFICATION
# ============================================================================

print_header "Phase 3: Verification"

orphaned=$(verify_cleanup "$OLD_KEBAB" "$OLD_CAMEL" "$OLD_SCREAMING" "$OLD_PASCAL" "$OLD_UPPER_KEBAB")

if [ "$orphaned" -eq 0 ]; then
  print_success "No orphaned references found"
else
  print_error "Found $orphaned orphaned reference(s)"
  exit 1
fi

# ============================================================================
# SUMMARY REPORT
# ============================================================================

print_header "Summary Report"

echo "Target: $OLD_NAME → $NEW_NAME"
echo ""
echo "Files & Directories:"
echo "  ✓ Agent files renamed: $files_renamed"
echo "  ✓ Hook directories renamed: $hooks_renamed"
echo ""
echo "Text Replacements:"
echo "  ✓ Total references updated: $total_replaced"
echo ""
echo "Verification:"
echo "  ✓ Orphaned references: $orphaned"
echo "  ✓ Status: CLEAN"
echo ""
print_success "Bulk rename completed successfully!"
print_info "Next step: Run 'bun test' to verify all tests pass"
