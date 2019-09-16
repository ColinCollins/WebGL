import component from "./component";

class Camera extends component {
    static type = ComponentType.CAMERA;

    canvas = null;

    constructor () {
        super();
        canvas = document.createElement('canvas');
    }
}