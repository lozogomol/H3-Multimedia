import React, { useState, useEffect } from 'react';
import Escenario from './Escenario';
import Objeto from './Objeto';
import Gatito from './components/Gatito';

const Nivel1 = () => {
  const [obstaculos, setObstaculos] = useState([]);


  const [posicionGatito, setPosicionGatito] = useState({ 
    x: 80, 
    y: window.innerHeight / 2 
  });

  useEffect(() => {
    const generador = setInterval(() => {
      const nuevoObjeto = {
        id: Date.now(),
     
        x: Math.floor(Math.random() * (window.innerWidth - 300)) + 150,
        y: -50
      };
      setObstaculos(prev => [...prev, nuevoObjeto]);
    }, 1500);

    const motor = setInterval(() => {
      setObstaculos(prev => 
        prev
          .map(obj => ({ ...obj, y: obj.y + 5 }))
          .filter(obj => obj.y < window.innerHeight)
      );
    }, 50);

    return () => {
      clearInterval(generador);
      clearInterval(motor);
    };
  }, []);

  const manejarClic = (e) => {
    setPosicionGatito({
      x: e.clientX,
      y: e.clientY
    });
  };

  return (
    <div 
      onClick={manejarClic} 
      style={{ 
        width: '100vw', 
        height: '100vh', 
        position: 'relative', 
        backgroundColor: '#020817',
        overflow: 'hidden'
      }}
    >
      <Escenario>
        <Gatito x={posicionGatito.x} y={posicionGatito.y} />
        {obstaculos.map(obj => (
          <Objeto key={obj.id} x={obj.x} y={obj.y} />
        ))}
      </Escenario>
    </div>
  );
};

export default Nivel1;
