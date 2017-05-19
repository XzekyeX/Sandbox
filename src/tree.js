/**
*
* @author Mikko Tekoniemi 
* 
*/
class Tree extends BABYLON.Mesh {
    constructor(scene, pos, branchData, trunkData, branchColor, trunkColor, shadow) {
        super("tree", scene);
        this.position = pos;
        this.material = createColorMaterial(scene, "branch_mat", branchColor);
        this.branchColor = branchColor;
        this.trunkColor = trunkColor;
        this.branchData = branchData;
        this.trunkData = trunkData;
        //console.log(this.trunkData);
        //options: { segments?: number, diameter?: number, diameterX?: number, diameterY?: number, diameterZ?: number, arc?: number, slice?: number, sideOrientation?: number }
        this.vertex = BABYLON.VertexData.CreateSphere({ segments: branchData.segments, diameterX: branchData.width, diameterY: branchData.height, diameterZ: branchData.depth });
        this.vertex.applyToMesh(this, false);
        //name: string, height: number, diameterTop: number, diameterBottom: number, tessellation: number, subdivisions: any, scene: Scene, updatable?: any, sideOrientation?: number
        this.trunk = BABYLON.Mesh.CreateCylinder("trunk", trunkData.height, trunkData.dTop, trunkData.dBot, trunkData.tessellation, trunkData.subdivisions, scene);

        this.trunk.material = createColorMaterial(scene, "trunk_mat", trunkColor);
        this.trunk.parent = this;
        this.trunk.position.y = -trunkData.height + 1;//-trunkSize.x + 1;
        this.ray = new BABYLON.Ray(this.position, Vec3(0, -1, 0));
        this.isGround = false;
        this.removed = false;
        this.lifeOri = rand(600, 3000);
        this.life = this.lifeOri;
        this.build();
        shadow.getShadowMap().renderList.push(this);
        shadow.getShadowMap().renderList.push(this.trunk);
    }

    update() {
        this.life -= 1;
        var amt = (this.life / this.lifeOri);
        this.material.diffuseColor = LerpColor(this.branchColor, Color(this.branchColor.r, 0, this.branchColor.b), 1 - amt);
        if (this.life <= 0) this.removed = true;
    }

    toGround(scene, ground) {
        if (!this.isGround) {
            var dist = getMeshY(this.position.x, this.position.z, ground, scene);
            var height = dist + this.trunkData.height + 1;
            this.position.y = height;
            //console.log(height);
            this.isGround = true;
        }
    }

    build() {
        var pos = this.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        var points = pos.length / 3;
        var map = [];

        for (var i = 0; i < points; i++) {
            var p = Vec3(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
            var found = false;
            for (var j = 0; (j < map.length) && !found; j++) {
                var val = map[j];
                var p0 = val[0];
                if (p0.equals(p) || ((p0.subtract(p)).lengthSquared() < 0.01)) {
                    val.push(i * 3);
                    found = true;
                }
            }
            if (!found) {
                var val = [];
                val.push(p, i * 3);
                map.push(val);
            }
        }
        var max = 0.5;
        var min = -0.5;
        for (var item in map) {
            var val = map[item];
            var rx = randFloat(min, max);
            var ry = randFloat(min, max);
            var rz = randFloat(min, max);
            for (var i = 1; i < val.length; i++) {
                var j = val[i];
                pos[j] += rx;
                pos[j + 1] += ry;
                pos[j + 2] += rz;
            }
        }
        this.convertToFlatShadedMesh();
    }
}