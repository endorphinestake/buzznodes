import re
from django.utils.translation import gettext_lazy as _


def clean_tags_from_text(text: str) -> str:
    text = re.sub(r"<[^>]+>", "", text).strip()
    text = re.sub(r"\s+", " ", text).strip()
    return text


def format_ping_time(seconds: int) -> str:
    if seconds < 3:
        return "Right now"

    if seconds < 60:
        thresholds = [
            (3, "3 Seconds ago"),
            (6, "6 Seconds ago"),
            (9, "9 Seconds ago"),
            (15, "15 Seconds ago"),
            (30, "30 Seconds ago"),
        ]
        for limit, text in thresholds:
            if seconds <= limit:
                return text
        return "30 Seconds ago"

    if seconds < 300:
        return "more 1 minutes ago"  # [60, 300)
    if seconds < 600:
        return "more 5 minutes ago"  # [300, 600)
    if seconds < 900:
        return "more 10 minutes ago"  # [600, 900)
    if seconds < 1800:
        return "more 15 minutes ago"  # [900, 1800)
    if seconds < 3600:
        return "more 30 minutes ago"  # [1800, 3600)
    if seconds < 7200:
        return "more 1 hour ago"  # [3600, 7200)
    if seconds < 10800:
        return "more 2 hours ago"  # [7200, 10800)
    if seconds < 14400:
        return "more 3 hours ago"  # [10800, 14400)
    if seconds < 18000:
        return "more 4 hours ago"  # [14400, 18000)
    if seconds < 36000:
        return "more 5 hours ago"  # [18000, 36000)
    if seconds < 54000:
        return "more 10 hours ago"  # [36000, 54000)
    if seconds < 72000:
        return "more 15 hours ago"  # [54000, 72000)
    if seconds < 86400:
        return "more 20 hours ago"  # [72000, 86400)

    if seconds < 2 * 86400:
        return "more 1 day ago"

    for i in range(2, 101):
        if seconds < (i + 1) * 86400:
            return f"more {i} days ago"

    return "more than 100 days ago"


def get_sync_status(blocks_behind: int) -> str:
    if blocks_behind < 100:
        return _("Synced")
    threshold = ((blocks_behind - 100) // 100) * 100 + 100
    # formatted = format(threshold, ",").replace(",", " ")
    return f"{threshold} blocks behind"
