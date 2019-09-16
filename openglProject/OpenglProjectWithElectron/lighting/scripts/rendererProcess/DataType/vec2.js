// static method 中 this 指向 class
// static 方法能够被子类继承
// 实例对象不能直接引用 static 方法

class vec2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    static create(x = 0, y = 0) {
        return new vec2(x, y);
    }

    static zero(t) {
        let out = t ? t : new vec2();
        out.x = 0;
        out.y = 0;
        return out;
    }

    static clone(a) {
        return new vec2(a.x, a.y);
    }

    static add(out, a, b) {
        out.x = a.x + b.x;
        out.y = a.y + b.y;
        return out;
    }

    static subtract(out, a, b) {
        out.x = a.x - b.x;
        out.y = a.y - b.y;
        return out;
    }

    static sub(out, a, b) {
        out.x = b.x - a.x;
        out.y = b.y - a.y;
        return out;
    }

    static multiply(out, a, b) {
        out.x = a.x * b.x;
        out.y = a.y * b.y;
        return out;
    }

    static mul(out, a, b) { return this.multiply(out, a, b) }

    static divide(out, a, b) {
        out.x = a.x / b.x;
        out.y = a.y / b.y;
        return out;
    }

    static div(out, a, b) { return this.divide(out, a, b); }

    static ceil(out, a) {
        out.x = Math.ceil(a.x);
        out.y = Math.ceil(a.y);
        return out;
    }

    static floor(out, a) {
        out.x = Math.floor(a.x);
        out.y = Math.floor(a.y);
        return out;
    }

    /**
 * Performs Math.min on each component of two vectors respectively.
 *
 * It doesn't matter that any amount of these parameters refer to same vector.
 *
 * @param {vec2} out - Vector to store result.
 * @param {vec2} a - The first operand.
 * @param {vec2} b - The second operand.
 * @returns {vec2} out.
 */
    static min(out, a, b) {
        out.x = Math.min(a.x, b.x);
        out.y = Math.min(a.y, b.y);
        return out;
    }

    /**
     * Performs Math.min on each component of two vectors respectively.
     *
     * It doesn't matter that any amount of these parameters refer to same vector.
     *
     * @param {vec2} out - Vector to store result.
     * @param {vec2} a - The first operand.
     * @param {vec2} b - The second operand.
     * @returns {vec2} out.
     */
    static max(out, a, b) {
        out.x = Math.max(a.x, b.x);
        out.y = Math.max(a.y, b.y);
        return out;
    }

    /**
     * Performs Math.round on each component of a vector.
     *
     * It doesn't matter that any amount of these parameters refer to same vector.
     *
     * @param {vec2} out - Vector to store result.
     * @param {vec2} a - Vector to perform operation.
     * @returns {vec2} out.
     */
    static round(out, a) {
        out.x = Math.round(a.x);
        out.y = Math.round(a.y);
        return out;
    }

    /**
     * Scales a vector with a number.
     *
     * @param {vec2} out - Vector to store result.
     * @param {vec2} a - Vector to scale.
     * @param {number} b - The scale number.
     * @returns {vec2} out.
     * */
    static scale(out, a, b) {
        out.x = a.x * b;
        out.y = a.y * b;
        return out;
    }

    /**
     * Add two vectors after scaling the second operand by a number.
     *
     * @param {vec2} out - Vector to store result.
     * @param {vec2} a - The first operand.
     * @param {vec2} b - The second operand.
     * @param {number} scale - The scale number before adding.
     * @returns {vec2} out.
     */
    static scaleAndAdd(out, a, b, scale) {
        out.x = a.x + (b.x * scale);
        out.y = a.y + (b.y * scale);
        return out;
    }

    /**
     * Calculates the euclidian distance between two vectors.
     *
     * @param {vec2} a - The first operand.
     * @param {vec2} b - The second operand.
     * @returns {number} Distance between a and b.
     */
    static distance(a, b) {
        let x = b.x - a.x,
            y = b.y - a.y;
        return Math.sqrt(x * x + y * y);
    }

    /**
     *Alias of {@link vec2.distance}.
     */
    static dist(a, b) {
        return vec2.distance(a, b);
    }

    /**
     * Calculates the squared euclidian distance between two vectors.
     *
     * @param {vec2} a - The first operand.
     * @param {vec2} b - The second operand.
     * @returns {number} Squared distance between a and b.
     */
    static squaredDistance(a, b) {
        let x = b.x - a.x,
            y = b.y - a.y;
        return x * x + y * y;
    }

    /**
     *Alias of {@link vec2.squaredDistance}.
     */
    static sqrDist(a, b) {
        return vec2.squaredDistance(a, b);
    }
    /**
     * Calculates the length of a vector.
     *
     * @param {vec2} a - The vector.
     * @returns {Number} Length of the vector.
     */
    static magnitude(a) {
        let x = a.x,
            y = a.y;
        return Math.sqrt(x * x + y * y);
    }

    /**
     *Alias of {@link vec2.magnitude}.
     */
    static mag(a) {
        return vec2.magnitude(a);
    }

    /**
     * Calculates the squared length of a vector.
     *
     * @param {vec2} a - The vector.
     * @returns {Number} Squared length of the vector.
     */
    static squaredMagnitude(a) {
        let x = a.x,
            y = a.y;
        return x * x + y * y;
    }

    /**
     *Alias of {@link vec2.squaredMagnitude}
     */
    static sqrMag(a) {
        return vec2.squaredMagnitude(a);
    }

    /**
     * Negates each component of a vector.
     *
     * @param {vec2} out - Vector to store result.
     * @param {vec2} a - Vector to negate.
     * @returns {vec2} out.
     */
    static negate(out, a) {
        out.x = -a.x;
        out.y = -a.y;
        return out;
    }

    /**
     * Invert the components of a vector.
     *
     * @param {vec2} out - Vector to store result.
     * @param {vec2} a - Vector to invert.
     * @returns {vec2} out.
     */
    static inverse(out, a) {
        out.x = 1.0 / a.x;
        out.y = 1.0 / a.y;
        return out;
    }
    static inverseSafe(out, a) {
        let x = a.x,
            y = a.y;

        if (Math.abs(x) < EPSILON) {
            out.x = 0;
        } else {
            out.x = 1.0 / x;
        }

        if (Math.abs(y) < EPSILON) {
            out.y = 0;
        } else {
            out.y = 1.0 / a.y;
        }

        return out;
    }

    /**
     * Normalizes a vector.
     *
     * @param {vec2} out - Vector to store result.
     * @param {vec2} a - Vector to normalize.
     * @returns {vec2} out.
     */
    static normalize(out, a) {
        let x = a.x,
            y = a.y;
        let len = x * x + y * y;
        if (len > 0) {
            //TODO: evaluate use of glm_invsqrt here?
            len = 1 / Math.sqrt(len);
            out.x = a.x * len;
            out.y = a.y * len;
        }
        return out;
    }

    /**
     * Calculates the dot product of two vectors.
     *
     * @param {vec2} a - The first operand.
     * @param {vec2} b - The second operand.
     * @returns {Number} Dot product of a and b.
     */
    static dot(a, b) {
        return a.x * b.x + a.y * b.y;
    }

    /**
     * Calculate the cross product of two vectors.
     * Note that the cross product must by definition produce a 3D vector.
     *
     * @param {vec2} out - Vector to store result.
     * @param {vec2} a - The first operand.
     * @param {vec2} b - The second operand.
     * @returns {vec3} out.
     */
    static cross(out, a, b) {
        let z = a.x * b.y - a.y * b.x;
        out.x = out.y = 0;
        out.z = z;
        return out;
    }

    /**
     * Performs a linear interpolation between two vectors.
     *
     * @param {vec2} out - Vector to store result.
     * @param {vec2} a - The first operand.
     * @param {vec2} b - The second operand.
     * @param {Number} t - The interpolation coefficient.
     * @returns {vec2} out.
     */
    static lerp(out, a, b, t) {
        let ax = a.x,
            ay = a.y;
        out.x = ax + t * (b.x - ax);
        out.y = ay + t * (b.y - ay);
        return out;
    }

    /**
     * Generates a random vector uniformly distributed on a circle centered at the origin.
     *
     * @param {vec2} out - Vector to store result.
     * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit length vector will be returned.
     * @returns {vec2} out.
     */
    static random(out, scale) {
        scale = scale || 1.0;
        let r = random() * 2.0 * Math.PI;
        out.x = Math.cos(r) * scale;
        out.y = Math.sin(r) * scale;
        return out;
    }

    static forEach(a, stride, offset, count, fn, arg) {
        return vec2._forEach(a, stride, offset, count, fn, arg);
    }

    /**
     * Returns string representation of a vector.
     *
     * @param {vec2} a - The vector.
     * @returns {String} - String representation of this vector.
     */
    static str(a) {
        return `vec2(${a.x}, ${a.y})`;
    }
    /**
     * Store components of a vector into array.
     *
     * @param {vec2} v - The vector.
     * @returns {Array} out.
     */
    static array(v) {
        let ele = new Float32Array();
        ele[0] = v.x;
        ele[1] = v.y;
        return ele;
    }

    /**
   * Returns whether the specified vectors are equal. (Compared using ===)
   *
   * @param {vec2} a - The first vector.
   * @param {vec2} b - The second vector.
   * @returns {Boolean} True if the vectors are equal, false otherwise.
   */
    static exactEquals(a, b) {
        return a.x === b.x && a.y === b.y;
    }

    /**
   * Returns whether the specified vectors are approximately equal.
   *
   * @param {vec2} a The first vector.
   * @param {vec2} b The second vector.
   * @returns {Boolean} True if the vectors are approximately equal, false otherwise.
   */
    static equals(a, b) {
        let a0 = a.x, a1 = a.y;
        let b0 = b.x, b1 = b.y;
        return (Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)));
    }

    elements() {
        return new Float32Array([this.x, this.y]);
    }
}

export default vec2;
