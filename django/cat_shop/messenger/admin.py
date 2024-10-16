from django.contrib import admin

from messenger.models import *


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_dialog_str', 'content')
    list_display_links = ('id', 'get_dialog_str')
    list_per_page = 20
    search_fields = ['get_dialog_str']

    def get_dialog_str(self, obj):
        return str(obj.dialog)


@admin.register(Dialog)
class DialogAdmin(admin.ModelAdmin):
    list_display = ('id', '__str__')
    list_display_links = ('id', '__str__')
    list_per_page = 20
    search_fields = ['__str__']
