class Player extends Model {
    constructor(scene, pos, speed, rotate) {
        super(scene, "Player", "skeleton.obj", "grass.png", pos);
        this.speed = speed;
        this.rotate = rotate;
        this.rad = 1.5707963267948966;
    }

    update() {
        if (isKeyDown(Keys.Q)) this.rotation.y -= this.rotate;
        if (isKeyDown(Keys.E)) this.rotation.y += this.rotate;
        if (isKeyDown(Keys.A)) {
            this.position.x -= Math.sin(this.rotation.y + this.rad) * this.speed;
            this.position.z -= Math.cos(this.rotation.y + this.rad) * this.speed;
        }
        if (isKeyDown(Keys.D)) {
            this.position.x -= Math.sin(this.rotation.y - this.rad) * this.speed;
            this.position.z -= Math.cos(this.rotation.y - this.rad) * this.speed;
        }
        if (isKeyDown(Keys.S)) {
            this.position.x -= Math.sin(this.rotation.y) * this.speed;
            this.position.z -= Math.cos(this.rotation.y) * this.speed;
        }
        if (isKeyDown(Keys.W)) {
            this.position.x += Math.sin(this.rotation.y) * this.speed;
            this.position.z += Math.cos(this.rotation.y) * this.speed;
        }
    }
}