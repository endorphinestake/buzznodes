import httpx

from logs.models import Log


async def cosmos_fetch_rpc_url(urls, timeout):
    for url in urls:
        try:
            validators = []
            page = 1
            per_page = 100
            max_pages = 10

            async with httpx.AsyncClient(timeout=timeout) as client:
                while True:
                    page_url = f"{url}?per_page={per_page}&page={page}"
                    resp = await client.get(page_url)
                    resp.raise_for_status()

                    data = resp.json()
                    if (
                        "result" not in data
                        or "validators" not in data["result"]
                        or int(data["result"]["count"]) < 1
                    ):
                        raise ValueError(f"Invalid response format for {page_url}")

                    page += 1
                    validators.extend(data["result"]["validators"])
                    total = int(data["result"]["total"])

                    if len(validators) >= total or page > max_pages:
                        return {
                            "network_height": int(data["result"]["block_height"]),
                            "validators": validators,
                        }

        except httpx.TimeoutException as e:
            await Log.awarning(f"Timeout for fetching data from {url}: {str(e)}")

        except Exception as e:
            await Log.awarning(f"Error with fetching data from {url}: {str(e)}")

    raise Exception(f"Failed to fetch data from all {len(urls)} RPC urls")
