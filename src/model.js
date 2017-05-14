/**
*
* @author Mikko Tekoniemi 
* 
*/
class Model {

    constructor(scene, loader, name, obj, texture, pos, scale, uv, mass, friction, restitution, physics) {
        this.material = createTextureMaterial(scene, "Texture_Model_" + name, texture, uv);
        this.model = loadMesh(loader, "Model_" + name, obj, pos, scale, this.material);
        this.model.then((e) => (this.mesh = e, this.maximum = e.getBoundingInfo().maximum, this.loaded = true, this.init(e)));
        this.mass = mass;
        this.friction = friction;
        this.restitution = restitution;
        this.physics = physics;
    }

    init(e) {
        if (this.physics) e.physicsImpostor = new BABYLON.PhysicsImpostor(e, BABYLON.PhysicsEngine.BoxImpostor, { mass: this.mass, restitution: this.restitution, friction: this.friction }, this.scene);
        e.receiveShadows = true;
    }

    update(task) {
        if (!this.loaded) return;
        task(this.mesh);
    }

    setPos(x, y, z) {
        if (!this.loaded) return;
        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.position.z = z;
    }

    addPos(x, y, z) {
        if (!this.loaded) return;
        this.mesh.position.x += x;
        this.mesh.position.y += y;
        this.mesh.position.z += z;
    }
}