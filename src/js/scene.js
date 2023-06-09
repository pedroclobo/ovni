var cameras = [],
	scene,
	renderer,
	clock;

var currentCameraIndex = 0,
	cameraFrustum = 50,
	delta = 0;

var keys = {};

var materials = new Map([
	["white", new THREE.MeshLambertMaterial({ color: 0xffffff})],
	["yellowEmissive", new THREE.MeshLambertMaterial({ color: 0xffd91c, emissive: 0xffd91c })],
	["orange", new THREE.MeshPhongMaterial({ color: 0xffa010 })],
	["darkOrange", new THREE.MeshPhongMaterial({ color: 0xff4000 })],
	["red", new THREE.MeshPhongMaterial({ color: 0xc21d11 })],
	["darkRed", new THREE.MeshPhongMaterial({ color: 0x9e0000 })],
	["green", new THREE.MeshPhongMaterial({ color: 0x00ff00 })],
	["peru", new THREE.MeshPhongMaterial({ color: 0xcd853f })],
	["darkPeru", new THREE.MeshPhongMaterial({ color: 0xb8793f })],
	["saddleBrown", new THREE.MeshPhongMaterial({ color: 0x8B4513 })],
	["darkOliveGreen", new THREE.MeshPhongMaterial({ color: 0x556B2F })],
	["oliveDrab", new THREE.MeshPhongMaterial({ color: 0x6B8E23 })],
	["olive", new THREE.MeshPhongMaterial({ color: 0x465701 })],
	["darkOlive", new THREE.MeshPhongMaterial({ color: 0x2c4a00 })],
	["darkGreen", new THREE.MeshPhongMaterial({ color: 0x154000 })],
	["blue", new THREE.MeshPhongMaterial({ color: 0x2260b3 })],
	["lightBlueEmissive", new THREE.MeshPhongMaterial({ color: 0x58c3d1, emissive: 0x58c3d1 })],
	["gray", new THREE.MeshPhongMaterial({ color: 0x7a7a7a })],
	["lightGray", new THREE.MeshPhongMaterial({ color: 0xacacac })],
	["darkGray", new THREE.MeshPhongMaterial({ color: 0x242424 })]
]);

var geometry,
	line,
	meshes = [];

var ovni,
	tree,
	moon,
	house;

var skydomeMesh,
	skydomeMaterial;

var fieldMesh,
	fieldMaterial;

var spotLight,
	pointLights = [],
	directionalLight;

var shadowsFlag = true;

//-----------------------------------------------------//


function createOvni(x, y, z) {
	"use strict";

	var body, cockpit, spotlight, light1, light2, light3, light4, light5, light6;
	var sLightColor = 0x00ff00;
	var pLightColor = 0xffff00;

	// body
	geometry = new THREE.SphereGeometry(15, 32, 32);
	geometry.scale(1, 0.18, 1);
	body = new THREE.Mesh(geometry, materials.get("gray"));
	body.position.set(0, 0, 0);

	// cockpit
	geometry = new THREE.SphereGeometry(5, 18, 18, 0, Math.PI * 2, 0, Math.PI / 2);
	cockpit = new THREE.Mesh(geometry, materials.get("lightBlueEmissive"));
	cockpit.position.set(0, 2, 0);

	// spotlight
	geometry = new THREE.CylinderGeometry(7, 6, 1, 32);
	spotlight = new THREE.Mesh(geometry, materials.get("yellowEmissive"));
	spotlight.position.set(0, -2.6, 0);

	// SpotLight(color: Integer, intensity: Float, distance: Float, angle: Radians, penumbra: Float, decay: Float)
	spotLight = new THREE.SpotLight(sLightColor, 3, 0, Math.PI / 6, 0.2, 0.5);
	spotLight.position.set(0, 0, 0);
	spotLight.target.position.set(0, -30, 0);
	spotLight.castShadow = true;

	// 8 lights around the cockpit
	geometry = new THREE.SphereGeometry(0.5, 14, 5, 0, Math.PI * 2, 0, Math.PI / 2);
	light1 = new THREE.Mesh(geometry, materials.get("yellowEmissive"));
	light2 = new THREE.Mesh(geometry, materials.get("yellowEmissive"));
	light3 = new THREE.Mesh(geometry, materials.get("yellowEmissive"));
	light4 = new THREE.Mesh(geometry, materials.get("yellowEmissive"));
	light5 = new THREE.Mesh(geometry, materials.get("yellowEmissive"));
	light6 = new THREE.Mesh(geometry, materials.get("yellowEmissive"));

	// full ovni
	ovni = new THREE.Object3D();
	ovni.add(body, cockpit, spotlight, light1, light2, light3, light4, light5, light6, spotLight, spotLight.target);

	// position the lights
	for(var i = 0; i < 6; i++) {
		var angle = i * Math.PI / 3;
		var xx = 11 * Math.cos(angle);
		var zz = 11 * Math.sin(angle);
		ovni.children[i + 3].position.set(xx, -1.8, zz);
		ovni.children[i + 3].rotation.x = Math.PI;
		// PointLight(color: Integer, intensity: Float, distance: Number, decay: Float)
		pointLights[i] = new THREE.PointLight(pLightColor, 1, 8, 0.25);
		pointLights[i].position.set( xx - 0.1, -2.5, zz - 0.1 );
		ovni.add(pointLights[i]);
	}

	ovni.position.set(x, y, z);

	meshes.push(body, cockpit, spotlight, light1, light2, light3, light4, light5, light6);
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

	meshes.push(trunk, branch1, topBranch1, branch2, topBranch2, branch3, foliage1, foliage2, foliage3);
	scene.add(tree);
}

