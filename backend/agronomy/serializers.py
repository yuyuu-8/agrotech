from rest_framework import serializers

class PredictionInputSerializer(serializers.Serializer):
    fieldId = serializers.CharField(max_length=50)
    nitrogen = serializers.FloatField(min_value=0, max_value=150)
    phosphorus = serializers.FloatField(min_value=0, max_value=150)
    potassium = serializers.FloatField(min_value=0, max_value=150)
    temperature = serializers.FloatField(min_value=-20, max_value=60)
    humidity = serializers.FloatField(min_value=0, max_value=100)
    moisture = serializers.FloatField(min_value=0, max_value=100)
    rainfall = serializers.FloatField(min_value=0, max_value=500)
    ph = serializers.FloatField(min_value=0, max_value=14)
    soilType = serializers.CharField(max_length=50)
    cropType = serializers.CharField(max_length=50)
    previousCrop = serializers.CharField(max_length=50)
    season = serializers.CharField(max_length=50)
    fieldOrientation = serializers.CharField(max_length=50)