/*
 ** Seminario #4: Multivista y seleccion 
 ** @author: rvivo@upv.es
 ** @date: 11-03-2020
 */

// Variables globales estandar
var renderer, scene, camera;

// Otras variables
var cameraControls;

// Otras camaras
var alzado, perfil, planta;
const L = 4;

init();
loadScene();
render();

function init() {
    // Funcion de inicializacion de motor, escena y camara

    // Motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.autoClear = false;
    document.getElementById('container').appendChild(renderer.domElement);

    // Escena
    scene = new THREE.Scene();

    // Camaras
    var aspectRatio = window.innerWidth / window.innerHeight;
    setCameras(aspectRatio);

    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(0, 0, 0);

    // Atencion al evento de resize
    window.addEventListener('resize', updateAspectRatio);
}

function setCameras(ar) {
    // Construye el conjunto de camaras

    // Camaras ortograficas
    var camaraOrtografica;
    if (ar < 1)
        camaraOrtografica = new THREE.OrthographicCamera(-L, L, L / ar, -L / ar, -1, 100);
    else
        camaraOrtografica = new THREE.OrthographicCamera(-L * ar, L * ar, L, -L, -1, 100);

    // Alzado, planta, perfil
    alzado = camaraOrtografica.clone();
    alzado.position.set(0, 0, 10);
    alzado.lookAt(new THREE.Vector3(0, 0, 0));
    perfil = camaraOrtografica.clone();
    perfil.position.set(10, 0, 0);
    perfil.lookAt(new THREE.Vector3(0, 0, 0));
    planta = camaraOrtografica.clone();
    planta.position.set(0, 10, 0);
    planta.up = new THREE.Vector3(0, 0, -1);
    planta.lookAt(new THREE.Vector3(0, 0, 0));

    // Camara perspectiva
    var cameraPerspectiva = new THREE.PerspectiveCamera(75, ar, 0.1, 100);
    cameraPerspectiva.position.set(1, 2, 5);
    cameraPerspectiva.lookAt(new THREE.Vector3(0, 0, 0));

    camera = cameraPerspectiva.clone();

    scene.add(alzado);
    scene.add(planta);
    scene.add(perfil);
    scene.add(camera);

}

function loadScene() {
    var material = new THREE.MeshBasicMaterial({
        color: 'yellow',
        wireframe: true
    });
    var geometriaCubo = new THREE.BoxGeometry(0.9, 0.9, 0.9);

    // Array de cubos
    for (var i = 0; i < 5; i++) {
        var cubo = new THREE.Mesh(geometriaCubo, material);
        cubo.position.set(-2 + i, 0, 0);
        scene.add(cubo);
    }

    renderer.domElement.addEventListener('dblclick', rotateCube);
}

function rotateCube(event) {
    // Girar el cubo seleccionado con doble click

    var x = event.clientX;
    var y = event.clientY;

    var derecha = false,
        abajo = false;
    var cam = null;

    // Zona de dobleclick (seleccion)
    if (x > window.innerWidth / 2) {
        derecha = true;
        x -= window.innerWidth / 2;
    };
    if (y > window.innerHeight / 2) {
        abajo = true;
        y -= window.innerHeight / 2;
    }

    // Determinar que camara es la que debe construir el rayo
    if (derecha)
        if (abajo) cam = camera;
        else cam = perfil;
    else
    if (abajo) cam = planta;
    else cam = alzado;

    // Normalizar x,y al espacio de 2x2 centrado
    x = x * 4 / window.innerWidth - 1;
    y = -y * 4 / window.innerHeight + 1;

    // Construir el rayo que pasa por el punto de vista y el punto x,y
    var rayo = new THREE.Raycaster();
    rayo.setFromCamera(new THREE.Vector2(x, y), cam);

    // Calcular interseccion con objetos de la escena
    var interseccion = rayo.intersectObjects(scene.children);
    if (interseccion.length > 0) {
        interseccion[0].object.rotation.x += Math.PI / 5;
    }
}

function update() {
    // Cambiar propiedades entre frames
}

function updateAspectRatio() {
    // Renovar las dimensiones del canvas
    renderer.setSize(window.innerWidth, window.innerHeight);

    var ar = window.innerWidth / window.innerHeight;

    camera.aspect = ar;

    camera.updateProjectionMatrix();

}

function render() {
    // Blucle de refresco
    requestAnimationFrame(render);
    update();
    renderer.clear();

    // Distrubuir los render en diferentes viewport
    renderer.setViewport(0, 0, window.innerWidth / 2, window.innerHeight / 2);
    renderer.render(scene, alzado);

    renderer.setViewport(window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight / 2);
    renderer.render(scene, perfil);

    renderer.setViewport(0, window.innerHeight / 2, window.innerWidth / 2, window.innerHeight / 2);
    renderer.render(scene, planta);

    renderer.setViewport(window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 2, window.innerHeight / 2);
    renderer.render(scene, camera);
}
