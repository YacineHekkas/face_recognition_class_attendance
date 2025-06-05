

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'students', StudentViewSet, basename='students')
router.register(r'photos', StudentPhotoViewSet, basename='photos')

urlpatterns = [
    path('api/', include(router.urls)),
    path('students/images-list/', StudentImagesListView.as_view(), name='student-images-list'),

]