import React from 'react';
import './Nivel-1.css';

const Escenario = ({ children }) => {
  return (
    <div className="avenida-container" style={{ 
      display: 'flex', 
      width: '100vw', 
      height: '100vh', 
      position: 'relative' 
    }}>
      {/* Zona de Inicio */}
      <div className="meta-inicio" style={{
        width: '100px',
        height: '100%',
        backgroundColor: 'rgba(0, 168, 107, 0.2)', // Jade Green tenue
        borderRight: '2px dashed #00A86B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#00A86B',
        fontWeight: 'bold',
        zIndex: 1
      }}>
        INICIO
      </div>

      {/* Carril de juego */}
      <div className="carril-unico" style={{ flex: 1, position: 'relative' }}>
        {children}
      </div>

      {/* Zona de Meta */}
      <div className="meta-fin" style={{
        width: '100px',
        height: '100%',
        backgroundColor: 'rgba(255, 77, 77, 0.2)',
        borderLeft: '2px dashed #ff4d4d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ff4d4d',
        fontWeight: 'bold',
        zIndex: 1
      }}>
        META
      </div>
    </div>
  );
};

export default Escenario;
