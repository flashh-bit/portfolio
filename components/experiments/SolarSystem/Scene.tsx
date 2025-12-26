import { Canvas, useThree } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { Suspense, useState, useRef, useEffect } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Sun } from "./Sun";
import { Planet } from "./Planet";
import { SOLAR_SYSTEM_DATA } from "../../../data/solarSystemData";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { calculateOrbitalPosition } from "../../../utils/orbitalPhysics";

function Simulation({ timeScale, isPaused, scaleMode, selectedId, onSelect }: any) {
    const timeRef = useRef(0);
    const [targetTime, setTargetTime] = useState(0);

    // Camera Control Logic
    const { camera, controls } = useThree<any>();
    const currentTargetPos = useRef(new THREE.Vector3());

    useFrame((state, delta) => {
        // 1. Update Time
        if (!isPaused) {
            timeRef.current += delta * 0.1 * timeScale;
        }
        setTargetTime(timeRef.current);

        // 2. Camera Focus Logic
        if (selectedId && controls) {
            const planetData = SOLAR_SYSTEM_DATA.find(p => p.id === selectedId);
            if (planetData) {
                // Calculate current position of the target
                const pos = calculateOrbitalPosition(planetData, timeRef.current, scaleMode);

                // Lerp controls target to planet position
                const lerpSpeed = 2 * delta;
                controls.target.lerp(pos, lerpSpeed);

                // Move camera to maintain relative offset? 
                // Or just let it look at the planet.
                // Ideally we want to "chase" it.
                // Let's just focus for now (lookAt). 
                // If we want to chase, we need to update camera position too.

                // Simple Chase: Keep camera at (pos + offset)
                // const offset = new THREE.Vector3(5, 5, 5); // generic offset
                // camera.position.lerp(pos.clone().add(offset), lerpSpeed);

                // For now, just updating target is good enough to center it.
                controls.update();
            }
        }
    });

    return (
        <>
            <Sun />
            {SOLAR_SYSTEM_DATA.map((planet) => {
                if (planet.id === 'sun') return null;
                return (
                    <Planet
                        key={planet.id}
                        data={planet}
                        time={targetTime}
                        scaleMode={scaleMode}
                        selected={selectedId === planet.id}
                        onSelect={onSelect}
                    />
                );
            })}
        </>
    );
}

export default function SolarSystemScene({
    timeScale = 1,
    isPaused = false,
    scaleMode = 'visual',
    selectedId,
    onSelect
}: any) {
    return (
        <div className="w-full h-full bg-black">
            <Canvas camera={{ position: [0, 40, 50], fov: 45 }} gl={{ antialias: true, toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5 }}>
                <OrbitControls
                    makeDefault
                    minDistance={scaleMode === 'visual' ? 10 : 20}
                    maxDistance={scaleMode === 'visual' ? 300 : 2000}
                    enablePan={true}
                />
                <color attach="background" args={["#000"]} />
                <ambientLight intensity={0.05} />

                <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                <Suspense fallback={null}>
                    <Simulation
                        timeScale={timeScale}
                        isPaused={isPaused}
                        scaleMode={scaleMode}
                        selectedId={selectedId}
                        onSelect={onSelect}
                    />

                    <EffectComposer>
                        <Bloom luminanceThreshold={0.9} mipmapBlur intensity={2.0} radius={0.5} />
                    </EffectComposer>
                </Suspense>
            </Canvas>
        </div>
    );
}
