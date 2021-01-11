from django.db import models


class Point(models.Model):
    longitude = models.CharField(max_length=30)
    latitude = models.CharField(max_length=30)
