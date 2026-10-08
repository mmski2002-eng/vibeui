#!/usr/bin/env bash
# One-off, run locally: one shared key for the agent → site invite API on both instances.
set -euo pipefail
KEY=$(openssl rand -hex 32)
SSH="ssh -i $HOME/.ssh/vibeui_ci"

$SSH root@216.173.70.241 "sed -i '/^AGENTS_API_KEY=/d' /etc/vibeui-club.env && echo 'AGENTS_API_KEY=$KEY' >> /etc/vibeui-club.env && systemctl restart vibeui-club
  sed -i '/^VIBEUI_INTERNAL_API_KEY=/d; /^OUTREACH_SENDER_NAME=/d' /etc/vibeui-agents/agents.env
  echo 'VIBEUI_INTERNAL_API_KEY=$KEY' >> /etc/vibeui-agents/agents.env
  echo 'OUTREACH_SENDER_NAME=VibeUI' >> /etc/vibeui-agents/agents.env
  systemctl restart vibeui-agents-worker"
$SSH root@185.104.251.106 "sed -i '/^AGENTS_API_KEY=/d' /etc/vibeui.env && echo 'AGENTS_API_KEY=$KEY' >> /etc/vibeui.env && systemctl restart vibeui"
echo "done"
