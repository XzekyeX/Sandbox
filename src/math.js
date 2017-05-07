/**
*
* @author Mikko Tekoniemi 
* 
*/
function addVec3(a, b) {
    return new BABYLON.Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
}
function add(a, b) {
    return new BABYLON.Vector3(a.x + b, a.y + b, a.z + b);
}

function subVec3(a, b) {
    return new BABYLON.Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
}

function sub(a, b) {
    return new BABYLON.Vector3(a.x - b, a.y - b, a.z - b);
}

function multiplyVec3(a, b) {
    return new BABYLON.Vector3(a.x * b.x, a.y * b.y, a.z * b.z);
}

function multiply(a, b) {
    return new BABYLON.Vector3(a.x * b, a.y * b, a.z * b);
}

function divVec3(a, b) {
    return new BABYLON.Vector3(a.x / b.x, a.y / b.y, a.z / b.z);
}

function div(a, b) {
    return new BABYLON.Vector3(a.x / b, a.y / b, a.z / b);
}

function Vec3(x, y, z) {
    return new BABYLON.Vector3(x, y, z);
}
function QtoVec3(q) {
    return new BABYLON.Vector3(q.x, q.y, q.z);
}
function mulQ(a, b) {
    return new BABYLON.Quaternion(a.x * b.x, a.y * b.y, a.z * b.z, a.w * b.w);
}
function Vec2(x, y) {
    return new BABYLON.Vector2(x, y);
}

function rand(min, max) {
    return Math.floor((Math.random() * (max - min)) + min);
}
// Converts from degrees to radians.
function toRadians(degrees) {
    return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
function toDegrees(radians) {
    return radians * 180 / Math.PI;
};
/**
 * 
 * @param {*} a 
 * @param {*} b 
 * @return Quaternion
 */
function LookRotation(a, b) {
    // console.log("a:", a, "b:", b);
    if (a == BABYLON.Vector3.Zero()) return BABYLON.Quaternion.Identity();
    if (b != a) {
        b.normalize();
        var v = multiply(addVec3(a, b), -(BABYLON.Vector3.Dot(b, a)));

        var q = FromToRotation(BABYLON.Vector3.Forward(), v);
        var result = mulQ(FromToRotation(v, a), q);
        // console.log("result:", result, "v:", v, "q:", q);
        return result;
    } else {
        return FromToRotation(BABYLON.Vector3.Forward(), a);
    }
}

/**
 * 
 * @param {*} a 
 * @param {*} b 
 * @return new Quaternion
 */
function FromToRotation(a, b) {
    var c = BABYLON.Vector3.Cross(a, b);
    var w = Math.sqrt(Math.pow(a.length(), 2) * Math.pow(b.length(), 2)) + (BABYLON.Vector3.Dot(a, b));
    var result = new BABYLON.Quaternion(c.x, c.y, c.z, w);
    // result.normalize();
    // console.log("result", result);
    return result;
}

function ProjectOnPlane(a, b) {
    return subVec3(a, Project(a, b));
}

function Project(a, b) {
    var num = BABYLON.Vector3.Dot(b, b);
    var result;
    if (num < Number.EPSILON) {
        result = BABYLON.Vector3.Zero();
    } else {
        var dot = BABYLON.Vector3.Dot(a, b);
        var m = multiply(b, dot);
        result = div(m, num);
    }
    return result;
}

function toForward(a) {
    return new BABYLON.Vector3(Math.sin(a.x), 0, Math.cos(a.z));
}


function getCurrentTimeMills() {
    return (new Date()).getTime();
}

//value min max
function clamp(value, min, max) {
    return value >= max ? max : value <= min ? min : value;
}

function getMeshMaximumBounds(mesh) {
    return mesh.getBoundingInfo().maximum;
}
function getMeshMinimumBounds(mesh) {
    return mesh.getBoundingInfo().minimum;
}

function getMeshY(x, z, mesh, scene) {
    var maxY = getMeshMaximumBounds(mesh).y;
    var pos = Vec3(x, maxY, z);
    var ray = new BABYLON.Ray(pos, Vec3(0, -1, 0));
    var collide = scene.pickWithRay(ray, function (item) {
        if (item === mesh) return true;
    });
    return (maxY - collide.distance);
}