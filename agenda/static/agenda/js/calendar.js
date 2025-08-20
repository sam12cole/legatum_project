document.addEventListener('DOMContentLoaded', function () {
  const tituloFecha = document.getElementById('titulo-fecha');

  const coloresEventos = [
    "rgba(82, 166, 213, 0.6)",   // azul semi-transparente
    "rgba(230, 126, 34, 0.6)",   // naranja semi-transparente
    "rgba(155, 89, 182, 0.6)",   // morado semi-transparente
    "rgba(26, 188, 156, 0.6)",   // verde semi-transparente
    "rgba(243, 156, 18, 0.6)"    // amarillo-naranja semi-transparente
  ];

  const calendarioSemanal = new FullCalendar.Calendar(
    document.getElementById('calendario-semanal'),
    {
      initialView: 'timeGridWeek',
      locale: 'es',
      allDaySlot: false,
      slotMinTime: '08:00:00',
      slotMaxTime: '20:00:00',
      expandRows: true,
      events: '/agenda/api/citas/',
      
      // Aplicamos color diferente a cada evento
      eventDidMount: function(info) {
        const color = coloresEventos[info.event.id % coloresEventos.length];
        info.el.style.backgroundColor = color;
        info.el.style.border = 'none';
        info.el.style.color = 'white';
        info.el.style.fontWeight = 'bold';
        info.el.style.borderRadius = '6px';
      },

      eventClick: function (info) {
        const ext = info.event.extendedProps || {};
        const mensaje = `
Nombre: ${info.event.title}
Correo: ${ext.cliente_email || '—'}
Teléfono: ${ext.cliente_telefono || '—'}
Estado: ${ext.estado || '—'}
Enlace Zoom: ${ext.enlace_zoom ? ext.enlace_zoom : "No disponible"}
        `;
        alert(mensaje);
      },

      datesSet: function(info) {
          const fecha = info.start;

          // Nombre del mes capitalizado
          const mes = fecha.toLocaleDateString('es-ES', { month: 'long' });
          const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);

          const año = fecha.getFullYear();

          tituloFecha.textContent = `${mesCapitalizado} de ${año}`;
      }
    }
  );
  calendarioSemanal.render();

  const miniCalendario = new FullCalendar.Calendar(
    document.getElementById('mini-calendario'),
    {
      initialView: 'dayGridMonth',
      locale: 'es',
      height: 'auto',
      dateClick: function (info) {
        calendarioSemanal.gotoDate(info.date);
      }
    }
  );
  miniCalendario.render();
});
