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