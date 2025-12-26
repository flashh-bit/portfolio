import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Trail } from "@react-three/drei";
import * as THREE from "three";
import { PlanetData } from "../../../data/solarSystemData";
import { calculateOrbitalPosition } from "../../../utils/orbitalPhysics";

interface PlanetProps {
    data: PlanetData;
    time: number; // Global simulation time
    scaleMode: 'real' | 'visual';
    selected: boolean;
    onSelect: (id: string) => void;
}

export function Planet({ data, time, scaleMode, selected, onSelect }: PlanetProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);

    // Load texture if available, otherwise fallback
    // Note: For stability in "thought" mode I'm not using useLoader here to avoid suspense mismatch if texture misses.
    // We can use a basic material first.

    useFrame(() => {
        // Calculate Position
        const pos = calculateOrbitalPosition(data, time, scaleMode);

        if (groupRef.current) {
            groupRef.current.position.copy(pos);
        }

        if (meshRef.current) {
            meshRef.current.rotation.y += data.rotationSpeed;
        }
    });

    // Calculate visual size
    // If visual scale, we might want to exaggerate planet sizes too?
    // Earth = 1 radius. In visual scale, let's keep them somewhat detectable.
    const visualSize = scaleMode === 'visual' ? Math.max(0.3, data.radius * 0.4) : data.radius;

    return (
        <group ref={groupRef}>
            <Trail
                width={1} // Width of the line
                color={data.color} // Color of the line
                length={20} // Length of the trail
                decay={1} // How fast the trail fades away
                local={false} // Whether to use the target's world coordinates or local coordinates
                stride={0} // Min distance between previous and current point
                interval={1} // Number of frames to wait before next calculation
            >
                <mesh
                    ref={meshRef}
                    onClick={(e) => { e.stopPropagation(); onSelect(data.id); }}
                    onPointerOver={() => document.body.style.cursor = 'pointer'}
                    onPointerOut={() => document.body.style.cursor = 'auto'}
                >
                    <sphereGeometry args={[visualSize, 32, 32]} />
                    <meshStandardMaterial
                        color={data.color}
                        roughness={0.7}
                        metalness={0.2}
                    />
                    {selected && (
                        <mesh>
                            <sphereGeometry args={[visualSize * 1.2, 32, 32]} />
                            <meshBasicMaterial color="#00f2fe" wireframe transparent opacity={0.3} />
                        </mesh>
                    )}
                </mesh>
            </Trail>

            {/* Label */}
            <Text
                position={[0, visualSize + 0.5, 0]}
                fontSize={0.5}
                color="white"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.05}
                outlineColor="#000"
            >
                {data.name}
            </Text>
        </group>
    );
}
