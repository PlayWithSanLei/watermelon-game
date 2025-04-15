import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { FruitType, Fruit, FRUIT_PROPERTIES, FruitProps } from '../types';

// 生成唯一ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// 游戏区域大小
const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const WALL_THICKNESS = 20;

// 游戏引擎钩子
const useGameEngine = () => {
  // 游戏状态
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [nextFruitType, setNextFruitType] = useState<FruitType>(FruitType.Cherry);
  
  // Matter.js 引擎相关引用
  const engineRef = useRef<Matter.Engine | null>(null);
  const rendererRef = useRef<Matter.Render | null>(null);
  const worldRef = useRef<Matter.World | null>(null);
  const fruitBodiesRef = useRef<Fruit[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const nextFruitRef = useRef<Fruit | null>(null);
  const canDropRef = useRef(true);
  const boundaryRef = useRef<Matter.Body | null>(null);
  
  // 初始化游戏引擎
  useEffect(() => {
    if (!containerRef.current) {
      console.error("容器引用不存在");
      return;
    }
    
    // 清除之前的canvas元素
    const existingCanvas = containerRef.current.querySelector('canvas');
    if (existingCanvas) {
      existingCanvas.remove();
    }
    
    console.log("开始初始化物理引擎", containerRef.current);
    
    try {
      // 创建引擎
      const engine = Matter.Engine.create({
        enableSleeping: false, // 禁用休眠，保持水果活跃
        gravity: { x: 0, y: 1, scale: 0.001 },
        positionIterations: 10, // 增加位置迭代次数
        velocityIterations: 10  // 增加速度迭代次数
      });
      
      // 设置全局物理参数
      engine.world.gravity.y = 1; // 增加重力
      
      // 创建渲染器，确保可见性设置正确
      const render = Matter.Render.create({
        element: containerRef.current,
        engine: engine,
        options: {
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
          wireframes: false,
          background: 'white',
          // 只保留Matter.js支持的选项
          showSleeping: false,
          showDebug: false,
          showBounds: false,
          showVelocity: false,
          showCollisions: false,
          showPositions: false,
          showAngleIndicator: false,
          showIds: false
        }
      });
      
      // 设置引用
      engineRef.current = engine;
      rendererRef.current = render;
      worldRef.current = engine.world;
      
      // 清除默认重力
      engine.gravity.scale = 0.001;
      
      // 创建游戏边界
      createBoundaries();
      
      // 设置碰撞事件
      Matter.Events.on(engine, 'collisionStart', handleCollision);
      
      // 创建下一个水果
      createNextFruit();
      
      // 确保渲染器正确运行
      Matter.Render.run(render);
      
      // 游戏更新循环
      const runner = Matter.Runner.create();
      Matter.Runner.run(runner, engine);
      
      // 设置游戏更新
      const updateGame = () => {
        checkGameOver();
        requestRef.current = requestAnimationFrame(updateGame);
      };
      requestRef.current = requestAnimationFrame(updateGame);
      
      // 添加调试日志
      console.log("物理引擎和渲染器已创建");
      
      // 确保canvas样式正确
      const canvas = containerRef.current.querySelector('canvas');
      if (canvas) {
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '5';
        console.log("Canvas已创建并样式已设置", canvas);
      } else {
        console.error("找不到canvas元素");
      }
      
      // 清理函数
      return () => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
        Matter.Events.off(engine, 'collisionStart', handleCollision);
        Matter.Render.stop(render);
        Matter.Runner.stop(runner);
        Matter.World.clear(engine.world, false);
        Matter.Engine.clear(engine);
        console.log("物理引擎已清理");
      };
    } catch (error) {
      console.error("初始化物理引擎时发生错误:", error);
    }
  }, []);
  
  // 创建游戏边界
  const createBoundaries = () => {
    if (!worldRef.current) return;
    
    // 底部边界
    const bottom = Matter.Bodies.rectangle(
      GAME_WIDTH / 2,
      GAME_HEIGHT + WALL_THICKNESS / 2,
      GAME_WIDTH,
      WALL_THICKNESS,
      { 
        isStatic: true, 
        label: 'boundary_bottom',
        render: {
          fillStyle: '#333',
          visible: true
        }
      }
    );
    
    // 左侧边界
    const left = Matter.Bodies.rectangle(
      -WALL_THICKNESS / 2,
      GAME_HEIGHT / 2,
      WALL_THICKNESS,
      GAME_HEIGHT,
      { 
        isStatic: true, 
        label: 'boundary_left',
        render: {
          fillStyle: '#333',
          visible: true
        }
      }
    );
    
    // 右侧边界
    const right = Matter.Bodies.rectangle(
      GAME_WIDTH + WALL_THICKNESS / 2,
      GAME_HEIGHT / 2,
      WALL_THICKNESS,
      GAME_HEIGHT,
      { 
        isStatic: true, 
        label: 'boundary_right',
        render: {
          fillStyle: '#333',
          visible: true
        }
      }
    );
    
    // 游戏结束边界线（红色可见线）
    const gameOverLine = Matter.Bodies.rectangle(
      GAME_WIDTH / 2,
      150,
      GAME_WIDTH,
      2,
      { 
        isStatic: true, 
        isSensor: true,
        label: 'game_over_line',
        render: { 
          fillStyle: 'rgba(255, 0, 0, 0.8)',
          strokeStyle: 'rgba(255, 0, 0, 0.8)',
          lineWidth: 1,
          visible: true
        }
      }
    );
    
    boundaryRef.current = gameOverLine;
    
    Matter.Composite.add(worldRef.current, [bottom, left, right, gameOverLine]);
    console.log("游戏边界已创建");
  };
  
  // 创建水果
  const createFruit = (type: FruitType, x: number, y: number, isNext = false) => {
    if (!worldRef.current) {
      console.error("物理世界未初始化");
      return null;
    }
    
    const props = FRUIT_PROPERTIES[type];
    console.log(`创建水果: 类型=${type}, 半径=${props.radius}, 颜色=${props.color}, 位置=(${x}, ${y})`);
    
    try {
      // 创建物理体，确保渲染设置正确
      const body = Matter.Bodies.circle(x, y, props.radius, {
        restitution: 0.5, // 弹性提高
        friction: 0.01,   // 减少摩擦
        frictionAir: 0.001, // 减少空气阻力
        label: `fruit_${type}`,
        render: {
          // 使用自定义渲染函数，绘制更逼真的水果
          sprite: {
            texture: createFruitTexture(props),
            xScale: props.radius * 2 / 200, // 假设贴图尺寸为200x200
            yScale: props.radius * 2 / 200
          },
          fillStyle: props.color,
          strokeStyle: props.borderColor,
          lineWidth: 2,
          visible: true  // 确保可见性为true
        },
        collisionFilter: {
          group: isNext ? -1 : 0  // 如果是下一个水果，不与其他物体碰撞
        }
      });
      
      // 创建水果对象
      const fruit: Fruit = {
        id: generateId(),
        type,
        body,
        isDropping: false,
        isRemoved: false
      };
      
      if (!isNext) {
        // 应用一个初始力，使其更有动态感
        Matter.Body.setVelocity(body, { x: 0, y: 2 });
        
        // 确保可见性
        if (body.render) {
          body.render.visible = true;
        }
        
        // 添加到世界
        Matter.Composite.add(worldRef.current, body);
        fruitBodiesRef.current = [...fruitBodiesRef.current, fruit];
        
        console.log(`水果已添加到物理世界: 类型=${type}, 位置=(${x}, ${y}), ID=${fruit.id}`);
      } else {
        console.log(`创建了下一个水果预览: 类型=${type}`);
      }
      
      return fruit;
    } catch (error) {
      console.error("创建水果时发生错误:", error);
      return null;
    }
  };
  
  // 创建水果贴图
  const createFruitTexture = (props: FruitProps): string => {
    try {
      // 创建一个临时canvas来绘制水果
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        console.error("无法获取canvas上下文");
        return '';
      }
      
      // 清除画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 计算中心点和半径
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = (canvas.width / 2) - 10; // 留一些边距
      
      // 绘制水果主体（外部轮廓）
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.closePath();
      
      // 创建渐变填充
      if (props.gradientColors && props.gradientColors.length > 1) {
        const gradient = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, radius
        );
        props.gradientColors.forEach((color: string, index: number) => {
          gradient.addColorStop(index / (props.gradientColors!.length - 1), color);
        });
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = props.color;
      }
      
      ctx.fill();
      
      // 绘制边框
      ctx.strokeStyle = props.borderColor;
      ctx.lineWidth = radius * 0.05;
      ctx.stroke();
      
      // 如果有条纹，绘制条纹
      if (props.hasStripes && props.stripeColor) {
        const stripesCount = 6; // 条纹数量
        ctx.strokeStyle = props.stripeColor;
        ctx.lineWidth = radius * 0.04;
        
        for (let i = 0; i < stripesCount; i++) {
          const angle = (Math.PI / stripesCount) * i;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(
            centerX + radius * Math.cos(angle),
            centerY + radius * Math.sin(angle)
          );
          ctx.stroke();
        }
      }
      
      // 绘制切开的水果横截面
      // 为了简化，我们只在圆形中间绘制一个小圆代表"横截面"
      const innerRadius = radius * 0.7;
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = props.pulpColor;
      ctx.fill();
      
      // 如果有种子图案，绘制种子
      if (props.hasSeedPattern) {
        const seedsCount = 8;
        const seedRadius = radius * 0.05;
        ctx.fillStyle = props.seedColor;
        
        for (let i = 0; i < seedsCount; i++) {
          const angle = (Math.PI * 2 / seedsCount) * i;
          const distance = innerRadius * 0.5;
          
          ctx.beginPath();
          ctx.ellipse(
            centerX + distance * Math.cos(angle),
            centerY + distance * Math.sin(angle),
            seedRadius * 2,
            seedRadius,
            angle,
            0, Math.PI * 2
          );
          ctx.fill();
        }
      }
      
      // 转换为dataURL
      return canvas.toDataURL();
    } catch (e) {
      console.error("创建水果贴图时出错:", e);
      return '';
    }
  };
  
  // 创建下一个水果
  const createNextFruit = () => {
    try {
      const type = getRandomSmallFruitType();
      console.log(`创建下一个水果，类型: ${type}`);
      
      // 更新状态，触发UI重新渲染
      setNextFruitType(type);
      
      // 在物理引擎中创建一个不可见的下一个水果（仅用于内部状态）
      const nextFruit = createFruit(type, GAME_WIDTH / 2, 50, true);
      nextFruitRef.current = nextFruit;
      
      console.log(`下一个水果已创建: ${type}, ID=${nextFruit?.id || 'unknown'}`);
    } catch (error) {
      console.error("创建下一个水果时出错:", error);
    }
  };
  
  // 获取随机小水果类型（通常游戏中只会掉落前3种水果）
  const getRandomSmallFruitType = (): FruitType => {
    const types = [FruitType.Cherry, FruitType.Strawberry, FruitType.Grape];
    return types[Math.floor(Math.random() * types.length)];
  };
  
  // 处理碰撞事件
  const handleCollision = (event: Matter.IEventCollision<Matter.Engine>) => {
    const pairs = event.pairs;
    
    for (let i = 0; i < pairs.length; i++) {
      const { bodyA, bodyB } = pairs[i];
      
      // 跳过非水果碰撞
      if (!bodyA.label.startsWith('fruit_') || !bodyB.label.startsWith('fruit_')) {
        continue;
      }
      
      const typeA = parseInt(bodyA.label.split('_')[1]);
      const typeB = parseInt(bodyB.label.split('_')[1]);
      
      // 如果两个水果类型相同，合并它们
      if (typeA === typeB) {
        const fruitA = fruitBodiesRef.current.find(f => f.body.id === bodyA.id);
        const fruitB = fruitBodiesRef.current.find(f => f.body.id === bodyB.id);
        
        if (fruitA && fruitB && !fruitA.isRemoved && !fruitB.isRemoved) {
          mergeFruits(fruitA, fruitB);
        }
      }
    }
  };
  
  // 合并水果
  const mergeFruits = (fruitA: Fruit, fruitB: Fruit) => {
    if (!worldRef.current) return;
    
    // 标记水果为已移除
    fruitA.isRemoved = true;
    fruitB.isRemoved = true;
    
    // 计算合并位置（两个水果的中点）
    const mergeX = (fruitA.body.position.x + fruitB.body.position.x) / 2;
    const mergeY = (fruitA.body.position.y + fruitB.body.position.y) / 2;
    
    // 从世界中移除两个水果
    Matter.Composite.remove(worldRef.current, fruitA.body);
    Matter.Composite.remove(worldRef.current, fruitB.body);
    
    // 从数组中移除
    fruitBodiesRef.current = fruitBodiesRef.current.filter(
      f => f.id !== fruitA.id && f.id !== fruitB.id
    );
    
    // 获取下一个水果类型
    const nextType = FRUIT_PROPERTIES[fruitA.type].nextType;
    
    // 如果有下一个类型，创建新的更大的水果
    if (nextType) {
      const newFruit = createFruit(nextType, mergeX, mergeY);
      console.log(`水果合并: ${fruitA.type} + ${fruitB.type} => ${nextType}`);
      
      // 增加分数
      setScore(prev => prev + nextType * 10);
      
      // 如果是西瓜，玩家获得更多分数
      if (nextType === FruitType.Watermelon) {
        setScore(prev => prev + 1000);
      }
    }
  };
  
  // 检查游戏是否结束
  const checkGameOver = () => {
    if (gameOver) return;
    
    const fruitBodies = fruitBodiesRef.current.filter(fruit => !fruit.isRemoved);
    
    // 检查是否有水果与游戏结束线接触
    if (boundaryRef.current) {
      for (const fruit of fruitBodies) {
        // 不使用Matter.Collision.collides，改用简单的位置检测
        const fruitY = fruit.body.position.y - FRUIT_PROPERTIES[fruit.type].radius;
        const gameOverY = 150; // 游戏结束线的位置
        
        if (fruitY <= gameOverY && !fruit.isDropping) {
          setGameOver(true);
          console.log("游戏结束！最终得分:", score);
          break;
        }
      }
    }
  };
  
  // 放置水果
  const dropFruit = (x: number) => {
    if (gameOver || !canDropRef.current || !nextFruitRef.current) return;
    
    // 防止连续快速点击
    canDropRef.current = false;
    setTimeout(() => {
      canDropRef.current = true;
    }, 500);
    
    const nextFruit = nextFruitRef.current;
    const props = FRUIT_PROPERTIES[nextFruit.type];
    
    // 限制x坐标在游戏区域内
    x = Math.max(props.radius + 10, Math.min(GAME_WIDTH - props.radius - 10, x));
    
    console.log(`放置水果: 类型=${nextFruit.type}, 位置=(${x}, 50)`);
    
    try {
      // 创建新水果并添加到游戏中
      const fruit = createFruit(nextFruit.type, x, 50);
      if (fruit && fruit.body) {
        // 直接给水果一个向下的初始速度
        Matter.Body.setVelocity(fruit.body, { x: 0, y: 5 });
        // 将水果设为可见
        if (fruit.body.render) {
          fruit.body.render.visible = true;
        }
        
        fruit.isDropping = true;
        
        // 500ms后水果不再处于掉落状态
        setTimeout(() => {
          if (fruit && fruitBodiesRef.current.find(f => f.id === fruit.id)) {
            fruit.isDropping = false;
          }
        }, 500);
        
        // 调试信息
        console.log(`水果已创建并添加到物理世界: ID=${fruit.id}`);
      } else {
        console.error("水果创建失败");
      }
    } catch (error) {
      console.error("放置水果时发生错误:", error);
    }
    
    // 创建下一个水果
    createNextFruit();
  };
  
  // 重置游戏
  const resetGame = () => {
    if (!worldRef.current || !engineRef.current) return;
    
    // 清除所有水果
    fruitBodiesRef.current.forEach(fruit => {
      Matter.Composite.remove(worldRef.current!, fruit.body);
    });
    
    fruitBodiesRef.current = [];
    
    // 重置游戏状态
    setScore(0);
    setGameOver(false);
    
    console.log("游戏已重置");
    
    // 创建新的水果
    createNextFruit();
  };
  
  return {
    containerRef,
    score,
    gameOver,
    nextFruitType,
    dropFruit,
    resetGame
  };
};

export default useGameEngine; 