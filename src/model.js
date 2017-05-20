/**
*
* @author Mikko Tekoniemi 
* 
*/
class Model extends BABYLON.Mesh {
    constructor(scene, name, obj, texture, pos) {
        super(name, scene);
        this.position = pos;
        this.material = createTextureMaterial(scene, "model_" + name + "_mat", texture, Vec2(1, 1), false);
        this.updatable = true;
        this.computeNormals = false;
        this.lowPoly = true;
        this.obj = obj;
        this.loaded = false;
        this.removed = false;
        this.build();
        // this.physicsImpostor = new BABYLON.PhysicsImpostor(this, BABYLON.PhysicsEngine.BoxImpostor, {
        //     mass: 0
        // });
    }
    buildInit() {

    }
    build() {
        this.file = loadFile(this.obj);
        var that = this;
        this.file.then(function (result) {
            var vertex = new BABYLON.VertexData();
            vertex.positions = result.positions;
            vertex.indices = result.indices;
            if (that.computeNormals) {
                var normals = [];
                BABYLON.VertexData.ComputeNormals(vertex.positions, vertex.indices, normals);
                vertex.normals = normals;
            } else {
                vertex.normals = result.normals;
            }
            vertex.applyToMesh(that);


            if (that.lowPoly) that.convertToFlatShadedMesh();
            that.buildInit();
            that.loaded = true;
        });

    }

}