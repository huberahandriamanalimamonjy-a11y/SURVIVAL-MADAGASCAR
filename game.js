
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

// 1. Préparer la scène
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 25, 100);

// 2. Créer la caméra
const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    200
);
camera.position.set(0, 5, 10);

// 3. Créer le moteur graphique
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

// 4. Ajouter la lumière
const sunlight = new THREE.DirectionalLight(0xffffff, 2);
sunlight.position.set(10, 20, 10);
sunlight.castShadow = true;
scene.add(sunlight);

scene.add(new THREE.HemisphereLight(0xffffff, 0x47633d, 1));

// 5. Créer le terrain
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({ color: 0x397d35 })
);

ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// 6. Créer notre personnage
const player = new THREE.Group();

const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.45, 1, 4, 8),
    new THREE.MeshStandardMaterial({ color: 0x263b52 })
);

body.position.y = 1;
body.castShadow = true;
player.add(body);

const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xd9a47c })
);

head.position.y = 1.85;
head.castShadow = true;
player.add(head);

player.position.set(0, 0, 0);
scene.add(player);

// 7. Construire des arbres
function createTree(x, z) {
    const tree = new THREE.Group();

    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.25, 1.5, 8),
        new THREE.MeshStandardMaterial({ color: 0x70452a })
    );

    trunk.position.y = 0.75;
    tree.add(trunk);

    const leaves = new THREE.Mesh(
        new THREE.ConeGeometry(1.1, 2.5, 8),
        new THREE.MeshStandardMaterial({ color: 0x174f26 })
    );

    leaves.position.y = 2.3;
    tree.add(leaves);

    tree.position.set(x, 0, z);
    tree.traverse(object => {
        if (object.isMesh) object.castShadow = true;
    });

    scene.add(tree);
}

// 8. Placer les arbres
for (let i = 0; i < 35; i++) {
    const x = (Math.random() - 0.5) * 35;
    const z = (Math.random() - 0.5) * 35;

    if (Math.abs(x) > 3 || Math.abs(z) > 3) {
        createTree(x, z);
    }
}

// 9. Déplacements au clavier
const keys = {};

window.addEventListener('keydown', event => {
    keys[event.key.toLowerCase()] = true;
});

window.addEventListener('keyup', event => {
    keys[event.key.toLowerCase()] = false;
});

// 10. Boucle du jeu
function animate() {
    requestAnimationFrame(animate);

    const speed = 0.09;

    if (keys['w'] || keys['arrowup']) player.position.z -= speed;
    if (keys['s'] || keys['arrowdown']) player.position.z += speed;
    if (keys['a'] || keys['arrowleft']) player.position.x -= speed;
    if (keys['d'] || keys['arrowright']) player.position.x += speed;

    camera.position.x = player.position.x;
    camera.position.z = player.position.z + 8;
    camera.position.y = 5;

    camera.lookAt(
        player.position.x,
        player.position.y + 1,
        player.position.z
    );

    renderer.render(scene, camera);
}

animate();

// 11. Adapter l'affichage à l'écran
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});
