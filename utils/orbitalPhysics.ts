import * as THREE from "three";
import { PlanetData } from "../data/solarSystemData";

const DEG_TO_RAD = Math.PI / 180;

/**
 * Solves Kepler's Equation: M = E - e * sin(E) for E (Eccentric Anomaly)
 * using Newton-Raphson iteration.
 */
export function solveKepler(M: number, e: number): number {
    let E = M;
    const tolerance = 1e-6;
    const maxIter = 30;

    for (let i = 0; i < maxIter; i++) {
        const delta = E - e * Math.sin(E) - M;
        if (Math.abs(delta) < tolerance) break;
        E = E - delta / (1 - e * Math.cos(E));
    }
    return E;
}

/**
 * Calculates the 3D position of a planet at a given time.
 * @param planet Planet data containing orbital elements
 * @param time Time in "years" from epoch (or any scaled unit)
 * @param scaleMode 'real' | 'visual' - Visual compresses distances logarithmically or linearly for display
 */
export function calculateOrbitalPosition(
    planet: PlanetData,
    time: number,
    scaleMode: 'real' | 'visual' = 'visual'
): THREE.Vector3 {
    const { a, e, i, om, w, ma } = planet.orbit;

    if (a === 0) return new THREE.Vector3(0, 0, 0); // Sun

    // 1. Mean Motion (n) and Mean Anomaly (M)
    // n = 2pi / Period. Period T^2 = a^3 (Kepler 3rd Law) -> T = a^(1.5)
    const period = Math.pow(a, 1.5);
    const n = (2 * Math.PI) / period;

    // Current Mean Anomaly
    let M = (ma * DEG_TO_RAD) + n * time;
    // Wrap M to 0-2PI
    M = M % (2 * Math.PI);

    // 2. solve for Eccentric Anomaly E
    const E = solveKepler(M, e);

    // 3. True Anomaly v
    // tan(v/2) = sqrt((1+e)/(1-e)) * tan(E/2)
    const v = 2 * Math.atan(Math.sqrt((1 + e) / (1 - e)) * Math.tan(E / 2));

    // 4. Distance r
    const rUnscaled = a * (1 - e * Math.cos(E));

    // --- SCALING LOGIC ---
    let r = rUnscaled;
    if (scaleMode === 'visual') {
        // Logarithmic-ish scaling to make outer planets visible
        // or just a custom compression: sqrt(a) * factor?
        // Power 0.5 (Sqrt) gives a nice spread where Jupiter isn't too far.
        // Scalar 12 keeps Neptune within ~100 units.
        r = Math.pow(rUnscaled, 0.5) * 12;
    } else {
        // Real scale: 1 AU = 50 units (example)
        r = rUnscaled * 50;
    }

    // 5. Heliocentric coordinates in orbital plane
    const x_orbit = r * Math.cos(v);
    const y_orbit = r * Math.sin(v);

    // 6. Rotate to ecliptic frame
    // We need to apply 3 rotations: 
    // - Argument of Periapsis (w) around Z
    // - Inclination (i) around X
    // - Ascending Node (om) around Z

    // Pre-compute trigo
    const cos_om = Math.cos(om * DEG_TO_RAD);
    const sin_om = Math.sin(om * DEG_TO_RAD);
    const cos_w = Math.cos(w * DEG_TO_RAD);
    const sin_w = Math.sin(w * DEG_TO_RAD);
    const cos_i = Math.cos(i * DEG_TO_RAD);
    const sin_i = Math.sin(i * DEG_TO_RAD);

    // Transformation matrices combined manually for performance
    // X = r * (cos(om) cos(w+v) - sin(om) sin(w+v) cos(i)) -- simplification if w is strictly perisapsis
    // Standard vector rotation:

    // P = position in plane (x_orbit, y_orbit, 0)
    // Rotate by w around Z
    const x_w = x_orbit * cos_w - y_orbit * sin_w;
    const y_w = x_orbit * sin_w + y_orbit * cos_w;
    const z_w = 0;

    // Rotate by i around X
    const x_i = x_w;
    const y_i = y_w * cos_i - z_w * sin_i;
    const z_i = y_w * sin_i + z_w * cos_i;

    // Rotate by om around Z
    const x_final = x_i * cos_om - y_i * sin_om;
    const y_final = x_i * sin_om + y_i * cos_om;
    const z_final = z_i;

    // Swap Y and Z because THREE.js Y is up, but astronomy Z is usually "up" relative to plane
    // Actually in THREE, Y is up. Ecliptic usually is X-Z plane.
    // So we map: x_final -> X, y_final -> Z, z_final -> Y (height)
    return new THREE.Vector3(x_final, z_final, y_final);
}
