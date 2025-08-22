from django.urls import path
from . import views

urlpatterns = [
    path('user_profile/', views.user_profile, name='user-profile'),
    path('listar_citas/', views.listar_citas, name='listar-citas'),
    path('listar_publicaciones/', views.listar_publicaciones, name='listar-publicaciones'),
    #path("citas/", views.listar_citas, name="listar_citas"),
    #path("publicaciones/", views.listar_publicaciones, name="listar_publicaciones"),
]
