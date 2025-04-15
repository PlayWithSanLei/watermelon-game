import React, { useEffect, useRef, useState } from 'react';
import useGameEngine from '../hooks/useGameEngine';
import { FruitType, FRUIT_PROPERTIES } from '../types';

// 内联NextFruit组件避免导入问题
const InlineNextFruit = ({ type }: { type: FruitType }) => {
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

// 内联GameOver组件避免导入问题
const InlineGameOver = ({ score, onRestart }: { score: number, onRestart: () => void }) => {
  return (
    <div className="game-over-overlay">
      <div className="game-over-modal">
        <h2>游戏结束</h2>
        <p>你的得分: {score}</p>
        <button className="restart-button" onClick={onRestart}>
          重新开始
        </button>
      </div>
    </div>
  );
};

const Game: React.FC = () => {
  // 加载状态
  const [isLoaded, setIsLoaded] = useState(false);
  
  const { 
    containerRef, 
    score, 
    gameOver, 
    nextFruitType, 
    dropFruit, 
    resetGame 
  } = useGameEngine();
  
  // 游戏容器的引用
  const gameRef = useRef<HTMLDivElement | null>(null);
  
  // 点击处理
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameRef.current && !gameOver) {
      const rect = gameRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      console.log(`点击位置: x=${x}`);
      dropFruit(x);
    }
  };
  
  // 为调试添加的useEffect
  useEffect(() => {
    console.log("Game组件已挂载，游戏容器引用:", containerRef.current);
    
    // 模拟加载完成
    setTimeout(() => {
      setIsLoaded(true);
      console.log("游戏加载完成");
    }, 1000);
  }, []);
  
  return (
    <div className="game-wrapper">
      <div className="game-score">分数: {score}</div>
      
      <div 
        className="game-canvas" 
        onClick={handleClick}
        ref={(el) => {
          if (el) {
            console.log("游戏容器已设置，宽度:", el.clientWidth, "高度:", el.clientHeight);
            containerRef.current = el;
            gameRef.current = el;
          }
        }}
      >
        {/* 物理引擎会在这个div中渲染游戏 */}
        <div className="game-debug">
          {gameOver ? "游戏已结束 - 点击重新开始" : "点击顶部区域放置水果"}
        </div>
        
        {!isLoaded && (
          <div className="game-loading">
            正在加载游戏...
          </div>
        )}
      </div>
      
      <div className="game-ui">
        <InlineNextFruit type={nextFruitType} />
      </div>
      
      {gameOver && <InlineGameOver score={score} onRestart={resetGame} />}
    </div>
  );
};

export default Game; 