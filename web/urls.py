from django.contrib import admin
from web import views
from django.urls import path, include

urlpatterns = [
    path('', views.home_view, name='index'),  # Página de inicio con nombre 'index'
    path('servicios/', views.servicios_view, name='servicios'),
    path('contacto/', views.contacto_view, name='contacto'),
    path('nosotros/', views.nosotros_view, name='nosotros'),
    path('razon/', views.razon_view, name='razon'),
]
