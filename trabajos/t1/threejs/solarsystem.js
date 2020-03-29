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

sun = {
    name: "Sun",
    radius: 1,
    xValue: 0,
    color: 'rgb(255,200,0)'
};

mercury = {
    name: "Mercury",
    radius: 0.1,
    xValue: 1.5,
    color: 'rgb(255,200,100)',
};
venus = {
    name: "Venus",
    radius: 0.2,
    xValue: 2.3,
    color: 'rgb(255,100,0)'
};
earth = {
    name: "Earth",
    radius: 0.4,
    xValue: 3.3,
    color: 'rgb(10,100,255)'
};
mars = {
    name: "Mars",
    radius: 0.2,
    xValue: 4.3,
    color: 'rgb(255,10,50)'
};
jupiter = {
    name: "Jupiter",
    radius: 0.6,
    xValue: 5.5,
    color: 'rgb(255,200,100)'
};
saturn = {
    name: "Saturn",
    radius: 0.5,
    xValue: 7,
    color: 'rgb(200,200,100)'
};
uranus = {
    name: "Uranus",
    radius: 0.3,
    xValue: 8.2,
    color: 'rgb(100,200,255)'
};
neptun = {
    name: "Neptun",
    radius: 0.3,
    xValue: 9.2,
    color: 'rgb(50,50,255)'
};

var planets = [mercury, venus, earth, mars, jupiter, neptun, saturn, uranus];

// Text
var text = {
    title: "The Solar System",
    color: 'rgb(255, 255, 255)',
    size: 0.5,
    xValue: 1,
}


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
    system.position.y = 1;

    // Lighs
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    var pointLight1 = new THREE.PointLight(0xffffff, 0.5);
    //var pointLight2 = new THREE.PointLight(0xffffff, 0.5);
    //var pointLight3 = new THREE.PointLight(0xffffff, 0.5);
    scene.add(ambientLight);
    scene.add(pointLight1);
    //scene.add(pointLight2);
    //scene.add(pointLight3);


    // Sun
    var sunSphere = new THREE.SphereGeometry(1, 30, 30);
    var sunMaterial = new THREE.MeshBasicMaterial({
        color: sun.color
    });
    sun = new THREE.Mesh(sunSphere, sunMaterial);

    // Planets
    planets.forEach(function (planet) {
        var planetSphere = new THREE.SphereGeometry(planet.radius, 30, 30);
        var planetMaterial = new THREE.MeshPhongMaterial({
            color: planet.color
        });
        var newPlanet = new THREE.Mesh(planetSphere, planetMaterial);
        console.log(planet.name);
        newPlanet.position.x = planet.xValue;
        system.add(newPlanet);
    });



    var stars = createStars(90, 64);
    scene.add(stars);

    system.add(sun);
    system.add(stars);
    scene.add(system);
    scene.add(new THREE.AxesHelper(3));
}

function createStars(radius, segments) {
    var texture = new THREE.TextureLoader().load('../img/background.jpg');
    var material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide
    });
    var sphere = new THREE.SphereGeometry(radius, segments, segments);
    return new THREE.Mesh(sphere, material);

    //return new THREE.Mesh(new THREE.SphereGeometry(radius, segments, segments), new THREE.MeshBasicMaterial({
    // map: THREE.TextureLoader('../img/stars.jpg'),
    // side: THREE.BackSide
    //}));
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
        color: 'rgb(255,255,0)',
        rotationSpeed: [],
    };

    // Interface
    var gui = new dat.GUI();
    var folder = gui.addFolder("Interface Solar System");
    folder.add(effectControls, "rotationSpeed", {
        Low: 0,
        Medium: 1,
        High: 2
    }).name("Rotation speed");
}


function update() {
    // Change properties between frames

    // Time elapsed
    var now = Date.now();

    // Increment with 20 degrees per second
    angle += Math.PI / 9 * (now - before) / 1000;
    before = now;

    // Rotate objects
    sun.rotation.y = angle;

    // Change with user demand
    sun.rotation = angle * effectControls.rotationSpeed;
}

function render() {
    // Refresh loop
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}
