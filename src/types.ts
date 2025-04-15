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
    nextType: FruitType.Strawberry
  },
  [FruitType.Strawberry]: {
    type: FruitType.Strawberry,
    radius: 25,
    color: '#FF624C',
    nextType: FruitType.Grape
  },
  [FruitType.Grape]: {
    type: FruitType.Grape,
    radius: 35,
    color: '#A969FF',
    nextType: FruitType.Dekopon
  },
  [FruitType.Dekopon]: {
    type: FruitType.Dekopon,
    radius: 45,
    color: '#FFAF02',
    nextType: FruitType.Orange
  },
  [FruitType.Orange]: {
    type: FruitType.Orange,
    radius: 55,
    color: '#FC8611',
    nextType: FruitType.Apple
  },
  [FruitType.Apple]: {
    type: FruitType.Apple,
    radius: 65,
    color: '#FC4F19',
    nextType: FruitType.Pear
  },
  [FruitType.Pear]: {
    type: FruitType.Pear,
    radius: 75,
    color: '#D3F159',
    nextType: FruitType.Peach
  },
  [FruitType.Peach]: {
    type: FruitType.Peach,
    radius: 85,
    color: '#FD99FF',
    nextType: FruitType.Pineapple
  },
  [FruitType.Pineapple]: {
    type: FruitType.Pineapple,
    radius: 95,
    color: '#FFD52E',
    nextType: FruitType.Melon
  },
  [FruitType.Melon]: {
    type: FruitType.Melon,
    radius: 105,
    color: '#97ED8A',
    nextType: FruitType.Watermelon
  },
  [FruitType.Watermelon]: {
    type: FruitType.Watermelon,
    radius: 120,
    color: '#23BF22',
    nextType: null
  }
}; 