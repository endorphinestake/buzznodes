import time
from prometheus_client import generate_latest


class CachedMetrics:
    def __init__(self, ttl=5):
        self.ttl = ttl
        self.last_updated = 0
        self.cached_data = None

    def get_latest(self):
        if time.time() - self.last_updated > self.ttl:
            self.cached_data = generate_latest()
            self.last_updated = time.time()
        return self.cached_data


cached_metrics = CachedMetrics(ttl=5)
