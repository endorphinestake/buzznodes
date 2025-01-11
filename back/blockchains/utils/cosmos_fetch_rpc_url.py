import httpx

from logs.models import Log


async def cosmos_fetch_rpc_url(urls, timeout):
    for url in urls:
        try:
            results = []
            page = 1
            per_page = 100
            max_pages = 100

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
                    if page > max_pages:
                        raise ValueError(
                            f"The number of pages has exceeded {max_pages} limit"
                        )

                    results.extend(data["result"]["validators"])
                    total = int(data["result"]["total"])

                    if len(results) >= total:
                        return results

        except httpx.TimeoutException as e:
            await Log.awarning(f"Timeout for fetching data from {url}: {str(e)}")

        except Exception as e:
            await Log.awarning(f"Error with fetching data from {url}: {str(e)}")

    raise Exception(f"Failed to fetch data from all {len(urls)} RPC urls")
