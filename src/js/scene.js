var cameras = [],
	scene,
	renderer,
	clock;

var currentCameraIndex = 0,
	cameraFrustum = 70,
	delta = 0;

var keys = {};

var materials = new Map([
	["yellow", new THREE.MeshBasicMaterial({ color: 0xffd91c, wireframe: true })],
	["orange", new THREE.MeshBasicMaterial({ color: 0xffa010, wireframe: true })],
	["darkOrange", new THREE.MeshBasicMaterial({ color: 0xff4000, wireframe: true }),],
	["red", new THREE.MeshBasicMaterial({ color: 0xc21d11, wireframe: true })],
	["darkRed", new THREE.MeshBasicMaterial({ color: 0x9e0000, wireframe: true })],
	["peru", new THREE.MeshBasicMaterial({ color: 0xcd853f, wireframe: true })],
	["darkPeru", new THREE.MeshBasicMaterial({ color: 0xb8793f, wireframe: true })],
	["saddleBrown", new THREE.MeshBasicMaterial({ color: 0x8B4513, wireframe: true })],
	["darkOliveGreen", new THREE.MeshBasicMaterial({ color: 0x556B2F, wireframe: true })],
	["oliveDrab", new THREE.MeshBasicMaterial({ color: 0x6B8E23, wireframe: true })],
	["olive", new THREE.MeshBasicMaterial({ color: 0x465701, wireframe: true })],
	["darkOlive", new THREE.MeshBasicMaterial({ color: 0x2c4a00, wireframe: true })],
	["darkGreen", new THREE.MeshBasicMaterial({ color: 0x154000, wireframe: true })],
	["blue", new THREE.MeshBasicMaterial({ color: 0x2260b3, wireframe: true }),],
	["lightBlue", new THREE.MeshBasicMaterial({ color: 0x58c3d1, wireframe: true }),],
	["gray", new THREE.MeshBasicMaterial({ color: 0x7a7a7a, wireframe: true })],
	["lightGray", new THREE.MeshBasicMaterial({ color: 0xacacac, wireframe: true }),],
	["darkGray", new THREE.MeshBasicMaterial({ color: 0x242424, wireframe: true }),]
]);

var geometry, line;

var ovni;
var tree;

//-----------------------------------------------------//


function createOvni(x, y, z) {
    "use strict";

    var body, cockpit, spotlight, light1, light2, light3, light4, light5, light6, light7, light8;

    // body
    geometry = new THREE.SphereGeometry(15, 32, 32);
    geometry.scale(1, 0.2, 1);
    body = new THREE.Mesh(geometry, materials.get("gray"));
    body.position.set(0, 0, 0);

    // cockpit
    geometry = new THREE.SphereGeometry(4, 32, 32);
    cockpit = new THREE.Mesh(geometry, materials.get("lightGray"));
    cockpit.position.set(0, 3, 0);

    // spotlight
    geometry = new THREE.CylinderGeometry(7, 7, 1, 32);
    spotlight = new THREE.Mesh(geometry, materials.get("yellow"));
    spotlight.position.set(0, 0, 0);

    var sLight = new THREE.SpotLight( 0xffffff );
    sLight.castShadow = true;

    // 8 lights around the cockpit
    geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 32);
    light1 = new THREE.Mesh(geometry, materials.get("yellow"));
    light2 = new THREE.Mesh(geometry, materials.get("yellow"));
    light3 = new THREE.Mesh(geometry, materials.get("yellow"));
    light4 = new THREE.Mesh(geometry, materials.get("yellow"));
    light5 = new THREE.Mesh(geometry, materials.get("yellow"));
    light6 = new THREE.Mesh(geometry, materials.get("yellow"));
    light7 = new THREE.Mesh(geometry, materials.get("yellow"));
    light8 = new THREE.Mesh(geometry, materials.get("yellow"));

    // full ovni
    ovni = new THREE.Object3D();
    ovni.add(body, cockpit, spotlight, light1, light2, light3, light4, light5, light6, light7, light8);

    // position the lights
    for(var i = 0; i < 8; i++) {
        var angle = i * Math.PI / 4;
        var x = 11 * Math.cos(angle);
        var z = 11 * Math.sin(angle);
        ovni.children[i + 3].position.set(x, 0, z);
        var light = new THREE.PointLight( 0xff0000, 1);
        light.position.set( 50, 50, 50 );
    }

    ovni.position.set(x, y, z);

    scene.add(ovni);
}

