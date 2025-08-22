from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Cita, Publicacion

#@api_view(['GET'])
#@permission_classes([IsAuthenticated])
#def listar_citas(request):
#    citas = Cita.objects.values("id", "titulo", "fecha", "hora")
#    return Response(list(citas))

#@api_view(['GET'])
#@permission_classes([IsAuthenticated])
#def listar_publicaciones(request):
#    publicaciones = Publicacion.objects.values("id", "titulo", "contenido", "fecha")
#    return Response(list(publicaciones))

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    usuario = request.user
    try:
        abogado = usuario.abogado
    except:
        abogado = None
    return Response({
        "firstName": usuario.first_name,
        "lastName": usuario.last_name,
        "username": usuario.username,
        "email": usuario.email,
        "photoUrl": abogado.foto.url if abogado and abogado.foto else None
    })
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_citas(request):
    abogado = request.user.abogado
    citas = Cita.objects.filter(abogado=abogado)
    return Response([{
        "id": c.id,
        "titulo": c.cliente_nombre,
        "fecha": c.fecha,
        "hora": c.hora,
        "estado": c.estado,
        "enlace_zoom": c.enlace_zoom
    } for c in citas])

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_publicaciones(request):
    abogado = request.user.abogado
    publicaciones = Publicacion.objects.filter(abogado=abogado)
    return Response([{
        "id": p.id,
        "titulo": p.titulo,
        "contenido": p.contenido,
        "fecha": p.fecha
    } for p in publicaciones])
