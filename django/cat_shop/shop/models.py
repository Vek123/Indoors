from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User


class Cat(models.Model):
    name = models.CharField(
        verbose_name=_("Name"),
        max_length=255,
    )
    breed = models.CharField(
        verbose_name=_("Breed"),
        max_length=255,
    )
    age = models.IntegerField(
        verbose_name=_("Age"),
    )
    skin = models.CharField(
        verbose_name=_("Skin"),
        max_length=255,
    )
    breeder = models.ForeignKey(
        verbose_name=_("Breeder"),
        to=User,
        related_name="cats",
        on_delete=models.CASCADE,
    )

    class Meta:
        verbose_name = _("Cat")
        verbose_name_plural = _("Cats")
        indexes = [
            models.Index(fields=["name"])
        ]

    def __str__(self):
        return self.name
