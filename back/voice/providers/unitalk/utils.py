import requests

from django.conf import settings

from logs.models import Log


def unitalk_submit_voice(
    phone: str, text: str, voice_id: int
) -> tuple[str | None, str | None]:
    url = "https://api.unitalk.cloud/api/calls/originateNew"
    headers = {
        "Authorization": f"Bearer {settings.UNITALK_VOICE_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "phone": phone,
        "audios": [
            {
                "tts": {
                    "ssml": text,
                    "settingsId": 472,
                }
            },
        ],
        "meta": voice_id,
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        response.raise_for_status()
        resp_json = response.json()

        print("VOICE JSON RESPONSE: ", resp_json)

        if resp_json.get("status") == "Success":
            return None, voice_id
        else:
            return resp_json.get("message", "Unknown Error")

    except requests.RequestException as req_err:
        Log.error(f"Request error in unitalk_submit_voice: {str(req_err)}")
        return str(req_err), None
    except Exception as err:
        Log.error(f"Unexpected error in unitalk_submit_voice: {str(err)}")
        return str(err), None
