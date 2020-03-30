/*
 ** Trabajo #1: The Solar System
 ** @author: sunrun@inf.upv.es
 ** @date: 29-03-2020
 ** @dependencier: OrbitControls.js, Tween.js, dat.gui.min.js
 */

// Global variables
var renderer, scene, camera;

// Planet objects
var sun;

var mercury, venus, earth, mars, jupiter, neptun, saturn, uranus;

var orbitLines = []; // For showing and hiding orbit lines

sun = {
    name: "Sun",
    radius: 1,
    distance: 0,
    color: 'rgb(255,200,0)',
    texture: '../t1/img/sun.jpg'
};

mercury = {
    name: "Mercury",
    radius: 0.05,
    distance: 0.7,
    rotationSpeed: 2,
    color: 'rgb(255,200,100)',
    texture: '../t1/img/mercury.jpg'
};
venus = {
    name: "Venus",
    radius: 0.1,
    distance: 1,
    rotationSpeed: 1.5,
    color: 'rgb(255,100,0)',
    texture: '../t1/img/venus.jpg'
};
earth = {
    name: "Earth",
    radius: 0.2,
    distance: 1.45,
    rotationSpeed: 1,
    color: 'rgb(10,100,255)',
    texture: '../t1/img/earth.jpg'
};
mars = {
    name: "Mars",
    radius: 0.1,
    distance: 2,
    rotationSpeed: 0.5,
    color: 'rgb(255,10,50)',
    texture: '../t1/img/mars.jpg'
};
jupiter = {
    name: "Jupiter",
    radius: 0.3,
    distance: 2.8,
    rotationSpeed: 0.25,
    color: 'rgb(255,200,100)',
    texture: '../t1/img/jupiter.jpg'
};
saturn = {
    name: "Saturn",
    radius: 0.1,
    distance: 3.5,
    rotationSpeed: 0.3,
    color: 'rgb(200,200,100)',
    texture: '../t1/img/saturn.jpg'
};
uranus = {
    name: "Uranus",
    radius: 0.15,
    distance: 4,
    rotationSpeed: 0.2,
    color: 'rgb(100,200,255)',
    texture: '../t1/img/uranus.jpg'
};
neptun = {
    name: "Neptun",
    radius: 0.15,
    distance: 4.5,
    rotationSpeed: 0.18,
    color: 'rgb(50,50,255)',
    texture: '../t1/img/neptune.jpg'
};

var planets = [mercury, venus, earth, mars, jupiter, neptun, saturn, uranus];

// Time
var angle = 0;
var before = Date.now();

// Camera variables
var cameraControls, effectControls;

// Functions
init();
loadScene();
setupGUI();
render();

