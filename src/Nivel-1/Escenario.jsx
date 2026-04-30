import React from 'react';
import './Nivel-1.css';

const Escenario = ({ children }) => {
  return (
    <div className="avenida-container">

      <div className="carril-unico">
        {children}
      </div>

      <div className="meta-inicio">INICIO</div>
      <div className="meta-fin">META</div>
    </div>
  );
};

export default Escenario;