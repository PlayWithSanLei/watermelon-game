const fs = require('fs');
const { createCanvas } = require('canvas');

// 创建一个西瓜logo
function createWatermelonLogo(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // 清除画布
  ctx.clearRect(0, 0, size, size);
  
  // 设置背景
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);
  
  // 绘制圆形底色
  const centerX = size / 2;
  const centerY = size / 2;
  const outerRadius = size * 0.45;
  
  // 绘制西瓜外壳
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
  ctx.closePath();
  
  // 创建绿色渐变
  const outerGradient = ctx.createRadialGradient(
    centerX, centerY, 0,
    centerX, centerY, outerRadius
  );
  outerGradient.addColorStop(0, '#23BF22');
  outerGradient.addColorStop(1, '#0F8510');
  ctx.fillStyle = outerGradient;
  ctx.fill();
  
  // 绘制条纹
  const stripesCount = 6;
  ctx.strokeStyle = '#0F8510';
  ctx.lineWidth = outerRadius * 0.08;
  
  for (let i = 0; i < stripesCount; i++) {
    const angle = (Math.PI / stripesCount) * i;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + outerRadius * Math.cos(angle),
      centerY + outerRadius * Math.sin(angle)
    );
    ctx.stroke();
  }
  
  // 绘制西瓜内部
  const innerRadius = outerRadius * 0.7;
  ctx.beginPath();
  ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fillStyle = '#FF6B6B';
  ctx.fill();
  
  // 绘制种子
  const seedsCount = 8;
  const seedRadius = outerRadius * 0.05;
  ctx.fillStyle = '#000000';
  
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
  
  // 返回数据URL
  return canvas.toBuffer('image/png');
}

// 生成不同尺寸的图标
const sizes = [16, 32, 64, 192, 512];

// 确保icons目录存在
if (!fs.existsSync('./icons')) {
  fs.mkdirSync('./icons');
}

// 生成favicon.ico (仅原始数据输出，需要另外处理)
const faviconBuffer = createWatermelonLogo(32);
fs.writeFileSync('./favicon.ico', faviconBuffer);
console.log('favicon.ico 已生成');

// 生成图标
sizes.forEach(size => {
  const buffer = createWatermelonLogo(size);
  fs.writeFileSync(`./icons/logo${size}.png`, buffer);
  console.log(`logo${size}.png 已生成`);
});

// 生成manifest中引用的图标
fs.writeFileSync('./logo192.png', createWatermelonLogo(192));
fs.writeFileSync('./logo512.png', createWatermelonLogo(512));
console.log('manifest 图标已生成'); 