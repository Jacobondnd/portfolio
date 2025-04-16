import * as THREE from 'three';
import gsap from 'gsap';

// Scene
const scene = new THREE.Scene();

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 3, 5); // Position the light
scene.add(directionalLight);

// Camera
const camera = new THREE.PerspectiveCamera(110, window.innerWidth / window.innerHeight, 0.1, 2000); // Wider FOV, Increased far clipping plane
camera.position.z = 5; // Move camera back so we can see the origin

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Improve sharpness on high-res displays

// Add renderer to DOM
const container = document.getElementById('container');
if (container) {
    container.appendChild(renderer.domElement);
} else {
    console.error('Container element not found!');
}

// Texture Loader
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('./textures/earth_daymap.jpg'); // Ensure you have this texture

// Earth Geometry and Material
const earthGeometry = new THREE.SphereGeometry(2, 64, 64); // Radius 2, high detail
const earthMaterial = new THREE.MeshStandardMaterial({
    map: earthTexture,
    metalness: 0.4, // Adjust for desired look
    roughness: 0.7  // Adjust for desired look
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// --- Earth Pulse Animation ---
gsap.to(earth.scale, {
    duration: 2,
    x: 1.1,
    y: 1.1,
    z: 1.1,
    yoyo: true,
    repeat: -1,
    ease: "power1.inOut"
});

// --- Starfield Background (Particle System) ---
const starCount = 10000; // Number of stars
const starGeometry = new THREE.BufferGeometry();
const starPositions = new Float32Array(starCount * 3); // 3 vertices per star (x, y, z)

for (let i = 0; i < starCount * 3; i++) {
    starPositions[i] = (Math.random() - 0.5) * 2000; // Random positions within a cube of side 2000
}

starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff, // White stars
    size: 2,          // Star size
    sizeAttenuation: true // Make stars smaller in the distance
});

const starField = new THREE.Points(starGeometry, starMaterial);
scene.add(starField);

// --- Raycaster for interaction ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// --- Interaction ---

function onPointerDown(event) {
    // Calculate mouse position in normalized device coordinates (-1 to +1) for both components
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObject(earth); // Check only against the earth object

    if (intersects.length > 0) {
        console.log("Earth clicked!");
        // Toggle the navigation menu visibility
        const navMenu = document.getElementById('nav-menu');
        if (navMenu) {
            navMenu.classList.toggle('visible');
        } else {
            console.error("Navigation menu element ('nav-menu') not found!");
        }
    }
}

window.addEventListener('click', onPointerDown); // Changed to 'click' for potentially better UX than 'pointerdown'


// OrbitControls (Optional, but helpful for debugging/viewing)
// import { OrbitControls } from 'three/examples/jsm/controls.js';
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;


// Handle window resize
window.addEventListener('resize', () => {
    // Update camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the Earth
    earth.rotation.y += 0.001; // Slow rotation

    // Rotate the Starfield
    starField.rotation.y += 0.0001; // Very slow rotation

    // Update controls if using OrbitControls
    // controls.update();

    // Render the scene
    renderer.render(scene, camera);
}

// Start animation
animate();
