import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import './Invitacion.css';

export default function Invitacion() {
  const [monedas, setMonedas] = useState(0);
  const [nombrePersona, setNombrePersona] = useState("");
  const [cuposMaximos, setCuposMaximos] = useState(1);
  const [cuposSeleccionados, setCuposSeleccionados] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const [asistira, setAsistira] = useState(true);
  const [enviandoConfirmacion, setEnviandoConfirmacion] = useState(false);

  // URL dinámica: usa la variable de entorno de Vercel o el localhost por defecto para desarrollo local
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const urlIglesia = "https://maps.google.com/?q=Parroquia+San+Damian+de+Molokai";
  const urlRecepcion = "https://maps.google.com/?q=Salon+Comunal+Bello+Horizonte";

  const buscarInvitado = async (nombre) => {
    const nombreLimpio = nombre.trim();
    if (!nombreLimpio) return;

    setCargando(true);
    try {
      const response = await fetch(`${API_URL}/api/invitados/buscar?nombre=${encodeURIComponent(nombreLimpio)}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data) {
          const max = Number(data.cupos) || 1;
          setCuposMaximos(max);
          
          setConfirmado(data.confirmado);
          setAsistira(data.asistira !== undefined ? data.asistira : true);
          setCuposSeleccionados(data.confirmado ? (data.cuposConfirmados || max) : max);
        }
      } else {
        console.warn('Invitado no encontrado.');
      }
    } catch (error) {
      console.error('Error conectando con el servidor:', error);
    } finally {
      setCargando(false);
    }
  };

  const enviarRespuesta = async (vaAsistir) => {
    const nombreLimpio = nombrePersona.trim();
    if (!nombreLimpio) {
      alert("Por favor escribe tu nombre primero.");
      return;
    }

    setEnviandoConfirmacion(true);
    try {
      const response = await fetch(`${API_URL}/api/invitados/confirmar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nombre: nombreLimpio,
          cuposConfirmados: vaAsistir ? Number(cuposSeleccionados) : 0,
          asistira: vaAsistir
        })
      });

      const data = await response.json();
      if (response.ok) {
        setConfirmado(true);
        setAsistira(vaAsistir);
        if (vaAsistir) {
          confetti({ particleCount: 50, spread: 80, origin: { y: 0.6 } });
        }
      } else {
        alert(data.error || 'No se pudo registrar la respuesta.');
      }
    } catch (error) {
      console.error('Error al enviar respuesta:', error);
      alert('Error de conexión con el servidor.');
    } finally {
      setEnviandoConfirmacion(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') buscarInvitado(nombrePersona);
  };

  const dispararMonedas = (e) => {
    setMonedas((prev) => prev + 1);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 12,
      spread: 60,
      startVelocity: 30,
      origin: { x, y },
      shapes: ['circle'],
      colors: ['#FFD700', '#FFA500', '#FFF8DC'],
      scalar: 1.2,
      ticks: 80
    });

    const audio = new Audio('https://www.myinstants.com/media/sounds/super-mario-coin-sound.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };

  return (
    <div className="invitacion-page">
      <div className="invitacion-card">
        
        <div className="foto-container">
          <img src="/Foto.jpeg" alt="Lina y Euclides" className="foto-imagen" />
        </div>
        <div className="marco-fondo"></div>

        <div className="invitacion-contenido">
          
          <div className="adorno-superior">⤅ ♥ ⤞</div>

          <p className="texto-encabezado">
            EL MEJOR VIAJE DE NUESTRAS VIDAS<br />COMIENZA CONTIGO.
          </p>

          <div className="corazon-mini">♥</div>

          <p className="texto-encabezado">
            TE INVITAMOS A CELEBRAR<br />NUESTRA
          </p>

          <h2 className="titulo-boda">Boda</h2>

          <div className="corazon-mini">♥</div>

          <div className="bloque-nombres">
            <h1 className="nombre-novio">Lina</h1>
            <div className="linea-ampersand">
              ➔ <span className="ampersand-symbol">&</span> ⟵
            </div>
            <h1 className="nombre-novio">Euclides</h1>
          </div>

          <div className="corazon-mini">♥</div>

          <p className="texto-leyenda">
            UNIREMOS NUESTRAS VIDAS Y COMENZAREMOS<br />JUNTOS NUESTRA MEJOR HISTORIA.
          </p>

          <div className="badge-cupos badge-nombre-input">
            <input 
              type="text" 
              className="input-persona-texto"
              value={nombrePersona}
              onChange={(e) => setNombrePersona(e.target.value)}
              onBlur={() => buscarInvitado(nombrePersona)}
              onKeyDown={handleKeyDown}
              placeholder="ESCRIBE AQUÍ TU NOMBRE"
            />
          </div>

          <div className="badge-cupos">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#2c3e2e' }}>
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            
            {cargando ? (
              <span>BUSCANDO...</span>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%', justifyContent: 'center' }}>
                <span>CANTIDAD DE PERSONAS:</span>
                <select
                  value={cuposSeleccionados}
                  onChange={(e) => setCuposSeleccionados(Number(e.target.value))}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #2c3e2e',
                    borderRadius: '4px',
                    padding: '2px 6px',
                    fontWeight: 'bold',
                    fontSize: '9.5px',
                    fontFamily: 'Montserrat, sans-serif',
                    color: '#2c3e2e',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  {Array.from({ length: cuposMaximos }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      +{i + 1} {i === 0 ? 'persona' : 'personas'} (Máx. {cuposMaximos})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div style={{ margin: '15px 0', display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '360px' }}>
            {!confirmado ? (
              <>
                <button
                  type="button"
                  onClick={() => enviarRespuesta(true)}
                  disabled={enviandoConfirmacion}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#2c3e2e',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    fontFamily: 'Montserrat, sans-serif',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                >
                  {enviandoConfirmacion ? "ENVIANDO..." : "✨ CONFIRMAR ASISTENCIA ✨"}
                </button>
                <button
                  type="button"
                  onClick={() => enviarRespuesta(false)}
                  disabled={enviandoConfirmacion}
                  style={{
                    width: '100%',
                    padding: '8px',
                    backgroundColor: 'transparent',
                    color: '#e74c3c',
                    border: '1px solid #e74c3c',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '10px',
                    fontFamily: 'Montserrat, sans-serif'
                  }}
                >
                  No podré asistir ❌
                </button>
              </>
            ) : (
              <div
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: asistira ? '#27ae60' : '#e74c3c',
                  color: '#fff',
                  borderRadius: '6px',
                  textAlign: 'center',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ fontWeight: 'bold', fontSize: '11px', fontFamily: 'Montserrat, sans-serif' }}>
                  {asistira ? "¡ASISTENCIA CONFIRMADA! ✔" : "RESPUESTA REGISTRADA"}
                </div>
                <div style={{ fontSize: '9.5px', marginTop: '2px', opacity: 0.9, fontFamily: 'Montserrat, sans-serif' }}>
                  {asistira 
                    ? `Gracias por confirmar tu asistencia (${cuposSeleccionados} ${cuposSeleccionados === 1 ? 'cupo' : 'cupos'})` 
                    : "Lamentamos que no nos acompañes, ¡gracias por avisarnos!"}
                </div>
              </div>
            )}
          </div>

          <div className="grid-detalles">
            <div className="col-detalle">
              <svg className="icon-svg" viewBox="0 0 24 24">
                <path d="M19 4H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM19 20H5V10h14v10zM19 8H5V6h14v2z"/>
                <circle cx="7" cy="12" r="1.5"/>
                <circle cx="12" cy="12" r="1.5"/>
                <circle cx="17" cy="12" r="1.5"/>
              </svg>
              <span className="txt-label">SÁBADO</span>
              <span className="num-dia">19</span>
              <span className="txt-label">DE DICIEMBRE</span>
              <span className="txt-label">DE 2026</span>
            </div>

            <div className="col-detalle border-lat">
              <svg className="icon-svg" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9"/>
                <path d="M12 7v5l3 3"/>
              </svg>
              <span className="txt-bold" style={{ marginTop: '12px' }}>5:00 P.M.</span>
            </div>

            <a 
              href={urlIglesia} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="col-detalle enlace-mapa"
              title="Ver ubicación en Google Maps"
            >
              <svg className="icon-svg" viewBox="0 0 24 24">
                <path d="M12 2L8 6v3H4v13h16V9h-4V6l-4-4zm0 2.8L13.2 6h-2.4L12 4.8zM6 11h4v9H6v-9zm12 9h-4v-5h-4v5H8v-7h10v7z"/>
              </svg>
              <span className="txt-label">CEREMONIA RELIGIOSA</span>
              <span className="txt-lugar">Parroquia San<br />Damián de Molokai</span>
              <span className="btn-ver-mapa"> Ver mapa 📍</span>
            </a>
          </div>

          <div className="separador-hojas">
            ➔ ♥ ⟵
          </div>

          <div className="grid-inferior">
            <div className="col-sobres sobres-card" onClick={dispararMonedas}>
              <div className="mario-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2c3e2e" strokeWidth="1.2">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                  <path d="M12 11l-1 1-1-1" />
                </svg>
                {monedas > 0 && <span className="coin-counter">+{monedas} 🪙</span>}
              </div>

              <h3 className="titulo-sobres">Lluvia de sobres</h3>
              <p className="txt-sobres-desc">
                TU PRESENCIA ES NUESTRO MEJOR REGALO, PERO SI DESEAS TENER UN DETALLE CON NOSOTROS, AGRADECEMOS UNA LLUVIA DE SOBRES.
              </p>

              <button type="button" className="btn-mario-interactive">
                🪙 ¡Toca aquí!
              </button>

              <div className="corazon-mini">♥</div>
            </div>

            <a 
              href={urlRecepcion} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="col-recepcion enlace-mapa"
              title="Ver ubicación en Google Maps"
            >
              <svg className="icon-svg" viewBox="0 0 24 24">
                <path d="M11 3v7.28B7 11 4 14 4 17.5V21h16v-3.5c0-3.5-3-6.5-7-7.22V3h-2z"/>
                <path d="M7 3h10v2H7z"/>
              </svg>
              <span className="txt-label">RECEPCIÓN</span>
              <span className="txt-lugar" style={{ fontWeight: 'bold' }}>Salón Comunal<br />Bello Horizonte</span>
              <span className="btn-ver-mapa"> Ver mapa 📍</span>
            </a>
          </div>

          <p className="txt-pie">
            ¡NOS HARÁ MUY FELICES<br />COMPARTIR ESTE DÍA CONTIGO!
          </p>

          <div className="corazon-mini" style={{ marginTop: '6px' }}>♥</div>

        </div>
      </div>
    </div>
  );
}