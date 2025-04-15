import React, { useEffect, useRef } from 'react';
import { FruitType, FRUIT_PROPERTIES } from '../types';

interface NextFruitProps {
  type: FruitType;
}

const NextFruit: React.FC<NextFruitProps> = ({ type }) => {
  const props = FRUIT_PROPERTIES[type];
  const seedsCount = 8; // 种子数量
  
  // 使用CSS渲染带有细节的水果
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
  
  // 生成水果条纹的JSX（如果有）
  const renderStripes = () => {
    if (!props.hasStripes || !props.stripeColor) return null;
    
    const stripes = [];
    const stripesCount = 6;
    const centerX = props.radius;
    const centerY = props.radius;
    
    for (let i = 0; i < stripesCount; i++) {
      const angle = (Math.PI / stripesCount) * i;
      const startX = centerX;
      const startY = centerY;
      const endX = centerX + props.radius * Math.cos(angle);
      const endY = centerY + props.radius * Math.sin(angle);
      
      stripes.push(
        <div
          key={`stripe-${i}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: `${startY}px`,
              left: `${startX}px`,
              width: '2px',
              height: `${props.radius}px`,
              backgroundColor: props.stripeColor,
              transformOrigin: '0 0',
              transform: `rotate(${angle}rad)`,
              opacity: 0.7
            }}
          />
        </div>
      );
    }
    
    return stripes;
  };
  
  // 生成种子的JSX（如果有）
  const renderSeeds = () => {
    if (!props.hasSeedPattern) return null;
    
    const seeds = [];
    const centerX = props.radius;
    const centerY = props.radius;
    const innerRadius = props.radius * 0.5; // 进一步减小半径，让种子更加居中
    const seedRadius = props.radius * 0.08; // 增大种子尺寸
    
    for (let i = 0; i < seedsCount; i++) {
      const angle = (Math.PI * 2 / seedsCount) * i;
      const seedX = centerX + innerRadius * Math.cos(angle);
      const seedY = centerY + innerRadius * Math.sin(angle);
      
      seeds.push(
        <div
          key={`seed-${i}`}
          style={{
            position: 'absolute',
            top: `${seedY - seedRadius}px`,
            left: `${seedX - seedRadius * 2}px`,
            width: `${seedRadius * 4}px`,
            height: `${seedRadius * 2}px`,
            backgroundColor: props.seedColor,
            borderRadius: '50%',
            transform: `rotate(${angle}rad)`,
            boxShadow: '0 1px 1px rgba(0,0,0,0.3)',
            border: '0.5px solid rgba(0,0,0,0.1)'
          }}
        />
      );
    }
    
    return seeds;
  };
  
  return (
    <div className="next-fruit">
      <div className="next-fruit-label">下一个:</div>
      <div className="next-fruit-preview" style={outerStyle}>
        <div style={innerStyle}>
          {renderSeeds()}
        </div>
        {renderStripes()}
      </div>
    </div>
  );
};

export default NextFruit; 