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

    ground = new Model(scene, loader, "Ground", "Ground.obj", "grass.png", Vec3(0, 0, 0), Vec3(0.2, 0.2, 0.2), Vec2(10, 10), 0, 0.1, 1);

    player = new Player(scene, loader, Vec3(0, 10, 0), 0.1, 0.1);

    var tree = new Model(scene, loader, "Dead_Tree", "DeadTree1.obj", "dead_tree.png", Vec3(0, 0, 0), Vec3(1, 1, 1), Vec2(1, 1), 0, 0, 0);
    // console.log("tree:", tree);
    loader.load();

}

function updateWorld(scene) {
    player.movement();
    // ground.update(function (mesh) {
    //     if (player.loaded) player.setY(player.getDistance(ground.maximum.y, mesh) + player.maximum.y / 2);
    // if (player.loaded && !player.mesh.intersectsMesh(mesh, true)) {
    //     player.addY(-0.1);
    //     console.log("collide!");
    // }
    // });
}

class Model {
    constructor(scene, loader, name, obj, texture, pos, scale, uv, mass, friction, restitution) {
        this.material = createTextureMaterial(scene, "Texture_Model_" + name, texture, uv);
        this.model = loadMesh(loader, "Model_" + name, obj, pos, scale, this.material);
        this.model.then((e) => (this.mesh = e, this.maximum = e.getBoundingInfo().maximum, this.loaded = true, this.init(e)));
        this.mass = mass;
        this.friction = friction;
        this.restitution = restitution;
    }

    init(e) {
        e.physicsImpostor = new BABYLON.PhysicsImpostor(e, BABYLON.PhysicsEngine.BoxImpostor, { mass: this.mass, restitution: this.restitution, friction: this.friction }, this.scene);
    }

    update(task) {
        if (!this.loaded) return;
        task(this.mesh);
    }
}