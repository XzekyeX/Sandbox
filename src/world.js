/**
*
* @author Mikko Tekoniemi 
* 
*/
var player, light, ground;
var offset = new BABYLON.Vector3(0, 12.0, 0);
var TREES = [];
function initWorld(scene) {
    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.OimoJSPlugin());
    var loader = new BABYLON.AssetsManager(scene);

    scene.clearColor = new BABYLON.Color3(0.2, 0.2, 0.8);

    var tlight = HemisphericLight(scene, "test light", BABYLON.Vector3.Zero(), 0.8);

    ground = new Model(scene, loader, "Ground", "Ground.obj", "grass.png", Vec3(0, 0, 0), Vec3(0.2, 0.2, 0.2), Vec2(6, 6), 0, 0.1, 1);

    player = new Player(scene, loader, Vec3(0, 10, 0), 0.1, 0.1);

    var tree = new Model(scene, loader, "Dead_Tree", "DeadTree1.obj", "dead_tree.png", Vec3(0, 0, 0), Vec3(1, 1, 1), Vec2(1, 1), 0, 0, 0);

    loader.load();

}

function updateWorld(scene) {
    player.movement();
}
