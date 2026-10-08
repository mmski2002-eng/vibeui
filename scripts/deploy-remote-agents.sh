#!/usr/bin/env bash
# Runs on the Latvian VPS. Expects $REL with the agents/ source already synced.
set -euo pipefail

cd "$REL"
npm ci --no-audit --no-fund --cache /srv/vibeui-agents/.npm
chown -R vibeui-agents:vibeui-agents "$REL"

set -a; . /etc/vibeui-agents/agents.env; set +a
sudo -u vibeui-agents -E node node_modules/tsx/dist/cli.mjs src/cli.ts migrate

ln -sfn "$REL" /srv/vibeui-agents/current
systemctl restart vibeui-agents-admin vibeui-agents-worker
sleep 3
systemctl is-active vibeui-agents-admin vibeui-agents-worker

ls -1dt /srv/vibeui-agents/releases/* | tail -n +6 | xargs -r rm -rf
