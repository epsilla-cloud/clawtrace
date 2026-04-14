#!/usr/bin/env bash
# Deploy puppygraph-monitor to the ingest VM.
#
# Required env vars (set before running):
#   INGEST_VM_USER   SSH user on the ingest VM         (e.g. azureuser)
#   INGEST_VM_IP     IP or hostname of the ingest VM   (e.g. 20.98.206.232)
#   INGEST_VM_PEM    Path to SSH private key for the ingest VM
#
# Example:
#   INGEST_VM_USER=azureuser \
#   INGEST_VM_IP=20.98.206.232 \
#   INGEST_VM_PEM=/path/to/key.pem \
#   bash services/puppygraph-monitor/install.sh
set -euo pipefail

: "${INGEST_VM_USER:?INGEST_VM_USER is required}"
: "${INGEST_VM_IP:?INGEST_VM_IP is required}"
: "${INGEST_VM_PEM:?INGEST_VM_PEM is required}"

REMOTE="$INGEST_VM_USER@$INGEST_VM_IP"
REMOTE_DIR="/opt/clawtrace/puppygraph-monitor"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== Deploying puppygraph-monitor to $REMOTE ==="

ssh -i "$INGEST_VM_PEM" -o StrictHostKeyChecking=no "$REMOTE" \
  "sudo mkdir -p $REMOTE_DIR && sudo chown $INGEST_VM_USER:$INGEST_VM_USER $REMOTE_DIR"

scp -i "$INGEST_VM_PEM" -o StrictHostKeyChecking=no \
  "$SCRIPT_DIR/puppygraph_monitor.py" \
  "$SCRIPT_DIR/puppygraph-monitor.service" \
  "$SCRIPT_DIR/.env.example" \
  "$REMOTE:$REMOTE_DIR/"

# Copy the PEM key used by the monitor to SSH into the PuppyGraph VM for restart
scp -i "$INGEST_VM_PEM" -o StrictHostKeyChecking=no \
  "$INGEST_VM_PEM" \
  "$REMOTE:$REMOTE_DIR/clawtrace-ingest-vm_key.pem"

ssh -i "$INGEST_VM_PEM" -o StrictHostKeyChecking=no "$REMOTE" \
  "chmod 600 $REMOTE_DIR/clawtrace-ingest-vm_key.pem"

ssh -i "$INGEST_VM_PEM" -o StrictHostKeyChecking=no "$REMOTE" "
  if [ ! -f $REMOTE_DIR/.env ]; then
    cp $REMOTE_DIR/.env.example $REMOTE_DIR/.env
    echo ''
    echo 'ACTION REQUIRED: fill in credentials in $REMOTE_DIR/.env before starting the service:'
    echo '  PUPPYGRAPH_PASSWORD=...'
    echo '  SLACK_WEBHOOK_URL=...'
    echo '  PUPPYGRAPH_VM_IP=...'
  else
    echo '.env already exists — not overwriting'
  fi
"

ssh -i "$INGEST_VM_PEM" -o StrictHostKeyChecking=no "$REMOTE" "
  sudo cp $REMOTE_DIR/puppygraph-monitor.service /etc/systemd/system/
  sudo systemctl daemon-reload
  sudo systemctl enable puppygraph-monitor
"

echo ""
echo "=== Deploy complete. Next steps ==="
echo "1. SSH to $REMOTE"
echo "2. Fill in credentials: sudo nano $REMOTE_DIR/.env"
echo "3. Start the service:   sudo systemctl start puppygraph-monitor"
echo "4. Check status:        sudo systemctl status puppygraph-monitor"
echo "5. Watch logs:          sudo journalctl -u puppygraph-monitor -f"
