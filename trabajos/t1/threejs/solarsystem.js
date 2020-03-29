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
    xValue: 1,
    color: 'rgb(255,200,100)',
};
venus = {
    name: "Venus",
    radius: 0.2,
    xValue: 2,
    color: 'rgb(255,100,0)'
};
earth = {
    name: "Earth",
    radius: 0.4,
    xValue: 3,
    color: 'rgb(10,100,255)'
};
mars = {
    name: "Mars",
    radius: 0.2,
    xValue: 4,
    color: 'rgb(255,10,50)'
};
jupiter = {
    name: "Jupiter",
    radius: 0.6,
    xValue: 5,
    color: 'rgb(255,200,100)'
};
saturn = {
    name: "Saturn",
    radius: 0.5,
    xValue: 6,
    color: 'rgb(200,200,100)'
};
uranus = {
    name: "Uranus",
    radius: 0.3,
    xValue: 7,
    color: 'rgb(100,200,255)'
};
neptun = {
    name: "Neptun",
    radius: 0.3,
    xValue: 8,
    color: 'rgb(50,50,255)'
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
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0x000000));
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

    // The sun
    var sunSphere = new THREE.SphereGeometry(1, 30, 30);
    var sunMaterial = new THREE.MeshBasicMaterial({
        color: sun.color
    });
    sun = new THREE.Mesh(sunSphere, sunMaterial);

    // Planets
    planets.forEach(function (planet) {
        var planetSphere = new THREE.SphereGeometry(planet.radius, 30, 30);
        var planetMaterial = new THREE.MeshBasicMaterial({
            color: planet.color
        });
        var newPlanet = new THREE.Mesh(planetSphere, planetMaterial);
        console.log(planet.name);
        newPlanet.position.x = planet.xValue;
        system.add(newPlanet);
    });

    // Text
    var fontLoader = new THREE.FontLoader();
    fontLoader.load('fonts/Yanone_Regular.json',
        function (font) {
            var geoTexto = new THREE.TextGeometry(
                'The Solar System', {
                    size: 0.5,
                    height: 0.1,
                    curveSegments: 3,
                    style: "normal",
                    font: font,
                    bevelThickness: 0.05,
                    bevelSize: 0.04,
                    bevelEnabled: true
                });
            var matTexto = new THREE.MeshBasicMaterial({
                color: 'yellow'
            });
            var texto = new THREE.Mesh(geoTexto, matTexto);
            scene.add(texto);
            texto.position.x = 1;
        });


    system.add(sun);
    scene.add(system);
    scene.add(new THREE.AxesHelper(3));
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
    folder.addColor(effectControls, "color").name("Color");
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
    sun.material.setValues({
        color: effectControls.color
    });
}

function render() {
    // Refresh loop
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}