function createField(x, y, z) {
	"use strict";
	// field
	geometry = new THREE.PlaneBufferGeometry(200, 200, 8, 8);
	fieldMaterial = new THREE.MeshPhongMaterial({color: 0x29870c});
	fieldMesh = new THREE.Mesh(geometry, fieldMaterial);
	fieldMesh.rotateX(-Math.PI / 2);
	fieldMesh.position.set(x, y, z);
	fieldMesh.receiveShadow = true;

	scene.add(fieldMesh);
}

function createSkydome(x, y, z) {
	"use strict";
	// skydome
	geometry = new THREE.SphereGeometry(180, 32, 32);
	skydomeMesh = new THREE.Mesh(geometry, skydomeMaterial);
	skydomeMesh.position.set(x, y, z);

	scene.add(skydomeMesh);
}

function createMoon(x, y, z) {
	"use strict";
	// moon
	moon = new THREE.Object3D();

	geometry = new THREE.SphereGeometry(10, 32, 32);
	var moonMesh = new THREE.Mesh(geometry, materials.get("yellowEmissive"));

	directionalLight = new THREE.DirectionalLight(0xf6dc79, 0.15);
	directionalLight.position.set(0, -8, 8);
	directionalLight.castShadow = true;

	moon.add(moonMesh, directionalLight);
	moon.position.set(x, y, z);

	scene.add(moon);
}

function addWindow( obj, x, y, z, size ) {
	'use strict';

	const vertices3 = new Float32Array([
		// left window
		-size*1.5+size*0.35,	size*0.65,	size+0.1,	// bot left - 0
		-size*1.5+size*0.35,	size*1.35,	size+0.1,	// top left - 1
		-size*1.5-size*0.35,	size*0.65,	size+0.1,	// bot left - 2
		-size*1.5-size*0.35,	size*1.35,	size+0.1,	// top left - 3

		// right window
		size*1.5+size*0.35,	size*0.65,	size+0.1,	// bot right - 4
		size*1.5+size*0.35,	size*1.35,	size+0.1,	// top right - 5
		size*1.5-size*0.35,	size*0.65,	size+0.1,	// bot right - 6
		size*1.5-size*0.35,	size*1.35,	size+0.1,	// top right - 7

		// door
		+size*0.5,	0,			size+0.1,	// bot left - 8
		+size*0.5,	size*1.6,	size+0.1,	// top left - 9
		-size*0.5,	0,			size+0.1,	// bot left - 10
		-size*0.5,	size*1.6,	size+0.1,	// top left - 11
	]);

	const indices3 = [
		// left window
		0, 1, 3,
		0, 3, 2,

		// right window
		4, 5, 7,
		4, 7, 6,

		// door
		8, 9, 11,
		8, 11, 10,
	];

	geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position', new THREE.BufferAttribute(vertices3, 3));
	geometry.setIndex(indices3);
	geometry.computeVertexNormals();

	var mesh = new THREE.Mesh(geometry, materials.get("blue"));
	mesh.position.set(x, y, z);

	obj.add(mesh);
	meshes.push(mesh);
}

function addWalls(obj, size) {
	'use strict';

	const vertices = new Float32Array([
		// front wall
		-size*2.5,	0,		size,	// bot left - 0
		-size*2.5,	size*2,	size,	// top left - 1
		size*2.5,	0,		size,	// bot right - 2
		size*2.5,	size*2,	size,	// top right - 3
		// side wall
		size*2.5,	size*2,	-size,	// top right - 4
		size*2.5,	0,		-size,	// bot right - 5
		// roof wall
		size*2.5,	size*2.5,	0,	// top right - 6
	]);
	const indices = [
		0, 3, 1,
		0, 2, 3,
		2, 4, 3,
		2, 5, 4,
		6, 3, 4
	];
	geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position', new THREE.BufferAttribute( vertices, 3) );
	geometry.setIndex(indices);
	geometry.computeVertexNormals();

	obj.add(new THREE.Mesh(geometry, materials.get("white")));
}

