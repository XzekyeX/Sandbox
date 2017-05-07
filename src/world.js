/**
*
* @author Mikko Tekoniemi 
* 
*/
var player, light;
var offset = new BABYLON.Vector3(0, 12.0, 0);
var TREES = [];
function initWorld(scene) {
    scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
    var loader = new BABYLON.AssetsManager(scene);

    scene.clearColor = new BABYLON.Color3(0.2, 0.2, 0.8);

    var tlight = HemisphericLight(scene, "test light", BABYLON.Vector3.Zero(), 0.8);

    light = SpotLight(scene, "light", BABYLON.Vector3.Zero(), Vec3(0, -1, 0), 0.8, 2, 0.5);

    var ground_mat = createTextureMaterial(scene, "tex1", "grass.png", Vec2(1.0, 1.0));
    //var plane = createPlane(scene, "ground", Vec3(0, 0, 0), Vec2(50, 50), ground_mat);
    var ground = loadMesh(loader, "Ground", "GroundTest2.obj", Vec3(0, 0, 0), Vec3(1.0, 1.0, 1.0), ground_mat);

    var player_mat = createColorMaterial(scene, "col2", new BABYLON.Color3(0.2, 0.5, 0.8))
    player = loadMesh(loader, "Player", "Dude.obj", Vec3(4, 1.5, -4), Vec3(0.5, 0.5, 0.5), player_mat);

    var tree_mat = createColorMaterial(scene, "col1", new BABYLON.Color3(0.4, 0.3, 0.1))
    var dead_tree = loadMesh(loader, "Dead Tree", "DeadTree1.obj", Vec3(0, 0, 0), Vec3(1.0, 1.0, 1.0), tree_mat);
    var tree = loadMesh(loader, "Tree", "TreeB2.obj", Vec3(0, 0, 0), Vec3(1.0, 1.0, 1.0), tree_mat);

    loader.load();

    var amount = 100;
    ground.then(function (gtask) {
        dead_tree.then(function (task) {
            task.position = getAvailableTreePos(gtask, scene);
            TREES.push(tree);
            for (var i = 0; i < amount; i++) {
                var t = task.clone(task.name);
                t.id = task.name + (TREES.length + 1);
                var pos = getAvailableTreePos(gtask, scene);
                t.position = pos;
                TREES.push(t);
            }
        });
        tree.then(function (task) {
            task.position = getAvailableTreePos(gtask, scene);
            TREES.push(tree);
            for (var i = 0; i < amount; i++) {
                var t = task.clone(task.name);
                t.id = task.name + (TREES.length + 1);
                var pos = getAvailableTreePos(gtask, scene);
                t.position = pos;
                TREES.push(t);
            }
        });
        player.then(function (task) {
            task.applyGravity = true;
        });
    });
}

function getAvailableTreePos(ground, scene) {
    var bound = ground.getBoundingInfo();
    var x = rand(bound.minimum.x, bound.maximum.x);
    var z = rand(bound.minimum.z, bound.maximum.z);
    var y = getMeshY(x, z, ground, scene);
    var pos = Vec3(x, y, z);
    if (checkTreePos(pos)) {
        console.log("Not Available Pos:", pos);
        return getAvailableTreePos();
    }
    return pos;
}

function checkTreePos(pos) {
    for (var tree in TREES) {
        if (TREES[tree].position === pos) return true;
    }
    return false;
}

var rad = 1.5707963267948966;
function updateWorld(scene) {
    player.then(function (task) {
        var speed = 0.1;
        var rotate = 0.1;
        if (isKeyDown(Keys.Q)) task.rotation.y -= rotate;
        if (isKeyDown(Keys.E)) task.rotation.y += rotate;

        if (isKeyDown(Keys.A)) {
            task.position.x -= Math.sin(task.rotation.y + rad) * speed;
            task.position.z -= Math.cos(task.rotation.y + rad) * speed;
        }
        if (isKeyDown(Keys.D)) {
            task.position.x -= Math.sin(task.rotation.y - rad) * speed;
            task.position.z -= Math.cos(task.rotation.y - rad) * speed;
        }
        if (isKeyDown(Keys.S)) {
            task.position.x -= Math.sin(task.rotation.y) * speed;
            task.position.z -= Math.cos(task.rotation.y) * speed;
        }
        if (isKeyDown(Keys.W)) {
            task.position.x += Math.sin(task.rotation.y) * speed;
            task.position.z += Math.cos(task.rotation.y) * speed;
        }
        light.position = addVec3(task.position, Vec3(0, 3, 0));
        light.direction.x = Math.sin((task.rotation.y));
        light.direction.z = Math.cos((task.rotation.y));
        // camera.setPosition(Vec3(task.position.x, task.position.y, task.position.z));
    });
}
