from django.urls import path
from .viewsets import AttendanceViewSet, StudentViewSet, ClasseViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'classes', ClasseViewSet)
router.register(r'students', StudentViewSet)
router.register(r'attendance', AttendanceViewSet)

urlpatterns = router.urls