import React, { useState, useEffect } from "react";
import "../styles/Horarios.css";

interface Cita {
  id: number;
  titulo: string;
  fecha: string; 
  hora: string;
}

const Horarios = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [citas, setCitas] = useState<Cita[]>([]);


  useEffect(() => {
    const token = localStorage.getItem("access");
    fetch("http://127.0.0.1:8000/api/agenda/listar_citas/", {
      headers: { "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,}  ,
    })
      .then((res) => res.json())
      .then((data) => setCitas(data))
      .catch((err) => console.error("Error cargando citas:", err));
  }, [currentDate]);

  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const changeWeek = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + offset * 7);
    setCurrentDate(newDate);
  };

  const renderMiniCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = [];
    for (let d = 1; d <= lastDay.getDate(); d++) {
      daysInMonth.push(new Date(year, month, d));
    }

    return (
      <div className="mini-calendar">
        <h3 className="titulo-fecha">

          <div className="mini-calendar-header">
                <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}>‹</button>
                <h3 className="titulo-fecha">
                {currentDate.toLocaleDateString("es-EC", {
                    month: "long",
                    year: "numeric",
                })}
                </h3>
                <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}>›</button>
            </div>

          {currentDate.toLocaleDateString("es-EC", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <div className="mini-calendar-grid">
          {["D", "L", "M", "X", "J", "V", "S"].map((d) => (
            <div key={d} className="day-name">{d}</div>
          ))}
          {daysInMonth.map((d) => (
            <div
              key={d.toISOString()}
              className={`day-cell ${
                d.toDateString() === currentDate.toDateString() ? "selected" : ""
              }`}
              onClick={() => setCurrentDate(d)}
            >
              {d.getDate()}
            </div>
          ))}
        </div>
      </div>
    );
  };

const renderWeekCalendar = () => {
  const hours = Array.from({ length: 15 }, (_, i) => i + 7); // 7h → 21h

  return (
    <div className="week-calendar">
      <div className="week-header">
        <button onClick={() => changeWeek(-1)}>‹</button>
        <h2>
          Semana de{" "}
          {startOfWeek.toLocaleDateString("es-EC", {
            day: "numeric",
            month: "long",
          })}
        </h2>
        <button onClick={() => changeWeek(1)}>›</button>
      </div>

      <div className="week-table">
        {/* Encabezado con días */}
        <div className="row header-row">
          <div className="cell hour-col"></div>
          {days.map((day) => (
            <div key={day.toISOString()} className="cell day-header">
              {day.toLocaleDateString("es-EC", {
                weekday: "short",
                day: "numeric",
              })}
            </div>
          ))}
        </div>

        {/* Filas por horas */}
        {hours.map((h) => (
          <div key={h} className="row">
            {/* Columna fija de horas */}
            <div className="cell hour-col">{h}:00</div>

            {/* Columnas de días */}
            {days.map((day) => (
              <div key={day.toISOString() + h} className="cell slot">
                {citas
                  .filter(
                    (c) =>
                      new Date(c.fecha).toDateString() ===
                        day.toDateString() &&
                      parseInt(c.hora.split(":")[0]) === h
                  )
                  .map((c) => (
                    <div key={c.id} className="cita-item">
                      {c.titulo}
                      <br />
                      <small>{c.hora}</small>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

  return (
    <div className="calendario-container">
      {renderMiniCalendar()}
      {renderWeekCalendar()}
    </div>
  );
};

export default Horarios;
