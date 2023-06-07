var cameras = [],
	scene,
	renderer,
	clock;

var currentCameraIndex = 0,
	cameraFrustum = 40,
	delta = 0;

var keys = {};

var materials = new Map([
	["yellow", new THREE.MeshPhongMaterial({ color: 0xffd91c, wireframe: false })],
	["orange", new THREE.MeshPhongMaterial({ color: 0xffa010, wireframe: false })],
	["darkOrange", new THREE.MeshPhongMaterial({ color: 0xff4000, wireframe: false }),],
	["red", new THREE.MeshPhongMaterial({ color: 0xc21d11, wireframe: false })],
	["darkRed", new THREE.MeshPhongMaterial({ color: 0x9e0000, wireframe: false })],
	["green", new THREE.MeshPhongMaterial({ color: 0x00ff00, wireframe: false })],
	["peru", new THREE.MeshPhongMaterial({ color: 0xcd853f, wireframe: false })],
	["darkPeru", new THREE.MeshPhongMaterial({ color: 0xb8793f, wireframe: false })],
	["saddleBrown", new THREE.MeshPhongMaterial({ color: 0x8B4513, wireframe: false })],
	["darkOliveGreen", new THREE.MeshPhongMaterial({ color: 0x556B2F, wireframe: false })],
	["oliveDrab", new THREE.MeshPhongMaterial({ color: 0x6B8E23, wireframe: false })],
	["olive", new THREE.MeshPhongMaterial({ color: 0x465701, wireframe: false })],
	["darkOlive", new THREE.MeshPhongMaterial({ color: 0x2c4a00, wireframe: false })],
	["darkGreen", new THREE.MeshPhongMaterial({ color: 0x154000, wireframe: false })],
	["blue", new THREE.MeshPhongMaterial({ color: 0x2260b3, wireframe: false }),],
	["lightBlue", new THREE.MeshPhongMaterial({ color: 0x58c3d1, wireframe: false }),],
	["gray", new THREE.MeshPhongMaterial({ color: 0x7a7a7a, wireframe: false })],
	["lightGray", new THREE.MeshPhongMaterial({ color: 0xacacac, wireframe: false }),],
	["darkGray", new THREE.MeshPhongMaterial({ color: 0x242424, wireframe: false }),]
]);

var geometry, 
	line;

var ovni, 
	tree;

var sLight,
	pLights = [];

var shadowsFlag = true;

//-----------------------------------------------------//


