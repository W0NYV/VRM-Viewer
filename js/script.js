let lastTime,
    angle,
    vrm;

//シーンの準備
const scene = new THREE.Scene();

//カメラの準備
const camera = new THREE.PerspectiveCamera(45, 960 / 540, 0.1, 1000);
camera.position.set(0, 1.0, -1.0);
camera.rotation.set(0, Math.PI, 0);

//レンダラの準備
const renderer = new THREE.WebGLRenderer();
renderer.setSize(960, 540);
document.body.appendChild(renderer.domElement);

//ライトの準備
const directionalLight = new THREE.DirectionalLight('#ffffff', 1);
directionalLight.position.set(1,1,1);
scene.add(directionalLight);

const loader = new THREE.GLTFLoader();

loader.load(
    './asset/JikkenChang.vrm',

    (gltf) => {
        THREE.VRM.from(gltf).then((_vrm) => {
            vrm = _vrm;
            scene.add(vrm.scene);
            
            normalPose(vrm);

            vrm.blendShapeProxy.setValue(THREE.VRMSchema.BlendShapePresetName.Joy, 1.0);
            vrm.blendShapeProxy.update();
            
            console.log(vrm);
        });
    },

    (progress) => console.log('loading model...', 100.0 * (progress.loaded / progress.total), '%'),
    (error) => console.error(error)

);

const normalPose = (vrm) => {
    const leftUpperArm = vrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.LeftUpperArm);
    leftUpperArm.rotateZ(0.8);
    const rightUpperArm = vrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightUpperArm);
    rightUpperArm.rotateZ(-0.8);
}

function animate() {
    let timeNow = new Date().getTime();
    if(lastTime) {
        const elapsed = timeNow - lastTime;
        angle += (90 * elapsed) / 10000.0;
    }
}

function tick() {
    requestAnimationFrame(tick);
    animate();
    renderer.render(scene, camera);
}

tick();