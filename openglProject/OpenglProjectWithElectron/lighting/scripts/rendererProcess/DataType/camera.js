import component from "./component";
import vec3 from "./vec3";

class Camera extends component {

    static type = ComponentType.CAMERA;

    // 类似于 renderTexture
    _canvas = null;

    /**
     * 持有当前 camera 的 sceneObj
     * @class {sceneObj}
     */
    _sceneHandle = null;

    /**
     * 摄像机位置，从 node pos 获取
     * @class {vec3}
     */
    _eyePos = null;

    /**
     * 摄像机查看中心点位置
     * @class {vec3}
     */
    _viewCenterPos = null;

    /**
     * 摄像机相对世界坐标下坐标轴
     * @class {vec3}
    */
    _worldAxis = null;

    /**
     * 观察矩阵
     * @class {Matrx4}
    */
    _viewMatrix = null;

    /**
     * 投影矩阵
     * @class {Matrix4}
    */
    _projectionMatrix = null;

    // 最好是一个 scene 里面只有一个 camera
    constructor (canvas) {
        super();

        if (!canvas) canvas = document.createElement('canvas');
        _canvas = canvas;

        // init prototype
        this._viewCenterPos = new vec3();
        this._worldAxis = new vec3(0, 1, 0);
        this._eyePos = new vec3();

        _updateViewMatrix();
        _updateProjectionMatrix();
    }

    static clone (camera) {
        return Object.create(camera);
    }

    _updateViewMatrix () {
        this._viewMatrix = new Matrix4().setLookAt(
            this._eyePos.x, this._eyePos.y, this._eyePos.z,
            this._viewCenterPos.x, this._viewCenterPos.y, this._viewCenterPos.z,
            this._worldAxis.x, this._worldAxis.y, this._worldAxis.z
        );
    }

    _updateProjectionMatrix () {
        // Camera view position and perspective
        let aspect = canvas.width / canvas.height;
        let viewAngle = 50.0;
        let near = 1;
        let far = 100;
        this._projectionMatrix = new Matrix4().setPerspective(viewAngle, aspect, near, far);
    }

    setEyePos (pos) {
        this._eyePos = pos;
        this._updateViewMatrix();
    }

    setViewCenterPos (pos) {
        this._viewCenterPos = pos;
        this._updateViewMatrix();
    }

    onAwake () {}

}