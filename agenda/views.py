from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Cita, Publicacion, Abogado, HorarioDisponible



def horas_se_solapan(hora1, hora2):
    """Verifica si dos horas se solapan considerando 20 minutos de duración"""
    delta = timedelta(minutes=20)
    
    inicio1 = datetime.combine(datetime.today(), hora1)
    fin1 = inicio1 + delta
    
    inicio2 = datetime.combine(datetime.today(), hora2)
    fin2 = inicio2 + delta
    
    return (inicio1 <= inicio2 < fin1) or (inicio2 <= inicio1 < fin2)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    usuario = request.user
    try:
        abogado = usuario.abogado
    except:
        return Response({"error": "El usuario no tiene perfil de abogado."}, status=status.HTTP_404_NOT_FOUND)

    # --- GET (mostrar perfil) ---
    if request.method == 'GET':
        return Response({
            "firstName": usuario.first_name,
            "lastName": usuario.last_name,
            "username": usuario.username,
            "email": usuario.email,
            "photoUrl": abogado.foto.url if abogado.foto else None,
            "especialidad": abogado.especialidad,
            "telefono": abogado.telefono,
            "lat": abogado.latitud,
            "lon": abogado.longitud,
            "numero_registro": abogado.numero_registro,
            "anios_experiencia": abogado.anios_experiencia,
            "idiomas": [idioma.nombre for idioma in abogado.idiomas.all()],
            "licenciatura": {
                "universidad": abogado.licenciatura_universidad,
                "titulo": abogado.licenciatura_titulo,
            },
            "maestria": {
                "universidad": abogado.maestria_universidad,
                "titulo": abogado.maestria_titulo,
            },
            "horario_atencion": abogado.horario_atencion,
        })

    # --- PUT (actualizar perfil) ---
    if request.method == 'PUT':
        data = request.data

        # Solo campos editables
        abogado.especialidad = data.get("especialidad", abogado.especialidad)
        abogado.telefono = data.get("telefono", abogado.telefono)
        abogado.latitud = data.get("latitud", abogado.latitud)
        abogado.longitud = data.get("longitud", abogado.longitud)
        abogado.anios_experiencia = data.get("anios_experiencia", abogado.anios_experiencia)
        abogado.horario_atencion = data.get("horario_atencion", abogado.horario_atencion)

        # Actualizar idiomas (espera lista de IDs)
        if "idiomas" in data:
            abogado.idiomas.set(data["idiomas"])  # Ejemplo: [1, 2, 3]

        # Foto (si viene en la petición)
        if "foto" in request.FILES:
            abogado.foto = request.FILES["foto"]

        abogado.save()

        return Response({"message": "Perfil actualizado correctamente"}, status=status.HTTP_200_OK)

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
def horarios_disponibles(request, abogado_id, fecha):
    """
    Retorna los horarios disponibles para un abogado en una fecha específica
    """
    try:
        abogado = Abogado.objects.get(id=abogado_id)
        fecha_obj = datetime.strptime(fecha, '%Y-%m-%d').date()
        
        # Obtener el día de la semana (0=Lunes, 6=Domingo)
        dias_semana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
        dia_semana_num = fecha_obj.weekday()
        dia_semana_nombre = dias_semana[dia_semana_num]
        
        # Obtener horarios configurados para ese día
        horarios_config = HorarioDisponible.objects.filter(
            abogado=abogado,
            dia_semana=dia_semana_nombre
        )
        
        # Obtener citas existentes para esa fecha
        citas_existentes = Cita.objects.filter(
            abogado=abogado,
            fecha=fecha_obj,
            estado__in=['Pendiente', 'Confirmada']
        )
        
        horarios_disponibles = []
        
        for horario in horarios_config:
            # Generar slots de 20 minutos dentro del horario configurado
            hora_actual = horario.hora_inicio
            while hora_actual < horario.hora_fin:
                hora_fin_slot = (datetime.combine(datetime.today(), hora_actual) + 
                               timedelta(minutes=20)).time()
                
                # Verificar si el slot está disponible
                slot_ocupado = False
                for cita in citas_existentes:
                    if horas_se_solapan(cita.hora, hora_actual):
                        slot_ocupado = True
                        break
                
                # Verificar que no sea en el pasado (si es el día actual)
                ahora = timezone.now()
                if fecha_obj == ahora.date():
                    hora_actual_dt = datetime.combine(ahora.date(), hora_actual)
                    if timezone.make_aware(hora_actual_dt) < ahora:
                        slot_ocupado = True
                
                if not slot_ocupado and hora_fin_slot <= horario.hora_fin:
                    horarios_disponibles.append({
                        'hora_inicio': hora_actual.strftime('%H:%M'),
                        'hora_fin': hora_fin_slot.strftime('%H:%M')
                    })
                
                # Avanzar al siguiente slot
                hora_actual = hora_fin_slot
        
        return Response({
            'fecha': fecha,
            'abogado': abogado.user.get_full_name(),
            'horarios_disponibles': horarios_disponibles
        })
        
    except Abogado.DoesNotExist:
        return Response({'error': 'Abogado no encontrado'}, status=404)
    except ValueError:
        return Response({'error': 'Formato de fecha inválido'}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def crear_cita(request):
    try:
        data = request.data
        abogado = Abogado.objects.get(id=data['abogado_id'])
        
        # Validar que la fecha/hora no sea en el pasado
        fecha = datetime.strptime(data['fecha'], '%Y-%m-%d').date()
        hora = datetime.strptime(data['hora'], '%H:%M').time()
        
        fecha_hora_cita = datetime.combine(fecha, hora)
        if timezone.make_aware(fecha_hora_cita) < timezone.now():
            return Response({'error': 'No se pueden agendar citas en el pasado'}, 
                          status=400)
        
        # Verificar disponibilidad
        citas_existentes = Cita.objects.filter(
            abogado=abogado,
            fecha=fecha,
            estado__in=['Pendiente', 'Confirmada']
        )
        
        for cita_existente in citas_existentes:
            if horas_se_solapan(cita_existente.hora, hora):
                return Response({'error': 'El horario seleccionado no está disponible'}, 
                              status=400)
        
        # Crear la cita
        cita = Cita.objects.create(
            cliente_nombre=data['cliente_nombre'],
            cliente_email=data['cliente_email'],
            cliente_telefono=data.get('cliente_telefono', ''),
            abogado=abogado,
            fecha=fecha,
            hora=hora,
            descripcion_caso=data.get('descripcion_caso', ''),
            servicio=data.get('servicio', 'asesoria_legal_integral'),
            modalidad=data.get('modalidad', 'virtual'),
            estado='Pendiente'
        )
        
        return Response({
            'id': cita.id,
            'mensaje': 'Cita creada exitosamente'
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=400)
    

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