from django.urls import path
from . import views

urlpatterns = [
    path('user_profile/', views.user_profile, name='user-profile'),
    path('listar_citas/', views.listar_citas, name='listar-citas'),
    path('listar_publicaciones/', views.listar_publicaciones, name='listar-publicaciones'),
    path('publicaciones/crear/', views.crear_publicacion, name='crear-publicacion'),   
    path('publicaciones/editar/<int:pk>/', views.editar_publicacion, name='editar-publicacion'),
    path('publicaciones/<int:pk>/', views.obtener_publicacion, name='obtener-publicacion'),     
    path('publicaciones/<int:pk>/eliminar/', views.eliminar_publicacion, name='eliminar-publicacion'), 
]
