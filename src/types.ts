// 水果类型枚举
export enum FruitType {
  Cherry = 1,      // 樱桃
  Strawberry = 2,  // 草莓
  Grape = 3,       // 葡萄
  Dekopon = 4,     // 丑橘
  Orange = 5,      // 橙子
  Apple = 6,       // 苹果
  Pear = 7,        // 梨
  Peach = 8,       // 桃子
  Pineapple = 9,   // 菠萝
  Melon = 10,      // 哈密瓜
  Watermelon = 11  // 西瓜
}

// 水果属性
export interface FruitProps {
  type: FruitType;
  radius: number;
  color: string;
  nextType: FruitType | null;
  borderColor: string;     // 外边框颜色
  pulpColor: string;       // 果肉颜色
  seedColor: string;       // 种子颜色
  hasSeedPattern: boolean; // 是否有种子图案
  hasStripes: boolean;     // 是否有条纹
  stripeColor?: string;    // 条纹颜色
  gradientColors?: string[]; // 渐变颜色
}

// 游戏中的水果对象
export interface Fruit {
  id: string;
  type: FruitType;
  body: Matter.Body;
  isDropping: boolean;
  isRemoved: boolean;
}

// 水果属性配置
export const FRUIT_PROPERTIES: Record<FruitType, FruitProps> = {
  [FruitType.Cherry]: {
    type: FruitType.Cherry,
    radius: 15,
    color: '#F20306',
    nextType: FruitType.Strawberry,
    borderColor: '#D00000',
    pulpColor: '#FF4D4D',
    seedColor: '#8B0000',
    hasSeedPattern: false,
    hasStripes: false,
    gradientColors: ['#F20306', '#D00000']
  },
  [FruitType.Strawberry]: {
    type: FruitType.Strawberry,
    radius: 25,
    color: '#FF624C',
    nextType: FruitType.Grape,
    borderColor: '#E30B5C',
    pulpColor: '#FF9999',
    seedColor: '#FFE135',
    hasSeedPattern: true,
    hasStripes: false,
    gradientColors: ['#FF624C', '#E30B5C']
  },
  [FruitType.Grape]: {
    type: FruitType.Grape,
    radius: 35,
    color: '#A969FF',
    nextType: FruitType.Dekopon,
    borderColor: '#7851A9',
    pulpColor: '#D7A9FF',
    seedColor: '#3A243B',
    hasSeedPattern: false,
    hasStripes: false,
    gradientColors: ['#A969FF', '#7851A9']
  },
  [FruitType.Dekopon]: {
    type: FruitType.Dekopon,
    radius: 45,
    color: '#FFAF02',
    nextType: FruitType.Orange,
    borderColor: '#E69500',
    pulpColor: '#FFCC66',
    seedColor: '#8B4513',
    hasSeedPattern: true,
    hasStripes: false,
    gradientColors: ['#FFAF02', '#E69500']
  },
  [FruitType.Orange]: {
    type: FruitType.Orange,
    radius: 55,
    color: '#FC8611',
    nextType: FruitType.Apple,
    borderColor: '#D66A00',
    pulpColor: '#FFA64D',
    seedColor: '#4A2700',
    hasSeedPattern: true,
    hasStripes: false,
    gradientColors: ['#FC8611', '#D66A00']
  },
  [FruitType.Apple]: {
    type: FruitType.Apple,
    radius: 65,
    color: '#FC4F19',
    nextType: FruitType.Pear,
    borderColor: '#D12D00',
    pulpColor: '#FFB59A',
    seedColor: '#301E1A',
    hasSeedPattern: false,
    hasStripes: false,
    gradientColors: ['#FC4F19', '#D12D00']
  },
  [FruitType.Pear]: {
    type: FruitType.Pear,
    radius: 75,
    color: '#D3F159',
    nextType: FruitType.Peach,
    borderColor: '#A6BF33',
    pulpColor: '#E0F7A0',
    seedColor: '#5E6300',
    hasSeedPattern: false,
    hasStripes: false,
    gradientColors: ['#D3F159', '#A6BF33']
  },
  [FruitType.Peach]: {
    type: FruitType.Peach,
    radius: 85,
    color: '#FD99FF',
    nextType: FruitType.Pineapple,
    borderColor: '#D467D6',
    pulpColor: '#FECCFF',
    seedColor: '#802680',
    hasSeedPattern: false,
    hasStripes: false,
    gradientColors: ['#FD99FF', '#D467D6']
  },
  [FruitType.Pineapple]: {
    type: FruitType.Pineapple,
    radius: 95,
    color: '#FFD52E',
    nextType: FruitType.Melon,
    borderColor: '#D4AF00',
    pulpColor: '#FFECA0',
    seedColor: '#7A6200',
    hasSeedPattern: true,
    hasStripes: true,
    stripeColor: '#E6B800',
    gradientColors: ['#FFD52E', '#D4AF00']
  },
  [FruitType.Melon]: {
    type: FruitType.Melon,
    radius: 105,
    color: '#97ED8A',
    nextType: FruitType.Watermelon,
    borderColor: '#59C248',
    pulpColor: '#C9FFB9',
    seedColor: '#2A5F21',
    hasSeedPattern: true,
    hasStripes: true,
    stripeColor: '#59C248',
    gradientColors: ['#97ED8A', '#59C248']
  },
  [FruitType.Watermelon]: {
    type: FruitType.Watermelon,
    radius: 120,
    color: '#23BF22',
    nextType: null,
    borderColor: '#0F8510',
    pulpColor: '#FF6B6B',
    seedColor: '#000000',
    hasSeedPattern: true,
    hasStripes: true,
    stripeColor: '#0F8510',
    gradientColors: ['#23BF22', '#0F8510']
  }
}; 