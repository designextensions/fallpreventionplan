#!/bin/bash
set -e
pnpm install --frozen-lockfile
# Apply schema, then seed the real program content (modules) so a fresh pull
# from GitHub leaves the app populated and ready — no manual seeding step.
# Content-only: no demo members, sample classes, or fake billing on production.
pnpm --filter db push
pnpm --filter @workspace/scripts run seed:content
