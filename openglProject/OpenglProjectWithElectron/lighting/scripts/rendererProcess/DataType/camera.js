import component from "./component";

class Camera extends component {
    static type = ComponentType.CAMERA;

    canvas = null;

    constructor () {
        canvas = document.createElement('canvas');
    }
}