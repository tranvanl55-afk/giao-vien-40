import React, { useRef, useState, useMemo } from 'react';
import { ArrowLeft, Play, Pause, Info } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';

interface PlanetData {
  id: string;
  name: string;
  radius: number;
  distance: number;
  speed: number;
  color: string;
  emissive: string;
  ringColor?: string;
  fact: string;
  diameter: string;
  dayLength: string;
  yearLength: string;
}

const PLANETS: PlanetData[] = [
  { id: 'mercury', name: 'Sao Thủy', radius: 0.25, distance: 3.2, speed: 4.7, color: '#a89080', emissive: '#302820', fact: 'Hành tinh nhỏ nhất và gần Mặt Trời nhất. Ngày Sao Thủy = 59 ngày Trái Đất.', diameter: '4,879 km', dayLength: '59 ngày', yearLength: '88 ngày' },
  { id: 'venus', name: 'Sao Kim', radius: 0.6, distance: 5.0, speed: 3.5, color: '#e8c980', emissive: '#403010', fact: 'Hành tinh nóng nhất (462°C), quay ngược chiều kim đồng hồ.', diameter: '12,104 km', dayLength: '243 ngày', yearLength: '225 ngày' },
  { id: 'earth', name: 'Trái Đất', radius: 0.65, distance: 7.0, speed: 2.9, color: '#4090c0', emissive: '#103050', fact: 'Hành tinh duy nhất có sự sống được biết đến trong Vũ trụ.', diameter: '12,742 km', dayLength: '24 giờ', yearLength: '365 ngày' },
  { id: 'mars', name: 'Sao Hỏa', radius: 0.4, distance: 9.2, speed: 2.4, color: '#c05020', emissive: '#401000', fact: '"Hành tinh Đỏ" — màu đỏ do bề mặt phủ đầy oxit sắt (rỉ sét).', diameter: '6,779 km', dayLength: '24.6 giờ', yearLength: '687 ngày' },
  { id: 'jupiter', name: 'Sao Mộc', radius: 1.5, distance: 13.5, speed: 1.3, color: '#c8a060', emissive: '#302010', fact: 'Hành tinh lớn nhất hệ Mặt Trời, có "Vết Đỏ Lớn" — cơn bão kéo dài 300 năm.', diameter: '139,820 km', dayLength: '10 giờ', yearLength: '12 năm' },
  { id: 'saturn', name: 'Sao Thổ', radius: 1.2, distance: 18.0, speed: 0.97, color: '#e0c080', emissive: '#302010', ringColor: '#c0a05080', fact: 'Nổi tiếng với hệ thống vành đai băng đá và đá. Có mật độ thấp hơn nước!', diameter: '116,460 km', dayLength: '10.7 giờ', yearLength: '29 năm' },
  { id: 'uranus', name: 'Sao Thiên Vương', radius: 0.9, distance: 23.0, speed: 0.68, color: '#70c8d8', emissive: '#103040', fact: 'Quay nghiêng 98° — như đang "nằm" trên quỹ đạo của mình.', diameter: '50,724 km', dayLength: '17 giờ', yearLength: '84 năm' },
  { id: 'neptune', name: 'Sao Hải Vương', radius: 0.85, distance: 27.5, speed: 0.54, color: '#2050c8', emissive: '#102050', fact: 'Hành tinh xa nhất và có gió mạnh nhất (2,100 km/h) trong hệ Mặt Trời.', diameter: '49,244 km', dayLength: '16 giờ', yearLength: '165 ngày' },
];

