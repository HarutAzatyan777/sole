import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSG } from "three-csg-ts"; // Install: npm install three-csg-ts
import "./JewelryMoodboard.css";

// Constants
const materialDensities = {
  gold: 0.0193,      // g/mm³
  silver: 0.0105,
  platinum: 0.02145,
};

const basicShapes = [
  { id: 1, name: "Circle (Ring)", type: "gold", radius: 9, thickness: 1, geometry: null },
  { id: 2, name: "Rectangle (Plate)", type: "silver", width: 10, height: 0.5, depth: 5, geometry: null },
  { id: 3, name: "Sphere (Pendant)", type: "platinum", radius: 4, geometry: null },
];

const details = [
  { id: 101, name: "Gemstone", color: 0xff0000, size: 1, geometry: null },
  { id: 102, name: "Pattern", color: 0x00ff00, size: 1, geometry: null },
  { id: 103, name: "Engraving", color: 0x000000, size: 1, geometry: null },
];

const JewelryMoodboard = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const [sceneObjects, setSceneObjects] = useState([]);
  const [weightInfo, setWeightInfo] = useState([]);

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfafafa);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(20, 20, 20);
    scene.add(pointLight);

    const animate = () => {
      requestAnimationFrame(animate);
      sceneObjects.forEach(obj => obj.rotation.y += 0.01);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [sceneObjects]);

  const createGeometry = (item) => {
    switch(item.name) {
      case "Circle (Ring)":
        return new THREE.TorusGeometry(item.radius, item.thickness, 32, 100);
      case "Rectangle (Plate)":
        return new THREE.BoxGeometry(item.width, item.height, item.depth);
      case "Sphere (Pendant)":
        return new THREE.SphereGeometry(item.radius, 32, 32);
      case "Gemstone":
        return new THREE.SphereGeometry(item.size, 16, 16);
      case "Pattern":
        return new THREE.TorusGeometry(item.size, 0.1, 8, 50);
      case "Engraving":
        return new THREE.BoxGeometry(item.size*0.5, item.size*0.5, item.size*0.2);
      default:
        return new THREE.BoxGeometry(1,1,1);
    }
  };

  const computeVolume = (geometry) => {
    let pos = geometry.attributes.position;
    let volume = 0;
    for(let i=0; i<pos.count; i+=3) {
      const ax = pos.getX(i), ay = pos.getY(i), az = pos.getZ(i);
      const bx = pos.getX(i+1), by = pos.getY(i+1), bz = pos.getZ(i+1);
      const cx = pos.getX(i+2), cy = pos.getY(i+2), cz = pos.getZ(i+2);
      volume += (ax*(by*cz - bz*cy) - ay*(bx*cz - bz*cx) + az*(bx*cy - by*cx))/6;
    }
    return Math.abs(volume); // in mm³
  };

  const onDrop = (event, type = "shape") => {
    event.preventDefault();
    const itemId = parseInt(event.dataTransfer.getData("itemId"));
    let item = null;

    if(type === "shape") item = basicShapes.find(i=>i.id===itemId);
    if(type === "detail") item = details.find(i=>i.id===itemId);
    if(!item) return;

    const geometry = createGeometry(item);
    const material = new THREE.MeshStandardMaterial({ color: item.color || 0xffcc00, metalness: 0.8, roughness: 0.2 });
    const mesh = new THREE.Mesh(geometry, material);

    // Layering: details on top
    mesh.position.x = (Math.random()-0.5)*5;
    mesh.position.y = (Math.random()-0.5)*5;
    mesh.position.z = type==="detail"?0.2:0;

    sceneRef.current.add(mesh);
    setSceneObjects(prev => [...prev, mesh]);

    // Compute weight
    const volume = computeVolume(geometry); // mm³
    const density = materialDensities[item.type] || 0.01;
    const weight = volume * density;
    setWeightInfo(prev => [...prev, { name: item.name, weight: weight.toFixed(2)+" g" }]);
  };

  const onDragOver = (e) => e.preventDefault();

  return (
    <div className="moodboard-container">
      <h2>Jewelry Moodboard with Precision & Weight Calculation</h2>

      <div className="items-section">
        <h3>Basic Shapes</h3>
        <div className="items-list">
          {basicShapes.map(shape => (
            <div key={shape.id} className="item"
              style={{ backgroundColor: shape.color?`#${shape.color.toString(16)}`:"#FFD700" }}
              draggable onDragStart={(e)=>e.dataTransfer.setData("itemId", shape.id)}
              onDragEnd={(e)=>onDrop(e, "shape")}
            >{shape.name}</div>
          ))}
        </div>

        <h3>Details / Layers</h3>
        <div className="items-list">
          {details.map(detail => (
            <div key={detail.id} className="item"
              style={{ backgroundColor: `#${detail.color.toString(16)}` }}
              draggable onDragStart={(e)=>e.dataTransfer.setData("itemId", detail.id)}
              onDragEnd={(e)=>onDrop(e, "detail")}
            >{detail.name}</div>
          ))}
        </div>
      </div>

      <div className="threejs-dropzone" ref={mountRef} onDrop={onDrop} onDragOver={onDragOver}/>

      <div className="weight-section">
        <h3>Objects Weight:</h3>
        <ul>
          {weightInfo.map((w,i)=><li key={i}>{w.name}: {w.weight}</li>)}
        </ul>
      </div>
    </div>
  );
};

export default JewelryMoodboard;
