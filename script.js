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

    shirt.updateMatrixWorld(true);

    // Hitung bounding box
    const box = new THREE.Box3().setFromObject(shirt);

    const center = box.getCenter(new THREE.Vector3());

    const size = box.getSize(new THREE.Vector3());

    // Geser model ke origin
    shirt.position.set(
        -center.x,
        -center.y,
        -center.z
    );

    scene.add(shirt);

    // Hitung ulang setelah dipindah
    const box2 = new THREE.Box3().setFromObject(shirt);

    const size2 = box2.getSize(new THREE.Vector3());

    const maxDim = Math.max(size2.x, size2.y, size2.z);

    const scale = 2 / maxDim;

    shirt.scale.setScalar(scale);

    shirt.updateMatrixWorld(true);

    // Hitung ulang lagi setelah scale
    const box3 = new THREE.Box3().setFromObject(shirt);

    const center3 = box3.getCenter(new THREE.Vector3());

    controls.target.copy(center3);

    camera.position.set(
        center3.x,
        center3.y + maxDim * scale * 0.4,
        center3.z + maxDim * scale * 2
    );

    camera.lookAt(center3);

    controls.update();

    loadingScreen.style.display = "none";
    }
        // ===========================
        // AUTO CENTER
        // ===========================

        const box = new THREE.Box3().setFromObject(shirt);

        const size = box.getSize(new THREE.Vector3());

        const center = box.getCenter(new THREE.Vector3());

        shirt.position.sub(center);

        // ===========================
        // AUTO SCALE
        // ===========================

        const maxSize = Math.max(size.x, size.y, size.z);

        const targetSize = 2;

        const scale = targetSize / maxSize;

        shirt.scale.setScalar(scale);

        // Hitung ulang setelah di-scale

        const newBox = new THREE.Box3().setFromObject(shirt);

        const newCenter = newBox.getCenter(new THREE.Vector3());

        shirt.position.sub(newCenter);

        scene.add(shirt);

        // ===========================
        // CAMERA FIT
        // ===========================

        const finalBox = new THREE.Box3().setFromObject(shirt);

        const finalSize = finalBox.getSize(new THREE.Vector3());

        const radius = Math.max(
            finalSize.x,
            finalSize.y,
            finalSize.z
        );

        camera.position.set(
            radius * 0.8,
            radius * 0.6,
            radius * 2.4
        );

        controls.target.set(0, 0, 0);

        controls.update();

        // Floor mengikuti model

        floor.position.y = finalBox.min.y - 0.01;

        loadingScreen.style.display = "none";

        console.log("Model berhasil dimuat");

        console.log(finalBox);

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
