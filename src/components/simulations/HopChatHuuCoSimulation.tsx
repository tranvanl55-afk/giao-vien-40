import React, { useState, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RefreshCw, Hexagon, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface HopChatHuuCoSimulationProps {
  onBack: () => void;
}

type Compound = 'methane' | 'ethylene' | 'acetylene' | 'ethanol' | 'acetic-acid' | 'benzene' | 'glucose' | 'tinh-bot' | 'cellulose' | 'chat-beo' | 'protein';

interface Atom3D {
  id: string;
  type: 'C' | 'H' | 'O' | 'N' | 'R';
  pos: [number, number, number];
}

interface Bond3DData {
  from: string;
  to: string;
  type: number; // 1: single, 2: double, 3: triple
}

interface IsomerData {
  name: string;
  formula: string;
  type: string;
  info: string;
  atoms: Atom3D[];
  bonds: Bond3DData[];
}

interface CompoundData {
  name: string;
  formula: string;
  type: string;
  info: string;
  atoms: Atom3D[];
  bonds: Bond3DData[];
  isomers?: IsomerData[];
}

const COMPOUNDS: Record<Compound, CompoundData> = {
  methane: {
    name: 'Methane',
    formula: 'CH_4',
    type: 'Ankan',
    info: 'Là ankan đơn giản nhất, thành phần chính của khí thiên nhiên và khí sinh học (biogas). Có cấu trúc hình tứ diện đều.',
    atoms: [
      { id: 'c1', type: 'C', pos: [0, 0, 0] },
      { id: 'h1', type: 'H', pos: [0, 0, 1.5] },
      { id: 'h2', type: 'H', pos: [1.41, 0, -0.5] },
      { id: 'h3', type: 'H', pos: [-0.7, 1.22, -0.5] },
      { id: 'h4', type: 'H', pos: [-0.7, -1.22, -0.5] },
    ],
    bonds: [
      { from: 'c1', to: 'h1', type: 1 },
      { from: 'c1', to: 'h2', type: 1 },
      { from: 'c1', to: 'h3', type: 1 },
      { from: 'c1', to: 'h4', type: 1 },
    ],
  },
  ethylene: {
    name: 'Ethene',
    formula: 'C_2H_4',
    type: 'Anken',
    info: 'Có chứa một liên kết đôi trong phân tử. Là chất khí kích thích trái cây mau chín, nguyên liệu quan trọng bậc nhất của ngành công nghiệp hóa chất (sản xuất nhựa PE).',
    atoms: [
      { id: 'c1', type: 'C', pos: [-1.0, 0, 0] },
      { id: 'c2', type: 'C', pos: [1.0, 0, 0] },
      { id: 'h1', type: 'H', pos: [-1.8, 1.0, 0] },
      { id: 'h2', type: 'H', pos: [-1.8, -1.0, 0] },
      { id: 'h3', type: 'H', pos: [1.8, 1.0, 0] },
      { id: 'h4', type: 'H', pos: [1.8, -1.0, 0] },
    ],
    bonds: [
      { from: 'c1', to: 'c2', type: 2 },
      { from: 'c1', to: 'h1', type: 1 },
      { from: 'c1', to: 'h2', type: 1 },
      { from: 'c2', to: 'h3', type: 1 },
      { from: 'c2', to: 'h4', type: 1 },
    ],
  },
  acetylene: {
    name: 'Ethyne',
    formula: 'C_2H_2',
    type: 'Ankin',
    info: 'Có liên kết ba đầu mạch kém bền dễ phản ứng. Được sử dụng làm nhiên liệu cho đèn xì oxy-acetylen để hàn, cắt kim loại và làm nguyên liệu tổng hợp hữu cơ.',
    atoms: [
      { id: 'c1', type: 'C', pos: [-1.0, 0, 0] },
      { id: 'c2', type: 'C', pos: [1.0, 0, 0] },
      { id: 'h1', type: 'H', pos: [-2.2, 0, 0] },
      { id: 'h2', type: 'H', pos: [2.2, 0, 0] },
    ],
    bonds: [
      { from: 'c1', to: 'c2', type: 3 },
      { from: 'c1', to: 'h1', type: 1 },
      { from: 'c2', to: 'h2', type: 1 },
    ],
  },
  ethanol: {
    name: 'Ethanol',
    formula: 'C_2H_5OH',
    type: 'Ancol',
    info: 'Hay còn gọi là cồn, rượu etylic. Chứa nhóm chức hydroxyl (-OH) phân cực. Dùng làm dung môi, nhiên liệu sinh học, sản xuất đồ uống và chất sát trùng y tế.',
    atoms: [
      { id: 'c1', type: 'C', pos: [-1.2, -0.2, 0] },
      { id: 'c2', type: 'C', pos: [0.3, 0.3, 0] },
      { id: 'o1', type: 'O', pos: [1.3, -0.7, 0] },
      { id: 'h1', type: 'H', pos: [-1.2, -1.3, 0] },
      { id: 'h2', type: 'H', pos: [-1.8, 0.3, 0.86] },
      { id: 'h3', type: 'H', pos: [-1.8, 0.3, -0.86] },
      { id: 'h4', type: 'H', pos: [0.3, 1.0, 0.86] },
      { id: 'h5', type: 'H', pos: [0.3, 1.0, -0.86] },
      { id: 'h6', type: 'H', pos: [2.2, -0.3, 0] },
    ],
    bonds: [
      { from: 'c1', to: 'c2', type: 1 },
      { from: 'c1', to: 'h1', type: 1 },
      { from: 'c1', to: 'h2', type: 1 },
      { from: 'c1', to: 'h3', type: 1 },
      { from: 'c2', to: 'h4', type: 1 },
      { from: 'c2', to: 'h5', type: 1 },
      { from: 'c2', to: 'o1', type: 1 },
      { from: 'o1', to: 'h6', type: 1 },
    ],
    isomers: [
      {
        name: 'Methoxymethane',
        formula: 'CH_3OCH_3',
        type: 'Ete',
        info: 'Là đồng phân nhóm chức của ethanol. Ở điều kiện thường là một chất khí gây mê, không màu, dễ cháy, được sử dụng phổ biến làm chất đẩy trong bình xịt và chất làm lạnh.',
        atoms: [
          { id: 'o1', type: 'O', pos: [0, 0.4, 0] },
          { id: 'c1', type: 'C', pos: [-1.2, -0.2, 0] },
          { id: 'c2', type: 'C', pos: [1.2, -0.2, 0] },
          { id: 'h1', type: 'H', pos: [-1.2, -1.3, 0] },
          { id: 'h2', type: 'H', pos: [-1.8, 0.2, 0.86] },
          { id: 'h3', type: 'H', pos: [-1.8, 0.2, -0.86] },
          { id: 'h4', type: 'H', pos: [1.2, -1.3, 0] },
          { id: 'h5', type: 'H', pos: [1.8, 0.2, 0.86] },
          { id: 'h6', type: 'H', pos: [1.8, 0.2, -0.86] },
        ],
        bonds: [
          { from: 'o1', to: 'c1', type: 1 },
          { from: 'o1', to: 'c2', type: 1 },
          { from: 'c1', to: 'h1', type: 1 },
          { from: 'c1', to: 'h2', type: 1 },
          { from: 'c1', to: 'h3', type: 1 },
          { from: 'c2', to: 'h4', type: 1 },
          { from: 'c2', to: 'h5', type: 1 },
          { from: 'c2', to: 'h6', type: 1 },
        ],
      }
    ],
  },
  'acetic-acid': {
    name: 'Ethanoic Acid',
    formula: 'CH_3COOH',
    type: 'Axit Carboxylic',
    info: 'Axit hữu cơ yếu, có trong giấm ăn (khoảng 2-5%). Phân tử chứa nhóm chức cacboxyl (-COOH) có khả năng làm quỳ tím chuyển sang màu đỏ nhạt.',
    atoms: [
      { id: 'c1', type: 'C', pos: [-1.2, -0.2, 0] },
      { id: 'c2', type: 'C', pos: [0.3, 0.3, 0] },
      { id: 'o1', type: 'O', pos: [0.6, 1.5, 0] },
      { id: 'o2', type: 'O', pos: [1.2, -0.7, 0] },
      { id: 'h1', type: 'H', pos: [-1.2, -1.3, 0] },
      { id: 'h2', type: 'H', pos: [-1.8, 0.3, 0.86] },
      { id: 'h3', type: 'H', pos: [-1.8, 0.3, -0.86] },
      { id: 'h4', type: 'H', pos: [2.1, -0.3, 0] },
    ],
    bonds: [
      { from: 'c1', to: 'c2', type: 1 },
      { from: 'c1', to: 'h1', type: 1 },
      { from: 'c1', to: 'h2', type: 1 },
      { from: 'c1', to: 'h3', type: 1 },
      { from: 'c2', to: 'o1', type: 2 },
      { from: 'c2', to: 'o2', type: 1 },
      { from: 'o2', to: 'h4', type: 1 },
    ],
    isomers: [
      {
        name: 'Methyl methanoate',
        formula: 'HCOOCH_3',
        type: 'Este',
        info: 'Là đồng phân este của axit axetic. Đây là este đơn giản nhất, tồn tại dưới dạng chất lỏng không màu, có mùi dễ chịu và bay hơi nhanh ở nhiệt độ phòng. Thường dùng làm dung môi hữu cơ.',
        atoms: [
          { id: 'c1', type: 'C', pos: [-0.6, 0.5, 0] },
          { id: 'o1', type: 'O', pos: [-0.6, 1.7, 0] },
          { id: 'o2', type: 'O', pos: [0.6, -0.1, 0] },
          { id: 'c2', type: 'C', pos: [1.8, 0.5, 0] },
          { id: 'h1', type: 'H', pos: [-1.5, -0.1, 0] },
          { id: 'h2', type: 'H', pos: [1.8, 1.6, 0] },
          { id: 'h3', type: 'H', pos: [2.4, 0.0, 0.86] },
          { id: 'h4', type: 'H', pos: [2.4, 0.0, -0.86] },
        ],
        bonds: [
          { from: 'c1', to: 'o1', type: 2 },
          { from: 'c1', to: 'o2', type: 1 },
          { from: 'c1', to: 'h1', type: 1 },
          { from: 'o2', to: 'c2', type: 1 },
          { from: 'c2', to: 'h2', type: 1 },
          { from: 'c2', to: 'h3', type: 1 },
          { from: 'c2', to: 'h4', type: 1 },
        ],
      }
    ],
  },
  benzene: {
    name: 'Benzene',
    formula: 'C_6H_6',
    type: 'Hydrocarbon thơm',
    info: 'Hydrocarbon thơm đơn giản nhất. Cấu trúc vòng lục giác đều phẳng với các liên kết đơn và đôi luân phiên tạo nên hệ liên hợp bền vững đặc biệt.',
    atoms: [
      { id: 'c1', type: 'C', pos: [1.4, 0, 0] },
      { id: 'c2', type: 'C', pos: [0.7, 1.21, 0] },
      { id: 'c3', type: 'C', pos: [-0.7, 1.21, 0] },
      { id: 'c4', type: 'C', pos: [-1.4, 0, 0] },
      { id: 'c5', type: 'C', pos: [-0.7, -1.21, 0] },
      { id: 'c6', type: 'C', pos: [0.7, -1.21, 0] },
      { id: 'h1', type: 'H', pos: [2.5, 0, 0] },
      { id: 'h2', type: 'H', pos: [1.25, 2.16, 0] },
      { id: 'h3', type: 'H', pos: [-1.25, 2.16, 0] },
      { id: 'h4', type: 'H', pos: [-2.5, 0, 0] },
      { id: 'h5', type: 'H', pos: [-1.25, -2.16, 0] },
      { id: 'h6', type: 'H', pos: [1.25, -2.16, 0] },
    ],
    bonds: [
      { from: 'c1', to: 'c2', type: 2 },
      { from: 'c2', to: 'c3', type: 1 },
      { from: 'c3', to: 'c4', type: 2 },
      { from: 'c4', to: 'c5', type: 1 },
      { from: 'c5', to: 'c6', type: 2 },
      { from: 'c6', to: 'c1', type: 1 },
      { from: 'c1', to: 'h1', type: 1 },
      { from: 'c2', to: 'h2', type: 1 },
      { from: 'c3', to: 'h3', type: 1 },
      { from: 'c4', to: 'h4', type: 1 },
      { from: 'c5', to: 'h5', type: 1 },
      { from: 'c6', to: 'h6', type: 1 },
    ],
  },
  glucose: {
    name: 'Glucose',
    formula: 'C_6H_{12}O_6',
    type: 'Cacbohiđrat',
    info: 'Đường đơn phân cực, có nhiều trong quả chín (đặc biệt là nho). Đóng vai trò là nguồn năng lượng sinh học chính và trực tiếp cho mọi tế bào sống.',
    atoms: [
      { id: 'o1', type: 'O', pos: [0.7, 1.2, -0.2] },
      { id: 'c1', type: 'C', pos: [1.3, 0, 0] },
      { id: 'c2', type: 'C', pos: [0.5, -1.2, 0.1] },
      { id: 'c3', type: 'C', pos: [-0.9, -1.0, -0.1] },
      { id: 'c4', type: 'C', pos: [-1.4, 0.4, 0.1] },
      { id: 'c5', type: 'C', pos: [-0.6, 1.4, -0.1] },
      { id: 'c6', type: 'C', pos: [-1.2, 2.7, 0.1] },
      { id: 'o2', type: 'O', pos: [2.6, 0.2, -0.2] },
      { id: 'o3', type: 'O', pos: [1.1, -2.3, -0.4] },
      { id: 'o4', type: 'O', pos: [-1.6, -2.1, 0.4] },
      { id: 'o5', type: 'O', pos: [-2.7, 0.2, -0.3] },
      { id: 'o6', type: 'O', pos: [-0.4, 3.8, -0.2] },
      { id: 'h1', type: 'H', pos: [1.4, -0.2, 1.1] },
      { id: 'h2', type: 'H', pos: [0.4, -1.0, 1.2] },
      { id: 'h3', type: 'H', pos: [-0.8, -0.8, -1.2] },
      { id: 'h4', type: 'H', pos: [-1.3, 0.5, 1.2] },
      { id: 'h5', type: 'H', pos: [-0.6, 1.3, -1.2] },
      { id: 'h6', type: 'H', pos: [-2.2, 2.6, -0.2] },
      { id: 'h7', type: 'H', pos: [-1.3, 2.8, 1.2] },
      { id: 'h8', type: 'H', pos: [3.0, -0.6, -0.1] },
      { id: 'h9', type: 'H', pos: [0.6, -3.1, -0.2] },
      { id: 'h10', type: 'H', pos: [-1.2, -2.9, 0.2] },
      { id: 'h11', type: 'H', pos: [-3.1, -0.6, -0.1] },
      { id: 'h12', type: 'H', pos: [-0.8, 4.6, 0.0] },
    ],
    bonds: [
      { from: 'o1', to: 'c1', type: 1 },
      { from: 'c1', to: 'c2', type: 1 },
      { from: 'c2', to: 'c3', type: 1 },
      { from: 'c3', to: 'c4', type: 1 },
      { from: 'c4', to: 'c5', type: 1 },
      { from: 'c5', to: 'o1', type: 1 },
      { from: 'c5', to: 'c6', type: 1 },
      { from: 'c1', to: 'o2', type: 1 },
      { from: 'c2', to: 'o3', type: 1 },
      { from: 'c3', to: 'o4', type: 1 },
      { from: 'c4', to: 'o5', type: 1 },
      { from: 'c6', to: 'o6', type: 1 },
      { from: 'o2', to: 'h8', type: 1 },
      { from: 'o3', to: 'h9', type: 1 },
      { from: 'o4', to: 'h10', type: 1 },
      { from: 'o5', to: 'h11', type: 1 },
      { from: 'o6', to: 'h12', type: 1 },
      { from: 'c1', to: 'h1', type: 1 },
      { from: 'c2', to: 'h2', type: 1 },
      { from: 'c3', to: 'h3', type: 1 },
      { from: 'c4', to: 'h4', type: 1 },
      { from: 'c5', to: 'h5', type: 1 },
      { from: 'c6', to: 'h6', type: 1 },
      { from: 'c6', to: 'h7', type: 1 },
    ],
    isomers: [
      {
        name: 'Fructose',
        formula: 'C_6H_{12}O_6',
        type: 'Cacbohiđrat (Ketozo)',
        info: 'Là đồng phân xeton của glucose. Có nhiều trong mật ong và các quả ngọt chín cây. Khác với cấu trúc vòng 6 cạnh của glucose, fructozơ trong dung dịch ưu tiên tạo vòng 5 cạnh.',
        atoms: [
          { id: 'o1', type: 'O', pos: [0, 1.1, -0.2] },
          { id: 'c2', type: 'C', pos: [1.1, 0.3, 0.1] },
          { id: 'c3', type: 'C', pos: [0.7, -1.1, -0.1] },
          { id: 'c4', type: 'C', pos: [-0.7, -1.1, 0.1] },
          { id: 'c5', type: 'C', pos: [-1.1, 0.3, -0.1] },
          { id: 'c1', type: 'C', pos: [2.4, 0.8, -0.3] },
          { id: 'c6', type: 'C', pos: [-2.4, 0.8, 0.3] },
          { id: 'o2', type: 'O', pos: [3.3, -0.2, 0.2] },
          { id: 'o3', type: 'O', pos: [1.2, 0.5, 1.4] },
          { id: 'o4', type: 'O', pos: [1.5, -2.1, 0.3] },
          { id: 'o5', type: 'O', pos: [-1.5, -2.1, -0.3] },
          { id: 'o6', type: 'O', pos: [-3.3, -0.2, -0.2] },
          { id: 'h1', type: 'H', pos: [2.5, 1.8, 0] },
          { id: 'h2', type: 'H', pos: [2.6, 0.7, -1.3] },
          { id: 'h3', type: 'H', pos: [0.8, -1.1, -1.2] },
          { id: 'h4', type: 'H', pos: [-0.8, -1.1, 1.2] },
          { id: 'h5', type: 'H', pos: [-1.1, 0.3, -1.2] },
          { id: 'h6', type: 'H', pos: [-2.5, 1.8, 0] },
          { id: 'h7', type: 'H', pos: [-2.6, 0.7, 1.3] },
          { id: 'h8', type: 'H', pos: [4.1, 0.1, 0] },
          { id: 'h9', type: 'H', pos: [0.6, 0.8, 1.9] },
          { id: 'h10', type: 'H', pos: [2.3, -2.4, 0] },
          { id: 'h11', type: 'H', pos: [-2.3, -2.4, 0] },
          { id: 'h12', type: 'H', pos: [-4.1, 0.1, 0] },
        ],
        bonds: [
          { from: 'o1', to: 'c2', type: 1 },
          { from: 'c2', to: 'c3', type: 1 },
          { from: 'c3', to: 'c4', type: 1 },
          { from: 'c4', to: 'c5', type: 1 },
          { from: 'c5', to: 'o1', type: 1 },
          { from: 'c2', to: 'c1', type: 1 },
          { from: 'c5', to: 'c6', type: 1 },
          { from: 'c1', to: 'o2', type: 1 },
          { from: 'c2', to: 'o3', type: 1 },
          { from: 'c3', to: 'o4', type: 1 },
          { from: 'c4', to: 'o5', type: 1 },
          { from: 'c6', to: 'o6', type: 1 },
          { from: 'o2', to: 'h8', type: 1 },
          { from: 'o3', to: 'h9', type: 1 },
          { from: 'o4', to: 'h10', type: 1 },
          { from: 'o5', to: 'h11', type: 1 },
          { from: 'o6', to: 'h12', type: 1 },
          { from: 'c1', to: 'h1', type: 1 },
          { from: 'c1', to: 'h2', type: 1 },
          { from: 'c3', to: 'h3', type: 1 },
          { from: 'c4', to: 'h4', type: 1 },
          { from: 'c5', to: 'h5', type: 1 },
          { from: 'c6', to: 'h6', type: 1 },
          { from: 'c6', to: 'h7', type: 1 },
        ],
      }
    ],
  },
  'tinh-bot': {
    name: 'Starch / Amylose',
    formula: '(C_6H_{10}O_5)_n',
    type: 'Polisaccarit',
    info: 'Polyme sinh học cấu thành từ nhiều mắt xích α-glucose liên kết với nhau bằng liên kết α-1,4-glycosidic tạo cấu hình mạch xoắn hoặc phân nhánh.',
    atoms: [
      { id: 'r1_c4', type: 'C', pos: [-3.0, 0, 0] },
      { id: 'r1_c3', type: 'C', pos: [-2.4, -0.6, 0.2] },
      { id: 'r1_c2', type: 'C', pos: [-1.4, -0.4, -0.2] },
      { id: 'r1_c1', type: 'C', pos: [-1.0, 0.4, 0.1] },
      { id: 'r1_o5', type: 'O', pos: [-1.6, 1.2, -0.1] },
      { id: 'r1_c5', type: 'C', pos: [-2.6, 1.0, 0.2] },
      { id: 'l1', type: 'O', pos: [-0.2, -0.3, 0] },
      { id: 'r2_c4', type: 'C', pos: [0.6, 0, 0] },
      { id: 'r2_c3', type: 'C', pos: [1.2, -0.6, 0.2] },
      { id: 'r2_c2', type: 'C', pos: [2.2, -0.4, -0.2] },
      { id: 'r2_c1', type: 'C', pos: [2.6, 0.4, 0.1] },
      { id: 'r2_o5', type: 'O', pos: [2.0, 1.2, -0.1] },
      { id: 'r2_c5', type: 'C', pos: [1.0, 1.0, 0.2] },
      { id: 'l2', type: 'O', pos: [3.4, -0.3, 0] },
      { id: 'r3_c4', type: 'C', pos: [4.2, 0, 0] },
      { id: 'r3_c3', type: 'C', pos: [4.8, -0.6, 0.2] },
      { id: 'r3_c2', type: 'C', pos: [5.8, -0.4, -0.2] },
      { id: 'r3_c1', type: 'C', pos: [6.2, 0.4, 0.1] },
      { id: 'r3_o5', type: 'O', pos: [5.6, 1.2, -0.1] },
      { id: 'r3_c5', type: 'C', pos: [4.6, 1.0, 0.2] },
    ],
    bonds: [
      { from: 'r1_c4', to: 'r1_c3', type: 1 },
      { from: 'r1_c3', to: 'r1_c2', type: 1 },
      { from: 'r1_c2', to: 'r1_c1', type: 1 },
      { from: 'r1_c1', to: 'r1_o5', type: 1 },
      { from: 'r1_o5', to: 'r1_c5', type: 1 },
      { from: 'r1_c5', to: 'r1_c4', type: 1 },
      { from: 'r1_c1', to: 'l1', type: 1 },
      { from: 'l1', to: 'r2_c4', type: 1 },
      { from: 'r2_c4', to: 'r2_c3', type: 1 },
      { from: 'r2_c3', to: 'r2_c2', type: 1 },
      { from: 'r2_c2', to: 'r2_c1', type: 1 },
      { from: 'r2_c1', to: 'r2_o5', type: 1 },
      { from: 'r2_o5', to: 'r2_c5', type: 1 },
      { from: 'r2_c5', to: 'r2_c4', type: 1 },
      { from: 'r2_c1', to: 'l2', type: 1 },
      { from: 'l2', to: 'r3_c4', type: 1 },
      { from: 'r3_c4', to: 'r3_c3', type: 1 },
      { from: 'r3_c3', to: 'r3_c2', type: 1 },
      { from: 'r3_c2', to: 'r3_c1', type: 1 },
      { from: 'r3_c1', to: 'r3_o5', type: 1 },
      { from: 'r3_o5', to: 'r3_c5', type: 1 },
      { from: 'r3_c5', to: 'r3_c4', type: 1 },
    ],
  },
  cellulose: {
    name: 'Cellulose',
    formula: '(C_6H_{10}O_5)_n',
    type: 'Polisaccarit',
    info: 'Polyme sinh học mạch thẳng dài không phân nhánh cấu tạo từ các mắt xích β-glucose qua liên kết β-1,4-glycosidic. Là thành phần chính tạo nên vách tế bào thực vật.',
    atoms: [
      { id: 'r1_c4', type: 'C', pos: [-3.0, 0, 0] },
      { id: 'r1_c3', type: 'C', pos: [-2.4, -0.6, 0.2] },
      { id: 'r1_c2', type: 'C', pos: [-1.4, -0.4, -0.2] },
      { id: 'r1_c1', type: 'C', pos: [-1.0, 0.4, 0.1] },
      { id: 'r1_o5', type: 'O', pos: [-1.6, 1.2, -0.1] },
      { id: 'r1_c5', type: 'C', pos: [-2.6, 1.0, 0.2] },
      { id: 'l1', type: 'O', pos: [-0.2, 0.4, 0] },
      { id: 'r2_c4', type: 'C', pos: [0.6, 0, 0] },
      { id: 'r2_c3', type: 'C', pos: [1.2, -0.6, 0.2] },
      { id: 'r2_c2', type: 'C', pos: [2.2, -0.4, -0.2] },
      { id: 'r2_c1', type: 'C', pos: [2.6, 0.4, 0.1] },
      { id: 'r2_o5', type: 'O', pos: [2.0, 1.2, -0.1] },
      { id: 'r2_c5', type: 'C', pos: [1.0, 1.0, 0.2] },
      { id: 'l2', type: 'O', pos: [3.4, 0.4, 0] },
      { id: 'r3_c4', type: 'C', pos: [4.2, 0, 0] },
      { id: 'r3_c3', type: 'C', pos: [4.8, -0.6, 0.2] },
      { id: 'r3_c2', type: 'C', pos: [5.8, -0.4, -0.2] },
      { id: 'r3_c1', type: 'C', pos: [6.2, 0.4, 0.1] },
      { id: 'r3_o5', type: 'O', pos: [5.6, 1.2, -0.1] },
      { id: 'r3_c5', type: 'C', pos: [4.6, 1.0, 0.2] },
    ],
    bonds: [
      { from: 'r1_c4', to: 'r1_c3', type: 1 },
      { from: 'r1_c3', to: 'r1_c2', type: 1 },
      { from: 'r1_c2', to: 'r1_c1', type: 1 },
      { from: 'r1_c1', to: 'r1_o5', type: 1 },
      { from: 'r1_o5', to: 'r1_c5', type: 1 },
      { from: 'r1_c5', to: 'r1_c4', type: 1 },
      { from: 'r1_c1', to: 'l1', type: 1 },
      { from: 'l1', to: 'r2_c4', type: 1 },
      { from: 'r2_c4', to: 'r2_c3', type: 1 },
      { from: 'r2_c3', to: 'r2_c2', type: 1 },
      { from: 'r2_c2', to: 'r2_c1', type: 1 },
      { from: 'r2_c1', to: 'r2_o5', type: 1 },
      { from: 'r2_o5', to: 'r2_c5', type: 1 },
      { from: 'r2_c5', to: 'r2_c4', type: 1 },
      { from: 'r2_c1', to: 'l2', type: 1 },
      { from: 'l2', to: 'r3_c4', type: 1 },
      { from: 'r3_c4', to: 'r3_c3', type: 1 },
      { from: 'r3_c3', to: 'r3_c2', type: 1 },
      { from: 'r3_c2', to: 'r3_c1', type: 1 },
      { from: 'r3_c1', to: 'r3_o5', type: 1 },
      { from: 'r3_o5', to: 'r3_c5', type: 1 },
      { from: 'r3_c5', to: 'r3_c4', type: 1 },
    ],
  },
  'chat-beo': {
    name: 'Triglyceride',
    formula: '(R-COO)_3C_3H_5',
    type: 'Lipit (Triglyceride)',
    info: 'Trieste của glixerol với các axit béo, là nguồn dự trữ năng lượng sinh học quan trọng bậc nhất của tế bào.',
    atoms: [
      { id: 'g1', type: 'C', pos: [-1.5, 1.0, 0] },
      { id: 'g2', type: 'C', pos: [-1.5, 0, 0] },
      { id: 'g3', type: 'C', pos: [-1.5, -1.0, 0] },
      { id: 'o1', type: 'O', pos: [-0.5, 1.0, 0] },
      { id: 'o2', type: 'O', pos: [-0.5, 0, 0] },
      { id: 'o3', type: 'O', pos: [-0.5, -1.0, 0] },
      { id: 'c1', type: 'C', pos: [0.5, 1.0, 0] },
      { id: 'c2', type: 'C', pos: [0.5, 0, 0] },
      { id: 'c3', type: 'C', pos: [0.5, -1.0, 0] },
      { id: 'do1', type: 'O', pos: [0.5, 1.8, 0] },
      { id: 'do2', type: 'O', pos: [0.5, 0.8, 0] },
      { id: 'do3', type: 'O', pos: [0.5, -1.8, 0] },
      { id: 'r1_1', type: 'C', pos: [1.5, 0.8, 0.3] },
      { id: 'r1_2', type: 'R', pos: [2.5, 1.0, -0.3] },
      { id: 'r2_1', type: 'C', pos: [1.5, -0.2, 0.3] },
      { id: 'r2_2', type: 'R', pos: [2.5, 0, -0.3] },
      { id: 'r3_1', type: 'C', pos: [1.5, -1.2, 0.3] },
      { id: 'r3_2', type: 'R', pos: [2.5, -1.0, -0.3] },
    ],
    bonds: [
      { from: 'g1', to: 'g2', type: 1 },
      { from: 'g2', to: 'g3', type: 1 },
      { from: 'g1', to: 'o1', type: 1 },
      { from: 'g2', to: 'o2', type: 1 },
      { from: 'g3', to: 'o3', type: 1 },
      { from: 'o1', to: 'c1', type: 1 },
      { from: 'o2', to: 'c2', type: 1 },
      { from: 'o3', to: 'c3', type: 1 },
      { from: 'c1', to: 'do1', type: 2 },
      { from: 'c2', to: 'do2', type: 2 },
      { from: 'c3', to: 'do3', type: 2 },
      { from: 'c1', to: 'r1_1', type: 1 },
      { from: 'r1_1', to: 'r1_2', type: 1 },
      { from: 'c2', to: 'r2_1', type: 1 },
      { from: 'r2_1', to: 'r2_2', type: 1 },
      { from: 'c3', to: 'r3_1', type: 1 },
      { from: 'r3_1', to: 'r3_2', type: 1 },
    ],
  },
  protein: {
    name: 'Protein',
    formula: '(-NH-CHR-CO-)_n',
    type: 'Polyme sinh học',
    info: 'Polyme sinh học mạch dài cấu tạo từ các gốc α-amino acid liên kết với nhau bằng liên kết peptit (-CO-NH-). Đóng vai trò kiến tạo và điều hòa hoạt động sống.',
    atoms: [
      { id: 'n1', type: 'N', pos: [-3.0, 0, 0] },
      { id: 'h1', type: 'H', pos: [-3.0, -0.8, 0] },
      { id: 'ca1', type: 'C', pos: [-1.8, 0.5, 0] },
      { id: 'r1', type: 'R', pos: [-1.8, 1.5, 0] },
      { id: 'c1', type: 'C', pos: [-0.6, -0.2, 0] },
      { id: 'o1', type: 'O', pos: [-0.6, -1.2, 0] },
      { id: 'n2', type: 'N', pos: [0.6, 0.3, 0] },
      { id: 'h2', type: 'H', pos: [0.6, 1.1, 0] },
      { id: 'ca2', type: 'C', pos: [1.8, -0.5, 0] },
      { id: 'r2', type: 'R', pos: [1.8, -1.5, 0] },
      { id: 'c2', type: 'C', pos: [3.0, 0.2, 0] },
      { id: 'o2', type: 'O', pos: [3.0, 1.2, 0] },
      { id: 'n3', type: 'N', pos: [4.0, -0.3, 0] },
      { id: 'h3', type: 'H', pos: [4.0, -1.1, 0] },
    ],
    bonds: [
      { from: 'n1', to: 'h1', type: 1 },
      { from: 'n1', to: 'ca1', type: 1 },
      { from: 'ca1', to: 'r1', type: 1 },
      { from: 'ca1', to: 'c1', type: 1 },
      { from: 'c1', to: 'o1', type: 2 },
      { from: 'c1', to: 'n2', type: 1 },
      { from: 'n2', to: 'h2', type: 1 },
      { from: 'n2', to: 'ca2', type: 1 },
      { from: 'ca2', to: 'r2', type: 1 },
      { from: 'ca2', to: 'c2', type: 1 },
      { from: 'c2', to: 'o2', type: 2 },
      { from: 'c2', to: 'n3', type: 1 },
      { from: 'n3', to: 'h3', type: 1 },
    ],
  },
};

const ATOM_COLORS: Record<string, string> = {
  C: '#374151', // slate-700
  H: '#f8fafc', // slate-50
  O: '#ef4444', // red-500
  N: '#3b82f6', // blue-500
  R: '#10b981', // emerald-500
};

const FORMULA_TEXTS: Record<Compound, string> = {
  methane: 'CH₄',
  ethylene: 'C₂H₄',
  acetylene: 'C₂H₂',
  ethanol: 'C₂H₅OH',
  'acetic-acid': 'CH₃COOH',
  benzene: 'C₆H₆',
  glucose: 'C₆H₁₂O₆',
  'tinh-bot': '(C₆H₁₀O₅)ₙ',
  cellulose: '(C₆H₁₀O₅)ₙ',
  'chat-beo': '(R-COO)₃C₃H₅',
  protein: '(-NH-CHR-CO-)ₙ',
};

const getCompoundScale = (comp: Compound): number => {
  switch (comp) {
    case 'methane':
      return 1.8;
    case 'ethylene':
    case 'acetylene':
      return 1.65;
    case 'ethanol':
    case 'acetic-acid':
      return 1.5;
    case 'benzene':
    case 'chat-beo':
      return 1.3;
    case 'glucose':
      return 1.15;
    case 'protein':
      return 0.95;
    case 'tinh-bot':
    case 'cellulose':
      return 0.85;
    default:
      return 1.0;
  }
};

// Component vẽ liên kết 3D hình trụ
const Bond3D = ({ from, to, type = 1 }: { from: [number, number, number]; to: [number, number, number]; type?: number }) => {
  const p1 = new THREE.Vector3(...from);
  const p2 = new THREE.Vector3(...to);
  const distance = p1.distanceTo(p2);
  const position = p1.clone().add(p2).multiplyScalar(0.5);
  
  const direction = p2.clone().sub(p1).normalize();
  const up = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction);

  if (type === 2) {
    // Liên kết đôi
    return (
      <group position={position} quaternion={quaternion}>
        <mesh position={[-0.08, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, distance, 16]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.2} />
        </mesh>
        <mesh position={[0.08, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, distance, 16]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.2} />
        </mesh>
      </group>
    );
  }

  if (type === 3) {
    // Liên kết ba
    return (
      <group position={position} quaternion={quaternion}>
        <mesh position={[-0.12, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, distance, 16]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, distance, 16]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.2} />
        </mesh>
        <mesh position={[0.12, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, distance, 16]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.2} />
        </mesh>
      </group>
    );
  }

  // Liên kết đơn
  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[0.05, 0.05, distance, 16]} />
      <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.2} />
    </mesh>
  );
};

