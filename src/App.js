import './App.css';
import * as THREE from 'three';
import { useEffect } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

function App() {
  useEffect(() => {
    // Debug
    const gui = new dat.GUI();
    const scene = new THREE.Scene();

    /**
     * Sizes
     */
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    /**
     * Renderer
     */

    window.addEventListener('resize', () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.body.appendChild(renderer.domElement);

    /**
     * Lights
     */
    // Ambient light
    const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.5);
    gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);
    scene.add(ambientLight);

    // Directional light
    const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.5);
    moonLight.position.set(4, 5, -2);

    gui.add(moonLight, 'intensity').min(0).max(1).step(0.001);
    gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001);
    gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001);
    gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001);
    scene.add(moonLight);

    /**
     * Textures
     */
    const textureLoader = new THREE.TextureLoader();
    const sunTexture = textureLoader.load('/images/sun-texture.png');

    /**
     * Sun
     */
    const planetGeometry = new THREE.SphereGeometry(2, 32, 32);
    const sunMaterial = new THREE.MeshStandardMaterial({ map: sunTexture });
    const sun = new THREE.Mesh(planetGeometry, sunMaterial);
    scene.add(sun);

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.x = 4;
    camera.position.y = 2;
    camera.position.z = 5;
    scene.add(camera);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const clock = new THREE.Clock();
    var animate = function () {
      const elapsedTime = clock.getElapsedTime();
      requestAnimationFrame(animate);

      sun.rotation.y = Math.PI * 0.25 * elapsedTime;
      // Update controls
      controls.update();

      // Render
      renderer.render(scene, camera);
    };
    animate();
  }, []);

  return <div className="App"></div>;
}

export default App;
