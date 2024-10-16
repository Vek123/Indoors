from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User


class Message(models.Model):
    dialog = models.ForeignKey(
        verbose_name=_("Dialog"),
        to="Dialog",
        related_name="messages",
        on_delete=models.CASCADE,
    )
    created_at = models.DateTimeField(
        verbose_name=_("Created at"),
        auto_now_add=True,
    )
    content = models.TextField(
        verbose_name=_("Content"),
    )
    author = models.ForeignKey(
        verbose_name=_("Breeder"),
        to=User,
        related_name="messages",
        on_delete=models.CASCADE,
    )

    class Meta:
        verbose_name = _("Message")
        verbose_name_plural = _("Messages")

    def __str__(self):
        return f"{str(self.dialog)}<{self.content[:10]}{"..." if len(self.content) >= 10 else ""}>"


class Dialog(models.Model):
    members = models.ManyToManyField(
        verbose_name=_("Members"),
        to=User,
        related_name="dialogs",
    )
    updated_at = models.DateTimeField(
        verbose_name=_("Updated at"),
        auto_now=True,
    )

    class Meta:
        verbose_name = _("Dialog")
        verbose_name_plural = _("Dialogs")

    def __str__(self):
        members = self.members.all()

        if len(members) <= 2:
            return ', '.join(obj.first_name for obj in members)

        return f"{', '.join(obj.first_name for obj in members[:2])}..."
