import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../styles/Horarios.css";

interface Cita {
  id: number;
  titulo: string;
  fecha: string;   // formato "YYYY-MM-DD"
  hora: string;    // formato "HH:MM"
}


export default function Calendario() {
  const [currentDate, setCurrentDate] = useState(new Date()); // para sincronizar mini y grande
  const [citas, setCitas] = useState<Cita[]>([]); 

    useEffect(() => {
    const token = localStorage.getItem("access");
    fetch("http://127.0.0.1:8000/api/agenda/listar_citas/", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then((data: Cita[]) => setCitas(data))
      .catch(err => console.error("Error cargando citas:", err));
  }, [currentDate]);

    const events = citas.map((c, index) => {
    const [y, m, d] = c.fecha.split("-").map(Number);
    const [h, min] = c.hora.split(":").map(Number);
    const start = new Date(y, m - 1, d, h, min);
    const end = new Date(y, m - 1, d, h + 1, min); // duración 1h
    const palette = [
      "#2a2dcbb5",     // azul base
      "#a5b7eda3",   // azul suave translúcido
      "#e67aa5b0",   // rosado-lila
      "#7ae6c4a9",   // verde menta
      "#f0a57ac0",   // naranja suave
    ];
    const color = palette[index % palette.length];

      return {
        id: c.id,
        title: c.titulo,
        start,
        end,
        backgroundColor: color,
        borderColor: "#83838f98",
        textColor: "#353434e6", 
      };
  });

    const changeMonth = (offset: number) => {
  const newDate = new Date(currentDate);
  newDate.setMonth(currentDate.getMonth() + offset);
  setCurrentDate(newDate);
};


  return (

    <div className="calendario-page_1">


    {/* Calendario semanal derecho */}
    <div className="main-calendar-container_1">
        <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        initialDate={currentDate} 
        events={events}
        selectable={true}
        allDaySlot={false} 
        slotMinTime="07:00:00"   // hora inicial
        slotMaxTime="22:00:00"   // hora final
       
        
        select={(info) => {
            let title = prompt("Título del evento:");
            if (title) {
            setEvents([...events, { title, start: info.startStr, end: info.endStr }]);
            }
        }}
        />
    </div>

   

    </div>

  );
}