function Sun({ radius = 2.0, lightIntensity = 3.0, lightDistance = 80 }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [textureLoaded, setTextureLoaded] = useState(false);
  
  const sunTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(
      'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/sunmap.jpg',
      () => setTextureLoaded(true)
    );
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.05;
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.01) * 0.05;
    }
  });

  return (
    <group>
      {/* Outer Glow Corona 1 */}
      <mesh>
        <sphereGeometry args={[radius * 1.25, 32, 32]} />
        <meshBasicMaterial 
          color="#ff3300" 
          transparent 
          opacity={0.3} 
          side={THREE.BackSide} 
          blending={THREE.AdditiveBlending} 
        />
      </mesh>
      
      {/* Outer Glow Corona 2 */}
      <mesh>
        <sphereGeometry args={[radius * 1.1, 32, 32]} />
        <meshBasicMaterial 
          color="#ffaa00" 
          transparent 
          opacity={0.55} 
          side={THREE.BackSide} 
          blending={THREE.AdditiveBlending} 
        />
      </mesh>

      {/* Main Sun Body */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial 
          map={textureLoaded ? sunTexture : undefined}
          color={textureLoaded ? undefined : '#ffaa00'}
          emissive="#ff5500" 
          emissiveIntensity={1.2} 
        />
        <pointLight intensity={lightIntensity} distance={lightDistance} color="#fffacc" />
      </mesh>
    </group>
  );
}

function OrbitRing({ radius, visible }: { radius: number; visible: boolean }) {
  if (!visible) return null;
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= 128; i++) {
    const angle = (i / 128) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: '#ffffff', opacity: 0.15, transparent: true });
  const lineObj = new THREE.Line(geometry, material);
  return <primitive object={lineObj} />;
}

function SaturnRing({ color, radius }: { color: string; radius: number }) {
  return (
    <mesh rotation={[Math.PI / 2, 0.08, 0]}>
      <ringGeometry args={[radius * 1.35, radius * 2.1, 64]} />
      <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.65} />
    </mesh>
  );
}

function DetailedEarth({ radius = 1.5, emissive = "#101e36", emissiveIntensity = 0.3 }) {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const [earthLoaded, setEarthLoaded] = useState(false);
  const [cloudsLoaded, setCloudsLoaded] = useState(false);

  const earthTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load(
      'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthmap1k.jpg',
      () => setEarthLoaded(true)
    );
  }, []);

  const cloudsTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load(
      'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthclouds1k.png',
      () => setCloudsLoaded(true)
    );
  }, []);

  useFrame((_, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.1;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.12;
  });

  return (
    <group>
      {/* Atmosphere Glow */}
      <mesh>
        <sphereGeometry args={[radius * 1.05, 32, 32]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.18} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* Earth Surface */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial 
          map={earthLoaded ? earthTexture : undefined} 
          color={earthLoaded ? undefined : '#4090c0'}
          roughness={0.8} 
          metalness={0.1}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      {/* Clouds */}
      {cloudsLoaded && (
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[radius * 1.01, 32, 32]} />
          <meshStandardMaterial map={cloudsTexture} transparent opacity={0.35} />
        </mesh>
      )}
    </group>
  );
}

