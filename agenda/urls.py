from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('login/', auth_views.LoginView.as_view(template_name='agenda/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('panel/', views.panel_abogado, name='panel_abogado'),
    path('api/citas/', views.citas_api, name='citas_api'),
    path('calendario-test/', views.calendario_test, name='calendario_test'),
    path('api/citas/', views.listar_citas),
    path('api/publicaciones/', views.listar_publicaciones),
]
