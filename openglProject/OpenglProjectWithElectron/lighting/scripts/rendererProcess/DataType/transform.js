import vec3 from "./vec3";
import component from "./component";

class Transform extends component {
    static type = ComponentType.TRANSFORM;
    // dirty
    isDirty = false;
    constructor () {
        super();
        this._position = new vec3();
        this._rotation = new vec3();
        this._anchor = new vec3(0.5, 0.5, 0.5);
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
        return vec3.clone(this._anchor);
    }

    set anchor (value) {
        this.isDirty = true;
        if (!(value instanceof vec3)) console.warn("Node anchor type error");
        this._anchor = vec3.clone(value);
    }

    get size () {
        return vec3.clone(this._size);
    }

    set size (value) {
        this.isDirty = true;
        if (!(value instanceof vec3)) console.warn("Node size type error");
        this._size = vec3.clone(value);
    }

    recalculateData () {
        if (!this.isDirty) return;
        this.modelMatrix = new Martix4()
        .setAnchor(this._anchor.x, this._anchor.y, this._anchor.z)
        .scale(this._size.x , this._size.y, this._size.z)
        .rotate(this._rotation.y, 0, 1, 0)
        .translate(this._position.x, this._position.y, this._position.z);
    }
}

export default Transform;