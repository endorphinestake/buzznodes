from rest_framework import views, permissions, response, status


class WebhookVoiceBirdView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        print("WebhookVoiceBirdView POST:", request.POST)
        print("WebhookVoiceBirdView DATA:", request.data)

        return response.Response("OK", status=status.HTTP_200_OK)
