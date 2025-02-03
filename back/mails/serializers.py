from rest_framework import serializers

from mails.models import Contact


class ContactFormSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        contact = Contact.objects.create(
            name=validated_data["name"],
            email=validated_data["email"],
            message=validated_data.get("message", ""),
        )
        return contact

    class Meta:
        model = Contact
        fields = (
            "name",
            "email",
            "message",
        )
