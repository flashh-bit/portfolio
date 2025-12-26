export interface PlanetData {
    id: string; // unique ID
    name: string;
    type: "star" | "planet" | "dwarf";
    radius: number; // relative to Earth (Earth = 1)
    rotationSpeed: number; // variable for rotation animation
    textureUrl: string; // placeholder path
    description: string;
    color: string; // fallback color
    // Keplerian Elements (J2000 epoch)
    orbit: {
        a: number; // Semi-major axis (AU)
        e: number; // Eccentricity
        i: number; // Inclination (deg)
        om: number; // Longitude of Ascending Node (deg)
        w: number; // Argument of Periapsis (deg)
        ma: number; // Mean Anomaly at Epoch (deg)
        mod?: undefined; // generic modifier
    };
}

export const SOLAR_SYSTEM_DATA: PlanetData[] = [
    {
        id: "sun",
        name: "Sun",
        type: "star",
        radius: 109, // Relative to Earth
        rotationSpeed: 0.001,
        textureUrl: "/textures/sun.jpg",
        description: "The star at the center of our Solar System.",
        color: "#FDB813",
        orbit: { a: 0, e: 0, i: 0, om: 0, w: 0, ma: 0 },
    },
    {
        id: "mercury",
        name: "Mercury",
        type: "planet",
        radius: 0.38,
        rotationSpeed: 0.005,
        textureUrl: "/textures/mercury.jpg",
        description: "The smallest planet in the Solar System and the closest to the Sun.",
        color: "#A5A5A5",
        orbit: { a: 0.387, e: 0.205, i: 7.0, om: 48.33, w: 29.12, ma: 174.79 },
    },
    {
        id: "venus",
        name: "Venus",
        type: "planet",
        radius: 0.95,
        rotationSpeed: 0.003,
        textureUrl: "/textures/venus.jpg",
        description: "Second planet from the Sun. It has a thick, toxic atmosphere.",
        color: "#E3BB76",
        orbit: { a: 0.723, e: 0.007, i: 3.39, om: 76.68, w: 54.85, ma: 50.11 },
    },
    {
        id: "earth",
        name: "Earth",
        type: "planet",
        radius: 1,
        rotationSpeed: 0.01,
        textureUrl: "/textures/earth_daymap.jpg",
        description: "Our home. The only known planet to harbor life.",
        color: "#22A6B3",
        orbit: { a: 1.0, e: 0.0167, i: 0.0, om: -11.26, w: 102.94, ma: 357.51 }, // i=0 referential
    },
    {
        id: "mars",
        name: "Mars",
        type: "planet",
        radius: 0.53,
        rotationSpeed: 0.009,
        textureUrl: "/textures/mars.jpg",
        description: "The Red Planet. Dusty, cold, desert world with a very thin atmosphere.",
        color: "#E27B58",
        orbit: { a: 1.524, e: 0.0934, i: 1.85, om: 49.58, w: 286.50, ma: 19.41 },
    },
    {
        id: "jupiter",
        name: "Jupiter",
        type: "planet",
        radius: 11.2,
        rotationSpeed: 0.02,
        textureUrl: "/textures/jupiter.jpg",
        description: "The largest planet in the Solar System. A gas giant with a Great Red Spot.",
        color: "#C99039",
        orbit: { a: 5.204, e: 0.0489, i: 1.3, om: 100.56, w: 273.87, ma: 20.02 },
    },
    {
        id: "saturn",
        name: "Saturn",
        type: "planet",
        radius: 9.45,
        rotationSpeed: 0.018,
        textureUrl: "/textures/saturn.jpg",
        description: "Adorned with a dazzling, complex system of icy rings.",
        color: "#EAD18B",
        orbit: { a: 9.582, e: 0.0565, i: 2.48, om: 113.72, w: 339.39, ma: 317.02 },
    },
    {
        id: "uranus",
        name: "Uranus",
        type: "planet",
        radius: 4.0,
        rotationSpeed: 0.014,
        textureUrl: "/textures/uranus.jpg",
        description: "An ice giant. Rotates at a nearly 90-degree angle from the plane of its orbit.",
        color: "#D1F7F8",
        orbit: { a: 19.2, e: 0.046, i: 0.77, om: 74.0, w: 96.66, ma: 142.59 },
    },
    {
        id: "neptune",
        name: "Neptune",
        type: "planet",
        radius: 3.88,
        rotationSpeed: 0.015,
        textureUrl: "/textures/neptune.jpg",
        description: "Another ice giant. Dark, cold, and whipped by supersonic winds.",
        color: "#5B5DDF",
        orbit: { a: 30.05, e: 0.009, i: 1.77, om: 131.78, w: 272.85, ma: 260.25 },
    }
];
