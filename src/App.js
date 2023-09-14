import './App.css';
import * as THREE from 'three';
import { useEffect } from 'react';
import {
  OrbitControls,
  MapControls,
} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import { sunRadius } from './constants/constants';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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

    const loader = new GLTFLoader();

    /**
     * Textures
     */
    const textureLoader = new THREE.TextureLoader();
    const sunTexture = textureLoader.load('/images/sun-texture.jpeg');
    const mercuryTexture = textureLoader.load('images/mercury-texture.jpeg');
    const venusTexture = textureLoader.load('images/venus-texture.jpeg');
    const earthTexture = textureLoader.load('images/earth-texture.jpeg');
    const earthNormalTexture = textureLoader.load('images/earth-normal.tif');
    const starTexture = textureLoader.load('images/bg/stars.jpeg');
    scene.background = starTexture;

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
    const mercuryGeometry = new THREE.SphereGeometry(sunRadius / 5, 32, 32);
    const mercuryMaterial = new THREE.MeshStandardMaterial({
      map: mercuryTexture,
    });
    const mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
    scene.add(mercury);
    mercury.position.x = 3;
    mercury.position.z = -3;

    /**
     * venus
     */
    const venusGeometry = new THREE.SphereGeometry(sunRadius / 3.5, 32, 32);
    const venusMaterial = new THREE.MeshStandardMaterial({
      map: venusTexture,
    });
    const venus = new THREE.Mesh(venusGeometry, venusMaterial);
    scene.add(venus);
    venus.position.x = mercury.position.x + 1.5;
    venus.position.z = -3;

    /**
     * earth
     */
    const earthGeometry = new THREE.SphereGeometry(sunRadius / 3, 32, 32);
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      normalMap: earthNormalTexture,
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);
    earth.position.x = venus.position.x + 1.8;
    earth.position.z = -3;

    /**
     * saturn
     */
    let saturn = null;
    loader.load('models/saturn.glb', (glb) => {
      saturn = glb.scene;
      saturn.scale.set(0.001, 0.001, 0.001);
      saturn.position.x = 8.8;
      saturn.position.z = -3;
      scene.add(saturn);
    });

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
    const controls = new MapControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 10;
    controls.maxDistance = 100;

    const clock = new THREE.Clock();
    var animate = function () {
      const elapsedTime = clock.getElapsedTime();
      requestAnimationFrame(animate);

      sun.rotation.y = Math.PI * 0.05 * elapsedTime;

      const mercuryAngle = elapsedTime * 0.5;
      mercury.position.x = Math.sin(mercuryAngle) * 3;
      mercury.position.z = Math.cos(mercuryAngle) * 4;
      mercury.position.y = Math.cos(mercuryAngle) * -2;
      mercury.rotation.y = Math.PI * 0.7 * elapsedTime;

      const venusAngle = elapsedTime * 0.3;
      venus.position.x = Math.sin(venusAngle) * 4.5;
      venus.position.z = Math.cos(venusAngle) * 4;
      venus.position.y = Math.cos(mercuryAngle) * 0.5;
      venus.rotation.y = Math.PI * 0.5 * elapsedTime;

      const earthAngle = elapsedTime * 0.2;
      earth.position.x = Math.sin(earthAngle) * 6.3;
      earth.position.z = Math.cos(earthAngle) * 7;
      earth.position.y = Math.cos(earthAngle) * -0.5;
      earth.rotation.y = Math.PI * 0.3 * elapsedTime;

      if (saturn) {
        const saturnAngle = elapsedTime * 0.09;
        saturn.position.x = Math.sin(saturnAngle) * 8.3;
        saturn.position.z = Math.cos(saturnAngle) * 9;
        saturn.position.y = Math.cos(saturnAngle) * -0.9;
        saturn.rotation.y = Math.PI * 0.1 * elapsedTime;
      }
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
