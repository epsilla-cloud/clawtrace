"""Notification sender — Azure ECS email + Slack webhook."""

from __future__ import annotations

import json
import logging

import httpx

from .config import Settings
from .database import get_pending_notifications, mark_notifications_sent

logger = logging.getLogger(__name__)


def _render_low_credit_email(name: str, email: str) -> str:
    return f"""\
<div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 20px;">
  <h2 style="color: #2e2115; font-size: 20px;">Your ClawTrace credits are running low</h2>
  <p style="color: #5a4534; font-size: 14px; line-height: 1.6;">
    Hi {name},<br><br>
    Your ClawTrace credit balance has dropped below the alert threshold.
    To keep your agents running without interruption, please top up your credits.
  </p>
  <a href="https://clawtrace.ai/billing"
     style="display: inline-block; padding: 10px 24px; background: #a4532b; color: #fff;
            border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
    Top Up Credits
  </a>
  <p style="color: #8c7a66; font-size: 12px; margin-top: 24px;">
    &mdash; The ClawTrace Team
  </p>
</div>"""


async def _send_email_azure(
    to_email: str,
    to_name: str,
    subject: str,
    html_body: str,
    settings: Settings,
) -> None:
    if not settings.azure_ecs_connection_string:
        logger.warning("Azure ECS not configured, skipping email to %s", to_email)
        return
    try:
        from azure.communication.email import EmailClient

        client = EmailClient.from_connection_string(
            settings.azure_ecs_connection_string
        )
        message = {
            "senderAddress": settings.azure_ecs_sender,
            "recipients": {"to": [{"address": to_email, "displayName": to_name}]},
            "content": {"subject": subject, "html": html_body},
        }
        poller = client.begin_send(message)
        poller.result()
        logger.info("Email sent to %s", to_email)
    except Exception:
        logger.exception("Failed to send email to %s", to_email)


async def _send_slack(message: str, settings: Settings) -> None:
    if not settings.slack_webhook_url:
        return
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(
                settings.slack_webhook_url,
                json={"text": message},
            )
            resp.raise_for_status()
    except Exception:
        logger.exception("Failed to send Slack notification")


async def send_pending_notifications(settings: Settings) -> None:
    """Process all pending notifications: send email + Slack, mark sent."""
    if not settings.notification_enabled:
        return

    pending = await get_pending_notifications(settings)
    if not pending:
        return

    sent_ids: list[str] = []
    for notif in pending:
        user_email = notif.get("email")
        user_name = notif.get("name", "there")
        notif_type = notif["notification_type"]

        if notif_type == "low_credit" and user_email:
            html = _render_low_credit_email(user_name, user_email)
            await _send_email_azure(
                to_email=user_email,
                to_name=user_name,
                subject="ClawTrace: Your credits are running low",
                html_body=html,
                settings=settings,
            )
            await _send_slack(
                f":warning: *Low credit alert* — user {user_name} ({user_email}) "
                f"has fallen below the credit threshold.",
                settings,
            )

        sent_ids.append(str(notif["id"]))

    await mark_notifications_sent(sent_ids, settings)
    logger.info("Processed %d pending notifications", len(sent_ids))
