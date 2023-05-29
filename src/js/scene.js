var cameras = [],
	scene,
	renderer,
	clock;

var currentCameraIndex = 0,
	delta = 0;

var keys = {};

var materials = new Map([
	["yellow", new THREE.MeshBasicMaterial({ color: 0xffd91c, wireframe: true })],
	["orange", new THREE.MeshBasicMaterial({ color: 0xffa010, wireframe: true })],
	["darkOrange", new THREE.MeshBasicMaterial({ color: 0xff4000, wireframe: true }),],
	["red", new THREE.MeshBasicMaterial({ color: 0xc21d11, wireframe: true })], //0xc21d11
	["darkRed", new THREE.MeshBasicMaterial({ color: 0x9e0000, wireframe: true })], //a8eeff
	["blue", new THREE.MeshBasicMaterial({ color: 0x2260b3, wireframe: true }),],
	["lightBlue", new THREE.MeshBasicMaterial({ color: 0x58c3d1, wireframe: true }),],
	["gray", new THREE.MeshBasicMaterial({ color: 0x7a7a7a, wireframe: true })],
	["lightGray", new THREE.MeshBasicMaterial({ color: 0xacacac, wireframe: true }),],
	["darkGray", new THREE.MeshBasicMaterial({ color: 0x242424, wireframe: true }),]
]);

var geometry, line;

var ovni;

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

function createScene() {
	"use strict";

	scene = new THREE.Scene();
	scene.background = new THREE.Color("rgb(230, 230, 230)");

    createOvni(0, 40, 0);
}

function createPerspectiveCamera(x, y, z) {
	"use strict";
	var newCamera = new THREE.PerspectiveCamera(
		80,
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
	var prespectiveCamera = createPerspectiveCamera(50, 50, 50);

	cameras.push(
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
	if (e.keyCode >= 49 && e.keyCode <= 49) {
		// 1-1
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
}

function animate() {
	"use strict";

	delta = clock.getDelta();
	update();
	render();
	requestAnimationFrame(animate);
}