function Planet({ data, playing, speed, onSelect, selected }: {
  data: PlanetData; playing: boolean; speed: number; onSelect: (d: PlanetData) => void; selected: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const extraLayerRef = useRef<THREE.Mesh>(null);
  const angleRef = useRef(Math.random() * Math.PI * 2);
  const [textureLoaded, setTextureLoaded] = useState(false);
  const [cloudsLoaded, setCloudsLoaded] = useState(false);

  const isEarth = data.id === 'earth';
  
  const planetTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    let url = '';
    if (data.id === 'mercury') url = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/mercurymap.jpg';
    else if (data.id === 'venus') url = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/venusmap.jpg';
    else if (data.id === 'earth') url = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthmap1k.jpg';
    else if (data.id === 'mars') url = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/marsmap1k.jpg';
    else if (data.id === 'jupiter') url = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/jupitermap.jpg';
    else if (data.id === 'saturn') url = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/saturnmap.jpg';
    else if (data.id === 'uranus') url = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/uranusmap.jpg';
    else if (data.id === 'neptune') url = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/neptunemap.jpg';

    if (!url) return null;
    return loader.load(url, () => setTextureLoaded(true));
  }, [data.id]);

  const cloudsTexture = useMemo(() => {
    if (!isEarth) return null;
    return new THREE.TextureLoader().load(
      'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthclouds1k.png',
      () => setCloudsLoaded(true)
    );
  }, [isEarth]);

  useFrame((_, delta) => {
    if (!groupRef.current || !meshRef.current) return;
    if (playing) {
      angleRef.current += delta * data.speed * 0.15 * speed;
    }
    groupRef.current.position.x = Math.cos(angleRef.current) * data.distance;
    groupRef.current.position.z = Math.sin(angleRef.current) * data.distance;
    
    if (data.id === 'uranus') {
      meshRef.current.rotation.x = (98 * Math.PI) / 180;
      meshRef.current.rotation.z += delta * 0.3;
    } else {
      meshRef.current.rotation.y += delta * 0.4;
    }

    if (extraLayerRef.current && playing) {
      extraLayerRef.current.rotation.y += delta * 0.55;
    }
  });

  return (
    <group ref={groupRef}>
      <group onClick={() => onSelect(data)}>
        {/* Atmosphere Glow */}
        {['earth', 'venus', 'uranus', 'neptune', 'mars', 'jupiter', 'saturn'].includes(data.id) && (
          <mesh>
            <sphereGeometry args={[data.radius * 1.06, 32, 32]} />
            <meshBasicMaterial 
              color={
                data.id === 'earth' ? '#60a5fa' :
                data.id === 'venus' ? '#fef08a' :
                data.id === 'mars' ? '#f97316' :
                data.id === 'jupiter' ? '#fcd34d' :
                data.id === 'saturn' ? '#fed7aa' :
                data.id === 'uranus' ? '#a5f3fc' :
                '#3b82f6'
              } 
              transparent 
              opacity={data.id === 'venus' ? 0.25 : 0.15} 
              side={THREE.BackSide} 
              blending={THREE.AdditiveBlending} 
            />
          </mesh>
        )}

        {/* Custom visual layering per planet specification */}
        {data.id === 'venus' ? (
          <>
            <mesh ref={meshRef}>
              <sphereGeometry args={[data.radius, 32, 32]} />
              <meshStandardMaterial color="#c2410c" roughness={0.9} emissive="#431407" emissiveIntensity={0.5} />
            </mesh>
            <mesh ref={extraLayerRef}>
              <sphereGeometry args={[data.radius * 1.015, 32, 32]} />
              <meshStandardMaterial 
                map={textureLoaded ? (planetTexture || undefined) : undefined} 
                color="#fef08a" 
                transparent 
                opacity={textureLoaded ? 0.88 : 0.15} 
              />
            </mesh>
          </>
        ) : data.id === 'earth' ? (
          <>
            <mesh ref={meshRef}>
              <sphereGeometry args={[data.radius, 32, 32]} />
              <meshStandardMaterial 
                map={textureLoaded ? (planetTexture || undefined) : undefined} 
                color={textureLoaded ? undefined : data.color}
                roughness={0.8} 
                metalness={0.1} 
              />
            </mesh>
            {cloudsLoaded && (
              <mesh ref={extraLayerRef}>
                <sphereGeometry args={[data.radius * 1.01, 32, 32]} />
                <meshStandardMaterial map={cloudsTexture || undefined} transparent opacity={0.38} />
              </mesh>
            )}
          </>
        ) : data.id === 'mars' ? (
          <>
            <mesh ref={meshRef}>
              <sphereGeometry args={[data.radius, 32, 32]} />
              <meshStandardMaterial 
                map={textureLoaded ? (planetTexture || undefined) : undefined} 
                roughness={0.85} 
                color="#ea580c" 
              />
            </mesh>
            {/* Mars thin dust storm layer */}
            <mesh ref={extraLayerRef}>
              <sphereGeometry args={[data.radius * 1.01, 32, 32]} />
              <meshStandardMaterial color="#c2410c" transparent opacity={0.15} wireframe={true} />
            </mesh>
          </>
        ) : data.id === 'neptune' ? (
          <>
            <mesh ref={meshRef}>
              <sphereGeometry args={[data.radius, 32, 32]} />
              <meshStandardMaterial 
                map={textureLoaded ? (planetTexture || undefined) : undefined} 
                color={textureLoaded ? undefined : data.color}
                roughness={0.7} 
                metalness={0.1} 
              />
            </mesh>
            {/* Neptune high altitude white methane ice clouds */}
            <mesh ref={extraLayerRef}>
              <sphereGeometry args={[data.radius * 1.01, 32, 32]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.2} wireframe={true} />
            </mesh>
          </>
        ) : (
          <mesh ref={meshRef}>
            <sphereGeometry args={[data.radius, 32, 32]} />
            <meshStandardMaterial 
              map={textureLoaded ? (planetTexture || undefined) : undefined} 
              color={textureLoaded ? undefined : data.color}
              emissive={textureLoaded ? undefined : data.emissive} 
              emissiveIntensity={0.2}
              roughness={data.id === 'mercury' ? 0.9 : 0.6} 
            />
          </mesh>
        )}
      </group>

      {data.id === 'saturn' && <SaturnRing color={data.ringColor || '#c0a05080'} radius={data.radius} />}

      {selected && (
        <mesh>
          <sphereGeometry args={[data.radius * 1.3, 24, 24]} />
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.15} wireframe />
        </mesh>
      )}
    </group>
  );
}

