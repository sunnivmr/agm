var scene, camera, renderer;
var controls;
var orbit;

init();
animate();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x202020);

    camera = new THREE.PerspectiveCamera(60, 4 / 3, 0.1, 10000.0);
    camera.position.set(5, 5, 5);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    renderer = new THREE.WebGLRenderer({
        antialias: false
    });

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    var ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    var geometry = new THREE.CircleGeometry(3.2, 100);
    geometry.vertices.shift();

    var circle = new THREE.Line(
        geometry,
        new THREE.LineDashedMaterial({
            color: 'aqua'
        })
    );
    circle.rotation.x = Math.PI * 0.5;

    var planet = new THREE.Mesh(
        new THREE.SphereBufferGeometry(0.5, 32, 32),
        new THREE.MeshPhongMaterial({
            color: 'yellow'
        })
    );
    planet.position.set(3.2, 0, 0);

    orbit = new THREE.Group();
    orbit.add(circle);
    orbit.add(planet);

    var orbitDir = new THREE.Group();
    orbitDir.rotation.x = 0.25;
    orbitDir.add(orbit);
    scene.add(orbitDir);

    var solar = new THREE.Mesh(
        new THREE.SphereBufferGeometry(1.0, 32, 32),
        new THREE.MeshPhongMaterial({
            emissive: 0xff5800,
            emissiveIntensity: 0.5
        })
    );
    var pointLight = new THREE.PointLight(0xffffff, 1.0, 10.0);
    solar.add(pointLight);
    scene.add(solar);

    window.addEventListener('resize', onWindowResize, false);
    onWindowResize();

    document.body.appendChild(renderer.domElement);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(time) {
    controls.update();

    orbit.rotation.y += 0.01;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
