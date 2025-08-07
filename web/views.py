from django.shortcuts import render

# Create your views here.


def home_view(request):
    return render(request, 'web/index.html')

def servicios_view(request):
    return render(request, 'web/servicios.html')

def contacto_view(request):
    return render(request, 'web/contacto.html')

def nosotros_view(request):
    return render(request, 'web/nosotros.html')

def razon_view(request):
    return render(request, 'web/razon.html')


