#!/bin/bash

# update-imports.sh
# Helper script to systematically update import paths during repo reorganization
# 
# Usage patterns:
#   1. Update internal imports within a domain:
#      ./scripts/update-imports.sh "./agents" "./orchestration/agents" "src/orchestration/agents"
#
#   2. Update cross-domain imports:
#      ./scripts/update-imports.sh "./features" "./execution/features" "src"
#
# The script handles both relative (./path) and absolute (path) import patterns

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Validate arguments
if [ $# -lt 2 ] || [ $# -gt 3 ]; then
    echo -e "${RED}Error: Invalid arguments${NC}"
    echo "Usage: $0 <old-pattern> <new-pattern> [target-directory]"
    echo ""
    echo "Examples:"
    echo "  # Update imports from ./agents to ./orchestration/agents"
    echo "  $0 './agents' './orchestration/agents' 'src'"
    echo ""
    echo "  # Update imports within a directory"
    echo "  $0 './features' './execution/features' 'src/orchestration'"
    exit 1
fi

OLD_PATTERN="$1"
NEW_PATTERN="$2"
TARGET_DIR="${3:-.}"

# Normalize paths
OLD_PATTERN="${OLD_PATTERN%/}"
NEW_PATTERN="${NEW_PATTERN%/}"
TARGET_DIR="${TARGET_DIR%/}"

# Verify target directory exists
if [ ! -d "$TARGET_DIR" ]; then
    echo -e "${RED}Error: Target directory not found: $TARGET_DIR${NC}"
    exit 1
fi

echo -e "${BLUE}=== Import Pattern Updater ===${NC}"
echo "Pattern (old):  $OLD_PATTERN"
echo "Pattern (new):  $NEW_PATTERN"
echo "Target dir:     $TARGET_DIR"
echo ""

# Find all TypeScript/JavaScript source files (exclude node_modules, dist, tests)
FILE_COUNT=0
declare -a files
while IFS= read -r file; do
    files+=("$file")
    ((FILE_COUNT++))
done < <(find "$TARGET_DIR" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
    ! -path "*/node_modules/*" \
    ! -path "*/dist/*" \
    ! -path "*/.next/*" \
    ! -path "*/.git/*" \
    2>/dev/null)

if [ $FILE_COUNT -eq 0 ]; then
    echo -e "${YELLOW}ℹ No TypeScript/JavaScript files found${NC}"
    exit 0
fi

echo "Scanning $FILE_COUNT files..."
echo ""

# Track statistics
TOTAL_CHANGES=0
CHANGED_FILES=0
TIMESTAMP=$(date +%s)
LOG_FILE="import-updates-${TIMESTAMP}.log"

# Create log file
{
    echo "Import Update Log"
    echo "================="
    echo "Timestamp: $(date)"
    echo "Pattern: $OLD_PATTERN → $NEW_PATTERN"
    echo "Target:  $TARGET_DIR"
    echo ""
    echo "Changes:"
    echo "--------"
} > "$LOG_FILE"

# Process each file
for file in "${files[@]}"; do
    # Count import occurrences of old pattern
    OLD_COUNT=$(grep -o "$OLD_PATTERN" "$file" 2>/dev/null | wc -l)
    
    if [ "$OLD_COUNT" -gt 0 ]; then
        # Create safety backup
        cp "$file" "${file}.bak"
        
        # Replace the pattern in imports
        # Uses pipes (|) as delimiters since paths contain slashes
        if sed -i.tmp "s|$OLD_PATTERN|$NEW_PATTERN|g" "$file" 2>/dev/null; then
            rm -f "${file}.tmp"
            
            # Verify replacement worked
            NEW_COUNT=$(grep -o "$NEW_PATTERN" "$file" 2>/dev/null | wc -l)
            
            # Check if old pattern still exists (might be in comments)
            REMAINING=$(grep "$OLD_PATTERN" "$file" 2>/dev/null | wc -l)
            
            CHANGES=$((OLD_COUNT))
            TOTAL_CHANGES=$((TOTAL_CHANGES + CHANGES))
            CHANGED_FILES=$((CHANGED_FILES + 1))
            
            echo -e "${GREEN}✓${NC} ${file#$TARGET_DIR/} ($OLD_COUNT replacements)"
            echo "$file: $OLD_COUNT replacements" >> "$LOG_FILE"
            
            # If old pattern still exists, note it (might be in comments - OK)
            if [ "$REMAINING" -gt 0 ]; then
                echo -e "${YELLOW}  ⚠ Old pattern still found (likely in comments)${NC}"
            fi
        else
            # Restore backup on error
            mv "${file}.bak" "$file"
            echo -e "${RED}✗${NC} ${file#$TARGET_DIR/} (sed failed - skipped)"
            echo "$file: ERROR - sed failed" >> "$LOG_FILE"
        fi
    fi
done

echo ""
echo -e "${BLUE}=== Summary ===${NC}"
echo "Files modified:    $CHANGED_FILES"
echo "Total replacements: $TOTAL_CHANGES"
echo ""

if [ $CHANGED_FILES -gt 0 ]; then
    echo -e "${GREEN}Backup files created (.bak extension)${NC}"
    echo "Review with:  git diff $TARGET_DIR"
    echo "Rollback:     git checkout -- $TARGET_DIR"
    echo "Accept:       rm -f $TARGET_DIR/**/*.bak"
    echo ""
    echo "Log saved to: $LOG_FILE"
else
    echo -e "${YELLOW}No imports updated (pattern not found)${NC}"
fi

echo -e "${GREEN}Done!${NC}"
