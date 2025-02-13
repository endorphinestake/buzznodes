import re


def clean_tags_from_text(text: str) -> str:
    text = re.sub(r"<[^>]+>", "", text).strip()
    text = re.sub(r"\s+", " ", text).strip()
    return text
