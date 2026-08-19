import { useState } from 'react';
import confetti from 'canvas-confetti';

export default function LluviaDeSobres() {
  const [monedas, setMonedas] = useState(0);

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
    <div className="sobres-container">
      <div className="sobres-card" onClick={dispararMonedas}>
        <div className="mario-box">
          <span className="box-icon">✉️</span>
          {monedas > 0 && <span className="coin-counter">+{monedas} 🪙</span>}
        </div>
        
        <h3 className="sobres-title">Lluvia de Sobres</h3>
        <p className="sobres-subtitle">
          Su presencia es nuestro mejor regalo. Si desean realizar un presente en efectivo, dispondremos de un buzón especial el día del evento.
        </p>

        <button type="button" className="btn-mario-interactive">
          🪙 ¡Toca aquí para enviar buenos deseos!
        </button>
      </div>
    </div>
  );
}