import React, { useEffect, useRef } from 'react';
import { FruitType, FRUIT_PROPERTIES } from '../types';

interface NextFruitProps {
  type: FruitType;
}

const NextFruit: React.FC<NextFruitProps> = ({ type }) => {
  const props = FRUIT_PROPERTIES[type];
  
  // 使用CSS渲染简化版水果（确保可见）
  const outerStyle = {
    width: props.radius * 2,
    height: props.radius * 2,
    borderRadius: '50%',
    position: 'relative' as const,
    backgroundColor: props.color,
    boxShadow: `0 0 0 ${props.radius * 0.05}px ${props.borderColor}`,
    overflow: 'hidden'
  };
  
  const innerStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: `${props.radius * 1.4}px`,
    height: `${props.radius * 1.4}px`,
    borderRadius: '50%',
    backgroundColor: props.pulpColor
  };
  
  return (
    <div className="next-fruit">
      <div className="next-fruit-label">下一个:</div>
      <div className="next-fruit-preview" style={outerStyle}>
        <div style={innerStyle}></div>
      </div>
    </div>
  );
};

export default NextFruit; 