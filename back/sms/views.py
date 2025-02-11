from rest_framework import views, permissions, response, status


class WebhookHicellView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        print("WebhookHicellView CONTENT-TYPE:", request.META.get("CONTENT_TYPE"))
        print("WebhookHicellView POST:", request.POST)
        print("WebhookHicellView DATA:", request.data)
