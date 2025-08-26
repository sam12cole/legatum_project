import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../styles/Horarios.css";
import TablaCitas from "../components/TablaCitas";
import { fetchConAuth } from "../utils/fetchConAuth";


interface Event {
  id?: number | string;
  title: string;
  start: Date | string;
  end: Date | string;
  backgroundColor?: string;
  borderColor?: string;
}


export default function Calendario() {
  const [currentDate, setCurrentDate] = useState(new Date()); // para sincronizar mini y grande
  const [citas, setCitas] = useState<Cita[]>([]); 

    useEffect(() => {
    fetchConAuth("http://127.0.0.1:8000/api/agenda/listar_citas/")
      .then(res => res.json())
      .then((data: Cita[]) => setCitas(data))
      .catch(err => console.error("Error cargando citas:", err));
  }, [currentDate]);

      const events = citas.map(c => {
    const [y, m, d] = c.fecha.split("-").map(Number);
    const [h, min] = c.hora.split(":").map(Number);
    const start = new Date(y, m - 1, d, h, min);
    const end = new Date(y, m - 1, d, h + 1, min); // duración 1h
    return {
      id: c.id,
      title: c.titulo,
      start,
      end,
      backgroundColor: "#2a2dcb",
      borderColor: "#1c1fa5",
    };
  });

    const changeMonth = (offset: number) => {
  const newDate = new Date(currentDate);
  newDate.setMonth(currentDate.getMonth() + offset);
  setCurrentDate(newDate);
};


  return (
    <>   
    <div className="calendario-page">


    {/* Calendario semanal derecho */}
    <div className="main-calendar-container">
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
        {/* Mini calendario izquierdo */}

    <div className="mini-calendar-wrapper">
    {/* Header encima del mini calendario */}
            <div className="mini-calendar-header">
            <span className="fecha-actual">
            {(() => {
                const fechaStr = currentDate.toLocaleDateString("es-EC", {
                weekday: "short",
                day: "numeric",
                month: "long",
                year: "numeric",
                });
                
                // Capitalizar la primera letra de cada palabra
                return fechaStr.replace(/\b\w/g, (c) => c.toUpperCase());
            })()}
            </span>

                <div className="botones-navegacion">
                <button onClick={() => changeMonth(-1)}>‹</button>
                <button onClick={() => changeMonth(1)}>›</button>
                </div>
            </div>

        {/* Mini calendario */}
        <div className="mini-calendar-container">
            <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            headerToolbar={false}
            height="auto"
            dateClick={(info) => setCurrentDate(new Date(info.date))}
            />
        </div>
    </div>
             
    </div>
       <TablaCitas citas={citas} />
       </>
  );
}
