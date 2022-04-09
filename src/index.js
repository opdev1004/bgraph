const BGraphData = require('./bgraphdata.js');
const BGraphNode = require('./bgraphnode.js');
const ListNode = require('./listnode.js');

module.exports = class BGraph {
    constructor(option={order: 3}) {
        this.root;
        this.start;
        this.end;
        this.order = option.order;
        this.size = 0;
        this.height = 1;
    }

    search(key)
    {   
        let tempNode = this.root;

        if(!key || typeof key !== 'string' || !tempNode) return undefined;

        let height = this.height;
        let nextNodeIndex = 0;

        for(let i = 0; i < height; i++)
        {
            let dataList = tempNode.dataList;
            let dataListSize = dataList.length;

            for(let j = 0; j < dataListSize; j++)
            {
                nextNodeIndex = j;
                let data = dataList[j];
                let dataKey = data.key;

                let compareResult = this.compareKey(dataKey, key);

                if(compareResult == 0) 
                {
                    return data.ref.value;
                }
                else if(compareResult > 0) break;
                else if(compareResult < 0) nextNodeIndex = nextNodeIndex + 1;
            }
            
            tempNode = tempNode.children[nextNodeIndex];
        }

        return undefined;
    }

    searchRange(key, total, position = 0)
    {
        let tempNode = this.root;

        if(!key || typeof key !== 'string' || !tempNode) return undefined;

        let height = this.height;
        let nextNodeIndex = 0;

        for(let i = 0; i < height; i++)
        {
            let dataList = tempNode.dataList;
            let dataListSize = dataList.length;

            for(let j = 0; j < dataListSize; j++)
            {
                nextNodeIndex = j;
                let data = dataList[j];
                let dataKey = data.key;

                let compareResult = this.compareKey(dataKey, key);

                if(compareResult == 0) 
                {
                    let result = [];
                    let listNode = data.ref;
                    
                    for(let k = 0; k < position; k++)
                    {
                        listNode = listNode.next;

                        if(listNode === undefined) return [];
                    }

                    for(let k = 0; k < total; k++)
                    {
                        result.push({key: listNode.key, value: listNode.value});
                        
                        if(listNode.next === undefined) break;
                        else listNode = listNode.next;
                    }

                    return result;
                }
                else if(compareResult > 0) break;
                else if(compareResult < 0) nextNodeIndex = nextNodeIndex + 1;
            }
            
            tempNode = tempNode.children[nextNodeIndex];
        }

        return [];
    }

    searchKeyContains(substring, total, position = 0, lastKey = "")
    {
        if(!substring || typeof substring !== 'string') return undefined;
        if(lastKey === "")
        {
            return this.searchKeyContainsFromListNode(this.start, substring, total, position);
        }
        else
        {
            let listNode = this.searchListNode(lastKey);
            return this.searchKeyContainsFromListNode(listNode, substring, total, position);
        }
    }

    searchKeyContainsFromListNode(listNode, substring, total, position)
    {
        let tempNode = listNode;

        if(!tempNode) return undefined;

        let result = [];
        let count = 0;
        let positionCount = 0;

        while(tempNode !== undefined && tempNode.key !== undefined)
        {
            let key = tempNode.key;
            
            if(key.includes(substring))
            {
                if(positionCount >= position)
                {
                    result.push({key: key, value: tempNode.value});
                    count++;
                }
                else positionCount++;
            }
            if(count >= total) return result;

            tempNode = tempNode.next;
        }

        return result;
    }

    searchValueContains(substring, total, position = 0,  lastKey = "")
    {
        if(!substring || typeof substring !== 'string') return undefined;
        if(lastKey === "")
        {
            return this.searchValueContainsFromListNode(this.start, substring, total, position);
        }
        else
        {
            let listNode = this.searchListNode(lastKey);
            return this.searchValueContainsFromListNode(listNode, substring, total, position);
        }
    }

    searchValueContainsFromListNode(listNode, substring, total, position)
    {
        let tempNode = listNode;

        if(!tempNode) return undefined;

        let result = [];
        let count = 0;
        let positionCount = 0;

        while(tempNode !== undefined)
        {
            let value = tempNode.value;
            
            if(value.includes(substring))
            {
                if(positionCount >= position)
                {
                    result.push({key: tempNode.key, value: value});
                    count++;
                }
                else positionCount++;
            }
            if(count >= total) return result;

            tempNode = tempNode.next;
        }

        return result;
    }

    searchListNode(key)
    {   
        let tempNode = this.root;

        if(!key || typeof key !== 'string' || !tempNode) return undefined;

        let height = this.height;
        let nextNodeIndex = 0;

        for(let i = 0; i < height; i++)
        {
            let dataList = tempNode.dataList;
            let dataListSize = dataList.length;

            for(let j = 0; j < dataListSize; j++)
            {
                nextNodeIndex = j;
                let data = dataList[j];
                let dataKey = data.key;

                let compareResult = this.compareKey(dataKey, key);

                if(compareResult == 0) 
                {
                    return data.ref;
                }
                else if(compareResult > 0) break;
                else if(compareResult < 0) nextNodeIndex = nextNodeIndex + 1;
            }
            
            tempNode = tempNode.children[nextNodeIndex];
        }

        return undefined;
    }

    insert(key, value)
    {
        if(!key || typeof key !== 'string') return false;

        let data = new BGraphData();
        data.key = key;

        if(this.root === undefined || this.root === null)
        {
            this.root = new BGraphNode();
        }

        let tempNode = this.root;
        let order = this.order;
        let height = this.height;
        let nextNodeIndex = 0;
        let indexes = [0];
        let parents = [];
        let newListNode = new ListNode();
        newListNode.key = key;
        newListNode.value = value;
        
        for(let i = 0; i < height; i++)
        {
            let dataList = tempNode.dataList;

            if(tempNode.isLeaf || dataList.length == 0)
            {
                let pos = this.getDataPos(data, dataList);
                
                if(this.size == 0)
                {
                    this.start = newListNode;
                    this.end = newListNode;
                    data.ref = this.start;
                }
                else if(pos >= dataList.length)
                {
                    let prevListNode = dataList[pos - 1].ref;
                    let nextListNode = prevListNode.next;
                    prevListNode.next = newListNode;
                    newListNode.prev = prevListNode;

                    if(nextListNode !== undefined && nextListNode.key !== undefined)
                    {
                        nextListNode.prev = newListNode;
                        newListNode.next = nextListNode;
                    }
                    else this.end = newListNode;

                    data.ref = newListNode;
                }
                else
                {
                    let nextListNode = dataList[pos].ref;
                    let prevListNode = nextListNode.prev;

                    if(prevListNode !== undefined && prevListNode.key !== undefined)
                    {
                        prevListNode.next = newListNode;
                        newListNode.prev = prevListNode;
                    }
                    else this.start = newListNode;

                    nextListNode.prev = newListNode;
                    newListNode.next = nextListNode;
                    data.ref = newListNode;
                }
                
                dataList.splice(pos, 0, data);

                let numberOfData = dataList.length;

                if(numberOfData == order)
                {
                    if(i == 0)
                    {
                        this.splitRoot(tempNode);
                        tempNode.isLeaf = false;
                    }
                    else this.split(tempNode, parents, parents.length - 1, indexes);
                }
                
                this.size = this.size + 1;
                return true;
            }

            let dataListSize = dataList.length;

            for(let j = 0; j < dataListSize; j++)
            {
                nextNodeIndex = j;
                let data2 = dataList[j];
                let compareResult = this.compareData(data2, data);

                if(compareResult > 0) break;
                else if(compareResult < 0) nextNodeIndex = nextNodeIndex + 1;
                else if(compareResult == 0) return false;
            }
            
            parents.push(tempNode);
            indexes.push(nextNodeIndex);
            tempNode = tempNode.children[nextNodeIndex];
        }

        return false;
    }

    splitRoot(node)
    {
        let order = this.order;
        let dataList = node.dataList;

        if(node.dataList.length == order)
        {
            let leftNode = new BGraphNode();
            let leftNodeDataList = leftNode.dataList;
            let leftNodeChildren = leftNode.children;
            let rightNode = new BGraphNode();
            let rightNodeDataList = rightNode.dataList;
            let rightNodeChildren = rightNode.children;
            let t = Math.ceil(order / 2);

            for(let i = t; i < order; i++)
            {
                this.addData(this.removeData(t, dataList), rightNodeDataList);
            }
    
            while(dataList.length > 1)
            {
                this.addData(this.removeData(0, dataList), leftNodeDataList);
            }
    
            let children = node.children;

            if(children.length != 0){
                for(let i = 0; i < leftNodeDataList.length + 1; i++)
                {
                    this.addChild(this.removeChild(0, children), i, leftNodeChildren);
                }
    
                while(children.length > 0)
                {
                    this.addChild(this.removeChild(0, children), rightNodeChildren.length, rightNodeChildren);
                }

                leftNode.isLeaf = false;
                rightNode.isLeaf = false;
            }
    
            this.addChild(leftNode, 0, node.children);
            this.addChild(rightNode, 1, node.children);
            this.height = this.height + 1;
        }
    }

    split(child, parents, parentIndex, indexes)
    {
        let order = this.order;
    
        if(child.dataList.length == order)
        {
            let parent = parents[parentIndex];
            let t = Math.ceil(order/2);
            let newChild = new BGraphNode();

            for(let i = t; i < order; i++)
            {
                if(child.dataList.length > t)
                {
                    this.addData(this.removeData(t, child.dataList), newChild.dataList)
                }
                else
                {
                    break;
                }
            }
            
            if(!child.isLeaf){
                let childrenSize = child.children.length;
                let half = Math.ceil(childrenSize/2);
                
                if(order % 2 == 0) half -= 1;

                for(let i = half; i < childrenSize; i++)
                {
                    if(childrenSize > half)
                    {
                        this.addChild(this.removeChild(half, child.children), newChild.children.length, newChild.children);
                    }
                    else
                    {
                        break;
                    }
                }

                newChild.isLeaf = false;
            }

            this.addData(this.removeData(t - 1, child.dataList), parent.dataList)
            let pos = indexes[parentIndex + 1] + 1;
            this.addChild(newChild, pos, parent.children);
            parent.isLeaf = false;

            if(parentIndex > 0)
            {
                this.split(parent, parents, parentIndex - 1, indexes);
            }
            else if(parentIndex == 0)
            {
                this.splitRoot(parents[0]);
            }
        }
    }

    update(key, value)
    {
        let tempNode = this.root;

        if(!key || !tempNode) return false;

        let height = this.height;
        let nextNodeIndex = 0;

        for(let i = 0; i < height; i++)
        {
            let dataList = tempNode.dataList;
            let dataListSize = dataList.length;

            for(let j = 0; j < dataListSize; j++)
            {
                nextNodeIndex = j;
                let data = dataList[j];
                let dataKey = data.key;

                let compareResult = this.compareKey(dataKey, key);

                if(compareResult == 0) 
                {
                    data.ref.value = value;
                    return true;
                }
                else if(compareResult > 0) break;
                else if(compareResult < 0) nextNodeIndex = nextNodeIndex + 1;
            }
            
            tempNode = tempNode.children[nextNodeIndex];
        }

        return false;
    }

    delete(key)
    {
        let tempNode = this.root;
        let height = this.height;
        let nextNodeIndex = 0;
        let indexes = [0];
        let parents = [];

        if(!key || typeof key !== 'string' || !tempNode) return false;

        for(let i = 0; i < height; i++)
        {
            let dataList = tempNode.dataList;
            let dataListSize = dataList.length;

            for(let j = 0; j < dataListSize; j++)
            {
                nextNodeIndex = j;
                let dataKey = dataList[j].key;
                let compareResult = this.compareKey(dataKey, key);

                if(compareResult > 0) break;
                else if(compareResult < 0) nextNodeIndex = nextNodeIndex + 1;
                else if(compareResult == 0)
                {
                    this.deleteFromNode(tempNode, j, parents, indexes);
                    return true;
                }
            }

            if(tempNode.isLeaf) return false;

            parents.push(tempNode);
            indexes.push(nextNodeIndex);
            tempNode = tempNode.children[nextNodeIndex];
        }

        return false;
    }


    deleteFromNode(node, dataIndex, parents, indexes)
    {
        if(node.isLeaf)
        {
            this.removeListNode(node.dataList[dataIndex].ref);
            this.removeData(dataIndex, node.dataList);
            this.size = this.size - 1;
            this.balanceAfterDeletion(node, parents, parents.length - 1, indexes);
            return true;
        }
        else
        {
            parents.push(node);
            indexes.push(dataIndex);
            let maxNode = node.children[dataIndex];

            while(!maxNode.isLeaf)
            {
                parents.push(maxNode);
                indexes.push(maxNode.children.length - 1);
                maxNode = maxNode.children[maxNode.children.length - 1];
            }

            this.removeListNode(node.dataList[dataIndex].ref);
            this.removeData(dataIndex, node.dataList);
            this.size = this.size - 1;
            this.addData(this.removeData(maxNode.dataList.length - 1, maxNode.dataList), node.dataList)
            this.balanceAfterDeletion(maxNode, parents, parents.length - 1, indexes);
            return true;
        }
    }

    balanceAfterDeletion(node, parents, parentIndex, indexes)
    {
        let order = this.order;
        let mk = Math.ceil(order / 2) - 1;
        let dataList = node.dataList;
        let childIndex = indexes[parentIndex + 1];

        if(dataList.length < mk)
        {
            if(parentIndex < 0)
            {
                if(dataList.length == 0)
                {
                    
                    let child = node.children[0];
                    this.height = this.height - 1;
                    this.root = child;

                    return true;
                }
            }
            else
            {
                let parent = parents[parentIndex];

                if(childIndex > 0 && parent.children[childIndex - 1].dataList.length > mk)
                {
                    this.borrowFromLeft(node, childIndex, parent);
                }
                else if(childIndex < parent.dataList.length && parent.children[childIndex + 1].dataList.length > mk)
                {
                    this.borrowFromRight(node, childIndex, parent);
                }
                else if(childIndex == 0)
                {
                    this.mergeRight(node, childIndex, parent);
                    this.balanceAfterDeletion(parent, parents, parentIndex - 1, indexes);
                }
                else
                {
                    this.mergeRight(parent.children[childIndex - 1], childIndex - 1, parent);
                    this.balanceAfterDeletion(parent, parents, parentIndex - 1, indexes);
                }
            }
        }
    }

    borrowFromLeft(child, childIndex, parent)
    {
        let leftChild = parent.children[childIndex - 1];

        if(!child.isLeaf)
        {
            this.addChild(this.removeChild(leftChild.dataList.length, leftChild.children), 0, child.children);
        }

        this.addData(this.removeData(childIndex - 1, parent.dataList), child.dataList);
        this.addData(this.removeData(leftChild.dataList.length - 1, leftChild.dataList), parent.dataList);
    }

    borrowFromRight(child, childIndex, parent)
    {
        let rightChild = parent.children[childIndex + 1];

        this.addData(this.removeData(childIndex, parent.dataList), child.dataList);
        this.addData(this.removeData(0, rightChild.dataList), parent.dataList);

        if(!child.isLeaf)
        {
            this.addChild(this.removeChild(0, rightChild.children), child.dataList.length, child.children);
        }
    }

    mergeRight(child, childIndex, parent)
    {
        let rightChild = parent.children[childIndex + 1];
        
        this.addData(this.removeData(childIndex, parent.dataList), child.dataList);

        while(rightChild.dataList.length > 0)
        {
            this.addData(this.removeData(0, rightChild.dataList), child.dataList);
        }

        if(!child.isLeaf)
        {
            let childChildren = child.children;
            let rightChildChildren = rightChild.children;

            while(rightChildChildren.length > 0)
            {
                this.addChild(this.removeChild(0, rightChildChildren), childChildren.length, childChildren);
            }
        }

        this.removeChild(childIndex + 1, parent.children);
    }

    removeListNode(listNode)
    {
        let prevListNode = listNode.prev;
        let nextListNode = listNode.next;

        if(prevListNode === undefined)
        {
            nextListNode.prev = undefined;
            this.start = nextListNode;
        }
        else prevListNode.next = nextListNode;

        if(nextListNode === undefined) this.end = prevListNode;
        else nextListNode.prev = prevListNode;
    }

    getDataPos(data, dataList)
    {
        let pos = 0;
        let dataListSize = dataList.length;

        while(pos < dataListSize && this.compareData(dataList[pos], data) < 0)
        {
            pos++;
        }

        return pos;
    }

    addData(data, dataList)
    {
        let pos = 0;
        let dataListSize = dataList.length;

        while(pos < dataListSize && this.compareData(dataList[pos], data) < 0)
        {
            pos++;
        }

        dataList.splice(pos, 0, data);
    }

    removeData(pos, dataList)
    {
        let dataListSize = dataList.length;

        if(pos >= dataListSize)
        {
            return null;
        }

        return dataList.splice(pos, 1)[0];
    }

    addChild(node, pos, children)
    {
        children.splice(pos, 0, node);
    }

    removeChild(pos, children)
    {
        return children.splice(pos, 1)[0];
    }

    serialize()
    {
        let size = this.size;

        if(size == 0) return null;

        let listNode = this.start;
        let list = {};
        let tracker;
        list.key = listNode.key;
        list.value = listNode.value;
        list.next = {};
        tracker = list.next;
        listNode = listNode.next;

        for(let i = 1; i < size; i++)
        {
            if(listNode === undefined) break;

            tracker.key = listNode.key;
            tracker.value = listNode.value;

            if(i < size - 1) tracker.next = {};

            tracker = tracker.next;
            listNode = listNode.next;
        }

        let result = {};
        result.order = this.order;
        result.size = size;
        result.height = this.height;
        result.list = list;
        result.btree = JSON.parse(JSON.stringify(this.root, ['dataList', 'children', 'isLeaf', 'key']));
        return JSON.stringify(result);
    }

    serializeToObj()
    {
        let size = this.size;

        if(size == 0) return null;
        
        let listNode = this.start;
        let list = {};
        let tracker;
        list.key = listNode.key;
        list.value = listNode.value;
        list.next = {};
        tracker = list.next;
        listNode = listNode.next;

        for(let i = 1; i < size; i++)
        {
            if(listNode === undefined) break;

            tracker.key = listNode.key;
            tracker.value = listNode.value;

            if(i < size - 1) tracker.next = {};

            tracker = tracker.next;
            listNode = listNode.next;
        }

        let result = {};
        result.order = this.order;
        result.size = size;
        result.height = this.height;
        result.list = list;
        result.btree = JSON.parse(JSON.stringify(this.root, ['dataList', 'children', 'isLeaf', 'key']));
        return result;
    }

    deserialize(string)
    {
        let data = JSON.parse(string);
        this.order = data.order;
        this.size = data.size;
        this.height = data.height;
        this.start = data.list;
        this.root = data.btree;
        let listNode = this.start;
        let prevNode = undefined;

        for(let i = 0; i < this.size; i++)
        {
            listNode.prev = prevNode;
            this.connectRef(listNode);

            if(listNode.next === undefined) this.end = listNode;
            
            prevNode = listNode;
            listNode = listNode.next;
        }
    }

    deserializeFromObj(data)
    {
        if(!data || data === null || data === undefined) return false;
        
        this.order = data.order;
        this.size = data.size;
        this.height = data.height;
        this.start = data.list;
        this.root = data.btree;
        let listNode = this.start;
        let prevNode = undefined;

        for(let i = 0; i < this.size; i++)
        {
            listNode.prev = prevNode;
            this.connectRef(listNode);

            if(listNode.next === undefined) this.end = listNode;
            
            prevNode = listNode;
            listNode = listNode.next;
        }
    }

    connectRef(node)
    {   
        let tempNode = this.root;

        if(!node || !tempNode || !node.key) return false;

        let key = node.key;

        let height = this.height;
        let nextNodeIndex = 0;

        for(let i = 0; i < height; i++)
        {
            let dataList = tempNode.dataList;
            let dataListSize = dataList.length;

            for(let j = 0; j < dataListSize; j++)
            {
                nextNodeIndex = j;
                let data = dataList[j];
                let dataKey = data.key;

                let compareResult = this.compareKey(dataKey, key);

                if(compareResult == 0) 
                {
                    data.ref = node;
                    return true;
                }
                else if(compareResult > 0) break;
                else if(compareResult < 0) nextNodeIndex = nextNodeIndex + 1;
            }
            
            tempNode = tempNode.children[nextNodeIndex];
        }

        return false;
    }

    compareKey(key1, key2)
    {
        return key1.localeCompare(key2);
    }

    compareData(data1, data2)
    {
        return data1.key.localeCompare(data2.key);
    }
}