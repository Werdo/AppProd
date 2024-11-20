#!/bin/bash
echo "Running linting checks..."

# Format with black
echo "Formatting code with black..."
black app/ tests/

# Sort imports
echo "Sorting imports with isort..."
isort app/ tests/

# Check with flake8
echo "Checking code with flake8..."
flake8 app/ tests/ --max-line-length=88 --extend-ignore=E203
