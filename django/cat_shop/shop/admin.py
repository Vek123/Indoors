from django.contrib import admin

from shop.models import *


@admin.register(Cat)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'breed', 'age', 'breeder__first_name', 'skin')
    list_display_links = ('id', 'name')
    list_per_page = 20
    search_fields = ['name', 'breeder__first_name']
    list_filter = ['age', 'breed', 'skin']
