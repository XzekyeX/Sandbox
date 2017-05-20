/**
*
* @author Mikko Tekoniemi 
* 
*/
var player, light, ground, trees = [], inits = [];
function initWorld(scene) {
    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.OimoJSPlugin());
    var loader = new BABYLON.AssetsManager(scene);

    scene.clearColor = new BABYLON.Color3(0.2, 0.2, 0.8);

    // var tlight = HemisphericLight(scene, "test light", BABYLON.Vector3.Zero(), 0.8);

    // Hemispheric light to light the scene
    var h = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, -1), scene);
    //    h.intensity = 0.35;

    var d1 = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(1, -1, -2), scene);
    d1.position = new BABYLON.Vector3(-300, 300, 600);
    var shadowGenerator = new BABYLON.ShadowGenerator(2048, d1);

    ground = new Model(scene, "Ground", "Ground.obj", "grass.png", Vec3(0, 0, 0));

    player = new Player(scene, Vec3(0, 16, 0), 0.5, 0.1);

    for (var x = -5; x < 5; x++) {
        for (var z = -5; z < 5; z++) {
            var tree = new Tree(scene, Vec3(x * 15, 11, z * 15), { segments: 2, width: 8, height: 5, depth: 8 }, { height: 5, dTop: 1, dBot: 2, tessellation: 5, subdivisions: 2 }, Color(34, 139, 34), Color(139, 69, 19), shadowGenerator);
            trees.push(tree);
        }
    }

    loader.load();

    ground.buildInit = function () {
        for (var tree in trees) {
            trees[tree].toGround(scene, ground);
        }
    };

}

function updateWorld(scene) {
    player.update();
    for (var tree in trees) {
        trees[tree].update();
        if (trees[tree].removed) {
            trees[tree].dispose();
            remove(trees, tree);
        }
    }
}

function remove(list, index) {
    if (index > -1) {
        list.splice(index, 1);
    }
}