function Scene({ playing, speed, onSelect, selectedId }: {
  playing: boolean; speed: number; onSelect: (d: PlanetData) => void; selectedId: string | null;
}) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <Stars radius={120} depth={80} count={3000} factor={4} />
      <Sun radius={2.0} lightIntensity={3.0} lightDistance={80} />
      {PLANETS.map(p => (
        <React.Fragment key={p.id}>
          <OrbitRing radius={p.distance} visible={true} />
          <Planet data={p} playing={playing} speed={speed} onSelect={onSelect} selected={selectedId === p.id} />
        </React.Fragment>
      ))}
      <OrbitControls enablePan={false} minDistance={5} maxDistance={60} />
    </>
  );
}

// ---------------- ECLIPSE SIMULATION COMPONENTS ----------------

function EclipseScene({
  mode,
  playing,
  moonAngle,
  setMoonAngle,
  speed,
  tiltOrbit
}: {
  mode: 'solar' | 'lunar';
  playing: boolean;
  moonAngle: number;
  setMoonAngle: React.Dispatch<React.SetStateAction<number>>;
  speed: number;
  tiltOrbit: boolean;
}) {
  const shadowGroupRef = useRef<THREE.Group>(null);
  
  const orbitRadius = 4.5;
  const earthPos = new THREE.Vector3(6, 0, 0);
  const sunPos = new THREE.Vector3(-18, 0, 0);

  useFrame((_, delta) => {
    if (playing) {
      const deltaAngle = delta * 0.15 * speed;
      setMoonAngle(prev => (prev + deltaAngle) % (Math.PI * 2));
    }
    
    // Dynamically point the Moon's shadow cone towards Earth
    if (shadowGroupRef.current) {
      shadowGroupRef.current.lookAt(6, 0, 0);
    }
  });

  const tiltAngle = tiltOrbit ? 0.089 : 0; // 5.14 degrees in radians
  const relativeMoonPos = new THREE.Vector3(
    Math.cos(moonAngle) * orbitRadius,
    Math.sin(moonAngle) * orbitRadius * Math.sin(tiltAngle),
    Math.sin(moonAngle) * orbitRadius * Math.cos(tiltAngle)
  );
  
  const absoluteMoonPos = earthPos.clone().add(relativeMoonPos);
  const moonDistFromAxis = Math.sqrt(relativeMoonPos.y * relativeMoonPos.y + relativeMoonPos.z * relativeMoonPos.z);
  
  const isSolarEclipseAlignment = relativeMoonPos.x < 0 && moonDistFromAxis < 0.7;
  const isLunarEclipseAlignment = relativeMoonPos.x > 0 && moonDistFromAxis < 0.8;

  return (
    <>
      <ambientLight intensity={0.2} />
      <Stars radius={120} depth={80} count={2000} factor={4} />

      {/* Sun */}
      <group position={sunPos}>
        <Sun radius={3.2} lightIntensity={3.5} lightDistance={100} />
        <Html distanceFactor={25} position={[0, 4.2, 0]}>
          <div className="bg-slate-900/90 text-yellow-400 font-bold border border-yellow-500/30 px-2 py-0.5 rounded text-xs whitespace-nowrap shadow-md">
            Mặt Trời
          </div>
        </Html>
      </group>

      {/* Earth */}
      <group position={earthPos}>
        <DetailedEarth 
          radius={1.5} 
          emissive={mode === 'solar' && isSolarEclipseAlignment ? "#050f21" : "#101e36"}
          emissiveIntensity={0.3}
        />

        {/* Dotted Moon Orbit Path */}
        <mesh rotation={[Math.PI / 2, tiltAngle, 0]}>
          <ringGeometry args={[orbitRadius - 0.02, orbitRadius + 0.02, 64]} />
          <meshBasicMaterial color="#ffffff" opacity={0.15} transparent side={THREE.DoubleSide} />
        </mesh>

        {/* Shadow Spot on Earth (for Solar Eclipse) */}
        {mode === 'solar' && relativeMoonPos.x < 0 && (
          <mesh 
            position={[
              -1.51, 
              (relativeMoonPos.y / orbitRadius) * 1.5, 
              (relativeMoonPos.z / orbitRadius) * 1.5
            ]}
          >
            <sphereGeometry args={[Math.max(0.05, 0.3 * (1 - moonDistFromAxis / 0.7)), 16, 16]} />
            <meshBasicMaterial 
              color="#020617" 
              transparent 
              opacity={Math.max(0, 0.9 * (1 - moonDistFromAxis / 0.7))} 
            />
          </mesh>
        )}

        <Html distanceFactor={25} position={[0, 2.2, 0]}>
          <div className="bg-slate-900/90 text-blue-400 font-bold border border-blue-500/30 px-2 py-0.5 rounded text-xs whitespace-nowrap shadow-md">
            Trái Đất
          </div>
        </Html>
      </group>

      {/* Moon */}
      <group position={absoluteMoonPos}>
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial 
            color={
              mode === 'lunar' && isLunarEclipseAlignment 
                ? new THREE.Color().lerpColors(
                    new THREE.Color('#aaaaaa'), 
                    new THREE.Color('#7f1d1d'), 
                    Math.max(0, 1 - moonDistFromAxis / 0.8)
                  ).getStyle()
                : '#aaaaaa'
            }
            emissive={
              mode === 'lunar' && isLunarEclipseAlignment
                ? new THREE.Color().lerpColors(
                    new THREE.Color('#000000'),
                    new THREE.Color('#3f0707'),
                    Math.max(0, 1 - moonDistFromAxis / 0.8)
                  ).getStyle()
                : '#111111'
            }
            emissiveIntensity={0.5}
            roughness={0.8}
          />
        </mesh>
        <Html distanceFactor={25} position={[0, 0.8, 0]}>
          <div className="bg-slate-900/90 text-slate-300 font-bold border border-slate-700 px-2 py-0.5 rounded text-[10px] whitespace-nowrap shadow-md">
            Mặt Trăng
          </div>
        </Html>
      </group>

      {/* Earth Shadow Cones (for Lunar Eclipse View) */}
      {mode === 'lunar' && (
        <group position={[6, 0, 0]}>
          {/* Umbra - converging cone */}
          <mesh position={[6, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[1.5, 12, 32, 1, true]} />
            <meshBasicMaterial 
              color="#090d16" 
              transparent 
              opacity={0.65} 
              side={THREE.DoubleSide} 
              depthWrite={false}
            />
          </mesh>
          
          {/* Penumbra - diverging cone */}
          <mesh position={[6, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <cylinderGeometry args={[1.5, 3.5, 12, 32, 1, true]} />
            <meshBasicMaterial 
              color="#334155" 
              transparent 
              opacity={0.2} 
              side={THREE.DoubleSide} 
              depthWrite={false}
            />
          </mesh>
          
          {/* Shadow Labels */}
          <Html distanceFactor={25} position={[5.5, 1.2, 0]}>
            <div className="text-[9px] font-bold text-red-400 select-none bg-slate-950/80 px-1.5 py-0.5 rounded border border-red-950/30">
              Vùng bóng tối (Umbra)
            </div>
          </Html>
          <Html distanceFactor={25} position={[5.5, 2.8, 0]}>
            <div className="text-[9px] font-bold text-slate-400 select-none bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800">
              Vùng bóng nửa tối (Penumbra)
            </div>
          </Html>
        </group>
      )}

      {/* Moon Shadow Cones (for Solar Eclipse View) */}
      {mode === 'solar' && (
        <group position={absoluteMoonPos} ref={shadowGroupRef}>
          {/* Umbra cone pointing to Earth */}
          <mesh position={[0, 0, 2.25]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.4, 4.5, 32, 1, true]} />
            <meshBasicMaterial 
              color="#090d16" 
              transparent 
              opacity={0.65} 
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
          {/* Penumbra cylinder pointing to Earth */}
          <mesh position={[0, 0, 2.25]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.4, 1.2, 4.5, 32, 1, true]} />
            <meshBasicMaterial 
              color="#334155" 
              transparent 
              opacity={0.25} 
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </group>
      )}

      <OrbitControls enablePan={false} minDistance={5} maxDistance={40} />
    </>
  );
}

// ---------------- MAIN EXPORT COMPONENT ----------------

export function HeMaTroiSimulation({ onBack }: { onBack: () => void }) {
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selected, setSelected] = useState<PlanetData | null>(null);
  
  // Eclipse Simulation States
  const [mode, setMode] = useState<'system' | 'solar' | 'lunar'>('system');
  const [moonAngle, setMoonAngle] = useState(Math.PI * 0.9); // Starts near alignment
  const [tiltOrbit, setTiltOrbit] = useState(false);

  return (
    <div className="w-full h-screen bg-slate-950 flex flex-col font-sans text-slate-100">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 cursor-pointer transition-all">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-black text-white uppercase flex items-center gap-2">
              🌟 Hệ Mặt Trời 3D & Nhật Thực, Nguyệt Thực
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Khoa học tự nhiên lớp 6</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800 rounded-xl px-3 py-1.5 border border-slate-700">
            <span className="text-xs text-slate-400 font-bold">Tốc độ:</span>
            <input type="range" min={0.2} max={5} step={0.2} value={speed} onChange={e => setSpeed(Number(e.target.value))}
              className="w-20 h-1.5 cursor-pointer accent-cyan-400" />
            <span className="text-xs font-black text-cyan-400 w-8">{speed}x</span>
          </div>
          <button onClick={() => setPlaying(p => !p)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold text-sm cursor-pointer transition-all">
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {playing ? 'Dừng' : 'Chạy'}
          </button>
        </div>
      </header>

      <div className="flex-1 relative overflow-hidden">
        {/* Floating Mode Selector Tabs */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/80 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
          <button 
            onClick={() => { setMode('system'); setPlaying(true); }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${mode === 'system' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <span>🌌</span> <span className="hidden sm:inline">Hệ Mặt Trời</span>
          </button>
          <button 
            onClick={() => { setMode('solar'); setMoonAngle(Math.PI * 0.9); }} 
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${mode === 'solar' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <span>🌑</span> <span>Nhật Thực</span>
          </button>
          <button 
            onClick={() => { setMode('lunar'); setMoonAngle(Math.PI * 0.1); }} 
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${mode === 'lunar' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <span>🌕</span> <span>Nguyệt Thực</span>
          </button>
        </div>

        {/* 3D Canvas */}
        <Canvas camera={{ position: [0, 15, 30], fov: 60 }} className="w-full h-full">
          {mode === 'system' ? (
            <Scene playing={playing} speed={speed} onSelect={setSelected} selectedId={selected?.id || null} />
          ) : (
            <EclipseScene 
              mode={mode} 
              playing={playing} 
              moonAngle={moonAngle} 
              setMoonAngle={setMoonAngle} 
              speed={speed} 
              tiltOrbit={tiltOrbit} 
            />
          )}
        </Canvas>

        {/* Interactive Instruction Overlay */}
        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between pointer-events-none z-10">
          <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md rounded-2xl p-3 border border-slate-700 text-[11px] text-slate-400 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            {mode === 'system' 
              ? 'Kéo để xoay • Cuộn để zoom • Click vào hành tinh để xem thông tin'
              : 'Kéo để xoay • Cuộn để zoom • Dùng thanh trượt điều chỉnh vị trí Mặt Trăng'}
          </div>

          {/* Planet Info Overlay (System mode only) */}
          {mode === 'system' && selected && (
            <div className="pointer-events-auto bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 border border-cyan-800/50 shadow-2xl max-w-xs animate-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-black text-white text-base">{selected.name}</h3>
                <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white cursor-pointer text-xl leading-none">×</button>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3 text-[11px]">
                <div className="bg-slate-800 rounded-xl p-2">
                  <p className="text-slate-400">Đường kính</p>
                  <p className="font-bold text-white">{selected.diameter}</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-2">
                  <p className="text-slate-400">Chu kỳ năm</p>
                  <p className="font-bold text-white">{selected.yearLength}</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-2">
                  <p className="text-slate-400">Chu kỳ ngày</p>
                  <p className="font-bold text-white">{selected.dayLength}</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-2">
                  <p className="text-slate-400">Màu sắc</p>
                  <div className="w-4 h-4 rounded-full mt-1" style={{ backgroundColor: selected.color }} />
                </div>
              </div>
              <div className="bg-indigo-950/40 rounded-xl p-3 border border-indigo-800/40">
                <p className="text-[11px] text-indigo-200 leading-relaxed">💡 {selected.fact}</p>
              </div>
            </div>
          )}

          {/* Detailed Eclipse Explanation Panel (Eclipse modes only) */}
          {mode !== 'system' && (
            <div className="pointer-events-auto bg-slate-900/95 backdrop-blur-md rounded-2xl p-5 border border-cyan-800/40 shadow-2xl w-full max-w-sm md:max-w-md animate-in slide-in-from-right-4 duration-300 flex flex-col gap-3">
              <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                <h3 className="font-black text-white text-sm uppercase tracking-wider flex items-center gap-2">
                  {mode === 'solar' ? '🌑 Nhật Thực (Solar Eclipse)' : '🌕 Nguyệt Thực (Lunar Eclipse)'}
                </h3>
              </div>
              
              {/* Moon Angle Manual Scrubber */}
              <div className="bg-slate-800/50 border border-slate-700/40 rounded-xl p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Vị trí Mặt Trăng trên quỹ đạo</span>
                  <span className="text-xs font-black text-cyan-400">{Math.round((moonAngle * 180) / Math.PI)}°</span>
                </div>
                <input 
                  type="range" 
                  min={0} 
                  max={Math.PI * 2} 
                  step={0.01} 
                  value={moonAngle} 
                  onChange={(e) => {
                    setPlaying(false); // Pause auto-rotation when dragging manually
                    setMoonAngle(Number(e.target.value));
                  }}
                  className="w-full h-1.5 cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[8px] text-slate-500 font-bold mt-1">
                  <span>0° (Trăng Tròn)</span>
                  <span>180° (Trăng Non)</span>
                  <span>360°</span>
                </div>
              </div>

              {/* Orbit Tilt Switch */}
              <div className="flex items-center justify-between bg-slate-800/50 border border-slate-700/40 rounded-xl p-3">
                <div>
                  <p className="text-xs font-bold text-white">Nghiêng quỹ đạo Mặt Trăng (5.14°)</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Mô tả thực tế trục nghiêng thiên văn</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={tiltOrbit} 
                    onChange={(e) => setTiltOrbit(e.target.checked)} 
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>

              {/* Dynamic Status Box and Scientific Details */}
              {(() => {
                const orbitR = 4.5;
                const tiltA = tiltOrbit ? 0.089 : 0;
                const relMoon = new THREE.Vector3(
                  Math.cos(moonAngle) * orbitR,
                  Math.sin(moonAngle) * orbitR * Math.sin(tiltA),
                  Math.sin(moonAngle) * orbitR * Math.cos(tiltA)
                );
                const moonDist = Math.sqrt(relMoon.y * relMoon.y + relMoon.z * relMoon.z);
                
                if (mode === 'solar') {
                  const isSolar = relMoon.x < 0 && moonDist < 0.7;
                  const isTotal = isSolar && moonDist < 0.25;
                  
                  return (
                    <div className="space-y-3">
                      <div className={`p-3 rounded-xl border flex flex-col ${
                        isSolar 
                          ? isTotal 
                            ? 'bg-red-950/20 border-red-500/30' 
                            : 'bg-orange-950/20 border-orange-500/30'
                          : 'bg-slate-800/40 border-slate-700/50'
                      }`}>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Trạng thái quan sát từ Trái Đất</span>
                        <span className={`text-xs font-black mt-1 uppercase tracking-wide ${
                          isSolar 
                            ? isTotal 
                              ? 'text-red-400 animate-pulse' 
                              : 'text-orange-400'
                            : 'text-slate-300'
                        }`}>
                          {isSolar 
                            ? isTotal 
                              ? '💥 Nhật thực toàn phần!' 
                              : '🌓 Nhật thực một phần!'
                            : '☀️ Không xảy ra Nhật thực'}
                        </span>
                      </div>

                      <div className="bg-indigo-950/20 rounded-xl p-3 border border-indigo-800/30 text-[11px] text-indigo-200 leading-relaxed space-y-2">
                        <p>
                          💡 <strong>Nhật thực</strong> xảy ra khi <strong>Mặt Trăng</strong> đi qua giữa Trái Đất và Mặt Trời, che khuất một phần hoặc toàn bộ đĩa Mặt Trời.
                        </p>
                        {tiltOrbit && moonDist >= 0.7 && relMoon.x < 0 && (
                          <p className="text-amber-300 font-medium">
                            ⚠️ Khi quỹ đạo bị nghiêng 5.14°, bóng của Mặt Trăng lệch qua khỏi Trái Đất và không có hiện tượng che khuất nào xảy ra.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                } else {
                  const isLunar = relMoon.x > 0 && moonDist < 0.8;
                  const isTotal = isLunar && moonDist < 0.35;
                  
                  return (
                    <div className="space-y-3">
                      <div className={`p-3 rounded-xl border flex flex-col ${
                        isLunar 
                          ? isTotal 
                            ? 'bg-red-950/20 border-red-500/30' 
                            : 'bg-orange-950/20 border-orange-500/30'
                          : 'bg-slate-800/40 border-slate-700/50'
                      }`}>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Trạng thái quan sát từ Trái Đất</span>
                        <span className={`text-xs font-black mt-1 uppercase tracking-wide ${
                          isLunar 
                            ? isTotal 
                              ? 'text-red-400 animate-pulse' 
                              : 'text-orange-400'
                            : 'text-slate-300'
                        }`}>
                          {isLunar 
                            ? isTotal 
                              ? '💥 Nguyệt thực toàn phần (Trăng máu)!' 
                              : '🌓 Nguyệt thực một phần!'
                            : '🌕 Không xảy ra Nguyệt thực'}
                        </span>
                      </div>

                      <div className="bg-indigo-950/20 rounded-xl p-3 border border-indigo-800/30 text-[11px] text-indigo-200 leading-relaxed space-y-2">
                        <p>
                          💡 <strong>Nguyệt thực</strong> xảy ra khi <strong>Trái Đất</strong> đi qua giữa Mặt Trời và Mặt Trăng, ngăn cản ánh sáng trực tiếp đổ bóng lên Mặt Trăng.
                        </p>
                        {isTotal && (
                          <p className="text-red-300 font-medium">
                            🩸 Sắc đỏ "Trăng Máu" xuất hiện do ánh sáng mặt trời đi xuyên qua khí quyển Trái Đất bị khúc xạ và lọc bớt các tia sáng xanh bước sóng ngắn, chỉ phản xạ ánh sáng đỏ lên bề mặt Mặt Trăng.
                          </p>
                        )}
                        {tiltOrbit && moonDist >= 0.8 && relMoon.x > 0 && (
                          <p className="text-amber-300 font-medium">
                            ⚠️ Khi quỹ đạo Mặt Trăng bị nghiêng 5.14°, Trăng tròn sẽ đi bên trên hoặc bên dưới vùng bóng tối của Trái Đất nên không có nguyệt thực.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }
              })()}
            </div>
          )}
        </div>

        {/* Planet list (System mode only) */}
        {mode === 'system' && (
          <div className="absolute top-4 right-4 flex flex-col gap-1 pointer-events-auto z-10 max-h-[85vh] overflow-y-auto pr-1">
            {PLANETS.map(p => (
              <button key={p.id} onClick={() => setSelected(p)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-all ${selected?.id === p.id ? 'bg-cyan-900/60 border-cyan-500 text-white' : 'bg-slate-900/80 border-slate-700/50 text-slate-300 hover:border-slate-600'}`}>
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                {p.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
