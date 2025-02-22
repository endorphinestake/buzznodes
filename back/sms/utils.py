from sms.models import (
    SMSBase,
    SMSConfirm,
    SMSAlertVotingPower,
    SMSAlertUptime,
    SMSAlertComission,
    SMSAlertJailedStatus,
    SMSAlertTombstonedStatus,
    SMSAlertBondedStatus,
    SMSAlertOtelUpdate,
    SMSAlertSyncStatus,
)


def find_sms_by_id(sms_id):
    for model in [
        SMSAlertOtelUpdate,
        SMSAlertSyncStatus,
        SMSAlertUptime,
        SMSAlertVotingPower,
        SMSAlertComission,
        SMSAlertBondedStatus,
        SMSAlertJailedStatus,
        SMSAlertTombstonedStatus,
        SMSConfirm,
    ]:
        sms = model.objects.filter(sms_id=sms_id, status=SMSBase.Status.SENT).last()
        if sms:
            return sms
    return None
