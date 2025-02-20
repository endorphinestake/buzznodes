import io
import gzip
import httpx
from prometheus_client.parser import text_string_to_metric_families
from django.utils.timezone import now

from blockchains.models import Blockchain
from logs.models import Log


def _filter_metrics(text: bytes) -> str:
    substrings = {
        "target_info",
        "build_info",
        "hdr_sync_subjective_head_gauge",
        "last_pfb_timestamp",
    }

    if text[:2] == b"\x1f\x8b":
        with gzip.GzipFile(fileobj=io.BytesIO(text), mode="rt", encoding="utf-8") as f:
            lines = f.readlines()
    else:
        lines = text.decode("utf-8").splitlines()

    return "\n".join(line for line in lines if any(sub in line for sub in substrings))


async def cosmos_fetch_da_url(ntype, urls, timeout):
    if len(urls) == 0:
        return {}

    for url in urls:
        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                while True:
                    resp = await client.get(url, headers={"Accept-Encoding": "gzip"})
                    resp.raise_for_status()
                    filtered_metrics = list(
                        text_string_to_metric_families(_filter_metrics(resp.content))
                    )

                    bridges = {}
                    last_timestamp = int(now().timestamp())

                    job_key = "/Bridge"
                    if ntype == Blockchain.NetworkType.CELESTIA_TESTNET:
                        job_key = "mocha-4/Bridge"
                    elif ntype == Blockchain.NetworkType.CELESTIA_MAINNET:
                        job_key = "celestia/Bridge"

                    for family in filtered_metrics:
                        if family.name == "target_info":
                            for sample in family.samples:
                                if job_key in sample.labels.get(
                                    "job"
                                ) and sample.labels.get("instance"):
                                    bridges[sample.labels.get("instance")] = {}

                    for family in filtered_metrics:
                        # build_info
                        if family.name == "build_info":
                            for sample in family.samples:
                                instance = sample.labels.get("instance")
                                if (
                                    job_key in sample.labels.get("job")
                                    and instance in bridges
                                ):
                                    bridges[instance]["semantic_version"] = (
                                        sample.labels.get("semantic_version")
                                    )
                                    bridges[instance]["system_version"] = (
                                        sample.labels.get("system_version")
                                    )

                        # hdr_sync_subjective_head_gauge
                        if family.name == "hdr_sync_subjective_head_gauge":
                            for sample in family.samples:
                                instance = sample.labels.get("instance")
                                if (
                                    job_key in sample.labels.get("job")
                                    and instance in bridges
                                ):
                                    bridges[instance]["node_height"] = int(sample.value)

                        # last_pfb_timestamp_total
                        if family.name == "last_pfb_timestamp":
                            for sample in family.samples:
                                instance = sample.labels.get("instance")
                                if (
                                    job_key in sample.labels.get("job")
                                    and instance in bridges
                                ):
                                    bridges[instance]["last_timestamp"] = last_timestamp

                    return bridges

        except httpx.TimeoutException as e:
            await Log.awarning(f"Timeout for fetching data from {url}: {str(e)}")

        except Exception as e:
            await Log.awarning(f"Error with fetching data from {url}: {str(e)}")

    raise Exception(f"Failed to fetch data from all {len(urls)} RPC urls")
