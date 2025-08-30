import React from 'react'

export default function FormCitaPublico() {
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h3>Formulario de Citas</h3>
      <form>
        <div>
          <label>Nombre:</label>
          <input type="text" />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" />
        </div>
        <button type="submit">Agendar Cita</button>
      </form>
    </div>
  )
}
