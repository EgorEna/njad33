from django.urls import path

from . import views

app_name = "API"

urlpatterns = [
    path('points', views.PointView.as_view(actions={
        'get': 'list',
        'post': 'create',
    }), name="points")
]

