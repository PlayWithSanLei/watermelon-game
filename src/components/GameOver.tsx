import React from 'react';

interface GameOverProps {
  score: number;
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, onRestart }) => {
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

export default GameOver; 