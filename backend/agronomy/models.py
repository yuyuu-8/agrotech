from django.db import models

class Field(models.Model):
    """Контекст: Поле клиента (B2B сущность)"""
    field_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class PredictionHistory(models.Model):
    """История запросов и результатов ML"""
    field_id = models.CharField(max_length=50) 
    
    # Входящие параметры
    nitrogen = models.FloatField()
    phosphorus = models.FloatField()
    potassium = models.FloatField()
    temperature = models.FloatField()
    humidity = models.FloatField()
    rainfall = models.FloatField()
    ph = models.FloatField()
    soil_type = models.CharField(max_length=50)
    crop_type = models.CharField(max_length=50)
    
    # Результаты ML
    recommended_fertilizer = models.CharField(max_length=100)
    confidence = models.FloatField()
    
    shap_values = models.JSONField(help_text="Stored SHAP model interpretability values")
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.field_id} - {self.recommended_fertilizer} ({self.created_at})"