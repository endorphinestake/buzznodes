from rest_framework import views, permissions, response

from mails.serializers import ContactFormSerializer


class ContactFormView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = ContactFormSerializer(data=request.data)
        if not serializer.is_valid():
            return response.Response(serializer.errors)

        serializer.create(validated_data=serializer.validated_data)
        return response.Response("OK")
