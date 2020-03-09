import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r113/build/three.module.js';

function main() 
{
    var selectedObject;

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,0.1,1000);
    camera.position.z = 5;
    camera.position.y = 2;
    camera.lookAt(0,0,0);

    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor("#808080");
    renderer.setSize(window.innerWidth,window.innerHeight);

    document.body.appendChild(renderer.domElement);

    var dl = new THREE.DirectionalLight(0xffffff, 1);
    scene.add(dl);
    dl.position.set(0, 1, 1);

    var al = new THREE.AmbientLight( 0xffffff, 0.1 );
    scene.add( al );

    for(let i = 0; i<30;i++) {
        let sphere = new_sphere(i);
        scene.add( sphere )
    }

    var previousTime = 0;

    var raycaster = new THREE.Raycaster();

    function loop(time) {
        zoomAtStart(camera);
        time = time/1000;
        var deltaTime = time - previousTime;
        previousTime = time;

        requestAnimationFrame(loop);
        renderer.render(scene, camera);
    }

    loop(0);

    document.addEventListener("click", function(event){
        var mousePos = getRelativePosition(event);
        raycaster.setFromCamera(mousePos, camera);
        var intersects = raycaster.intersectObjects(scene.children, true);

        for (var i = 0; i < intersects.length; i++) {
            var intersectsData = intersects[i].object.userData;
            if(intersectsData.selected){
                intersectsData.unselect();
                selectedObject = null;
            }
            else{
                intersectsData.select();
                selectedObject = intersects[i].object;
            }
        }
    });
}

function randomRange(from, to){
    return Math.random() * (to - from) + from;
}

function randomColor() {
    return Math.random() * 0xffffff;
}

var zoomAtStart = function(camera) {
    if (camera.position.z <= 8) {
      camera.position.z = camera.position.z + 0.05;
    }
}

var new_sphere = function(id){
    const sphere_data = {
        selected: false,
        id:id,
        select:function(){this.selected = true; this.colorHex =  this.sphereMesh.material.color.getHex(); this.sphereMesh.material.color.setHex(0xff0000);},
        unselect:function(){this.selected = false; this.sphereMesh.material.color.setHex(this.colorHex);},
    };
    var geometry = new THREE.SphereGeometry(randomRange(0.1, 2), 20, 20);
    var material = new THREE.MeshPhongMaterial( {color: randomColor()} );
    var sphere = new THREE.Mesh( geometry, material );
    sphere.position.set(randomRange(-10, 10), randomRange(-10, 10), randomRange(-4, 2));
    sphere.userData = sphere_data;
    sphere_data.sphereMesh = sphere;
    return sphere;
}

function getRelativePosition(event) {
    event.preventDefault();
    let mouse = {};
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    return mouse;
}

main();
