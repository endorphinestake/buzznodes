import re
from django.utils.translation import gettext_lazy as _


def clean_tags_from_text(text: str) -> str:
    text = re.sub(r"<[^>]+>", "", text).strip()
    text = re.sub(r"\s+", " ", text).strip()
    return text


def format_ping_time(seconds: int) -> str:
    if seconds < 3:
        return _("Right now")

    thresholds = [
        (3, _("3 Seconds ago")),
        (6, _("6 Seconds ago")),
        (9, _("9 Seconds ago")),
        (15, _("15 Seconds ago")),
        (30, _("30 Seconds ago")),
        (60, _("more 1 minutes ago")),
        (300, _("more 5 minutes ago")),
        (600, _("more 10 minutes ago")),
        (900, _("more 15 minutes ago")),
        (1800, _("more 30 minutes ago")),
        (3600, _("more 1 hour ago")),
        (7200, _("more 2 hours ago")),
        (10800, _("more 3 hours ago")),
        (14400, _("more 4 hours ago")),
        (18000, _("more 5 hours ago")),
        (36000, _("more 10 hours ago")),
        (54000, _("more 15 hours ago")),
        (72000, _("more 20 hours ago")),
        (86400, _("more 1 day ago")),
    ]

    for i in range(2, 101):
        thresholds.append((i * 86400, f"more {i} days ago"))

    for limit, text in thresholds:
        if seconds <= limit:
            return text

    return _("more than 100 days ago")


def get_sync_status(blocks_behind: int) -> str:
    if blocks_behind < 100:
        return _("Synced")
    elif blocks_behind < 500:
        return _("100 blocks behind")
    elif blocks_behind < 1000:
        return _("500 blocks behind")
    elif blocks_behind < 10000:
        return _("1000 blocks behind")
    else:
        return _("more than 10000 blocks behind")