function createOvni(x, y, z) {
	"use strict";

	var body, cockpit, spotlight, light1, light2, light3, light4, light5, light6, light7, light8;
	var sLightColor = 0x00ff00;
	var pLightColor = 0xffff00;

	// body
	geometry = new THREE.SphereGeometry(15, 32, 32);
	geometry.scale(1, 0.18, 1);
	body = new THREE.Mesh(geometry, materials.get("gray"));
	body.position.set(0, 0, 0);

	// cockpit
	geometry = new THREE.SphereGeometry(5, 18, 18, 0, Math.PI * 2, 0, Math.PI / 2);
	cockpit = new THREE.Mesh(geometry, materials.get("lightBlue"));
	cockpit.position.set(0, 2, 0);

	// spotlight
	geometry = new THREE.CylinderGeometry(7, 6, 1, 32);
	spotlight = new THREE.Mesh(geometry, materials.get("yellow"));
	spotlight.position.set(0, -2.6, 0);

	// SpotLight( color : Integer, intensity : Float, distance : Float, angle : Radians, penumbra : Float, decay : Float ) 
	sLight = new THREE.SpotLight(sLightColor, 3, 0, Math.PI / 6, 0.2, 0.5);
	sLight.position.set(0, 0, 0);
	sLight.target.position.set(0, -30, 0);
	sLight.castShadow = true;

	// 8 lights around the cockpit
	geometry = new THREE.SphereGeometry(0.5, 14, 5, 0, Math.PI * 2, 0, Math.PI / 2);
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
	ovni.add(body, cockpit, spotlight, light1, light2, light3, light4, light5, light6, light7, light8, sLight, sLight.target);

	// position the lights
	for(var i = 0; i < 8; i++) {
		var angle = i * Math.PI / 4;
		var xx = 11 * Math.cos(angle);
		var zz = 11 * Math.sin(angle);
		ovni.children[i + 3].position.set(xx, -1.6, zz);
		ovni.children[i + 3].rotation.x = Math.PI;
		// PointLight( color : Integer, intensity : Float, distance : Number, decay : Float )
		pLights[i] = new THREE.PointLight(pLightColor, 1, 8, 0.25);
		pLights[i].position.set( xx - 0.1, -2.5, zz - 0.1 );
		pLights[i].castShadow = false;
		ovni.add(pLights[i]);
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

function makeShadow(mesh) {
	mesh.receiveShadow = shadowsFlag;
	mesh.castShadow = shadowsFlag;
}

function createTree(x, y, z) {
	"use strict";

	var trunk, branch1, topBranch1, branch2, topBranch2, branch3, foliage1, foliage2, foliage3;

	// trunk
	geometry = new THREE.CylinderGeometry(1.1, 1.5, 8, 16);
	trunk = new THREE.Mesh(geometry, materials.get("peru"));
	trunk.position.set(0, 4, 0); // base on the ground
	makeShadow(trunk);

	// branch 1
	geometry = new THREE.CylinderGeometry(0.7, 1, 6, 16);
	branch1 = new THREE.Mesh(geometry, materials.get("peru"));
	branch1.rotation.x = THREE.MathUtils.degToRad(-20);
	branch1.rotation.z = THREE.MathUtils.degToRad(10);
	branch1.position.set(-0.7, 10, -1.2);
	makeShadow(branch1);

	// topBranch 1
	geometry = new THREE.CylinderGeometry(0.9, 1, 3, 16);
	topBranch1 = new THREE.Mesh(geometry, materials.get("saddleBrown"));
	topBranch1.rotation.x = THREE.MathUtils.degToRad(-20);
	topBranch1.rotation.z = THREE.MathUtils.degToRad(10);
	topBranch1.position.set(-0.8, 10.5, -1.4);
	makeShadow(topBranch1);

	// branch 2
	geometry = new THREE.CylinderGeometry(0.4, 0.8, 10, 16);
	branch2 = new THREE.Mesh(geometry, materials.get("peru"));
	branch2.rotation.x = THREE.MathUtils.degToRad(40);
	branch2.rotation.z = THREE.MathUtils.degToRad(-10);
	branch2.position.set(1, 11, 3.4);
	makeShadow(branch2);

	// topBranch 2
	geometry = new THREE.CylinderGeometry(0.6, 0.8, 8, 16);
	topBranch2 = new THREE.Mesh(geometry, materials.get("saddleBrown"));
	topBranch2.rotation.x = THREE.MathUtils.degToRad(40);
	topBranch2.rotation.z = THREE.MathUtils.degToRad(-10);
	topBranch2.position.set(1.2, 12, 4.2);
	makeShadow(topBranch2);

	// branch 3
	geometry = new THREE.CylinderGeometry(0.5, 0.5, 3.5, 16);
	branch3 = new THREE.Mesh(geometry, materials.get("saddleBrown"));
	branch3.rotation.x = THREE.MathUtils.degToRad(-40);
	branch3.rotation.z = THREE.MathUtils.degToRad(-25);
	branch3.position.set(2, 12.1, 1.7);
	makeShadow(branch3);

	// foliage 1
	geometry = new THREE.SphereGeometry(6, 16, 16);
	geometry.scale(0.9, 0.5, 1);
	foliage1 = new THREE.Mesh(geometry, materials.get("darkOlive"));
	foliage1.rotation.x = THREE.MathUtils.degToRad(3);
	foliage1.position.set(-1.5, 14, -4);
	makeShadow(foliage1);

	// foliage 2
	geometry = new THREE.SphereGeometry(7, 16, 16);
	geometry.scale(0.8, 0.4, 1);
	foliage2 = new THREE.Mesh(geometry, materials.get("darkGreen"));
	foliage2.rotation.z = THREE.MathUtils.degToRad(5);
	foliage2.position.set(1, 15.5, 7);
	makeShadow(foliage2);

	// foliage 3
	geometry = new THREE.SphereGeometry(4, 16, 16);
	geometry.scale(1, 0.6, 1);
	foliage3 = new THREE.Mesh(geometry, materials.get("olive"));
	foliage3.position.set(4, 15, 0);
	makeShadow(foliage3);

	// full tree
	tree = new THREE.Object3D();
	tree.add(trunk, branch1, topBranch1, branch2, topBranch2, branch3, foliage1, foliage2, foliage3);

	tree.position.set(x, y, z);

	scene.add(tree);
}

function createPlane(x, y, z) {
	geometry = new THREE.PlaneBufferGeometry(200, 200, 8, 8);
	var material = new THREE.MeshPhongMaterial({color: 0x00ff00});
	var plane = new THREE.Mesh(geometry, material);
	plane.rotateX(-Math.PI / 2);
	plane.position.set(x, y, z);
	plane.receiveShadow = true;

	scene.add(plane);
}

function createScene() {
	"use strict";

	scene = new THREE.Scene();
	scene.background = new THREE.Color("rgb(20, 20, 20)");

	createPlane(0, -25, 0);
	createOvni(0, 10, 0);
	createTree(0, -25, 0);

	var ambientLight = new THREE.AmbientLight(0xeeffa8, 0.2);
	scene.add(ambientLight);
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
	var backCamera = createOrthographicCamera(-100, 0, 0);
	var sideCamera = createOrthographicCamera(0, 0, 100);
	var topCamera = createOrthographicCamera(0, 100, 0);
	var botCamera = createOrthographicCamera(0, -100, 0);
	var orthographicCamera = createOrthographicCamera(50, 50, 50);
	var prespectiveCamera = createPerspectiveCamera(50, 50, 50);

	cameras.push(
		frontCamera,
		backCamera,
		sideCamera,
		topCamera,
		botCamera,
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
	if (e.keyCode >= 49 && e.keyCode <= 55) {
		console.log("1-7 : Cameras");
		currentCameraIndex = e.keyCode - 49;
	}
	// Toggle wireframe
	else if (e.keyCode == 56) {
		console.log("8 : Wireframe");
		for (let material of materials.values()) {
			material.wireframe = !material.wireframe;
		}
	}
	// Toggle spotLight
	else if (e.keyCode == 83) {
		console.log("s/S : SpotLight");
		sLight.visible = !sLight.visible;
	}
	// Toggle pointLights
	else if (e.keyCode == 80) {
		console.log("p/P : PointLights");
		for(var i = 0; i < 8; i++) {
			pLights[i].visible = !pLights[i].visible;
		}
	}
	else keys[e.keyCode] = 1;
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
	renderer.shadowMap.enabled = true;
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