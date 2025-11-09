import './App.css';
import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { MapControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import { sunRadius } from './constants/constants';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function App() {
  const planetLabelRef = useRef(null);

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
    sun.userData.name = 'Sun';
    scene.add(sun);

    /**
     * Mercury
     */
    const mercuryGeometry = new THREE.SphereGeometry(sunRadius / 5, 32, 32);
    const mercuryMaterial = new THREE.MeshStandardMaterial({
      map: mercuryTexture,
    });
    const mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
    mercury.userData.name = 'Mercury';
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
    venus.userData.name = 'Venus';
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
    earth.userData.name = 'Earth';
    scene.add(earth);
    earth.position.x = venus.position.x + 1.8;
    earth.position.z = -3;

    /**
     * Mars
     */
    const marsGeometry = new THREE.SphereGeometry(sunRadius / 6, 32, 32);
    const marsMaterial = new THREE.MeshStandardMaterial({
      color: '#E27B58',
      roughness: 0.8,
    });
    const mars = new THREE.Mesh(marsGeometry, marsMaterial);
    mars.userData.name = 'Mars';
    scene.add(mars);
    mars.position.x = earth.position.x + 2.5;
    mars.position.z = -3;

    /**
     * Jupiter
     */
    const jupiterGeometry = new THREE.SphereGeometry(sunRadius / 2.5, 32, 32);
    const jupiterMaterial = new THREE.MeshStandardMaterial({
      color: '#C88B3A',
      roughness: 0.6,
    });
    const jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
    jupiter.userData.name = 'Jupiter';
    scene.add(jupiter);
    jupiter.position.x = mars.position.x + 4.5;
    jupiter.position.z = -3;

    /**
     * saturn
     */
    let saturn = null;
    const planetsArray = [sun, mercury, venus, earth, mars, jupiter, uranus, neptune];

    loader.load('models/saturn.glb', (glb) => {
      saturn = glb.scene;
      saturn.userData.name = 'Saturn';
      saturn.scale.set(0.001, 0.001, 0.001);
      saturn.position.x = jupiter.position.x + 5;
      saturn.position.z = -3;
      scene.add(saturn);
      planetsArray.push(saturn);
    });

    /**
     * Uranus
     */
    const uranusGeometry = new THREE.SphereGeometry(sunRadius / 3.5, 32, 32);
    const uranusMaterial = new THREE.MeshStandardMaterial({
      color: '#4FD0E0',
      roughness: 0.5,
    });
    const uranus = new THREE.Mesh(uranusGeometry, uranusMaterial);
    uranus.userData.name = 'Uranus';
    scene.add(uranus);
    uranus.position.x = 19;
    uranus.position.z = -3;

    /**
     * Neptune
     */
    const neptuneGeometry = new THREE.SphereGeometry(sunRadius / 3.8, 32, 32);
    const neptuneMaterial = new THREE.MeshStandardMaterial({
      color: '#4166F5',
      roughness: 0.5,
    });
    const neptune = new THREE.Mesh(neptuneGeometry, neptuneMaterial);
    neptune.userData.name = 'Neptune';
    scene.add(neptune);
    neptune.position.x = uranus.position.x + 3.5;
    neptune.position.z = -3;

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      200
    );
    camera.position.x = 0;
    camera.position.y = 15;
    camera.position.z = 35;
    scene.add(camera);

    // Controls
    const controls = new MapControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 5;
    controls.maxDistance = 150;

    // Raycaster for hover detection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Mouse move event for hover detection
    const onMouseMove = (event) => {
      mouse.x = (event.clientX / sizes.width) * 2 - 1;
      mouse.y = -(event.clientY / sizes.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planetsArray, true);

      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        let planetName = intersectedObject.userData.name;

        // For Saturn (GLTF model), check parent hierarchy
        if (!planetName && intersectedObject.parent) {
          let parent = intersectedObject.parent;
          while (parent && !planetName) {
            planetName = parent.userData.name;
            parent = parent.parent;
          }
        }

        if (planetName && planetLabelRef.current) {
          planetLabelRef.current.textContent = planetName;
          planetLabelRef.current.style.display = 'block';
          planetLabelRef.current.style.left = event.clientX + 15 + 'px';
          planetLabelRef.current.style.top = event.clientY + 15 + 'px';
        }
      } else if (planetLabelRef.current) {
        planetLabelRef.current.style.display = 'none';
      }
    };

    window.addEventListener('mousemove', onMouseMove);

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

      const marsAngle = elapsedTime * 0.15;
      mars.position.x = Math.sin(marsAngle) * 7.8;
      mars.position.z = Math.cos(marsAngle) * 8.5;
      mars.position.y = Math.cos(marsAngle) * -0.7;
      mars.rotation.y = Math.PI * 0.25 * elapsedTime;

      const jupiterAngle = elapsedTime * 0.08;
      jupiter.position.x = Math.sin(jupiterAngle) * 11;
      jupiter.position.z = Math.cos(jupiterAngle) * 12;
      jupiter.position.y = Math.cos(jupiterAngle) * -1.2;
      jupiter.rotation.y = Math.PI * 0.15 * elapsedTime;

      if (saturn) {
        const saturnAngle = elapsedTime * 0.06;
        saturn.position.x = Math.sin(saturnAngle) * 15;
        saturn.position.z = Math.cos(saturnAngle) * 16;
        saturn.position.y = Math.cos(saturnAngle) * -1.5;
        saturn.rotation.y = Math.PI * 0.1 * elapsedTime;
      }

      const uranusAngle = elapsedTime * 0.04;
      uranus.position.x = Math.sin(uranusAngle) * 19;
      uranus.position.z = Math.cos(uranusAngle) * 20;
      uranus.position.y = Math.cos(uranusAngle) * -1.8;
      uranus.rotation.y = Math.PI * 0.08 * elapsedTime;

      const neptuneAngle = elapsedTime * 0.03;
      neptune.position.x = Math.sin(neptuneAngle) * 22.5;
      neptune.position.z = Math.cos(neptuneAngle) * 24;
      neptune.position.y = Math.cos(neptuneAngle) * -2;
      neptune.rotation.y = Math.PI * 0.07 * elapsedTime;

      // Update controls
      controls.update();

      // Render
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="App">
      <div ref={planetLabelRef} className="planet-label"></div>
    </div>
  );
}

export default App;
