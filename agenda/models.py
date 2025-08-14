from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Abogado(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE)
    especialidad = models.CharField(max_length=100, blank=True)
    telefono = models.CharField(max_length=20, blank=True)
    foto = models.ImageField(upload_to='abogados/', blank=True, null=True)

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
    enlace_zoom = models.URLField(blank=True, null=True)
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
        return f"Cita con {self.abogado} el {self.fecha} a las {self.hora}"

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
