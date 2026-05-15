# agronomy/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import PredictionInputSerializer
from .services import FertilizerMLService
from .models import PredictionHistory

class PredictFertilizerView(APIView):
    def post(self, request):
        serializer = PredictionInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        valid_data = serializer.validated_data
        
        prediction_result = FertilizerMLService.predict(valid_data)
        
        PredictionHistory.objects.create(
            field_id=valid_data['fieldId'],
            nitrogen=valid_data['nitrogen'],
            phosphorus=valid_data['phosphorus'],
            potassium=valid_data['potassium'],
            temperature=valid_data['temperature'],
            humidity=valid_data['humidity'],
            rainfall=valid_data['rainfall'],
            ph=valid_data['ph'],
            soil_type=valid_data['soilType'],
            crop_type=valid_data['cropType'],
            recommended_fertilizer=prediction_result['recommended_fertilizer'],
            confidence=prediction_result['confidence'],
            shap_values=prediction_result['shap_values']
        )
        
        return Response(prediction_result, status=status.HTTP_200_OK)