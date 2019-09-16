// Tree node
const MAX_NODE_COUNT = 1024;

class nodeTree {
    isDestroy = false;
    _nodes = new Array(MAX_NODE_COUNT);
    count = 0;

    addNewNode (node) {
       if (this.count + 1 === MAX_NODE_COUNT) return;
        this._nodes.push(node);
        this.count++;
   }

    clearAll () {
        if (!this.isDestroy) return;
       this._nodes = new Array(1024);
   }
}

export default nodeTree;