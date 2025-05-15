from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='attendance-home'),
    # Add more paths later
]