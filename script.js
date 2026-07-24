// ======================================
// BATIK KEDIRI × JOGJA
// script.js
// Part 3 - Bagian 1
// ======================================

import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

// --------------------------------------
// ELEMENT
// --------------------------------------

const viewer = document.getElementById("viewer");

const loadingScreen = document.getElementById("loadingScreen");

const progressText = document.getElementById("progressText");

// --------------------------------------
// SCENE
// --------------------------------------

const scene = new THREE.Scene();

scene.background = new THREE.Color(0xffffff);

// --------------------------------------
// CAMERA
// --------------------------------------

const camera = new THREE.PerspectiveCamera(

35,

window.innerWidth / window.innerHeight,

0.1,

100

);

camera.position.set(0, 1.4, 4);

// --------------------------------------
// RENDERER
// --------------------------------------

const renderer = new THREE.WebGLRenderer({

antialias: true,

alpha: true

});

renderer.setPixelRatio(window.devicePixelRatio);

renderer.setSize(

window.innerWidth,

window.innerHeight

);

renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.shadowMap.enabled = true;

viewer.appendChild(renderer.domElement);

// --------------------------------------
// CONTROL
// --------------------------------------

const controls = new OrbitControls(

camera,

renderer.domElement

);

controls.enableDamping = true;

controls.dampingFactor = 0.08;

controls.target.set(0, 1.2, 0);

controls.autoRotate = false;

controls.autoRotateSpeed = 1.5;

controls.minDistance = 2.2;

controls.maxDistance = 7;

// --------------------------------------
// LIGHT
// --------------------------------------

const hemi = new THREE.HemisphereLight(

0xffffff,

0xe0e0e0,

2

);

scene.add(hemi);

const dir = new THREE.DirectionalLight(

0xffffff,

2

);

dir.position.set(4, 6, 4);

dir.castShadow = true;

scene.add(dir);

const fill = new THREE.DirectionalLight(

0xffffff,

1

);

fill.position.set(-4, 3, -3);

scene.add(fill);

// --------------------------------------
// FLOOR
// --------------------------------------

const floor = new THREE.Mesh(

new THREE.PlaneGeometry(20,20),

new THREE.ShadowMaterial({

opacity:0.15

})

);

floor.rotation.x = -Math.PI/2;

floor.receiveShadow = true;

scene.add(floor);

// --------------------------------------
// HDR ENVIRONMENT
// --------------------------------------



// --------------------------------------
// MODEL
// --------------------------------------

let shirt;

const loader = new GLTFLoader();

loader.load(

"assets/batik_men_shirt.glb",

(gltf)=>{

shirt = gltf.scene;

shirt.position.set(0,0,0);

shirt.scale.set(1.25,1.25,1.25);

shirt.traverse((obj)=>{

if(obj.isMesh){

obj.castShadow = true;

obj.receiveShadow = true;

}

});

scene.add(shirt);

loadingScreen.style.display="none";

},

(xhr)=>{

let percent =

(xhr.loaded/xhr.total)*100;

progressText.innerHTML=

Math.round(percent)+"%";

},

(error)=>{

console.error(error);

alert("Model gagal dimuat.");

}

);

// --------------------------------------
// RESIZE
// --------------------------------------

window.addEventListener(

"resize",

()=>{

camera.aspect=

window.innerWidth/

window.innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(

window.innerWidth,

window.innerHeight

);

}

);

// --------------------------------------
// ANIMATION
// --------------------------------------

function animate(){

requestAnimationFrame(animate);

controls.update();

renderer.render(

scene,

camera

);

}

animate();
