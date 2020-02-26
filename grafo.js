/*
** Seminario 1: Grafo de escena
** @autor: Sunniva Mathea Runde
** @dependencies: OrbitCOntrols.js, Tween.js, dat.gui.min.js
*/

// Variables globales estandar
var renderer, scene, camera;

// Objetos
var esfera, conjunto, cubo;

// Control
var cameraControls, effectControls;

// Temporales
var angulo: 0;
var antes = Date.now();


// Acciones
init();
loadScene();
render();

function init() {
	// Funcion de init de motor, escena y camara

	// Motor de render
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(new THREE.Color(0x000000));
	document.getElementById("container").appendChild(renderer.domElement);

	// Escena
	scene = new THREE.Scene();

	// Camara
	var aspectRatio = window.innerWidth/window.innerHeight;
	//camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100); // Perspectiva
	camera = new THREE.OrthographicCamera(-10, 10, 10/aspectRatio, -10/aspectRatio, 0.1, 100); // Orthographic
	camera.position.set(0.5, 2, 5); 
	camera.lookAt(new THREE.Vector3(0,0,0));

	// Control de camara
	cameraControls = new THREE.OrbitCOntrols(camera, renderer.domElement);
	cameraControls.target.set(0, 0, 0);
	cameraControls.noZoom = false;


	//Atender al eventos
	window.addEventListener('resize', updateAspectRatio);

}

function loadScene() {
	// Construye el grado de escena
	// - Objetos (geometria, material)
	// - Transformaciones
	// - Organizar el grafo

	// Objeto contenedor de cubo y esfera
	conjunto = new THREE.Object3D();
	conjunto.position.y = 1;


	// Cubo
	var geoCubo = new THREE.BoxGeometry(2, 2, 2);
	var geoMat = new THREE.MeshBasicMaterial({color: 'green', wireframe: true});
	cubo = new THREE.Mesh(geoCubo, geoMat);
	cubo.position.x = 2;

	// Esfera
	var geoEsfera = new THREE.SphereGeometry(1, 30, 30);
	var material = new THREE.MeshBasicMaterial({color: "yellow", wireframe: true});
	esfera = new THREE.Mesh(geoEsfera, material);

	// Suelo
	var geoSuelo = new THREE.PlaneGeometry(10, 10, 12, 12);
	var matSuelo = new THREE.MeshBasicMaterial({color: 'grey', wireframe: false});
	var suelo = new THREE.Mesh(geoSuelo, matSuelo);
	suelo.rotation.x = -Math.PI/2;
	suelo.position.y = -0.1;

	// Objeto importado
	var loader = new THREE.ObjectLoader();
	loader.load('models/mario/mario-sculpture.json',
		function (objeto) {
			objeto.scale.set(0.01, 0.01, 0.01);
			objeto.rotation.y = Math.PI/2;
			cubo.add(objeto);
		})

	// Texto
	var fontLoader = new THREE.FontLoader();
	fontLoader.load('font/gentilis_bold.typeface.json',
					function (font) {
						var geoTexto = new THREE.TextGeometry('MARIO',
							{
								size: 0.5,
								height: 0.1,
								curveSegments: 3,
								style: "normal",
								font: font,
								bevelThickness: 0.05,
								bevelSize: 0.04,
								bevelEnabled: true
							});
						var matTexto = new THREE.MeshBasicMaterial({color: 'red'});
						var texto = new THREE.Mesh(geoTexto, matTexto);
						scene.add(texto);
						texto.position.x = -1;
					});

	// Grafo
	conjunto.add(cubo);;
	conjunto.add(esfera);
	scene.add(conjunto);
	scene.add(new THREE.AxesHelper(3));
	scene.add(suelo);

}

function updateAspectRatio() {
	// Mantener øa reøacopm de aspecto entre marco y camara

	var aspectRatio = window.innerWidth/window.innerHeight;

	// Renovar medidas de viewport
	renderer.setSize(window.innerWidth, window.innerHeight);

	// Para la perspectiva
	camera.aspect = aspectRatio;

	// Para la ortografica
	// camera.top = 10/aspectRatio;
	// camera.bottom = -10/aspectRatio;

	// Hay que actualizar la matriz de proyeccion
	camera.updateProjectionMatrix();

function update() {
	// Cambiar propiedades entre frames

	// Tiempo transcurrido
	var ahora = Date.now();

	// Incremento de 20 grados por segundo
	angulo += Math.PI/9 * (ahora - antes)/1000;
	antes = ahora;


	esfera.rotation.y = angulo;
	conjunto.rotation.y = angulo/10;
}

function render() {
	// Blucle de refresco
	requestAnimationFrame(render);
	update();
	renderer.render(scene, camera);
}