function rotateOvni() {
    "use strict";

    ovni.rotation.y += Math.PI / 180;
}

function moveOvniX(left) {
    "use strict";
    var velocity = new THREE.Vector3(35, 0, 0).multiplyScalar(delta);

    if (left) {
        velocity.x = -velocity.x;
    } else {
        velocity.x = velocity.x;
    }

    ovni.position.add(velocity);
}

function moveOvniZ(left) {
    "use strict";
    var velocity = new THREE.Vector3(0, 0, 35).multiplyScalar(delta);
    
    if (left) {
        velocity.z = -velocity.z;
    } else {
        velocity.z = velocity.z;
    }

    ovni.position.add(velocity);
}

function createTree(x, y, z) {
    "use strict";

    var trunk, branch1, topBranch1, branch2, topBranch2, branch3, foliage1, foliage2, foliage3;

    // trunk
    geometry = new THREE.CylinderGeometry(1.1, 1.5, 8, 16);
    trunk = new THREE.Mesh(geometry, materials.get("peru"));
    trunk.position.set(0, 4, 0); // base on the ground

	// branch 1
	geometry = new THREE.CylinderGeometry(0.7, 1, 6, 16);
	branch1 = new THREE.Mesh(geometry, materials.get("peru"));
	branch1.rotation.x = THREE.MathUtils.degToRad(-20);
	branch1.rotation.z = THREE.MathUtils.degToRad(10);
	branch1.position.set(-0.7, 10, -1.2);

	// topBranch 1
	geometry = new THREE.CylinderGeometry(0.9, 1, 3, 16);
	topBranch1 = new THREE.Mesh(geometry, materials.get("saddleBrown"));
	topBranch1.rotation.x = THREE.MathUtils.degToRad(-20);
	topBranch1.rotation.z = THREE.MathUtils.degToRad(10);
	topBranch1.position.set(-0.8, 10.5, -1.4);

	// branch 2
	geometry = new THREE.CylinderGeometry(0.4, 0.8, 10, 16);
	branch2 = new THREE.Mesh(geometry, materials.get("peru"));
	branch2.rotation.x = THREE.MathUtils.degToRad(40);
	branch2.rotation.z = THREE.MathUtils.degToRad(-10);
	branch2.position.set(1, 11, 3.4);

	// topBranch 2
	geometry = new THREE.CylinderGeometry(0.6, 0.8, 8, 16);
	topBranch2 = new THREE.Mesh(geometry, materials.get("saddleBrown"));
	topBranch2.rotation.x = THREE.MathUtils.degToRad(40);
	topBranch2.rotation.z = THREE.MathUtils.degToRad(-10);
	topBranch2.position.set(1.2, 12, 4.2);

	// branch 3
	geometry = new THREE.CylinderGeometry(0.5, 0.5, 3.5, 16);
	branch3 = new THREE.Mesh(geometry, materials.get("saddleBrown"));
	branch3.rotation.x = THREE.MathUtils.degToRad(-40);
	branch3.rotation.z = THREE.MathUtils.degToRad(-25);
	branch3.position.set(2, 12.1, 1.7);

	// foliage 1
    geometry = new THREE.SphereGeometry(6, 16, 16);
    geometry.scale(0.9, 0.5, 1);
    foliage1 = new THREE.Mesh(geometry, materials.get("darkOlive"));
	foliage1.rotation.x = THREE.MathUtils.degToRad(3);
    foliage1.position.set(-1.5, 14, -4);

	// foliage 2
    geometry = new THREE.SphereGeometry(7, 16, 16);
    geometry.scale(0.8, 0.4, 1);
    foliage2 = new THREE.Mesh(geometry, materials.get("darkGreen"));
	foliage2.rotation.z = THREE.MathUtils.degToRad(5);
    foliage2.position.set(1, 15.5, 7);

	// foliage 3
    geometry = new THREE.SphereGeometry(4, 16, 16);
    geometry.scale(1, 0.6, 1);
    foliage3 = new THREE.Mesh(geometry, materials.get("olive"));
    foliage3.position.set(4, 15, 0);

    // full tree
    tree = new THREE.Object3D();
    tree.add(trunk, branch1, topBranch1, branch2, topBranch2, branch3, foliage1, foliage2, foliage3);

    tree.position.set(x, y, z);

    scene.add(tree);
}

