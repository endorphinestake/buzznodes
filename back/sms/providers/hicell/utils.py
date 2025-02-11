import requests
import urllib.parse
from django.conf import settings

from sms.providers.hicell.serializers import HicellSMSReplySerializer
from logs.models import Log


def hicell_submit_sms(phone: str, text: str) -> tuple[str | None, str | None]:
    text_encoded = urllib.parse.quote(text)
    url = (
        f"https://api.hicell.net/message/send/?"
        f"username={settings.HICELL_SMS_USERNAME}&api_key={settings.HICELL_SMS_API_KEY}"
        f"&from=Buzznodes&to={phone}&message={text_encoded}"
    )
    try:
        resp = requests.get(url, timeout=5)
        resp_json = resp.json()

        serializer = HicellSMSReplySerializer(data=resp_json)
        serializer.is_valid(raise_exception=True)

        reply = serializer.validated_data.get("reply", [])

        if not reply:
            Log.error("Hicell API response is empty")
            return "Empty response from API", None

        first_reply = reply[0]
        if first_reply.get("status") != "OK":
            Log.error(f"Hicell API returned an error: {first_reply}")
            return first_reply.get("status", "Unknown error"), None

        return None, first_reply["message_id"]

    except requests.RequestException as req_err:
        Log.error(f"Request error in hicell_submit_sms: {str(req_err)}")
        return str(req_err), None
    except Exception as err:
        Log.error(f"Unexpected error in hicell_submit_sms: {str(err)}")
        return str(err), None
