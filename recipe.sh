#!/usr/bin/env bash
curl -X PUT -H "Content-Type: application/json" -d { "title":"this is a test", "time":"30", "desc":"this is a description", "ingredient": "ingredient", "instruction": "instruction" } \
  http://localhost:4000/recipe
