from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Cita, Publicacion
from rest_framework.parsers import MultiPartParser, FormParser

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
        "photoUrl": abogado.foto.url if abogado and abogado.foto else None,
        "especialidad": abogado.especialidad if abogado else None 
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
        "enlace_zoom": c.enlace_zoom,
        "servicio": c.get_servicio_display(),  # mostrar nombre legible del servicio
        "descripcion_caso": c.descripcion_caso,
        "telefono": c.cliente_telefono,
        "email": c.cliente_email,
        "modalidad_valor": c.modalidad,
        "modalidad_display": c.get_modalidad_display(),
        "direccion": c.direccion(),
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
        "imagen": p.imagen.url if p.imagen else None,
        "fecha": p.fecha_creacion
    } for p in publicaciones])


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def crear_publicacion(request):
    abogado = request.user.abogado
    titulo = request.data.get("titulo")
    contenido = request.data.get("contenido")
    imagen = request.FILES.get("imagen")

    publicacion = Publicacion.objects.create(
        abogado=abogado,
        titulo=titulo,
        contenido=contenido,
        imagen=imagen
    )

    return Response({
        "id": publicacion.id,
        "titulo": publicacion.titulo,
        "contenido": publicacion.contenido,
        "fecha": publicacion.fecha_creacion
    })

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def editar_publicacion(request, pk):
    try:
        publicacion = Publicacion.objects.get(pk=pk, abogado=request.user.abogado)
    except Publicacion.DoesNotExist:
        return Response({"error": "No encontrada"}, status=404)

    publicacion.titulo = request.data.get("titulo", publicacion.titulo)
    publicacion.contenido = request.data.get("contenido", publicacion.contenido)
    
    if request.FILES.get("imagen"):
        publicacion.imagen = request.FILES.get("imagen")
    
    publicacion.save()
    
    return Response({
        "id": publicacion.id,
        "titulo": publicacion.titulo,
        "contenido": publicacion.contenido,
        "fecha": publicacion.fecha_creacion
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_publicacion(request, pk):
    try:
        publicacion = Publicacion.objects.get(pk=pk, abogado=request.user.abogado)
        return Response({
            "id": publicacion.id,
            "titulo": publicacion.titulo,
            "contenido": publicacion.contenido,
            "imagen": publicacion.imagen.url if publicacion.imagen else None,
            "fecha": publicacion.fecha_creacion
        })
    except Publicacion.DoesNotExist:
        return Response({"error": "Publicación no encontrada"}, status=404)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def eliminar_publicacion(request, pk):
    try:
        publicacion = Publicacion.objects.get(pk=pk, abogado=request.user.abogado)
        publicacion.delete()
        return Response({"message": "Publicación eliminada correctamente"})
    except Publicacion.DoesNotExist:
        return Response({"error": "Publicación no encontrada"}, status=404)