module.exports = class BGraphNode {
    constructor() {
        /**
         * @type {Data[]}
         */
        this.dataList = [];
        /**
         * @type {BGraphNode[]}
         */
        this.children = [];
        /**
         * @type {boolean}
         */
        this.isLeaf = true;
    }
}