from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from datetime import timedelta, datetime, time
import pytz

class Idioma(models.Model):
    codigo = models.CharField(max_length=5, unique=True)
    nombre = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre


class Abogado(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE)
    especialidad = models.CharField(max_length=100, blank=True)
    telefono = models.CharField(max_length=20, blank=True)
    foto = models.ImageField(upload_to='abogados/', blank=True, null=True)

    # Nuevos campos
    latitud = models.FloatField(blank=True, null=True)
    longitud = models.FloatField(blank=True, null=True)
    numero_registro = models.CharField("N° de Registro Profesional", max_length=50, blank=True)
    anios_experiencia = models.PositiveIntegerField("Años de experiencia", default=0, blank=True)

    # Educación
    licenciatura_universidad = models.CharField("Licenciatura - Universidad", max_length=150, blank=True)
    licenciatura_titulo = models.CharField("Título de Licenciatura", max_length=150, blank=True)

    maestria_universidad = models.CharField("Maestría - Universidad", max_length=150, blank=True)
    maestria_titulo = models.CharField("Título de Maestría", max_length=150, blank=True)

    # Horario de atención
    horario_atencion = models.CharField(max_length=200, blank=True, help_text="Ej: Lunes a Viernes, 09h00-17h00")

    # Relación con Idiomas
    idiomas = models.ManyToManyField(Idioma, blank=True)

    def __str__(self):
        return f"{self.usuario.get_full_name()} - {self.especialidad}"


class HorarioDisponible(models.Model):
    abogado = models.ForeignKey(Abogado, on_delete=models.CASCADE, related_name='horarios')
    dia_semana = models.CharField(
        max_length=9,
        choices=[
            ('Lunes', 'Lunes'),
            ('Martes', 'Martes'),
            ('Miércoles', 'Miércoles'),
            ('Jueves', 'Jueves'),
            ('Viernes', 'Viernes'),
            ('Sábado', 'Sábado'),
            ('Domingo', 'Domingo'),
        ]
    )
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()

    def __str__(self):
        return f"{self.dia_semana}: {self.hora_inicio} - {self.hora_fin}"

class Cita(models.Model):
    cliente_nombre = models.CharField(max_length=100)
    cliente_email = models.EmailField()
    cliente_telefono = models.CharField(max_length=20, blank=True)
    abogado = models.ForeignKey(Abogado, on_delete=models.CASCADE)
    fecha = models.DateField()
    hora = models.TimeField()
    descripcion_caso = models.TextField(blank=True, null=True)
    SERVICIOS = [
        ("asesoria_legal_integral", "Asesoría Legal Integral"),
        ("contratacion_publica", "Contratación Pública y Asesoría a Empresas"),
        ("defensa_penal", "Defensa Penal Estratégica"),
        ("litigio_civil_mercantil", "Litigio Civil y Mercantil"),
        ("derecho_laboral", "Derecho Laboral y Seguridad Social"),
        ("derecho_familia", "Derecho de Familia y Niñez"),
        ("constitucion_empresas", "Constitución y Regularización de Empresas"),
        ("recuperacion_cartera", "Recuperación de Cartera Vencida"),
        ("defensa_administrativa", "Defensa Administrativa y Sancionatoria"),
        ("derecho_militar", "Derecho Militar"),
        ("derecho_notarial", "Derecho Notarial"),
        ("derecho_internacional", "Derecho Internacional Privado"),
    ]

    servicio = models.CharField(max_length=50, choices=SERVICIOS, default="asesoria_legal_integral")

    
    enlace_zoom = models.URLField(blank=True, null=True)
    modalidad = models.CharField(
    max_length=20,
    choices=[
        ("virtual", "Atención Virtual"),
        ("presencial", "Atención Presencial"),
    ],
    default="virtual"
    )
    estado = models.CharField(
        max_length=20,
        choices=[
            ('Pendiente', 'Pendiente'),
            ('Confirmada', 'Confirmada'),
            ('Cancelada', 'Cancelada')
        ],
        default='Pendiente'
    )

    def __str__(self):
        return f"{self.cliente_nombre} - {self.get_servicio_display()} ({self.fecha} {self.hora}) - {self.estado}"

    def direccion(self):
        """Devuelve la dirección si es presencial"""
        if self.modalidad == "presencial":
            return "Guayaquil - Av. Carchi y Quisquis / Edificio Quil 1 / Piso 8, Oficina 801"
        return None
    
    class Meta:
        unique_together = ['abogado', 'fecha', 'hora']
    
    def clean(self):
        """Validación adicional para el modelo"""
        from django.core.exceptions import ValidationError
        
        # Verificar que la cita no sea en el pasado
        ahora = timezone.now()
        fecha_hora_cita = datetime.combine(self.fecha, self.hora)
        if timezone.make_aware(fecha_hora_cita) < ahora:
            raise ValidationError("No se pueden agendar citas en el pasado")
        
        # Verificar que no haya citas solapadas
        citas_existentes = Cita.objects.filter(
            abogado=self.abogado,
            fecha=self.fecha,
            estado__in=['Pendiente', 'Confirmada']
        ).exclude(pk=self.pk if self.pk else None)
        
        for cita_existente in citas_existentes:
            hora_existente = cita_existente.hora
            hora_nueva = self.hora
            
            # Verificar solapamiento considerando 20 minutos de duración
            if self._horas_se_solapan(hora_existente, hora_nueva):
                raise ValidationError("Ya existe una cita en este horario")
    
    def _horas_se_solapan(self, hora1, hora2):
        """Verifica si dos horas se solapan considerando 20 minutos de duración"""
        delta = timedelta(minutes=20)
        
        inicio1 = datetime.combine(datetime.today(), hora1)
        fin1 = inicio1 + delta
        
        inicio2 = datetime.combine(datetime.today(), hora2)
        fin2 = inicio2 + delta
        
        return (inicio1 <= inicio2 < fin1) or (inicio2 <= inicio1 < fin2)
    
    def save(self, *args, **kwargs):
        self.clean()  # Ejecutar validaciones antes de guardar
        super().save(*args, **kwargs)
    
class Publicacion(models.Model):
    abogado = models.ForeignKey(Abogado, on_delete=models.CASCADE)
    titulo = models.CharField(max_length=200)
    contenido = models.TextField()
    imagen = models.ImageField(upload_to='publicaciones/', blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo

@receiver(post_save, sender=User)
def crear_perfil_abogado(sender, instance, created, **kwargs):
    if created and instance.is_staff:
        Abogado.objects.get_or_create(usuario=instance)
