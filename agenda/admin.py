

# Register your models here.
from django.contrib import admin
from .models import Abogado, HorarioDisponible, Cita, Publicacion

class CitaAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        if hasattr(request.user, 'abogado'):
            return qs.filter(abogado=request.user.abogado)
        return qs.none()

admin.site.register(Abogado)
admin.site.register(HorarioDisponible)
admin.site.register(Cita, CitaAdmin)
admin.site.register(Publicacion)
