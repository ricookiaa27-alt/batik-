// ======================================
// BATIK KEDIRI × JOGJA
// script.js
// Part 3 - Bagian 1
// ======================================

import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

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

camera.position.set(0, 2, 8);

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

controls.target.set(0, 0, 0);

controls.autoRotate = false;

controls.autoRotateSpeed = 1.5;

controls.enablePan = false;

controls.minDistance = 0.5;

controls.maxDistance = 10;
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

    (gltf) => {

        shirt = gltf.scene;

        shirt.traverse((obj) => {

            if (obj.isMesh) {

                obj.castShadow = true;
                obj.receiveShadow = true;

            }

        });

        scene.add(shirt);
        
        shirt.traverse((child) => {
    if (child.isMesh) {
        child.material.side = THREE.DoubleSide;
        child.material.needsUpdate = true;
    }
});

        // ==========================
        // AUTO CENTER
        // ==========================

        const box = new THREE.Box3().setFromObject(shirt);

        const center = box.getCenter(new THREE.Vector3());

        const size = box.getSize(new THREE.Vector3());

        shirt.position.x -= center.x;
        shirt.position.y -= center.y;
        shirt.position.z -= center.z;

        // ==========================
        // AUTO SCALE
        // ==========================

        const maxDim = Math.max(size.x, size.y, size.z);

        const scale = 2 / maxDim;

        shirt.scale.setScalar(scale);

        shirt.updateMatrixWorld(true);

        // ==========================
        // UPDATE BOUNDING BOX
        // ==========================

        const newBox = new THREE.Box3().setFromObject(shirt);

        const newCenter = newBox.getCenter(new THREE.Vector3());

        const newSize = newBox.getSize(new THREE.Vector3());

        const radius = Math.max(
            newSize.x,
            newSize.y,
            newSize.z
        );

        controls.target.copy(newCenter);

        camera.position.set(0,0,5);
        controls.target.set(0,0,0);
        camera.lookAt(0,0,0);
        controls.update();
            newCenter.x,
            newCenter.y + radius * 0.3,
            newCenter.z + radius * 2.3
        );

        camera.lookAt(newCenter);

        controls.update();

        floor.position.y = newBox.min.y - 0.01;

        loadingScreen.style.display = "none";

        console.log("Model berhasil dimuat");

        console.log(newBox);

    },

    (xhr) => {

        if (xhr.total) {

            progressText.innerHTML =
                Math.round((xhr.loaded / xhr.total) * 100) + "%";

        }

    },

    (error) => {

        console.error(error);

        alert("Model gagal dimuat");

    }
);
