import httpx

from logs.models import Log


async def cosmos_fetch_rpc_status_url(urls, timeout):
    for url in urls:
        api_url = url.replace("/validators", "/status")

        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                while True:
                    resp = await client.get(api_url)
                    resp.raise_for_status()

                    data = resp.json()
                    if (
                        "result" not in data
                        or "sync_info" not in data["result"]
                        or int(data["result"]["sync_info"]["latest_block_height"]) < 1
                    ):
                        raise ValueError(f"Invalid response format for {api_url}")
                    return data["result"]

        except httpx.TimeoutException as e:
            await Log.awarning(f"Timeout for fetching data from {api_url}: {str(e)}")

        except Exception as e:
            await Log.awarning(f"Error with fetching data from {api_url}: {str(e)}")

    raise Exception(f"Failed to fetch status-data from all {len(urls)} RPC urls")