function addRoof(obj, size) {
	'use strict';

	const vertices = new Float32Array([
		// front roof
		-size*2.5,	size*2,		size,	// bot left - 0
		-size*2.5,	size*2.5,	0,		// top left - 1
		size*2.5,	size*2.5,	0,		// top right - 2
		size*2.5,	size*2,		size,	// bot right - 3
		// back roof
		size*2.5,	size*2,	-size,	// bot right - 4
		-size*2.5,	size*2,	-size,	// bot left - 5
	]);
	const indices = [
		0, 2, 1,
		0, 3, 2,
		2, 4, 5,
		1, 2, 5
	];
	geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position', new THREE.BufferAttribute( vertices, 3) );
	geometry.setIndex(indices);
	geometry.computeVertexNormals();

	obj.add(new THREE.Mesh(geometry, materials.get("orange")));
}

function createHouse(x, y, z) {
	'use strict';

	var size = 5;
	
	house = new THREE.Object3D();
	addWalls(house, size);
	addRoof(house, size);
	addWindow(house, 0, 0, 0, size);

	house.rotation.y = THREE.MathUtils.degToRad(40);
	house.position.set(x, y, z);

	scene.add(house);
}

function createScene() {
	"use strict";

	scene = new THREE.Scene();
	scene.background = new THREE.Color("rgb(20, 20, 20)");

	createSkydome(0, 0, 0);
	createField(0, -25, 0);
	createOvni(0, 10, 20);
	createTree(0, -25, 20);
	createHouse(0, -25, 0);
	createMoon(0, 30, 40);
	
	var ambientLight = new THREE.AmbientLight(0xf6dc79, 0.5);
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
	var otherSideCamera = createOrthographicCamera(0, 0, -100);
	var topCamera = createOrthographicCamera(0, 100, 0);
	var botCamera = createOrthographicCamera(0, -100, 0);
	var orthographicCamera = createOrthographicCamera(50, 50, 50);
	var prespectiveCamera = createPerspectiveCamera(50, 50, 50);

	cameras.push(
		frontCamera,
		backCamera,
		sideCamera,
		otherSideCamera,
		topCamera,
		botCamera,
		orthographicCamera,
		prespectiveCamera
	);
}

function generateSkyTexture(size) {
	'use strict';

	var canvas = document.createElement('canvas');
	canvas.width = size;
	canvas.height = size;
	var context = canvas.getContext('2d');

	// creating the background
	var gradient = context.createLinearGradient(0, 0, 0, size);
	gradient.addColorStop(0, '#00008B');
	gradient.addColorStop(1, '#140026');
	context.fillStyle = gradient;
	context.fillRect(0, 0, size, size);

	// creating the stars
	var starColor = '#ffffff';
	var starRadius = 1;
	var numStars = 250;

	for (var i = 0; i < numStars; i++) {
		var x = Math.random() * size;
		var y = Math.random() * size;
		context.fillStyle = starColor;
		context.beginPath();
		context.arc(x, y, starRadius, 0, Math.PI * 2);
		context.closePath();
		context.fill();
	}

	// Generate data URL
	var dataURL = canvas.toDataURL('sky.jpeg');
	return dataURL;
}

