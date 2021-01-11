from rest_framework.viewsets import GenericViewSet
from rest_framework import mixins

from map.models import Point
from .serializers import PointSerializer


class PointView(mixins.CreateModelMixin, mixins.ListModelMixin, GenericViewSet):

    queryset = Point.objects.all()
    serializer_class = PointSerializer

