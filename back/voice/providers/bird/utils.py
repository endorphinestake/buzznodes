import re
import requests

from django.conf import settings

from alerts.utils import clean_tags_from_text
from logs.models import Log


def bird_submit_voice(phone: str, text: str) -> tuple[str | None, str | None]:
    text = clean_tags_from_text(text)

    url = f"https://api.bird.com/workspaces/{settings.BIRD_WORKSPACE_ID}/channels/{settings.BIRD_VOICE_CHANNEL_ID}/calls"
    headers = {
        "Authorization": f"AccessKey {settings.BIRD_ACCESS_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "to": phone,
        "callFlow": [
            {
                "command": "say",
                "options": {
                    "locale": "en-US",
                    "text": text,
                    "voice": "male",
                },
            },
            {"command": "hangup"},
        ],
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        response.raise_for_status()
        resp_json = response.json()

        print("VOICE JSON RESPONSE: ", resp_json)

        voice_id = resp_json.get("id")
        if not voice_id:
            Log.error("Bird API response does not contain voice ID")
            return "Invalid API response", None

        return None, voice_id

    except requests.RequestException as req_err:
        Log.error(f"Request error in bird_submit_voice: {str(req_err)}")
        return str(req_err), None
    except Exception as err:
        Log.error(f"Unexpected error in bird_submit_voice: {str(err)}")
        return str(err), None
