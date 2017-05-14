/**
*
* @author Mikko Tekoniemi 
* 
*/
class Player extends Model {
    constructor(scene, loader, pos, speed, rotate) {
        super(scene, loader, "Player", "Dude.obj", "grass.png", pos, Vec3(1, 1, 1), Vec3(1, 1, 1), 1, 0.001, 0.5, true);
        this.speed = speed;
        this.rotate = rotate;
        this.rad = 1.5707963267948966;
        this.lamp = SpotLight(scene, "lamp", BABYLON.Vector3.Zero(), Vec3(0, -1, 0), 0.8, 2, 0.5);
        this.ray = new BABYLON.Ray(pos, Vec3(0, -1, 0));
    }

    getDistance(max, mesh) {
        this.ray.origin.y = max;
        var collide = this.scene.pickWithRay(this.ray, function (item) {
            if (item === mesh) return true;
        });
        return max - collide.distance;
    }

    movement() {
        if (!this.loaded) return;
        if (isKeyDown(Keys.Q)) this.mesh.rotation.y -= this.rotate;
        if (isKeyDown(Keys.E)) this.mesh.rotation.y += this.rotate;
        if (isKeyDown(Keys.A)) {
            this.mesh.position.x -= Math.sin(this.mesh.rotation.y + this.rad) * this.speed;
            this.mesh.position.z -= Math.cos(this.mesh.rotation.y + this.rad) * this.speed;
        }
        if (isKeyDown(Keys.D)) {
            this.mesh.position.x -= Math.sin(this.mesh.rotation.y - this.rad) * this.speed;
            this.mesh.position.z -= Math.cos(this.mesh.rotation.y - this.rad) * this.speed;
        }
        if (isKeyDown(Keys.S)) {
            this.mesh.position.x -= Math.sin(this.mesh.rotation.y) * this.speed;
            this.mesh.position.z -= Math.cos(this.mesh.rotation.y) * this.speed;
        }
        if (isKeyDown(Keys.W)) {
            this.mesh.position.x += Math.sin(this.mesh.rotation.y) * this.speed;
            this.mesh.position.z += Math.cos(this.mesh.rotation.y) * this.speed;
        }
        this.ray.origin.x = this.mesh.position.x;
        this.ray.origin.z = this.mesh.position.z;
        this.lamp.position = this.mesh.position;
        this.lamp.direction.x = Math.sin(this.mesh.rotation.y);
        this.lamp.direction.z = Math.cos(this.mesh.rotation.y);
        // this.mesh.updatePhysicsBodyPosition();
    }
    setY(y) {
        if (!this.loaded) return;
        this.mesh.position.y = y;
    }
    addY(y) {
        if (!this.loaded) return;
        this.mesh.position.y += y;
    }
    setAngularVelocity(x, y, z, q) {
        if (!this.loaded) return;
        this.mesh.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(x, y, z, q));
    }

    getRotation() {
        return this.loaded ? this.mesh.rotation : BABYLON.Vector3.Zero();
    }
}