// Component vẽ toàn bộ phân tử
const Molecule3D = ({ atoms, bonds, scale = 1.0 }: { atoms: Atom3D[]; bonds: Bond3DData[]; scale?: number }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Tự động xoay chậm phân tử để tạo hiệu ứng không gian 3D sinh động
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.15 * delta;
      groupRef.current.rotation.x += 0.05 * delta;
    }
  });

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      {/* Vẽ các nguyên tử dạng hình cầu */}
      {atoms.map((atom) => {
        const radius = atom.type === 'C' ? 0.36 : (atom.type === 'O' || atom.type === 'N') ? 0.32 : atom.type === 'R' ? 0.28 : 0.22;
        return (
          <mesh key={atom.id} position={atom.pos}>
            <sphereGeometry args={[radius, 32, 32]} />
            <meshStandardMaterial 
              color={ATOM_COLORS[atom.type] || '#94a3b8'} 
              roughness={0.15} 
              metalness={0.65} 
            />
          </mesh>
        );
      })}

      {/* Vẽ các liên kết giữa các nguyên tử */}
      {bonds.map((bond, idx) => {
        const fromAtom = atoms.find((a) => a.id === bond.from);
        const toAtom = atoms.find((a) => a.id === bond.to);
        if (!fromAtom || !toAtom) return null;
        return (
          <Bond3D 
            key={idx} 
            from={fromAtom.pos} 
            to={toAtom.pos} 
            type={bond.type} 
          />
        );
      })}
    </group>
  );
};

