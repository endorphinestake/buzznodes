import httpx
import urllib.parse

from logs.models import Log


async def cosmos_fetch_infos_url(urls, timeout):
    for url in urls:
        try:
            results = []
            page = 1
            page_key = ""
            per_page = 10000
            max_pages = 100

            async with httpx.AsyncClient(timeout=timeout) as client:
                while True:
                    page_url = (
                        f"{url}?pagination.limit={per_page}&pagination.key={page_key}"
                    )
                    resp = await client.get(page_url)
                    resp.raise_for_status()

                    data = resp.json()
                    if "info" not in data or "pagination" not in data:
                        raise ValueError(f"Invalid response format for {page_url}")

                    page += 1
                    page_key = None
                    if data["pagination"].get("next_key"):
                        page_key = urllib.parse.quote(
                            data["pagination"]["next_key"], safe=""
                        )
                    results.extend(data["info"])

                    if not page_key or page > max_pages:
                        return results

        except httpx.TimeoutException as e:
            await Log.awarning(f"Timeout for fetching data from {url}: {str(e)}")

        except Exception as e:
            await Log.awarning(f"Error with fetching data from {url}: {str(e)}")

    raise Exception(f"Failed to fetch data from all {len(urls)} RPC urls")