function generateFieldTexture(size) {
	'use strict';
	// Create a canvas element, our texture
	var canvas = document.createElement('canvas');
	canvas.width = size;
	canvas.height = size;

	var context = canvas.getContext('2d');

	// Define the field colors
	var fieldColor = '#1a6b01';
	var flowerColors = ['#ffffff', '#ffff00', '#a835c4', '#0092d1'];
	var flowerCount = 75;

	// Fill the canvas with the field color
	context.fillStyle = fieldColor;
	context.fillRect(0, 0, canvas.width, canvas.height);

	for (let i = 0; i < flowerCount; ++i) {
		var x = Math.random() * canvas.width;
		var y = Math.random() * canvas.height;
		var radius = Math.random() * 2 + 3; // Randomize flower size
		var color = flowerColors[Math.floor(Math.random() * flowerColors.length)]; // Randomize flower color

		context.beginPath();
		context.arc(x, y, radius, 0, 2 * Math.PI);
		context.fillStyle = color;
		context.fill();
	}

	// Generate data URL
	var dataURL = canvas.toDataURL('field.jpeg');
	return dataURL;
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
	if (e.keyCode >= 97 && e.keyCode <= 104) {
		console.log("1-7 : Cameras");
		currentCameraIndex = e.keyCode - 97;
	}
	// Scene in Lambert Material
	else if (e.keyCode == 81) {
		console.log("Q/q : Gouraud / MeshLambertMaterial");
		for (let i = 0; i < meshes.length; ++i) {
			var colorT = meshes[i].material.color;
			var emissiveT =  meshes[i].material.emissive;
			meshes[i].material = new THREE.MeshLambertMaterial({color: colorT, emissive: emissiveT});
		}
	}
	// Scene in Phong Material
	else if (e.keyCode == 87) {
		console.log("W/w : Phong / MeshPhongMaterial");
		for (let i = 0; i < meshes.length; ++i) {
			var colorT = meshes[i].material.color;
			var emissiveT =  meshes[i].material.emissive;
			meshes[i].material = new THREE.MeshPhongMaterial({color: colorT, emissive: emissiveT});
		}
	}
	// Scene in Toon Material
	else if (e.keyCode == 69) {
		console.log("E/e : Cartoon / MeshToonMaterial");
		for (let i = 0; i < meshes.length; ++i) {
			var colorT = meshes[i].material.color;
			var emissiveT =  meshes[i].material.emissive;
			meshes[i].material = new THREE.MeshToonMaterial({color: colorT, emissive: emissiveT});
		}
	}
	// Scene in Basic Material - No light calculations
	else if (e.keyCode == 82) {
		console.log("R/r : Cartoon / MeshToonMaterial");
		for (let i = 0; i < meshes.length; ++i) {
			var colorT = meshes[i].material.color;
			var emissiveT =  meshes[i].material.emissive;
			meshes[i].material = new THREE.MeshBasicMaterial({color: colorT, emissive: emissiveT});
		}
		fieldMaterial = new THREE.MeshBasicMaterial({color: 0x29870c});
		fieldMesh.material = fieldMaterial;
	}
	// Toggle wireframe
	else if (e.keyCode == 56) {
		console.log("8 : Wireframe");
		for (let material of materials.values()) {
			material.wireframe = !material.wireframe;
		}
	}
	// Toggle directionalLight
	else if (e.keyCode == 68) {
		console.log("s/S : DirectionalLight");
		directionalLight.visible = !directionalLight.visible;
	}
	// Toggle spotLight
	else if (e.keyCode == 83) {
		console.log("s/S : SpotLight");
		spotLight.visible = !spotLight.visible;
	}
	// Toggle pointLights
	else if (e.keyCode == 80) {
		console.log("p/P : PointLights");
		for(var i = 0; i < 6; i++) {
			pointLights[i].visible = !pointLights[i].visible;
		}
	}
	// Skydome Texture
	else if (e.keyCode == 50) {
		console.log("2 : Skydome Texture");
		var skydomeTexture = new THREE.TextureLoader().load(generateSkyTexture(2048));
		skydomeTexture.wrapS = skydomeTexture.wrapT = THREE.RepeatWrapping;
		var timesToRepeatHorizontally = 4;
		var timesToRepeatVertically = 2;
		skydomeTexture.repeat.set(timesToRepeatHorizontally, timesToRepeatVertically);

		skydomeMaterial = new THREE.MeshPhongMaterial({ map: skydomeTexture });
		skydomeMesh.material = skydomeMaterial;
		skydomeMesh.material.side = THREE.BackSide;
	}
	// Field Texture
	else if (e.keyCode == 49) {
		console.log("1 : Field Texture");
		var fieldTexture = new THREE.TextureLoader().load(generateFieldTexture(540));
		fieldTexture.wrapS = fieldTexture.wrapT = THREE.RepeatWrapping;
		var timesToRepeatHorizontally = 8;
		var timesToRepeatVertically = 8;
		fieldTexture.repeat.set(timesToRepeatHorizontally, timesToRepeatVertically);

		fieldMaterial = new THREE.MeshPhongMaterial({ map: fieldTexture });
		fieldMesh.material = fieldMaterial;

		// terrainCutout = new TerrainCutout(60, 1, 60, 300, 300, displacement, texture);
	
		// terrainCutout.material.displacementScale = 10;
		// terrainCutout.position.set(0, -6, 2);
		// scene.add(terrainCutout);
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
	renderer.shadowMap.type = THREE.BasicShadowMap; //THREE.PCFSoftShadowMap for better quality
	document.body.appendChild(renderer.domElement);

	createScene();
	createCameras();

	clock = new THREE.Clock();
	clock.start();

	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);
	window.addEventListener("resize", onResize, false);

	renderer.setAnimationLoop(animate);
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
	// requestAnimationFrame(animate);
}