export function HopChatHuuCoSimulation({ onBack }: HopChatHuuCoSimulationProps) {
  const [activeCompound, setActiveCompound] = useState<Compound>('methane');
  const [activeIsomerIndex, setActiveIsomerIndex] = useState<number>(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const compound = COMPOUNDS[activeCompound];

  const currentStructure = activeIsomerIndex === 0 
    ? compound 
    : (compound.isomers && compound.isomers[activeIsomerIndex - 1]) || compound;

  const handleSelectCompound = (comp: Compound) => {
    setActiveCompound(comp);
    setActiveIsomerIndex(0);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex flex-col w-full h-screen bg-slate-950 text-slate-200 overflow-hidden select-none animate-in fade-in duration-500">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between p-4 pr-16 md:pr-20 border-b border-slate-900 bg-slate-900/60 backdrop-blur-xl z-30 shadow-md">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 hover:border-orange-500 transition-all text-white group shadow-sm flex items-center justify-center shrink-0"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-black bg-clip-text text-transparent bg-linear-to-r from-emerald-400 to-cyan-400 font-heading tracking-tight italic">
              CẤU TẠO HỢP CHẤT HỮU CƠ 3D
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Mô hình không gian tương tác trực quan</p>
          </div>
        </div>

        {/* Legend Indicator */}
        <div className="hidden lg:flex items-center gap-4 bg-slate-950/50 px-5 py-2 rounded-2xl border border-slate-800/80 text-xs font-bold">
          <span className="text-slate-400">Chú giải:</span>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full border border-slate-900 shadow-sm" style={{ backgroundColor: ATOM_COLORS.C }}></div>
            <span>C (Carbon)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full border border-slate-900 shadow-sm" style={{ backgroundColor: ATOM_COLORS.H }}></div>
            <span className="text-slate-300">H (Hydro)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full border border-slate-900 shadow-sm" style={{ backgroundColor: ATOM_COLORS.O }}></div>
            <span>O (Oxy)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full border border-slate-900 shadow-sm" style={{ backgroundColor: ATOM_COLORS.N }}></div>
            <span>N (Nitơ)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full border border-slate-900 shadow-sm" style={{ backgroundColor: ATOM_COLORS.R }}></div>
            <span>R (Gốc hữu cơ)</span>
          </div>
        </div>
      </div>

      {/* Main Container - Single Frame (no outer scrollbars) */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Left Side: 3D Visualization Area (takes main space) */}
        <div className="flex-1 relative bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-slate-900/60 via-slate-950 to-slate-950 flex flex-col items-center justify-center overflow-hidden">
          
          {/* Interactive instruction hint */}
          <div className="absolute bottom-6 left-6 z-20 text-[10px] font-black text-slate-500 flex items-center gap-1.5 bg-slate-900/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-800/50 pointer-events-none">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Kéo chuột để xoay phân tử • Cuộn chuột để phóng to/thu nhỏ</span>
          </div>

          {/* 3D Canvas rendering */}
          <div className="w-full h-full cursor-grab active:cursor-grabbing">
            <Canvas camera={{ position: [0, 0, 6.2], fov: 45 }}>
              <ambientLight intensity={0.7} />
              <pointLight position={[10, 10, 10]} intensity={1.8} castShadow />
              <pointLight position={[-10, -10, -10]} intensity={0.6} color="#3b82f6" />
              <directionalLight position={[0, 5, 5]} intensity={1.2} />
              <Suspense fallback={null}>
                <Molecule3D atoms={currentStructure.atoms} bonds={currentStructure.bonds} scale={getCompoundScale(activeCompound)} />
              </Suspense>
              <OrbitControls enablePan={true} enableZoom={true} minDistance={3} maxDistance={20} />
            </Canvas>
          </div>
        </div>

        {/* Right Side: Selection Dropdown & Info Panel */}
        <div className="w-[320px] lg:w-[360px] bg-slate-900/60 border-l border-slate-900/80 flex flex-col backdrop-blur-xl z-20 shrink-0 overflow-hidden">
          <div className="p-4 border-b border-slate-900 bg-slate-900/20">
             <h3 className="font-black text-xs uppercase tracking-widest text-emerald-400 mb-1 font-heading">Danh sách hợp chất</h3>
             <p className="text-[10px] text-slate-500 font-bold">Chọn hợp chất để lắp ráp mô hình 3D.</p>
          </div>
          
          <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden relative min-h-0">
            {/* Custom Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between group shadow-lg bg-slate-950/40 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700"
              >
                <div className="min-w-0">
                  <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-0.5">
                    {compound.type}
                  </div>
                  <div className="text-sm font-extrabold text-white">
                    {compound.name}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-300 font-serif text-xs px-2 py-0.5 rounded-md bg-slate-950/60 border border-slate-800/80 shadow-sm">
                    {FORMULA_TEXTS[activeCompound]}
                  </span>
                  {isDropdownOpen ? (
                    <ChevronUp className="w-5 h-5 text-emerald-400 transition-transform" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-white transition-transform" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-30" 
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-40 overflow-hidden max-h-[320px] overflow-y-auto custom-scrollbar"
                    >
                      {(Object.keys(COMPOUNDS) as Compound[]).map(comp => (
                        <button
                          key={comp}
                          onClick={() => handleSelectCompound(comp)}
                          className={`w-full text-left p-3 hover:bg-slate-800/60 transition-all flex items-center justify-between border-b border-slate-800/40 last:border-0 ${
                            activeCompound === comp ? 'bg-slate-800/40 text-emerald-400' : 'text-slate-300'
                          }`}
                        >
                          <div>
                            <span className={`text-xs font-bold ${activeCompound === comp ? 'text-emerald-400' : 'text-slate-300'}`}>
                              {COMPOUNDS[comp].name}
                            </span>
                            <span className="text-[10px] block text-slate-500 font-medium mt-0.5">{COMPOUNDS[comp].type}</span>
                          </div>
                          <span className="text-[11px] font-serif opacity-80 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800/80 shadow-sm">
                            {FORMULA_TEXTS[comp]}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Compound Information Card */}
            <div className="flex-1 flex flex-col min-h-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeCompound}-${activeIsomerIndex}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="bg-slate-950/40 backdrop-blur-md p-5 rounded-2xl border border-slate-800/60 shadow-xl flex flex-col h-full min-h-0 gap-3"
                >
                  <div>
                    <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1.5">{currentStructure.type}</div>
                    <h2 className="text-2xl font-black text-white font-heading tracking-tight">{currentStructure.name}</h2>
                  </div>

                  {/* Isomer Selector Tabs */}
                  {compound.isomers && (
                    <div className="flex bg-slate-950/60 p-1 rounded-xl border border-slate-800/80 gap-1 shadow-inner shrink-0">
                      <button
                        onClick={() => setActiveIsomerIndex(0)}
                        className={`flex-1 text-center py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                          activeIsomerIndex === 0
                            ? 'bg-linear-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'text-slate-400 hover:text-white border border-transparent'
                        }`}
                      >
                        {compound.name}
                      </button>
                      {compound.isomers.map((isomer, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveIsomerIndex(idx + 1)}
                          className={`flex-1 text-center py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                            activeIsomerIndex === idx + 1
                              ? 'bg-linear-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'text-slate-400 hover:text-white border border-transparent'
                          }`}
                        >
                          {isomer.name}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-lg text-cyan-300 font-serif flex items-center justify-center bg-slate-950/60 p-4 rounded-xl border border-slate-800/50 shadow-inner shrink-0 min-h-[56px]">
                    <BlockMath math={currentStructure.formula} />
                  </div>
                  
                  <div className="text-xs text-slate-400 leading-relaxed font-semibold overflow-y-auto custom-scrollbar pr-1 flex-1">
                    {currentStructure.info}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
