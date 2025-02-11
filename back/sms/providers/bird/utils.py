import requests

from django.conf import settings

from logs.models import Log


def bird_submit_sms(phone: str, text: str) -> tuple[str | None, str | None]:
    url = f"https://api.bird.com/workspaces/{settings.BIRD_WORKSPACE_ID}/channels/{settings.BIRD_SMS_CHANNEL_ID}/messages"
    headers = {
        "Authorization": f"AccessKey {settings.BIRD_ACCESS_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "body": {"type": "text", "text": {"text": text}},
        "receiver": {
            "contacts": [{"identifierValue": phone, "identifierKey": "phonenumber"}]
        },
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=5)
        response.raise_for_status()
        resp_json = response.json()

        message_id = resp_json.get("id")
        if not message_id:
            Log.error("Bird API response does not contain message ID")
            return "Invalid API response", None

        return None, message_id

    except requests.RequestException as req_err:
        Log.error(f"Request error in bird_submit_sms: {str(req_err)}")
        return str(req_err), None
    except Exception as err:
        Log.error(f"Unexpected error in bird_submit_sms: {str(err)}")
        return str(err), None
