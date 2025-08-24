from django.urls import path
from . import views

urlpatterns = [
    path('user_profile/', views.user_profile, name='user-profile'),
    path('listar_citas/', views.listar_citas, name='listar-citas'),
    path('listar_publicaciones/', views.listar_publicaciones, name='listar-publicaciones'),
    path('publicaciones/crear/', views.crear_publicacion, name='crear_publicacion'),   
    path('publicaciones/editar/<int:pk>/', views.editar_publicacion, name='editar_publicacion'),

]
