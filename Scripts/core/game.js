/// <reference path="_reference.ts"/>
// MAIN GAME FILE
// Jake Parnell
// Comp392 - Assignment 1
// Last Modified by: Jake Parnell
// Date Last Modified Jan 28th 2016
// THREEJS Aliases
var Scene = THREE.Scene;
var Renderer = THREE.WebGLRenderer;
var PerspectiveCamera = THREE.PerspectiveCamera;
var BoxGeometry = THREE.BoxGeometry;
var CubeGeometry = THREE.CubeGeometry;
var PlaneGeometry = THREE.PlaneGeometry;
var SphereGeometry = THREE.SphereGeometry;
var Geometry = THREE.Geometry;
var AxisHelper = THREE.AxisHelper;
var LambertMaterial = THREE.MeshLambertMaterial;
var MeshBasicMaterial = THREE.MeshBasicMaterial;
var Material = THREE.Material;
var Mesh = THREE.Mesh;
var Object3D = THREE.Object3D;
var SpotLight = THREE.SpotLight;
var PointLight = THREE.PointLight;
var AmbientLight = THREE.AmbientLight;
var Control = objects.Control;
var GUI = dat.GUI;
var Color = THREE.Color;
var Vector3 = THREE.Vector3;
var Face3 = THREE.Face3;
var Point = objects.Point;
var CScreen = config.Screen;
//Custom Game Objects
var gameObject = objects.gameObject;
var scene;
var renderer;
var camera;
var axes;
var lLeg;
var rLeg;
var body;
var lArm;
var rArm;
var head;
var plane;
var sphere;
var ambientLight;
var spotLight;
var control;
var gui;
var stats;
var step = 0;
var cubeGeometry;
var cubeMaterial;
var ambientcolour = "#0c0c0c";
function init() {
    // Instantiate a new Scene object
    scene = new Scene();
    setupRenderer(); // setup the default renderer
    setupCamera(); // setup the camera
    // add an axis helper to the scene
    axes = new AxisHelper(10);
    scene.add(axes);
    console.log("Added Axis Helper to scene...");
    //Add a Plane to the Scene
    plane = new gameObject(new PlaneGeometry(16, 16, 1, 1), new LambertMaterial({ color: 0xe79b61 }), 0, 0, 0);
    plane.rotation.x = -0.5 * Math.PI;
    scene.add(plane);
    console.log("Added Plane Primitive to scene...");
    //set colour
    cubeMaterial = new LambertMaterial({ color: ambientcolour });
    //add Body
    cubeGeometry = new CubeGeometry(1.5, 2, 2);
    body = new Mesh(cubeGeometry, cubeMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    body.position.y = 3;
    scene.add(body);
    console.log("Added Body to scene...");
    //add Left Leg
    cubeGeometry = new CubeGeometry(0.5, 2, 0.5);
    lLeg = new Mesh(cubeGeometry, cubeMaterial);
    lLeg.castShadow = true;
    lLeg.receiveShadow = true;
    lLeg.position.y = -1.5;
    lLeg.position.x = -0.5;
    body.add(lLeg);
    console.log("Added Left Leg to scene...");
    //add Right Leg
    cubeGeometry = new CubeGeometry(0.5, 2, 0.5);
    rLeg = new Mesh(cubeGeometry, cubeMaterial);
    rLeg.castShadow = true;
    rLeg.receiveShadow = true;
    rLeg.position.y = -1.5;
    rLeg.position.x = 0.5;
    body.add(rLeg);
    console.log("Added Right Leg to scene...");
    //add Left Arm
    cubeGeometry = new CubeGeometry(2, 0.5, 0.5);
    lArm = new Mesh(cubeGeometry, cubeMaterial);
    lArm.castShadow = true;
    lArm.receiveShadow = true;
    lArm.position.x = -1;
    lArm.position.y = 0.8;
    body.add(lArm);
    console.log("Added Left Arm to scene...");
    //add Right Arm;
    cubeGeometry = new CubeGeometry(2, 0.5, 0.5);
    rArm = new Mesh(cubeGeometry, cubeMaterial);
    rArm.castShadow = true;
    rArm.receiveShadow = true;
    rArm.position.x = 1;
    rArm.position.y = 0.8;
    body.add(rArm);
    console.log("Added Right Arm to scene...");
    //add Head
    cubeGeometry = new CubeGeometry(1.5, 1.5, 1.5);
    head = new Mesh(cubeGeometry, cubeMaterial);
    head.castShadow = true;
    head.receiveShadow = true;
    head.position.y = 1.5;
    body.add(head);
    console.log("Added Head to scene...");
    // Add an AmbientLight to the scene
    ambientLight = new AmbientLight(0x090909);
    scene.add(ambientLight);
    console.log("Added an Ambient Light to Scene");
    // Add a SpotLight to the scene
    spotLight = new SpotLight(0xffffff);
    spotLight.position.set(5.6, 23.1, 5.4);
    spotLight.rotation.set(-0.8, 42.7, 19.5);
    spotLight.castShadow = true;
    scene.add(spotLight);
    console.log("Added a SpotLight Light to Scene");
    // add controls
    gui = new GUI();
    control = new Control(0.1, 0.1, 0.1, ambientcolour);
    addControl(control);
    // Add framerate stats
    addStatsObject();
    console.log("Added Stats to scene...");
    document.body.appendChild(renderer.domElement);
    gameLoop(); // render the scene	
    window.addEventListener('resize', onResize, false);
}
function onResize() {
    camera.aspect = CScreen.RATIO;
    camera.updateProjectionMatrix();
    renderer.setSize(CScreen.WIDTH, CScreen.HEIGHT);
}
function addControl(controlObject) {
    gui.add(controlObject, 'rotationSpeedx', -0.5, 0.5);
    gui.add(controlObject, 'rotationSpeedy', -0.5, 0.5);
    gui.add(controlObject, 'rotationSpeedz', -0.5, 0.5);
    gui.addColor(controlObject, 'ambientcolour').onChange(function (color) { cubeMaterial.color = new Color(color); });
}
function addStatsObject() {
    stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);
}
// Setup main game loop
function gameLoop() {
    stats.update();
    body.rotation.x += control.rotationSpeedx;
    body.rotation.y += control.rotationSpeedy;
    body.rotation.z += control.rotationSpeedz;
    // render using requestAnimationFrame
    requestAnimationFrame(gameLoop);
    // render the scene
    renderer.render(scene, camera);
}
// Setup default renderer
function setupRenderer() {
    renderer = new Renderer();
    renderer.setClearColor(0xEEEEEE, 1.0);
    renderer.setSize(CScreen.WIDTH, CScreen.HEIGHT);
    //renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    console.log("Finished setting up Renderer...");
}
// Setup main camera for the scene
function setupCamera() {
    camera = new PerspectiveCamera(45, CScreen.RATIO, 0.1, 1000);
    //camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = 0.6;
    camera.position.y = 16;
    camera.position.z = -20.5;
    camera.lookAt(new Vector3(0, 0, 0));
    console.log("Finished setting up Camera...");
}
//# sourceMappingURL=game.js.map