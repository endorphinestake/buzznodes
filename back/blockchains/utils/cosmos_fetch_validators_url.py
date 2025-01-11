import httpx

from logs.models import Log


async def cosmos_fetch_validators_url(urls, timeout):
    for url in urls:
        try:
            results = []
            page = 1
            page_key = ""
            per_page = 500
            max_pages = 10

            async with httpx.AsyncClient(timeout=timeout) as client:
                while True:
                    page_url = (
                        f"{url}?pagination.limit={per_page}&pagination.key={page_key}"
                    )
                    resp = await client.get(page_url)
                    resp.raise_for_status()

                    data = resp.json()
                    if "validators" not in data or "pagination" not in data:
                        raise ValueError(f"Invalid response format for {page_url}")

                    page += 1
                    page_key = data["pagination"]["next_key"]
                    results.extend(data["validators"])

                    if not page_key or page > max_pages:
                        return results

        except httpx.TimeoutException as e:
            await Log.awarning(f"Timeout for fetching data from {url}: {str(e)}")

        except Exception as e:
            await Log.awarning(f"Error with fetching data from {url}: {str(e)}")

    raise Exception(f"Failed to fetch data from all {len(urls)} RPC urls")
