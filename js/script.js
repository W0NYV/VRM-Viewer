let lastTime,
    angle = 0,
    vrm,
    isLoaded = false,
    dropZone = document.getElementById('drop-zone');

dropZone.addEventListener('dragover', function(e) {
    e.stopPropagation();
    e.preventDefault();
    this.style.background = '#e1e7f0';
}, false);

dropZone.addEventListener('dragleave', function(e) {
    e.stopPropagation();
    e.preventDefault();
    this.style.background = '#ffffff';
}, false);

dropZone.addEventListener('drop', function(e) {
    e.stopPropagation();
    e.preventDefault();
    this.style.background = '#ffffff';
    let files = e.dataTransfer.files;
    if(files.length > 1) return alert('ファイルを複数投げないでね');
    
    loadFile(files[0]);
    // loadModel(files[0]);
    //loadModel('./asset/JikkenChang.vrm');
}, false); 

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

function loadFile(file) {
    const blob = new Blob([file], {type: "application/octet-stream"});
    const url = URL.createObjectURL(blob);
    loadModel(url);
}

//VRMの読み込み
function loadModel(path) {
    const loader = new THREE.GLTFLoader();

    loader.load(
    path,

    (gltf) => {
        THREE.VRM.from(gltf).then((_vrm) => {

            if(scene.children.length > 1) scene.remove(scene.children[1]);

            vrm = _vrm;
            scene.add(vrm.scene);            
            normalPose(vrm);

            vrm.blendShapeProxy.setValue(THREE.VRMSchema.BlendShapePresetName.Joy, 1.0);
            vrm.blendShapeProxy.update();
            
            let title = document.getElementById('title');
            title.innerHTML = vrm.meta.title;

            
            let author = document.getElementById('author');
            author.innerHTML = vrm.meta.author;

            let load = document.getElementById('load');
            load.innerHTML =  '読み込んだぜ!!';

            isLoaded = true;

            });
        },

    (progress) => {
        let load = document.getElementById('load');
        load.innerHTML =  '読み込み中だぜ！';
        // load.innerHTML =  '読み込み中...' + 100.0 * (progress.loaded / progress.total) + '%';
        // console.log('loading model...', 100.0 * (progress.loaded / progress.total), '%')
    },
    
    (error) => console.error(error)

    );

}

const normalPose = (vrm) => {
    const leftUpperArm = vrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.LeftUpperArm);
    leftUpperArm.rotateZ(0.8);
    const rightUpperArm = vrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightUpperArm);
    rightUpperArm.rotateZ(-0.8);
}

function rotateModels(vrm, speed) {
    const hips = vrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.Hips);
    hips.rotateY(speed);
}

function animate() {
    let timeNow = new Date().getTime();
    if(lastTime) {
        const elapsed = timeNow - lastTime;
        angle += (90 * elapsed) / 10000.0;
    }
    lastTime = timeNow;

    if(isLoaded) rotateModels(vrm, (Math.PI/180.0));
}

function tick() {
    requestAnimationFrame(tick);
    animate();
    renderer.render(scene, camera);
}

tick();