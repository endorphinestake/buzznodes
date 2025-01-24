import httpx

from django.conf import settings

from blockchains.models import Blockchain


async def grafana_fetch_metrics(
    chart_type: Blockchain.ChartType,
    validator_ids: list[int],
    start_time: int,
    end_time: int,
):

    params = {
        "query": f'{chart_type}{{validator_id=~"{"|".join(map(str, validator_ids))}"}}',
        "start": start_time,
        "end": end_time,
        "step": settings.METRICS_CHART_STEP,
    }

    try:
        async with httpx.AsyncClient(timeout=3) as client:
            while True:
                resp = await client.get(
                    f"{settings.GRAFANA_BASE_URL}/api/datasources/proxy/1/api/v1/query_range",
                    params=params,
                    headers={
                        "Authorization": f"Bearer {settings.GRAFANA_SERVICE_TOKEN}",
                    },
                )
                resp.raise_for_status()
                data = resp.json()

                return data.get("data", {}).get("result", {})

    except httpx.TimeoutException as e:
        print(
            f"WARNING: Timeout for fetching cosmos_validator_uptime from {validator_ids}: {str(e)}"
        )

    except Exception as e:
        await print(
            f"WARNING: Error with fetching cosmos_validator_uptime from {validator_ids}: {str(e)}"
        )
