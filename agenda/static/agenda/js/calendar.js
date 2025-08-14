document.addEventListener('DOMContentLoaded', function() {
    let tituloFecha = document.getElementById('titulo-fecha');

    let calendarioSemanal = new FullCalendar.Calendar(
        document.getElementById('calendario-semanal'),
        {
            initialView: 'timeGridWeek',
            locale: 'es',
            allDaySlot: false,
            slotMinTime: '08:00:00',
            slotMaxTime: '20:00:00',
            events: '/agenda/api/citas/',
            eventClick: function(info) {
                // Obtener todos los datos
                let event = info.event.extendedProps;
                let mensaje = `
Nombre: ${info.event.title}
Correo: ${event.cliente_email}
Teléfono: ${event.cliente_telefono}
Estado: ${event.estado}
Enlace Zoom: ${event.enlace_zoom ? event.enlace_zoom : "No disponible"}
                `;
                alert(mensaje);
            },
            datesSet: function(info) {
                let fecha = info.start;
                let opciones = { day: 'numeric', month: 'long', year: 'numeric' };
                tituloFecha.textContent = fecha.toLocaleDateString('es-ES', opciones);
            }
        }
    );
    calendarioSemanal.render();

    let miniCalendario = new FullCalendar.Calendar(
        document.getElementById('mini-calendario'),
        {
            initialView: 'dayGridMonth',
            locale: 'es',
            height: 'auto',
            dateClick: function(info) {
                calendarioSemanal.gotoDate(info.date);
            }
        }
    );
    miniCalendario.render();
});
