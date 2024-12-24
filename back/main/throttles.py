from rest_framework import throttling


class OneSecRateThrottle(throttling.UserRateThrottle):
    rate= '1/sec'
