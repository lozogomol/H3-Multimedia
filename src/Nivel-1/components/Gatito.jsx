import React from 'react';

const Gatito = ({ x, y }) => {
  return (
    <div 
      style={{ 
        left: `${x}px`, 
        top: `${y}px`,
        position: 'fixed', 
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        width: '50px',
        height: '50px',
        transition: 'all 0.2s ease-out',
        pointerEvents: 'none'
      }}
    >
      <div className="gatito-body" style={{
        width: '100%', height: '100%', backgroundColor: '#ECA60D',
        borderRadius: '12px', border: '3px solid #E8A710',
        position: 'relative', boxShadow: '0 0 15px rgba(222, 178, 5, 0.5)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', top: '-10px', width: '100%' }}>
          <div style={{ width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: '15px solid #E19209' }}></div>
          <div style={{ width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: '15px solid #E19209' }}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '15px' }}>
          <div style={{ width: '8px', height: '8px', background: '#020817', borderRadius: '50%' }}></div>
          <div style={{ width: '8px', height: '8px', background: '#020817', borderRadius: '50%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default Gatito;
