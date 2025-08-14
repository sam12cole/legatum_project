from django.shortcuts import render
from django.http import JsonResponse
from .models import Cita
from datetime import timedelta
from datetime import datetime


# Create your views here.
from django.contrib.auth.decorators import user_passes_test

def es_abogado(user):
    return hasattr(user, 'abogado')


from django.contrib.auth.decorators import login_required, user_passes_test
from .models import Cita, Publicacion

def es_abogado(user):
    return hasattr(user, 'abogado')

@login_required
@user_passes_test(es_abogado)
def panel_abogado(request):
    abogado = request.user.abogado
    citas = Cita.objects.filter(abogado=abogado)
    publicaciones = Publicacion.objects.filter(abogado=abogado)
    return render(request, 'agenda/panel_abogado.html', {
        'citas': citas,
        'publicaciones': publicaciones
    })


def citas_api(request):
    citas = Cita.objects.all()
    data = []
    for c in citas:
        # Ajusta duración de cita (ej. 1 hora)
        hora_fin = (datetime.combine(c.fecha, c.hora) + timedelta(hours=1)).time()
        data.append({
            "id": c.id,
            "title": f"{c.cliente} ({c.estado})",
            "start": f"{c.fecha}T{c.hora}",
            "end": f"{c.fecha}T{hora_fin}",
        })
    return JsonResponse(data, safe=False)
