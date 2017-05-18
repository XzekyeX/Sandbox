/**
*
* @author Mikko Tekoniemi 
* 
*/
function loadFile(obj) {
    var deferred = $.Deferred();
    var url = local ? "res/models/" : git + "res/models/" + obj;
    var positions = [];
    // var indices = [];
    var faces = [];
    var normals = [];
    var uvs = [];
    var colors = [];
    BABYLON.Tools.LoadFile(url, function (data) {
        var str = data.split(/\r?\n/);
        for (var i = 0; i < str.length; i++) {
            var line = str[i];
            var tokens = RemoveEmptyStrings(line.split(" "));
            if (tokens.length == 0 || tokens[0] == "#") {
                continue;
            } else {
                switch (tokens[0].toLowerCase()) {
                    case "v":
                        positions.push(parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]));
                        break;
                    case "vt":
                        uvs.push(Vec2(parseFloat(tokens[1]), parseFloat(tokens[2])));
                        break;
                    case "vn":
                        normals.push(Vec3(parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3])));
                        break;
                    case "f":
                        var face = new Face([tokens[1], tokens[2], tokens[3]]);
                        faces.push(face);
                        if (tokens.length > 4) {
                            var face1 = new Face([tokens[1], tokens[3], tokens[4]]);
                            faces.push(face1);
                        }
                        break;
                }
            }
        }
        deferred.resolve(reOrder({ positions: positions, normals: normals, uvs: uvs, faces: faces }));
    });
    return deferred.promise();
}

class Face {
    constructor(tokens) {
        this.indices = [];
        for (var i = 0; i < tokens.length; i++) {
            this.indices.push(parseIndex(tokens[i]));
        }
    }
}

class Index {
    constructor() {
        this.vertex = -1;
        this.texture = -1;
        this.normal = -1;
    }
}
//f vertex1/vertex_texture1/vertex_normal1 v2/vt2/vn2 v3/vt3/vn3
function parseIndex(str) {
    var result = new Index();
    var split = str.split("/");
    if (split.length > 0) {
        result.vertex = parseInt(split[0]);
        if (split.length > 1) {
            var tex = split[1];
            if (!isEmpty(tex)) result.texture = parseInt(tex);
            if (split.length > 2) {
                result.normal = parseInt(split[2]);
            }
        }
    }
    return result;
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function reOrder(tokens) {
    var indices = [];
    var uvs = [];
    var normals = [];
    for (var f in tokens.faces) {
        var fi = tokens.faces[f].indices;
        for (var v in fi) {
            var index = fi[v].vertex - 1;
            indices.push(index);
            if (fi[v].texture >= 0) {
                var t = tokens.uvs[fi[v].texture - 1];
                uvs.push(t.x, 1 - t.y);
            }
            if (fi[v].normal >= 0) {
                var n = tokens.normals[fi[v].normal - 1];
                normals.push(n.x, n.y, n.z);
            }
        }
    }
    return { positions: tokens.positions, indices: indices, normals: normals, uvs: uvs };
}

function RemoveEmptyStrings(tokens) {
    var result = [];
    for (var i = 0; i < tokens.length; i++) {
        if (!tokens[i] == "") {
            result.push(tokens[i]);
        }
    }
    return result;
}
