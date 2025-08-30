import React, { useState } from "react";
import "../styles/chatWidget.css";
import { FaRobot, FaPaperPlane } from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";


const ChatCitaPublico = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "¡Hola! 😀 Soy Legatum, tu asistente virtual. ¿Cómo te llamas?" }
  ]);
  const [step, setStep] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    servicio: "",
    dia: "",
    hora: "",
    telefono: "",
    email: "",
    descripcion: "",
    comprobante: null,
  });
const serviciosDisponibles = [
  "Asesoría Legal",
  "Defensa Penal",
  "Litigio Civil",
  "Derecho Laboral",
  "Familia Niñez",
  "Constitución Empresas"
];
const horasDisponibles = {
  Mañana: ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30"],
  Tarde: ["13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30"],
  Noche: ["18:00","18:30","19:00","19:30"]
};



  const handleSend = () => {
    if (!inputValue.trim()) return;
      // Validación específica del paso teléfono
if(step === 6) { // paso donde se pide teléfono
  const telefonoEcuador = /^09\d{8}$/; // empieza con 09 y luego 8 dígitos
  if(!telefonoEcuador.test(inputValue)) {
    setMessages(prev => [...prev, { sender:"bot", text: "😔 Por favor, escribe un número válido de Ecuador (10 dígitos)." }]);
    setInputValue(""); // limpiar input
    return; // no avanzar
  }
}


    // Agregar mensaje del usuario
    setMessages([...messages, { sender: "user", text: inputValue }]);



    // Flujo paso a paso
    switch (step) {
      case 1:
        const partesNombre = inputValue.trim().split(" ");
        
        // Validamos que tenga al menos 2 palabras (nombre + apellido)
        if (partesNombre.length < 2) {
          setMessages(prev => [
            ...prev,
            { sender: "bot", text: "😔 Por favor, escribe tu nombre y apellido." }
          ]);
          setInputValue(""); // limpiamos el input
          return; // no avanza hasta que ponga bien
        }

        setFormData({ ...formData, nombre: inputValue });
        setMessages(prev => [
          ...prev,
          { sender: "bot", text: `Encantado de conocerte, ${inputValue}! 😊\n¿Qué tipo de consulta te interesa hoy?` }
        ]);
        setStep(2);
        break;

      case 2:
        setFormData({ ...formData, servicio: inputValue });
        setMessages(prev => [...prev, { sender: "bot", text: `Perfecto. Ahora dime, ¿qué día prefieres para tu cita?` }]);
        setStep(3);
        break;
      case 3:
        setFormData({ ...formData, dia: inputValue });
        setMessages(prev => [...prev, { sender: "bot", text: `Genial. ¿Qué hora prefieres?` }]);
        setStep(4);
        break;
      case 4:
        setFormData({ ...formData, hora: inputValue });
        setMessages(prev => [...prev, { sender: "bot", text: `Para completar la reserva, necesito tu teléfono:` }]);
        setStep(5);
        break;
      case 6:
        setFormData({ ...formData, telefono: inputValue });
        setMessages(prev => [...prev, { sender: "bot", text: `Perfecto. Ahora tu correo electrónico:` }]);
        setStep(7);
        break;
   
      case 7:
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(inputValue)) {
        setMessages(prev => [
          ...prev,
          { sender: "bot", text: "😔 Por favor, escribe un correo válido (ejemplo@dominio.com)." }
        ]);
        setInputValue(""); // limpiar campo
        return; // 🚫 no avanza de paso
      }

      setFormData({ ...formData, email: inputValue });
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: `¿En qué modalidad deseas la cita?` }
      ]);
      setStep(8);
      break;


    case 9:
      setFormData({ ...formData, descripcion: inputValue });
      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: (
            <div>
              Genial, <b>{formData.nombre}</b>! 🎉<br />
              <span>Recapitulando tu cita:</span>
              <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
                <li><b>Servicio:</b> {formData.servicio}</li>
                <li><b>Día:</b> {formData.dia}</li>
                <li><b>Hora:</b> {formData.hora}</li>
                <li><b>Teléfono:</b> {formData.telefono}</li>
                <li><b>Email:</b> {formData.email}</li>
                <li><b>Modalidad:</b> {formData.modalidad}</li>
                <li><b>Caso:</b> {inputValue}</li>
              </ul>
              <p>
                Para asegurar tu cita de <b>$20</b>, puedes subir el comprobante de transferencia:
              </p>
            </div>
          )
        }
      ]);

      setStep(10);
      break;

      default:
        break;
    }

    setInputValue("");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, comprobante: file });
      setMessages(prev => [...prev, { sender: "bot", text: "¡Gracias! Hemos recibido tu comprobante. Nuestros asesores verificarán el pago y tu cita será confirmada en breve. ⏳" }]);
      setStep(9);
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <div className="chat-button" onClick={() => setOpen(!open)}>

                <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 67.447 68.018" 
                      width="40px" 
                      height="40px" 
                      fill="none"
                    >
                  
                  <path d="M32.384 300.396c.29-.12 2.196-.838 4.233-1.594 6.513-2.417 15.824-6.117 17.463-6.938 3.814-1.912 6.942-5.5 8.213-9.421.399-1.23.606-1.48 1.677-2.026 1.555-.794 2.486-1.784 3.247-3.451.548-1.204.604-1.719.612-5.689.008-4.007-.041-4.474-.6-5.688-.756-1.643-1.977-2.931-3.36-3.545-.824-.366-1.137-.699-1.413-1.506-.837-2.44-2.349-5.006-3.878-6.585-3.21-3.313-8.014-5.301-14.739-6.102-.96-.114-1.824-.412-2.373-.817-.791-.584-2.004-1.024-4.452-1.615-.906-.218-.93-.26-1.134-1.9l-.208-1.676 1.062-.909c1.914-1.638 2.042-4.084.31-5.906-1.672-1.757-4.085-1.765-5.83-.02-1.737 1.737-1.628 4.236.256 5.91l1.12.995-.236 1.63c-.258 1.792-.066 1.638-2.88 2.313-.728.175-1.86.651-2.514 1.059-.883.549-1.807.824-3.572 1.064-4.898.663-8.658 1.996-11.637 4.123-2.478 1.77-4.335 4.24-5.652 7.52-.676 1.682-.925 2.02-1.792 2.443-1.482.72-2.466 1.753-3.23 3.391-.634 1.36-.68 1.725-.693 5.556-.012 3.343.076 4.363.478 5.515.615 1.766 1.738 3.065 3.363 3.888.999.506 1.324.843 1.58 1.637.944 2.932 2.99 5.995 5.232 7.836 1.581 1.298 5.465 3.16 7.853 3.763 1.019.257 3.162.658 4.763.89l2.91.422.164 3.04c.278 1.164-.502 3.108.828 3.677.537.202 2.527-.328 4.829-1.284zm-5.689-13.393c-5.646-.55-9.659-1.86-11.428-3.729-3.017-3.185-4.044-12.823-2.125-19.934 1.397-5.178 5.011-7.127 14.692-7.924 8.645-.711 17.944.099 22.263 1.939 2.164.922 4.016 2.99 4.886 5.455 1.015 2.875 1.373 9.703.716 13.626-.81 4.833-2.317 7.207-5.515 8.69-4.157 1.927-14.505 2.754-23.489 1.877zm-.486-11.663c1.666-1.509 2.496-8.693-1.901-8.693-4.306 0-3.95 7.646-1.291 9.072.818.439 2.51.238 3.192-.38zm19 .361c2.518-1.457 2.558-6.915.374-8.634-1.42-1.117-3.695-.36-4.483 1.49-.613 1.438-.418 5.1.324 6.1.973 1.31 2.452 1.718 3.784 1.044z" fill="#fff" transform="translate(-.383 -233.705)"/>
                  
                </svg>

      </div>

      {/* Ventana de chat */}
      {open && (
        <div className="chat-box">
          {/* Header */}
          <div className="chat-header">
            <div>
            <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 67.447 68.018" 
                  width="30px" 
                  height="30px" 
                  fill="none"
                >
              
              <path d="M32.384 300.396c.29-.12 2.196-.838 4.233-1.594 6.513-2.417 15.824-6.117 17.463-6.938 3.814-1.912 6.942-5.5 8.213-9.421.399-1.23.606-1.48 1.677-2.026 1.555-.794 2.486-1.784 3.247-3.451.548-1.204.604-1.719.612-5.689.008-4.007-.041-4.474-.6-5.688-.756-1.643-1.977-2.931-3.36-3.545-.824-.366-1.137-.699-1.413-1.506-.837-2.44-2.349-5.006-3.878-6.585-3.21-3.313-8.014-5.301-14.739-6.102-.96-.114-1.824-.412-2.373-.817-.791-.584-2.004-1.024-4.452-1.615-.906-.218-.93-.26-1.134-1.9l-.208-1.676 1.062-.909c1.914-1.638 2.042-4.084.31-5.906-1.672-1.757-4.085-1.765-5.83-.02-1.737 1.737-1.628 4.236.256 5.91l1.12.995-.236 1.63c-.258 1.792-.066 1.638-2.88 2.313-.728.175-1.86.651-2.514 1.059-.883.549-1.807.824-3.572 1.064-4.898.663-8.658 1.996-11.637 4.123-2.478 1.77-4.335 4.24-5.652 7.52-.676 1.682-.925 2.02-1.792 2.443-1.482.72-2.466 1.753-3.23 3.391-.634 1.36-.68 1.725-.693 5.556-.012 3.343.076 4.363.478 5.515.615 1.766 1.738 3.065 3.363 3.888.999.506 1.324.843 1.58 1.637.944 2.932 2.99 5.995 5.232 7.836 1.581 1.298 5.465 3.16 7.853 3.763 1.019.257 3.162.658 4.763.89l2.91.422.164 3.04c.278 1.164-.502 3.108.828 3.677.537.202 2.527-.328 4.829-1.284zm-5.689-13.393c-5.646-.55-9.659-1.86-11.428-3.729-3.017-3.185-4.044-12.823-2.125-19.934 1.397-5.178 5.011-7.127 14.692-7.924 8.645-.711 17.944.099 22.263 1.939 2.164.922 4.016 2.99 4.886 5.455 1.015 2.875 1.373 9.703.716 13.626-.81 4.833-2.317 7.207-5.515 8.69-4.157 1.927-14.505 2.754-23.489 1.877zm-.486-11.663c1.666-1.509 2.496-8.693-1.901-8.693-4.306 0-3.95 7.646-1.291 9.072.818.439 2.51.238 3.192-.38zm19 .361c2.518-1.457 2.558-6.915.374-8.634-1.42-1.117-3.695-.36-4.483 1.49-.613 1.438-.418 5.1.324 6.1.973 1.31 2.452 1.718 3.784 1.044z" fill="#2a2dcb" transform="translate(-.383 -233.705)"/>
            </svg>
            </div>
            <div className="chat-header-text">
              <div className="chat-title">Asistente IA</div>
              <div className="chat-subtitle">El equipo que te ayuda</div>
            </div>
          </div>

          {/* Contenido */}
          <div className="chat-content">
            {messages.map((m, i) => (
              <div key={i} className={`chat-message ${m.sender}`}>
                {m.text}
              </div>
            ))}


          </div>
                      {/* Input dinámico según step */}
            {step === 2 && (
              <div className="service-options">
                {serviciosDisponibles.map((s, index) => (
                  <div
                    key={index}
                    className="service-option"
                    onClick={() => {
                      setFormData({ ...formData, servicio: s });
                      setMessages(prev => [...prev, { sender: "user", text: s }]);
                      setMessages(prev => [...prev, { sender: "bot", text: `Perfecto. Ahora dime, ¿qué día prefieres para tu cita?` }]);
                      setStep(3);
                    }}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="service-options">
                {["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"].map((d,i)=>(
                  <div
                    key={i}
                    className="service-option"
                    onClick={()=>{
                      setFormData({...formData, dia: d});
                      setMessages(prev => [...prev, {sender:"user", text:d}]);
                      setMessages(prev => [...prev, {sender:"bot", text:"Perfecto, elige turno: 🌄 Mañana 🌆Tarde 🌃 Noche"}]);
                      setStep(4);
                    }}
                  >{d}</div>
                ))}
              </div>
            )}
            {step === 4 && (
              <div className="service-options">
                {["Mañana","Tarde","Noche"].map((t,i)=>(
                  <div
                    key={i}
                    className="service-option"
                    onClick={()=>{
                      setFormData({...formData, turno: t});
                      setMessages(prev => [...prev, {sender:"user", text:t}]);
                      setMessages(prev => [...prev, {sender:"bot", text:"Elige hora disponible:"}]);
                      setStep(5);
                    }}
                  >{t}</div>
                ))}
              </div>
            )}

              {step === 5 && (
              <div className="service-options">
                {horasDisponibles[formData.turno].map((h,i)=>(
                  <div
                    key={i}
                    className="service-option"
                    onClick={()=>{
                      setFormData({...formData, hora: h});
                      setMessages(prev => [...prev, {sender:"user", text:h}]);
                      setMessages(prev => [...prev, {sender:"bot", text:"Perfecto, ahora tu teléfono:"}]);
                      setStep(6);
                    }}
                  >{h}</div>
                ))}
              </div>
            )}
{step === 8 && (
  <div className="service-options">
    {["Presencial", "Virtual"].map((tipo, i) => (
      <div
        key={i}
        className="service-option"
        onClick={() => {
          if (tipo === "Presencial") {
            // Mostrar confirmación
            setMessages(prev => [
              ...prev,
              {
                sender: "bot",
                text: "🏢 Por el momento solo tenemos oficinas en Guayaquil, ¿deseas continuar con modalidad presencial?"
              }
            ]);

            // Aquí creamos opciones de aceptar o cambiar a virtual
            setStep(8.5); // paso intermedio para confirmar presencial
          } else {
            // Modalidad virtual
            setFormData({ ...formData, modalidad: "Virtual" });
            setMessages(prev => [
              ...prev,
              { sender: "user", text: "Virtual" },
              { sender: "bot", text: "Perfecto, tu cita será en modalidad 💻 Virtual." },
              { sender: "bot", text: "Por último, cuéntanos un poco sobre tu caso (solo lo esencial):" }
            ]);
            setStep(9);
          }
        }}
      >
        {tipo}
      </div>
    ))}
  </div>
)}

// Paso 8.5: Confirmación Presencial
{step === 8.5 && (
  <div className="service-options">
    {["Sí, continuar presencial", "No, prefiero virtual"].map((op, i) => (
      <div
        key={i}
        className="service-option"
        onClick={() => {
          if (op.startsWith("Sí")) {
            setFormData({ ...formData, modalidad: "Presencial" });
            setMessages(prev => [
              ...prev,
              { sender: "user", text: "Sí, continuar presencial" },
              {
                sender: "bot",
                text: (
                  <div>
                    Perfecto, tu cita será <b>Presencial</b>. 🏢<br />
                    <span style={{ fontSize: "14px" }}>
                      📍 <b>Ubicación de la oficina:</b><br />
                      Guayaquil - Av. Carchi y Quisquis<br />
                      Edificio Quil 1, Piso 8, Oficina 801
                    </span>
                  </div>
                )
              },
              { sender: "bot", text: "Por último, cuéntanos un poco sobre tu caso (solo lo esencial):" }
            ]);
          } else {
            setFormData({ ...formData, modalidad: "Virtual" });
            setMessages(prev => [
              ...prev,
              { sender: "user", text: "No, prefiero virtual" },
              { sender: "bot", text: "Perfecto, tu cita será en modalidad 💻 Virtual." },
              { sender: "bot", text: "Por último, cuéntanos un poco sobre tu caso (solo lo esencial):" }
            ]);
          }
          setStep(9); // avanzar al paso siguiente
        }}
      >
        {op}
      </div>
    ))}
  </div>
)}



            {step < 10 && (
              <div className="chat-input">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Escribe tu respuesta..."
                />
                  <button onClick={handleSend}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                    viewBox="90 95 50 50"// Cambia estos valores según la zona del path
                    width="25px"
                    height="25px"
                    fill="white"
                    >
                     <path
                            d="m 101.4181,113.32551 c 0.191,-0.0764 0.4192,-0.067 0.50712,0.0209 0.0879,0.0879 -0.0683,0.15045 -0.34727,0.13896 -0.30822,-0.0127 -0.37092,-0.0754 -0.15985,-0.15985 z m 0,-2.91042 c 0.191,-0.0764 0.4192,-0.067 0.50712,0.0209 0.0879,0.0879 -0.0683,0.15045 -0.34727,0.13897 -0.30822,-0.0127 -0.37092,-0.0754 -0.15985,-0.15986 z"
                            id="path3" /><path
                            d="m 83.253235,130.43958 c 0,-0.3638 0.06005,-0.51263 0.133452,-0.33073 0.0734,0.18191 0.0734,0.47956 0,0.66146 -0.0734,0.1819 -0.133452,0.0331 -0.133452,-0.33073 z M 128.2324,111.91875 c 0,-0.3638 0.06,-0.51263 0.13345,-0.33073 0.0734,0.1819 0.0734,0.47956 0,0.66146 -0.0734,0.1819 -0.13345,0.0331 -0.13345,-0.33073 z M 83.253235,93.397918 c 0,-0.363803 0.06005,-0.512631 0.133452,-0.33073 0.0734,0.181901 0.0734,0.479558 0,0.661459 -0.0734,0.181901 -0.133452,0.03307 -0.133452,-0.330729 z"
                            id="path2" /><path
                            d="m 77.342672,140.65968 c -0.80186,-0.33836 -1.690189,-1.56403 -1.690189,-2.33204 0,-0.83276 6.006934,-15.12268 6.869576,-15.51377 2.084688,-0.94513 5.469582,-0.47608 16.321768,-2.40346 0,0 -14.184181,-2.79157 -16.320582,-3.73847 -1.301159,-0.5767 -6.870762,-14.68594 -6.870762,-15.53034 0,-0.3703 0.300874,-1.03084 0.66861,-1.467872 1.383291,-1.643948 0.378058,-2.009309 22.469778,8.166852 12.342069,5.68516 20.452059,9.56567 20.828089,9.96594 0.89561,0.95334 0.87182,2.99121 -0.0456,3.90684 -0.2127,0.21229 -4.18917,2.13939 -9.59024,4.69351 -11.858361,5.60771 -30.583981,14.23793 -31.420181,14.37789 -0.363804,0.0609 -0.912904,0.005 -1.220227,-0.12508 z"
                            id="path1"
                            sodipodi:nodetypes="ssscssssssssss" />

                    </svg>
                  </button>
              </div>
            )}

            {step === 10 && (
              <div className="chat-input">
                <input type="file" onChange={handleFileUpload} />
              </div>
            )}
        </div>
      )}
    </>
  );
};

// Exponer componente para Django
if (typeof window !== "undefined") {
  window.ChatCitaPublico = ChatCitaPublico;
}

export default ChatCitaPublico;
