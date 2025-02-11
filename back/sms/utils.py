from sms.models import (
    SMSBase,
    SMSConfirm,
    SMSAlertVotingPower,
    SMSAlertUptime,
    SMSAlertComission,
    SMSAlertJailedStatus,
    SMSAlertTombstonedStatus,
    SMSAlertBondedStatus,
)


def find_sms_by_id(sms_id):
    for model in [
        SMSConfirm,
        SMSAlertVotingPower,
        SMSAlertUptime,
        SMSAlertComission,
        SMSAlertJailedStatus,
        SMSAlertTombstonedStatus,
        SMSAlertBondedStatus,
    ]:
        sms = model.objects.filter(sms_id=sms_id, status=SMSBase.Status.SENT).last()
        if sms:
            return sms
    return None
