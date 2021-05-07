import './App.css';
import * as THREE from 'three';
import { useEffect } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import { sunRadius } from './constants/constants';

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
    const ambientLight = new THREE.AmbientLight('#fffff', 0.7);
    gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);
    scene.add(ambientLight);

    // Directional light
    const moonLight = new THREE.DirectionalLight('#fffff', 1);
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
    const mercuryTexture = textureLoader.load('images/mercury-texture.jpeg');

    /**
     * Sun
     */
    const sunGeometry = new THREE.SphereGeometry(sunRadius, 32, 32);
    const sunMaterial = new THREE.MeshStandardMaterial({ map: sunTexture });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    /**
     * Mercury
     */
    const mercuryGeometry = new THREE.SphereGeometry(sunRadius / 4, 32, 32);
    const mercuryMaterial = new THREE.MeshStandardMaterial({
      map: mercuryTexture,
    });
    const mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
    scene.add(mercury);
    mercury.position.x = 4;
    mercury.position.z = -5;

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
    camera.position.z = 15;
    scene.add(camera);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const clock = new THREE.Clock();
    var animate = function () {
      const elapsedTime = clock.getElapsedTime();
      requestAnimationFrame(animate);

      sun.rotation.y = Math.PI * 0.1 * elapsedTime;

      const angle = elapsedTime * 0.5;
      mercury.position.x = Math.sin(angle) * 5;
      mercury.position.z = Math.cos(angle) * 3;
      mercury.position.y = Math.cos(angle) * -2;
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
