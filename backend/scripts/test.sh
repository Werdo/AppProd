#!/bin/bash
# Run tests
pytest tests/ -v --cov=app --cov-report=term-missing

# Run linting
flake8 app tests
black app tests --check
isort app tests --check-only