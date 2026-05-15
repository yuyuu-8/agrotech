# agronomy/urls.py
from django.urls import path
from .views import PredictFertilizerView

urlpatterns =[
    path('predict/', PredictFertilizerView.as_view(), name='api-predict'),
]