/**
*
* @author Mikko Tekoniemi 
* 
*/
class Tree extends BABYLON.Mesh {
    constructor(scene, pos, segments, size, branchColor, trunkColor, shadow) {
        super("tree", scene);
        this.position = pos;
        this.material = createColorMaterial(scene, "branch_mat", branchColor);
        this.vertex = BABYLON.VertexData.CreateSphere({ segments: segments, diameterX: size.x, diameterY: size.y, diameterZ: size.z });
        this.vertex.applyToMesh(this, false);
        var height = 7, dTop = 2, dBot = 6;
        this.trunk = BABYLON.Mesh.CreateCylinder("trunk", height, dTop, dBot, 5, 2, scene);
        this.trunk.material = createColorMaterial(scene, "trunk_mat", trunkColor);
        this.trunk.parent = this;
        this.trunk.position.y = -height;
        this.build();
        shadow.getShadowMap().renderList.push(this);
        shadow.getShadowMap().renderList.push(this.trunk);
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
        var max = 1;
        var min = -1;
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