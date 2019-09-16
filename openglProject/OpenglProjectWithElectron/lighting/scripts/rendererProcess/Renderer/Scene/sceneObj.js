import nodeTree from "../../frameBlock/nodeTree";

class sceneObj {

    _mainCamera = null;
    cameras = [];

    constructor (id, camera) {
        this._id = id;
        this.nodeTree = new nodeTree();
        _mainCamera = camera;
    }

    awake()
    start() {}
    preUpdate() {}
    update() {

    }
    lateUpdate() {}
}

export default sceneObj;