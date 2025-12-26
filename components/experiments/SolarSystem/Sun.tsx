import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Sun() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.05; // Slow rotation
        }
    });

    return (
        <group>
            <pointLight
                position={[0, 0, 0]}
                intensity={2}
                distance={200} // Range of light
                decay={1.2}
                color="#fff" // bright white light
            />

            {/* Visual Sun */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[2.5, 32, 32]} /> {/* Scaled down visual sun */}
                <meshStandardMaterial
                    emissive="#FDB813"
                    emissiveIntensity={3}
                    color="#FDB813"
                    toneMapped={false} // Allow it to blow out bloom
                />
            </mesh>
        </group>
    );
}
