#!/usr/bin/env bash
# ==============================================================================
# ARENA_CORE // Automated Setup & Verification Script
# Week 10 Industry Showcase Deliverable
# ==============================================================================

set -e

# ANSI Color formatting
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${CYAN}${BOLD}"
echo "=================================================================="
echo "   ARENA_CORE // Global Football Platform & Tournament Simulator  "
echo "=================================================================="
echo -e "${NC}"

echo -e "${YELLOW}🔍 [1/4] Checking project files and structure...${NC}"
REQUIRED_FILES=("index.html" "style.css" "app.js" "data/real-tournaments.js" "README.md")
MISSING_FILES=0

for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "  ${GREEN}✓${NC} Found $file"
  else
    echo -e "  ${RED}✗ Missing required file: $file${NC}"
    MISSING_FILES=$((MISSING_FILES + 1))
  fi
done

if [ $MISSING_FILES -ne 0 ]; then
  echo -e "\n${RED}Error: Project structure incomplete. Missing $MISSING_FILES required file(s).${NC}"
  exit 1
fi

echo -e "\n${YELLOW}🧪 [2/4] Verifying runtime dependencies & environment...${NC}"
if command -v node >/dev/null 2>&1; then
  NODE_VER=$(node -v)
  echo -e "  ${GREEN}✓${NC} Node.js detected: ${BOLD}$NODE_VER${NC}"
  
  # Run syntax check and unit test suite if test files exist
  echo -e "  ${GREEN}✓${NC} Verifying app.js syntax..."
  node -c app.js
  
  if [ -f "scratch/test-runtime-execution.js" ]; then
    echo -e "  ${GREEN}✓${NC} Running startup lifecycle verification..."
    node scratch/test-runtime-execution.js
  fi
else
  echo -e "  ${YELLOW}ℹ Note: Node.js not detected in path. Vanilla static files can still run directly in any browser.${NC}"
fi

echo -e "\n${YELLOW}🚀 [3/4] Ready to launch ARENA_CORE!${NC}"
echo -e "  ${GREEN}✓${NC} Environment check passed successfully."

echo -e "\n${CYAN}=================================================================="
echo -e "                      HOW TO RUN LOCALLY                          "
echo -e "==================================================================${NC}"
echo -e "Option 1: Double-click ${BOLD}index.html${NC} in your file manager."
echo -e "Option 2: Using Python HTTP server:"
echo -e "          ${BOLD}python3 -m http.server 8080${NC} (or ${BOLD}python -m http.server 8080${NC})"
echo -e "Option 3: Using Node / npx:"
echo -e "          ${BOLD}npx -y serve .${NC}"
echo -e "Live URL: ${BOLD}https://omwe77.github.io/SIEP--arena_coore/${NC}"
echo -e "${CYAN}==================================================================${NC}\n"

exit 0
