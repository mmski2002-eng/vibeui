#!/usr/bin/env bash
# One-off: expose the agents admin at https://vibeui.club/agents/ (run as root on the Latvian VPS).
set -euo pipefail
SITE=/etc/nginx/sites-enabled/vibeui.club
grep -q 'location /agents/' "$SITE" && { echo "already configured"; exit 0; }
cp "$SITE" "/root/vibeui.club.nginx.bak.$(date +%s)"
python3 - "$SITE" <<'PY'
import sys
path = sys.argv[1]
text = open(path).read()
block = """    location = /agents { return 301 /agents/; }
    location /agents/ {
        proxy_pass http://127.0.0.1:4310/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }

"""
anchor = "    location / {\n        proxy_pass http://127.0.0.1:3003;"
assert text.count(anchor) == 1, "anchor not found"
open(path, "w").write(text.replace(anchor, block + anchor))
PY
nginx -t
systemctl reload nginx
echo "ok"
