# 合成大西瓜 (React版)

这是一个用React和Matter.js物理引擎开发的合成大西瓜游戏克隆版。

## 游戏规则

1. 点击屏幕顶部，水果会从该位置掉落
2. 当相同类型的水果碰撞时，它们会合并成更大的水果
3. 当水果堆积到特定高度（红线位置）时游戏结束
4. 尝试获得最高分！合成西瓜将获得巨额加分

## 技术栈

- React
- TypeScript
- Matter.js物理引擎

## 安装和运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start
```

打开浏览器访问 http://localhost:3000 即可开始游戏。

## 开发

游戏主要由以下组件构成：

1. `Game.tsx` - 游戏主组件
2. `useGameEngine.ts` - 包含游戏逻辑和物理引擎的钩子
3. `NextFruit.tsx` - 显示下一个水果的组件
4. `GameOver.tsx` - 游戏结束界面

## 许可

MIT 