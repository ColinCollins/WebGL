import nodeTree from "../../frameBlock/nodeTree";

class sceneObj {
    _mainCamera = null;
    cameras = [];

    constructor (id, name, camera) {
        this._id = id;
        this._name = name;
        this.nodeTree = new nodeTree();
        _mainCamera = camera;
    }

    get name () {
        return this._name;
    }
}

export default sceneObj;