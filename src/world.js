/**
*
* @author Mikko Tekoniemi 
* 
*/
var player, light, ground;
var offset = new BABYLON.Vector3(0, 12.0, 0);
var TREES = [];
function initWorld(scene) {
    scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
    var loader = new BABYLON.AssetsManager(scene);

    scene.clearColor = new BABYLON.Color3(0.2, 0.2, 0.8);

    var tlight = HemisphericLight(scene, "test light", BABYLON.Vector3.Zero(), 0.8);

    ground = new Ground(scene, loader, "GroundTest2.obj", "grass.png");

    player = new Player(scene, loader, Vec3(0, 0, 0), 0.1, 0.1);

    // var tree_mat = createColorMaterial(scene, "col1", new BABYLON.Color3(0.4, 0.3, 0.1))

    // var dead_tree = loadMesh(loader, "Dead Tree", "DeadTree1.obj", Vec3(0, 0, 0), Vec3(1.0, 1.0, 1.0), tree_mat);

    // var tree = loadMesh(loader, "Tree", "lowpoyltree.obj", Vec3(0, 0, 0), Vec3(1.0, 1.0, 1.0), tree_mat);

    var tree = new Tree(scene, loader, Vec3(0, 0, 0), Vec3(1, 1, 1), "lowpoyltree.obj", "TreeBase.jpg");

    loader.load();

}

function updateWorld(scene) {
    player.movement();
    ground.update(function (mesh) {
        if (player.loaded) player.setY(player.getDistance(ground.maximum.y, mesh) + player.maximum.y / 2);
    });
}

class Ground {
    constructor(scene, loader, obj, texture) {
        this.material = createTextureMaterial(scene, "Ground_Texture", texture, Vec2(1.0, 1.0));
        this.model = loadMesh(loader, "Ground", obj, Vec3(0, 0, 0), Vec3(1.0, 1.0, 1.0), this.material);
        this.model.then((e) => (this.mesh = e, this.maximum = e.getBoundingInfo().maximum, this.loaded = true));
    }

    update(task) {
        if (!this.loaded) return;
        task(this.mesh);
    }
}

class Tree {
    constructor(scene, loader, pos, size, obj, texture) {
        this.material = createTextureMaterial(scene, "Tree_Texture", texture, Vec2(1.0, 1.0));
        this.model = loadMesh(loader, "Tree", obj, pos, size, this.material);
        this.model.then((e) => (this.mesh = e, this.maximum = e.getBoundingInfo().maximum, this.loaded = true));
    }

    update(task) {
        if (!this.loaded) return;
        task(this.mesh);
    }
}