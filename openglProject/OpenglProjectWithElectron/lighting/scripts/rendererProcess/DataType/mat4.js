import vec3 from "./vec3";

// 这个类的功能很多，但是我会用的比较少，大多数都用 cuon-Matrix 的
// 这个类作为对应方法的理解类和 vec3 一起用
class Matrix4x4 {

    elements = new Float32Array(16);

    constructor () {
        let e = this.elements;

        e[0] = 1; e[1] = 0; e[2] = 0; e[3] = 0;
        e[4] = 0; e[5] = 1; e[6] = 0; e[7] = 0;
        e[8] = 0; e[9] = 0; e[10] = 1; e[11] = 0;
        e[12] = 0; e[13] = 0; e[14] = 0; e[15] = 1;
    }
    /**
     * matrix 获取 camera 的 viewMatrix
     * @param eyePos {vec3} camera position
     * @param centerPos {vec3} camera view center position
     * @param Axis {vec3} up axis
     * @reference https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-3d-camera.html
     */
    setLookAt (eyePos, centerPos, Axis) {
        let viewDir = new vec3();
        vec3.sub(viewDir, centerPos, eyePos);
        vec3.normalize(viewDir, viewDir);

        // 计算 x 轴方向
        let xDir = new vec3();
        vec3.cross(xDir, viewDir, Axis);
        vec3.normalize(xDir, xDir);

        // 计算 y 轴方向
        let yDir = new vec3();
        vec3.cross(yDir, viewDir, xDir);
        vec3.normalize(yDir, yDir);

        let e = this.elements;
        // get camera coordiate
        e[0] = xDir[0]; e[1] = yDir[0]; e[2] = -viewDir[0]; e[3] = 0;
        e[4] = xDir[1]; e[5] = yDir[1]; e[6] = -viewDir[1]; e[7] = 0;
        e[8] = xDir[2]; e[9] = yDir[2]; e[10] = -viewDir[2]; e[11] = 0;
        e[12] = 0; e[13] = 0; e[14] = 0; e[15] = 1;
    }

    lookAt (eyePos, centerPos, Axis) {
        return this.concat(new Matrix4x4().setLookAt(eyePos, centerPos, Axis));
    }

    // 矩阵乘法
    concat (othrMatrix) {
        var i, e, a, b, ai0, ai1, ai2, ai3;
        // e, a 指向同一个引用，它俩值是一样的3

        e = this.elements;
        a = this.elements;
        b = othrMatrix.elements;

        if (e === b) {
            b = new Float32Array(16);
            for (i = 0; i < 16; ++i) {
                b[i] = e[i];
            }
        }

        for (i = 0; i < 4; i++) {
            ai0=a[i];  ai1=a[i+4];  ai2=a[i+8];  ai3=a[i+12];
            e[i]    = ai0 * b[0]  + ai1 * b[1]  + ai2 * b[2]  + ai3 * b[3];
            e[i+4]  = ai0 * b[4]  + ai1 * b[5]  + ai2 * b[6]  + ai3 * b[7];
            e[i+8]  = ai0 * b[8]  + ai1 * b[9]  + ai2 * b[10] + ai3 * b[11];
            e[i+12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
        }
    }

}

export default Matrix4x4;