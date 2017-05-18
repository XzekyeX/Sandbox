/**
*
* @author Mikko Tekoniemi 
* 
*/
var width = 640;
var height = 480;
var camera;
var git = "https://raw.githubusercontent.com/XzekyeX/Sandbox/master/";

var local = false;

function init() {
    if (!BABYLON.Engine.isSupported()) {
        console.warn("Babylon engine is not supported! Please enable WebGL!");
        return;
    }
    var agent = navigator.userAgent;
    var android = agent.includes("Android");
    console.log("Agent", agent, "is Android:", android);
    var game = $("<canvas width=\"" + width + "\" height=\"" + height + "\" />");
    $("#game").append(game);
    var engine = new BABYLON.Engine(game[0], true);
    initInput(game[0]);
    window.addEventListener('resize', resizeCanvas, false);
    function resizeCanvas() {
        width = game[0].width = window.innerWidth;
        height = game[0].height = window.innerHeight;
        engine.resize();
    }
    resizeCanvas();
    var scene = createScene(game[0], engine);
    var delta = 0;
    var ns = 1000000000 / 60.0;
    var lastTime = getCurrentTimeMills();//window.performance.now();  // FIX ME
    var timer = getCurrentTimeMills();
    var ups = 0;
    var showFps = $("<b style=\"font-size: 20px; color:white;\"></b>");
    $("#fps").append(showFps);
    setInterval(function () {
        updateInput();
        update(scene);
        ups++;
    }, 17);
    engine.runRenderLoop(function () {
        // var now = getCurrentTimeMills();//window.performance.now();  //FIX ME
        // delta += (now - lastTime) * 0.06;
        // lastTime = now;
        // while (delta >= 1) {
        //     delta--;
        //     updateInput();
        //     update(scene);
        //     ups++;
        // }

        scene.render();
        if ((getCurrentTimeMills() - timer) >= 1000) {
            timer += 1000;
            // console.log("ups[" + ups + "]");
            showFps[0].innerHTML = engine.getFps().toFixed() + " fps, " + ups + " ups";
            ups = 0;
        }
    });
}

// function current


function update(scene) {
    updateWorld(scene);
}

function createScene(canvas, engine) {
    var scene = new BABYLON.Scene(engine);
    camera = new BABYLON.ArcRotateCamera("camera", -1.57, 1, 40, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, false);
    initWorld(scene);
    return scene;
}


function createTextureMaterial(scene, name, file, scale, backFaceCulling) {
    var mat = new BABYLON.StandardMaterial(name, scene);
    mat.diffuseTexture = new BABYLON.Texture(local ? "res/textures/" + file : git + "res/textures/" + file, scene);
    mat.diffuseTexture.uScale = scale.x;
    mat.diffuseTexture.vScale = scale.y;
    mat.backFaceCulling = backFaceCulling;
    mat.specularColor = BABYLON.Color3.Black();
    return mat;
}

function createColorMaterial(scene, name, color) {
    var mat = new BABYLON.StandardMaterial(name, scene);
    mat.diffuseColor = color;
    mat.specularColor = BABYLON.Color3.Black();
    return mat;
}

function createPlane(scene, name, pos, size, mat) {
    var plane = new BABYLON.Mesh.CreateGround(name, size.x, size.y, 1, scene, false);
    plane.position = pos;
    plane.material = mat;
    return plane;
}

function createLight(scene, name, pos, dir) {
    var light = new BABYLON.DirectionalLight(name, dir, scene);
    light.position = pos;
    return light;
}

function HemisphericLight(scene, name, pos, intensity) {
    var light = new BABYLON.HemisphericLight(name, pos, scene);
    light.intensity = intensity;
    return light;
}

function SpotLight(scene, name, pos, dir, angle, exponent, intensity) {
    var light = new BABYLON.SpotLight(name, pos, dir, angle, exponent, scene);
    light.intensity = intensity;
    return light;
}

function loadMesh(loader, name, obj, pos, scale, mat) {
    var mt = loader.addMeshTask(name, "", local ? "res/models/" : git + "res/models/", obj);
    var deferred = $.Deferred();
    mt.onSuccess = function (task) {
        var mesh = task.loadedMeshes[0];
        mesh.position = pos;
        mesh.material = mat;
        mesh.scaling = scale;
        deferred.resolve(mesh);
    }
    mt.onError = function (task) {
        var mesh = task.loadedMeshes[0];
        deferred.reject(mesh);
    }
    return deferred.promise();
}

function read(arr, index) {
    return arr != null && Object.keys(arr).length > index ? arr[index] : null;
}