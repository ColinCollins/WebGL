import game from "../game";

class component {
    static type = ComponentType.DEFAULT;
    _node = null;
    _uniqueTag = '';
    constructor() {
        this.isDestroy = false;
    }

    setNode (node) {
        this._node = node;
        _uniqueID = node.name.concat(`_${this.type}`);
        game.addToComponentQueue(this);
    }

    // automatically
    awake () {}
    start () {}
    preUpdate () {}
    update () {}
    lateUpdate () {}

    // manually
    onEnable() {}
    onDisable() {}
}

export default component;