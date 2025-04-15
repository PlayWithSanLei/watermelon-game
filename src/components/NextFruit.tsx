import React from 'react';
import { FruitType, FRUIT_PROPERTIES } from '../types';

interface NextFruitProps {
  type: FruitType;
}

const NextFruit: React.FC<NextFruitProps> = ({ type }) => {
  const props = FRUIT_PROPERTIES[type];
  
  return (
    <div className="next-fruit">
      <div className="next-fruit-label">下一个:</div>
      <div 
        className="next-fruit-preview" 
        style={{ 
          width: props.radius * 2, 
          height: props.radius * 2, 
          backgroundColor: props.color,
          borderRadius: '50%'
        }}
      />
    </div>
  );
};

export default NextFruit; 