function createScene() {
	"use strict";

	scene = new THREE.Scene();
	scene.background = new THREE.Color("rgb(230, 230, 230)");

    createOvni(0, 40, 0);
	createTree(0, 0, 0);
}

function createOrthographicCamera(x, y, z) {
	"use strict";
	var ratio = window.innerWidth / window.innerHeight;
	var newCamera = new THREE.OrthographicCamera(
		-cameraFrustum * ratio,
		cameraFrustum * ratio,
		cameraFrustum,
		-cameraFrustum,
		1,
		1000
	);
	newCamera.position.set(x, y, z);
	newCamera.lookAt(scene.position);
	return newCamera;
}

function createPerspectiveCamera(x, y, z) {
	"use strict";
	var newCamera = new THREE.PerspectiveCamera(
		cameraFrustum,
		window.innerWidth / window.innerHeight,
		1,
		1000
	);
	newCamera.position.set(x, y, z);
	newCamera.lookAt(scene.position);
	return newCamera;
}

function createCameras() {
	"use strict";
	var frontCamera = createOrthographicCamera(100, 0, 0);
	var sideCamera = createOrthographicCamera(0, 0, 100);
	var topCamera = createOrthographicCamera(0, 100, 0);
	var orthographicCamera = createOrthographicCamera(50, 50, 50);
	var prespectiveCamera = createPerspectiveCamera(50, 50, 50);

	cameras.push(
		frontCamera,
		sideCamera,
		topCamera,
		orthographicCamera,
		prespectiveCamera
	);
}

function onResize() {
	"use strict";
	for (var i = 0; i < cameras.length; i++) {
		cameras[i].aspect = window.innerWidth / window.innerHeight;
		cameras[i].updateProjectionMatrix();
	}
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function onKeyDown(e) {
	"use strict";
	// Handle cameras
	if (e.keyCode >= 49 && e.keyCode <= 53) {
		// 1-5
		currentCameraIndex = e.keyCode - 49;
	}
    // Toggle wireframe
	else if (e.keyCode == 54) {
		// 6
		for (let material of materials.values()) {
			material.wireframe = !material.wireframe;
		}
	} else keys[e.keyCode] = 1;
}

function onKeyUp(e) {
	"use strict";
	keys[e.keyCode] = 0;
}

function render() {
	"use strict";
	renderer.render(scene, cameras[currentCameraIndex]);
}

function init() {
	"use strict";
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	createScene();
	createCameras();

	clock = new THREE.Clock();
	clock.start();

	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);
	window.addEventListener("resize", onResize, false);
}

function update() {
	"use strict";

	if (keys[81] == 1) {
		console.log("Q");
	}

    if (keys[37] == 1) {
		console.log("L-Arrow");
		moveOvniX(true);
	}
	if (keys[39] == 1) {
		console.log("R-Arrow");
		moveOvniX(false);
	}
	if (keys[38] == 1) {
		console.log("U-Arrow");
		moveOvniZ(true);
	}
	if (keys[40] == 1) {
		console.log("D-Arrow");
		moveOvniZ(false);
	}

    rotateOvni();
}

function animate() {
	"use strict";

	delta = clock.getDelta();
	update();
	render();
	requestAnimationFrame(animate);
}