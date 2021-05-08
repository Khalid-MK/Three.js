import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r113/build/three.module.js";
import { GLTFLoader } from "https://threejsfundamentals.org/threejs/resources/threejs/r113/examples/jsm/loaders/GLTFLoader.js";
var mixer;

function main() {
  var selectedObject;

  var scene = new THREE.Scene();

  // Create Camera
  var camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // Camera Position
  camera.position.x = 0;
  camera.position.y = 7;
  camera.position.z = +10;
  camera.lookAt(0, 0, 0);

  // Render
  var renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor("#808080");
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  // Lighting
  var dl = new THREE.DirectionalLight(0xffffff, 1);
  scene.add(dl);
  dl.position.set(0, 1, 1);

  var al = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(al);

  const loader = new THREE.TextureLoader();
  const texture1 = loader.load("stone.jpg");
  var texture1_material = new THREE.MeshLambertMaterial({
    map: texture1
  });

  const texture2 = loader.load("UV_Grid.jpg");
  var texture2_material = new THREE.MeshLambertMaterial({
    map: texture2
  });

  const texture3 = loader.load("wall.jpg");
  var texture3_material = new THREE.MeshLambertMaterial({
    map: texture3
  });

  //****************************************** */

  //#region   Cubes

  // Cube Plane
  var cube_Plane_geometry = new THREE.BoxGeometry(10, 0.2, 10);
  var cube_Plane_material = texture3_material;

  var cube_Plane = new THREE.Mesh(cube_Plane_geometry, cube_Plane_material);

  // Cube Plane Position
  cube_Plane.rotation.x = 0;
  cube_Plane.rotation.y = 0;
  cube_Plane.position.set(0, 0, 0);
  scene.add(cube_Plane);

  //****************************************** */

  // Red Cube
  var cube_Red = New_Cube(2);

  // Cube Position
  cube_Red.rotation.y = 0;
  cube_Red.rotation.x = 0;
  cube_Red.position.set(2.7, 0.5, 0);
  cube_Red.material = texture2_material;
  scene.add(cube_Red);

  //****************************************** */

  // Yellow Cube
  var cube_Yellow = New_Cube(2);

  cube_Yellow.material = texture1_material;

  // Cube Position
  cube_Yellow.rotation.y = 0;
  cube_Yellow.rotation.x = 0;
  cube_Yellow.position.set(-2.7, 0.5, 0);
  scene.add(cube_Yellow);

  //******************************************** */

  // Cube 0,0,0
  var _cube = New_Cube(2);
  _cube.material = new THREE.MeshPhongMaterial({ color: 0x000000 });
  scene.add(_cube);

  //********************************************* */
  var raycaster = new THREE.Raycaster();
  //#endregion

  // Loop

  var previousTime = 0;

  function loop(time) {
    time = time / 1000;
    var deltaTime = time - previousTime;
    previousTime = time;

    requestAnimationFrame(loop);
    renderer.render(scene, camera);

    if (mixer) mixer.update(deltaTime);
  }

  loop(0);

  //********************************************* */

  var pick = false;
  var selectedObject = null;
  var moveObject = null;

  //********************************************* */

  //#region  Events

  // Mouse Dawn Event
  document.addEventListener("mousedown", function(event) {
    // Get mouse position
    var mousePos = getRelativePosition(event);
    raycaster.setFromCamera(mousePos, camera);
    var intersects = raycaster.intersectObjects(scene.children, true);

    // potition of new cube
    let pos = intersects[0].point;

    // select element
    // not important part
    for (var i = 0; i < intersects.length; i++) {
      var intersectsData = intersects[i].object.userData;
      if (intersectsData.selected) {
        intersectsData.unselect();
        selectedObject = intersects[i].object;
        break;
      } else {
        intersectsData.select();
        selectedObject = intersects[i].object;
        break;
      }
    }
    //

    if (selectedObject.userData.id == 1) {
      moveObject = selectedObject;
      if (pick) {
        moveObject.position.set(pos.x, moveObject.position.y, pos.z);
        scene.add(moveObject);
        moveObject = null;
        pick = false;
      }
    } else if (selectedObject.userData.id == 2) {
      moveObject = New_Cube(1);
      moveObject.material = selectedObject.material;
      scene.add(moveObject);
    }
  });

  //Mouse Move
  document.addEventListener("mousemove", function(event) {
    var mousePos = getRelativePosition(event);
    raycaster.setFromCamera(mousePos, camera);
    var intersects = raycaster.intersectObjects(scene.children, true);

    if (moveObject) {
      var pos = intersects[0].point;
      moveObject.position.set(
        GetPosition(-4.6, 4.62, pos.x),
        moveObject.position.y,
        GetPosition(-4.375, 4.8, pos.z)
      );
      pick = true;
    }
  });

  //Keyboard
  document.addEventListener("keydown", function(event) {
    if (moveObject) {
      switch (event.keyCode) {
        case 37:
          // left key pressed
          moveObject.rotation.y += 0.1;
          break;
        case 38:
          // up key pressed
          moveObject.rotation.x += 0.1;
          break;
        case 39:
          // right key pressed
          moveObject.rotation.y -= 0.1;
          break;
        case 40:
          // down key pressed
          moveObject.rotation.x -= 0.1;
          break;
      }
    }
  });

  //#endregion

  scene.background = getEnvMap();
  loadModel(scene);
}

// Create Cube
var New_Cube = function(_id) {
  const cube_data = {
    selected: false,
    id: _id,
    select: function() {
      this.selected = true;
      this.colorHex = this.cubeMesh.material.color.getHex();
      this.cubeMesh.material.color.setHex(this.colorHex);
    },
    unselect: function() {
      this.selected = false;
      this.cubeMesh.material.color.setHex(this.colorHex);
    }
  };
  var geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
  var material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
  var cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, 0.5, 0);
  cube.userData = cube_data;
  cube_data.cubeMesh = cube;
  return cube;
};

// Mouse Position
function getRelativePosition(event) {
  event.preventDefault();
  let mouse = {};
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  return mouse;
}

function GetPosition(min, max, num) {
  if (num >= max) {
    return max;
  } else if (num <= min) {
    return min;
  }
  return num;
}

function getEnvMap() {
  let path = "./skybox/";
  let format = ".jpg";
  let urls = [
    path + "px" + format,
    path + "nx" + format,
    path + "py" + format,
    path + "ny" + format,
    path + "pz" + format,
    path + "nz" + format
  ];
  let loader = new THREE.CubeTextureLoader();
  let envMap = loader.load(urls);
  envMap.format = THREE.RGBFormat;
  envMap.encoding = THREE.sRGBEncoding;
  return envMap;
}

function loadModel(scene) {
  let loader = new GLTFLoader();
  loader.load("./models/new knight/scene.gltf", gltf => {
    const model = gltf.scene.children[0];
    const animation = gltf.animations[0];
    mixer = new THREE.AnimationMixer(model);
    const action = mixer.clipAction(animation);
    action.play();
    model.scale.set(0.3, 0.3, 0.3);
    model.position.set(0, 2.5, 1);
    scene.add(model);
  });
}

main();
