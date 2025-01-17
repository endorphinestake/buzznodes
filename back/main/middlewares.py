from django.middleware.gzip import GZipMiddleware


class DjanoGZipMiddleware(GZipMiddleware):
    def process_response(self, request, response):
        if request.path.startswith("/metrics"):
            return response
        return super().process_response(request, response)
