import vec3 from "./vec3";
import vec2 from "./vec2";

class Transform {
    // dirty
    isDirty = false;
    constructor () {
        this._position = new vec3();
        this._rotation = new vec3();
        this._anchor = new vec2(0.5, 0.5);
        this._size = vec3.one();
        this.isDirty = true;
        // Matrix4
        this.modelMatrix = null;
    }

    get position () {
        return vec3.clone(this._position);
    }
    set position (value) {
        this.isDirty = true;
        if (!(value instanceof vec3)) console.warn("Node position type error");
        this._poisition = vec3.clone(value);
    }

    get rotation () {
        // 四元数
        return vec3.clone(this._rotation);
    }
    set rotation (value) {
        this.isDirty = true;
        if (!(value instanceof vec3)) console.warn("Node rotation type error");
        this._rotation = vec3.clone(value);
    }

    get anchor () {
        return vec2.clone(this._anchor);
    }

    set anchor (value) {
        this.isDirty = true;
        if (!(value instanceof vec2)) console.warn("Node anchor type error");
        this._anchor = vec2.clone(value);
    }

    get size () {
        return vec3.clone(this._size);
    }

    set size (value) {
        this.isDirty = true;
        if (!(value instanceof vec3)) console.warn("Node size type error");
        this._size = vec3.clone(value);
    }

    initData () {
        if (!this.isDirty) return;

        this.modelMatrix = new Martix4().setTranslate(this._position).scale(this._size).rotate(this._rotation.y, 0, 1, 0)
    }

}

export default Transform;