import React from 'react';

const Objeto = ({ x, y }) => {
  return (
    <div 
      style={{
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
        width: '30px',
        height: '30px',
        backgroundColor: '#ff4d4d',
        borderRadius: '50%',
        zIndex: 9998,
        pointerEvents: 'none',
        boxShadow: '0 0 10px #ff4d4d'
      }}
    />
  );
};

export default Objeto;