function init() {
    // Initialize the motor, scene and the camera

    // Render motor
    renderer = new THREE.WebGLRenderer({
        alpha: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    document.getElementById('container').appendChild(renderer.domElement);

    // Scene
    scene = new THREE.Scene();

    // Perspective camera
    var aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
    camera.position.set(0.5, 2, 5);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Camera controls
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(0, 0, 0);
    cameraControls.noZoom = false;

    // Events
    window.addEventListener('resize', updateAspectRatio);

}


function loadScene() {
    // Constructing the scene graphics
    // Objects
    // Transformations
    // Organize the graph

    // The solar system object
    system = new THREE.Object3D();
    system.position.y = 0;

    // Lights
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    var pointLight = new THREE.PointLight(0xffffff, 0.7);
    scene.add(ambientLight);
    scene.add(pointLight);

    // Sun
    var sunSphere = new THREE.SphereGeometry(0.45, 30, 30);
    var sunTexture = new THREE.TextureLoader().load(sun.texture);
    var sunMaterial = new THREE.MeshBasicMaterial({
        color: sun.color,
        map: sunTexture
    });
    sun = new THREE.Mesh(sunSphere, sunMaterial);


    // Planets and orbits
    newPlanets = [];
    orbits = [];

    planets.forEach(function (planet) {
        // Create sphere for each planet
        // Add textures to planets
        // Position planets correctly

        var planetSphere = new THREE.SphereGeometry(planet.radius, 30, 30);
        var planetTexture = new THREE.TextureLoader().load(planet.texture);
        var planetMaterial = new THREE.MeshPhongMaterial({
            color: planet.color,
            map: planetTexture
        });
        var newPlanet = new THREE.Mesh(planetSphere, planetMaterial);
        console.log(planet.name);

        newPlanets.push(newPlanet);

        // Add rings to Saturn
        if (planet.name === "Saturn") {
            var rings = createRings(planet.radius, 32);
            rings.rotation.x = 5;
            newPlanet.add(rings);
        }

        // Add orbits to scene and add 
        // planets to their respective orbits
        var geometry = new THREE.CircleGeometry(planet.distance, 100);
        geometry.vertices.shift();

        var orbitLine = new THREE.Line(
            geometry,
            new THREE.LineDashedMaterial({
                color: 'white',
                visible: true
            })
        );
        orbitLine.rotation.x = Math.PI * 0.5;
        newPlanet.position.set(planet.distance, 0, 0);

        orbit = new THREE.Group();
        orbit.add(orbitLine);
        orbit.add(newPlanet);

        orbitLines.push(orbitLine); // For showing and hiding orbit lines

        var orbitDir = new THREE.Group();
        orbitDir.rotation.x = 0.25;
        orbitDir.add(orbit);

        orbits.push(orbitDir);
        scene.add(orbitDir);
    });

    // Background of stars
    var stars = createStarBackground(30, 64);
    scene.add(stars);

    system.add(sun);
    scene.add(system);
    // scene.add(new THREE.AxesHelper(3));
}

function createStarBackground(radius, segments) {
    // Adds a background of stars to a sphere to visualize space

    var texture = new THREE.TextureLoader().load('../t1/img/stars.jpg');
    var material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide
    });
    var sphere = new THREE.SphereGeometry(radius, segments, segments);
    return new THREE.Mesh(sphere, material);
}

function createRings(radius, segments) {
    // Adds rings to a planet

    var texture = new THREE.TextureLoader().load('../t1/img/saturn_rings.png');
    var material = new THREE.MeshBasicMaterial({
        color: saturn.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
    });
    var rings = new THREE.RingGeometry(1.2 * radius, 2 * radius, 2 * segments, 5, 0, Math.PI * 2)
    return new THREE.Mesh(rings, material);

}

function updateAspectRatio() {
    // Maintain the aspect ratio between frame and camera

    var aspectRatio = window.innerWidth / window.innerHeight;

    //Refresh viewport measurements
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Perspective
    camera.aspect = aspectRatio;

    // Update the projection matrix
    camera.updateProjectionMatrix();
}

function setupGUI() {
    // The graphic interface

    // Controls
    effectControls = {
        rotationSpeed: 1,
        showOrbits: true,
    };

    // Interface
    var gui = new dat.GUI();
    var folder = gui.addFolder("Interface Solar System");
    folder.add(effectControls, "rotationSpeed", 1.0, 10.0, 0.1).name("Rotation speed");
    folder.add(effectControls, "showOrbits").name("Show orbits");

}

function getRotationSpeeds() {
    // Return list of rotation speeds of planets

    var speeds = [];
    planets.forEach(function (planet) {
        speeds.push(planet.rotationSpeed);
    })

    return speeds;
}

function rotatePlanets(i) {
    // Rotate planets and orbits around the sun

    var speeds = getRotationSpeeds();

    orbits.forEach(function (orbit) {
        var orbitPosition = orbits.indexOf(orbit);
        orbit.rotation.y = angle * speeds[orbitPosition] * i;
    });
}


function update() {
    // Change properties between frames

    // Time elapsed
    var now = Date.now();

    // Increment with 20 degrees per second
    angle += Math.PI / 9 * (now - before) / 1000;
    before = now;

    // Rotate sun
    sun.rotation.y = angle;

    // Rotate planets around themselves
    newPlanets.forEach(function (planet) {
        planet.rotation.y = angle;
    });

    // Rotate orbits around the sun
    rotatePlanets(1);

    // Change with user demand
    rotatePlanets(effectControls.rotationSpeed);

    orbitLines.forEach(function (orbitLine) {
        orbitLine.visible = effectControls.showOrbits;
    });
}


function render() {

    // Refresh loop
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}
