from django.contrib import admin

from .models import Point


class PointAdmin(admin.ModelAdmin):
    pass


admin.site.register(Point, PointAdmin)
