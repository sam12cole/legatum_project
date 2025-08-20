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
    usuario = request.user
    try:
        abogado = usuario.abogado  # relación OneToOne con Abogado
    except:
        abogado = None

    citas = Cita.objects.filter(abogado=abogado) if abogado else []
    publicaciones = Publicacion.objects.filter(abogado=abogado) if abogado else []

    contexto = {
        "nombre": usuario.first_name,
        "apellido": usuario.last_name,
        "username": usuario.username,
        "email": usuario.email,
        "foto": abogado.foto.url if abogado and abogado.foto else None,
        "citas": citas,
        "publicaciones": publicaciones,
    }
    return render(request, "agenda/panel_abogado.html", contexto)


def citas_api(request):
    citas = Cita.objects.all()
    data = []
    for c in citas:
        # Ajusta duración de cita (ej. 1 hora)
        hora_fin = (datetime.combine(c.fecha, c.hora) + timedelta(hours=1)).time()
        data.append({
            "id": c.id,
            "title": f"{c.cliente_nombre} ({c.estado})",
            "start": f"{c.fecha}T{c.hora}",
            "end": f"{c.fecha}T{hora_fin}",
            "cliente_email": c.cliente_email,
            "cliente_telefono": c.cliente_telefono,
            "estado": c.estado,
            "enlace_zoom": c.enlace_zoom
        })
    return JsonResponse(data, safe=False)

from django.shortcuts import render

def calendario_test(request):
    return render(request, 'agenda/calendario_test.html')

from django.contrib.auth.decorators import login_required

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Cita, Publicacion

@api_view(['GET'])
def listar_citas(request):
    citas = Cita.objects.values("id", "titulo", "fecha", "hora")
    return Response(list(citas))

@api_view(['GET'])
def listar_publicaciones(request):
    publicaciones = Publicacion.objects.values("id", "titulo", "contenido", "fecha")
    return Response(list(publicaciones))
