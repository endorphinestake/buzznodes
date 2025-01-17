import time
import requests

from django.core.management.base import BaseCommand

from blockchains.models import BlockchainValidator
from blockchains.serilazers import ValidatorPictureSerializer


class Command(BaseCommand):
    help = "Get Validator picture by identity from https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=FE38D8D1E0E5011F&fields=pictures"

    def handle(self, *args, **options):
        start_run_time = time.time()

        for validator in BlockchainValidator.objects.iterator():
            if (
                validator.picture
                or not validator.identity
                or validator.identity == "INACTIVE"
            ):
                continue

            res = requests.get(
                f"https://keybase.io/_/api/1.0/user/lookup.json?key_suffix={validator.identity}&fields=pictures"
            ).json()

            serializer = ValidatorPictureSerializer(data=res.get("them", []), many=True)
            if not serializer.is_valid():
                print(f"ERROR: ValidatorPictureSerializer - {serializer.errors}")
                validator.picture = "default"
                validator.save()
                continue

            if not serializer.validated_data:
                print(f"ERROR: {validator.moniker} no pictures!")
                validator.picture = "default"
                validator.save()
                continue

            picture = serializer.validated_data[0]["pictures"]["primary"]

            if not picture.get("url"):
                print(f"ERROR: {validator.moniker} no picture!")
                validator.picture = "default"
                validator.save()
                continue

            validator.picture = picture["url"]
            validator.save()
            print(f"INFO: {validator.moniker} added picture {validator.picture}")

        print(f"{__name__} is Finished: {(time.time() - start_run_time)}")
