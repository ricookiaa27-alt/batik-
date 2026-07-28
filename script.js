// ======================================
// BATIK KEDIRI × JOGJA
// script.js
// Part 3 - Bagian 1 (FIXED)
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
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
viewer.appendChild(renderer.domElement);

// --------------------------------------
// CONTROL
// --------------------------------------
const controls = new OrbitControls(camera, renderer.domElement);
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
const hemi = new THREE.HemisphereLight(0xffffff, 0xe0e0e0, 2);
scene.add(hemi);

const dir = new THREE.DirectionalLight(0xffffff, 2);
dir.position.set(4, 6, 4);
dir.castShadow = true;
scene.add(dir);

const fill = new THREE.DirectionalLight(0xffffff, 1);
fill.position.set(-4, 3, -3);
scene.add(fill);

// --------------------------------------
// FLOOR
// --------------------------------------
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.ShadowMaterial({ opacity: 0.15 })
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// --------------------------------------
// MODEL
// --------------------------------------
let shirt;
const loader = new GLTFLoader();

// Safety timeout: kalau loading lebih dari 20 detik, tampilkan pesan error
// supaya layar tidak nyangkut di loading screen selamanya.
const loadTimeout = setTimeout(() => {
    if (loadingScreen && loadingScreen.style.display !== "none") {
        if (progressText) {
            progressText.innerHTML = "Gagal memuat model. Cek path file / koneksi.";
        }
    }
}, 20000);

loader.load(
    "assets/batik_men_shirt.glb",
    (gltf) => {
        clearTimeout(loadTimeout);

        shirt = gltf.scene;
        shirt.traverse((obj) => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;
                obj.material.side = THREE.DoubleSide;
                obj.material.needsUpdate = true;
            }
        });

        scene.add(shirt);

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

        controls.target.copy(newCenter);
        camera.position.set(newCenter.x, newCenter.y, newCenter.z + 5);
        camera.lookAt(newCenter);
        controls.update();

        floor.position.y = newBox.min.y - 0.01;

        if (loadingScreen) loadingScreen.style.display = "none";

        console.log("Model berhasil dimuat");
        console.log(newBox);
    },
    (xhr) => {
        if (xhr.total && progressText) {
            progressText.innerHTML =
                Math.round((xhr.loaded / xhr.total) * 100) + "%";
        }
    },
    (error) => {
        clearTimeout(loadTimeout);
        console.error(error);
        if (progressText) {
            progressText.innerHTML = "Model gagal dimuat. Cek path/nama file .glb.";
        }
        // Jangan biarkan loadingScreen nyangkut - kasih tombol/reload opsional di sini
        // jika ingin, misal: loadingScreen.style.display = "none";
    }
);

// --------------------------------------
// RESIZE HANDLER
// --------------------------------------
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --------------------------------------
// RENDER LOOP (INI YANG HILANG SEBELUMNYA!)
// --------------------------------------
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();
