import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./JewelryMoodboard.css";

const items = [
  { id: 1, name: "Gold Ring", color: 0xffd700, geometry: new THREE.TorusGeometry(0.5, 0.15, 16, 100) },
  { id: 2, name: "Silver Necklace", color: 0xc0c0c0, geometry: new THREE.TorusKnotGeometry(0.5, 0.15, 100, 16) },
  { id: 3, name: "Diamond Earrings", color: 0xe0ffff, geometry: new THREE.SphereGeometry(0.3, 32, 32) },
  { id: 4, name: "Ruby Bracelet", color: 0xb22222, geometry: new THREE.TorusGeometry(0.7, 0.1, 16, 100) },
  { id: 5, name: "Emerald Pendant", color: 0x50c878, geometry: new THREE.ConeGeometry(0.3, 0.6, 32) },
];

const ThreeDMoodboard = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const [sceneObjects, setSceneObjects] = useState([]);

  useEffect(() => {
    const width = mountRef.current.clientWidth;
    const height = 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfafafa);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const animate = () => {
      requestAnimationFrame(animate);
      sceneObjects.forEach(obj => obj.rotation.y += 0.01);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [sceneObjects]);

  const onDragStart = (event, item) => {
    event.dataTransfer.setData("itemId", item.id);
  };

  const onDrop = (event) => {
    event.preventDefault();
    const itemId = parseInt(event.dataTransfer.getData("itemId"));
    const item = items.find(i => i.id === itemId);
    if (item) {
      const material = new THREE.MeshStandardMaterial({ color: item.color, metalness: 0.8, roughness: 0.2 });
      const mesh = new THREE.Mesh(item.geometry, material);
      mesh.position.x = (Math.random() - 0.5) * 2;
      mesh.position.y = (Math.random() - 0.5) * 2;
      sceneRef.current.add(mesh);
      setSceneObjects(prev => [...prev, mesh]);
    }
  };

  const onDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className="three-moodboard-container">
      <h2>Interactive 3D Moodboard</h2>
      <p>Drag items into the 3D scene below:</p>

      <div className="items-list">
        {items.map(item => (
          <div
            key={item.id}
            className="item"
            style={{ backgroundColor: `#${item.color.toString(16)}` }}
            draggable
            onDragStart={(e) => onDragStart(e, item)}
          >
            {item.name}
          </div>
        ))}
      </div>

      <div
        ref={mountRef}
        className="threejs-dropzone"
        onDrop={onDrop}
        onDragOver={onDragOver}
      />
    </div>
  );
};

export default ThreeDMoodboard;
