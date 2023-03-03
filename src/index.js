const BGraphData = require('./bgraphdata.js');
const BGraphNode = require('./bgraphnode.js');
const ListNode = require('./listnode.js');
const Mutex = require('./mutex');
module.exports = class BGraph
{
    constructor(order = 5, compareCallback = undefined)
    {
        this.root;
        this.start;
        this.end;
        this.order = order;
        this.size = 0;
        this.height = 1;
        this.readingCount = 0;
        this.lock = false;
        this.mutex = new Mutex();
        this.compareCallback = compareCallback;
        if (this.compareCallback === undefined) this.compareCallback = this.compareKey;
    }

    async search(key)
    {
        let tempNode = this.root;

        if (!key || typeof key !== 'string' || !tempNode) return undefined;

        await this.waitForUnlock();
        this.readingCount = this.readingCount + 1;

        let height = this.height;
        let nextNodeIndex = 0;

        for (let i = 0; i < height; i++)
        {
            let dataList = tempNode.dataList;
            let dataListSize = dataList.length;

            for (let j = 0; j < dataListSize; j++)
            {
                nextNodeIndex = j;
                let data = dataList[j];
                let dataKey = data.key;

                let compareResult = await this.compareCallback(dataKey, key);

                if (compareResult == 0) 
                {
                    this.readingCount = this.readingCount - 1;
                    return data.ref.value;
                }
                else if (compareResult > 0) break;
                else if (compareResult < 0) nextNodeIndex = nextNodeIndex + 1;
            }

            tempNode = tempNode.children[nextNodeIndex];
        }

        this.readingCount = this.readingCount - 1;
        return undefined;
    }

    async searchRange(key, total, position = 0)
    {
        let tempNode = this.root;

        if (!key || typeof key !== 'string' || !tempNode) return undefined;

        await this.waitForUnlock();
        this.readingCount = this.readingCount + 1;

        let height = this.height;
        let nextNodeIndex = 0;

        for (let i = 0; i < height; i++)
        {
            let dataList = tempNode.dataList;
            let dataListSize = dataList.length;

            for (let j = 0; j < dataListSize; j++)
            {
                nextNodeIndex = j;
                let data = dataList[j];
                let dataKey = data.key;

                let compareResult = await this.compareCallback(dataKey, key);

                if (compareResult == 0) 
                {
                    let result = [];
                    let listNode = data.ref;

                    for (let k = 0; k < position; k++)
                    {
                        listNode = listNode.next;

                        if (listNode === undefined)
                        {
                            this.readingCount = this.readingCount - 1;
                            return [];
                        }
                    }

                    for (let k = 0; k < total; k++)
                    {
                        result.push({ key: listNode.key, value: listNode.value });

                        if (listNode.next === undefined) break;
                        else listNode = listNode.next;
                    }

                    this.readingCount = this.readingCount - 1;
                    return result;
                }
                else if (compareResult > 0) break;
                else if (compareResult < 0) nextNodeIndex = nextNodeIndex + 1;
            }

            tempNode = tempNode.children[nextNodeIndex];
        }

        this.readingCount = this.readingCount - 1;
        return [];
    }

    async searchRangeBackward(key, total, position = 0)
    {
        let tempNode = this.root;

        if (!key || typeof key !== 'string' || !tempNode) return undefined;

        await this.waitForUnlock();
        this.readingCount = this.readingCount + 1;

        let height = this.height;
        let nextNodeIndex = 0;

        for (let i = 0; i < height; i++)
        {
            let dataList = tempNode.dataList;
            let dataListSize = dataList.length;

            for (let j = 0; j < dataListSize; j++)
            {
                nextNodeIndex = j;
                let data = dataList[j];
                let dataKey = data.key;

                let compareResult = await this.compareCallback(dataKey, key);

                if (compareResult == 0) 
                {
                    let result = [];
                    let listNode = data.ref;

                    for (let k = 0; k < position; k++)
                    {
                        listNode = listNode.prev;

                        if (listNode === undefined)
                        {
                            this.readingCount = this.readingCount - 1;
                            return [];
                        }
                    }

                    for (let k = 0; k < total; k++)
                    {
                        result.splice(0, 0, { key: listNode.key, value: listNode.value });

                        if (listNode.prev === undefined) break;
                        else listNode = listNode.prev;
                    }

                    this.readingCount = this.readingCount - 1;
                    return result;
                }
                else if (compareResult > 0) break;
                else if (compareResult < 0) nextNodeIndex = nextNodeIndex + 1;
            }

            tempNode = tempNode.children[nextNodeIndex];
        }

        this.readingCount = this.readingCount - 1;
        return [];
    }

    async searchKeyContains(substring, total, position = 0, lastKey = "")
    {
        if (!substring || typeof substring !== 'string') return undefined;

        await this.waitForUnlock();
        this.readingCount = this.readingCount + 1;
        let result;

        if (lastKey === "")
        {
            result = await this.searchKeyContainsFromListNode(this.start, substring, total, position);
        }
        else
        {
            let listNode = await this.searchListNode(lastKey);
            result = await this.searchKeyContainsFromListNode(listNode, substring, total, position);
        }

        this.readingCount = this.readingCount - 1;
        return result;
    }

    async searchKeyContainsFromListNode(listNode, substring, total, position)
    {
        let tempNode = listNode;

        if (!tempNode) return undefined;

        let result = [];
        let count = 0;
        let positionCount = 0;

        while (tempNode !== undefined && tempNode.key !== undefined)
        {
            let key = tempNode.key;

            if (key.includes(substring))
            {
                if (positionCount >= position)
                {
                    result.push({ key: key, value: tempNode.value });
                    count++;
                }
                else positionCount++;
            }
            if (count >= total) return result;

            tempNode = tempNode.next;
        }

        return result;
    }

    async searchValueContains(substring, total, position = 0, lastKey = "")
    {
        if (!substring || typeof substring !== 'string') return undefined;

        await this.waitForUnlock();
        this.readingCount = this.readingCount + 1;
        let result;

        if (lastKey === "")
        {
            result = await this.searchValueContainsFromListNode(this.start, substring, total, position);
        }
        else
        {
            let listNode = await this.searchListNode(lastKey);
            result = await this.searchValueContainsFromListNode(listNode, substring, total, position);
        }

        this.readingCount = this.readingCount - 1;
        return result;
    }

    async searchValueContainsFromListNode(listNode, substring, total, position)
    {
        let tempNode = listNode;

        if (!tempNode) return undefined;

        let result = [];
        let count = 0;
        let positionCount = 0;

        while (tempNode !== undefined)
        {
            let value = tempNode.value;

            if (value.includes(substring))
            {
                if (positionCount >= position)
                {
                    result.push({ key: tempNode.key, value: value });
                    count++;
                }
                else positionCount++;
            }
            if (count >= total) return result;

            tempNode = tempNode.next;
        }

        return result;
    }

    async searchListNode(key)
    {
        let tempNode = this.root;

        if (!key || typeof key !== 'string' || !tempNode) return undefined;

        let height = this.height;
        let nextNodeIndex = 0;

        for (let i = 0; i < height; i++)
        {
            let dataList = tempNode.dataList;
            let dataListSize = dataList.length;

            for (let j = 0; j < dataListSize; j++)
            {
                nextNodeIndex = j;
                let data = dataList[j];
                let dataKey = data.key;

                let compareResult = await this.compareCallback(dataKey, key);

                if (compareResult == 0) 
                {
                    return data.ref;
                }
                else if (compareResult > 0) break;
                else if (compareResult < 0) nextNodeIndex = nextNodeIndex + 1;
            }

            tempNode = tempNode.children[nextNodeIndex];
        }

        return undefined;
    }

    async insert(key, value)
    {
        if (!key || typeof key !== 'string') return false;

        await this.waitForReadingCountToBeZero()
        this.lock = true;
        await this.mutex.acquire();

        let data = new BGraphData();
        data.key = key;

        if (this.root === undefined || this.root === null)
        {
            this.root = new BGraphNode();
        }

        let result = false;
        let tempNode = this.root;
        let order = this.order;
        let height = this.height;
        let nextNodeIndex = 0;
        let indexes = [0];
        let parents = [];
        let newListNode = new ListNode();
        newListNode.key = key;
        newListNode.value = value;

        for (let i = 0; i < height; i++)
        {
            let dataList = tempNode.dataList;

            if (tempNode.isLeaf || dataList.length == 0)
            {
                let pos = await this.getDataPos(data, dataList);

                if (this.size == 0)
                {
                    this.start = newListNode;
                    this.end = newListNode;
                    data.ref = this.start;
                }
                else if (pos >= dataList.length)
                {
                    let prevListNode = dataList[pos - 1].ref;
                    let nextListNode = prevListNode.next;

                    if (prevListNode !== undefined && prevListNode.key !== undefined)
                    {
                        if (prevListNode.key === key)
                        {
                            result = false;
                            break;
                        }
                    }

                    if (nextListNode !== undefined && nextListNode.key !== undefined)
                    {
                        if (nextListNode.key === key)
                        {
                            result = false;
                            break;
                        }
                    }

                    prevListNode.next = newListNode;
                    newListNode.prev = prevListNode;

                    if (nextListNode !== undefined && nextListNode.key !== undefined)
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

                    if (prevListNode !== undefined && prevListNode.key !== undefined)
                    {
                        if (prevListNode.key === key)
                        {
                            result = false;
                            break;
                        }
                    }
                    if (nextListNode !== undefined && nextListNode.key !== undefined)
                    {
                        if (nextListNode.key === key)
                        {
                            result = false;
                            break;
                        }
                    }
                    if (prevListNode !== undefined && prevListNode.key !== undefined)
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

                if (numberOfData == order)
                {
                    if (i == 0)
                    {
                        await this.splitRoot(tempNode);
                        tempNode.isLeaf = false;
                    }
                    else await this.split(tempNode, parents, parents.length - 1, indexes);
                }

                this.size = this.size + 1;
                result = true;
                break;
            }

            let dataListSize = dataList.length;

            for (let j = 0; j < dataListSize; j++)
            {
                nextNodeIndex = j;
                let data2 = dataList[j];
                let compareResult = await this.compareCallback(data2.key, data.key);

                if (compareResult > 0) break;
                else if (compareResult < 0) nextNodeIndex = nextNodeIndex + 1;
                else if (compareResult == 0)
                {
                    await this.mutex.release();
                    this.lock = false;
                    return false;
                }
            }

            parents.push(tempNode);
            indexes.push(nextNodeIndex);
            tempNode = tempNode.children[nextNodeIndex];
        }

        await this.mutex.release();
        this.lock = false;
        return result;
    }

    async splitRoot(node)
    {
        let order = this.order;
        let dataList = node.dataList;

        if (node.dataList.length == order)
        {
            let leftNode = new BGraphNode();
            let leftNodeDataList = leftNode.dataList;
            let leftNodeChildren = leftNode.children;
            let rightNode = new BGraphNode();
            let rightNodeDataList = rightNode.dataList;
            let rightNodeChildren = rightNode.children;
            let t = Math.ceil(order / 2);

            for (let i = t; i < order; i++)
            {
                await this.addData(await this.removeData(t, dataList), rightNodeDataList);
            }

            while (dataList.length > 1)
            {
                await this.addData(await this.removeData(0, dataList), leftNodeDataList);
            }

            let children = node.children;

            if (children.length != 0)
            {
                for (let i = 0; i < leftNodeDataList.length + 1; i++)
                {
                    await this.addChild(await this.removeChild(0, children), i, leftNodeChildren);
                }

                while (children.length > 0)
                {
                    await this.addChild(await this.removeChild(0, children), rightNodeChildren.length, rightNodeChildren);
                }

                leftNode.isLeaf = false;
                rightNode.isLeaf = false;
            }

            await this.addChild(leftNode, 0, node.children);
            await this.addChild(rightNode, 1, node.children);
            this.height = this.height + 1;
        }
    }

    async split(child, parents, parentIndex, indexes)
    {
        let order = this.order;

        if (child.dataList.length == order)
        {
            let parent = parents[parentIndex];
            let t = Math.ceil(order / 2);
            let newChild = new BGraphNode();

            for (let i = t; i < order; i++)
            {
                if (child.dataList.length > t)
                {
                    await this.addData(await this.removeData(t, child.dataList), newChild.dataList)
                }
                else
                {
                    break;
                }
            }

            if (!child.isLeaf)
            {
                let childrenSize = child.children.length;
                let half = Math.ceil(childrenSize / 2);

                if (order % 2 == 0) half -= 1;

                for (let i = half; i < childrenSize; i++)
                {
                    if (childrenSize > half)
                    {
                        await this.addChild(await this.removeChild(half, child.children), newChild.children.length, newChild.children);
                    }
                    else
                    {
                        break;
                    }
                }

                newChild.isLeaf = false;
            }

            await this.addData(await this.removeData(t - 1, child.dataList), parent.dataList)
            let pos = indexes[parentIndex + 1] + 1;
            await this.addChild(newChild, pos, parent.children);
            parent.isLeaf = false;

            if (parentIndex > 0)
            {
                await this.split(parent, parents, parentIndex - 1, indexes);
            }
            else if (parentIndex == 0)
            {
                await this.splitRoot(parents[0]);
            }
        }
    }

    async update(key, value)
    {
        let tempNode = this.root;

        if (!key || !tempNode) return false;

        await this.waitForReadingCountToBeZero()
        this.lock = true;
        await this.mutex.acquire();

        let height = this.height;
        let nextNodeIndex = 0;

        for (let i = 0; i < height; i++)
        {
            let dataList = tempNode.dataList;
            let dataListSize = dataList.length;

            for (let j = 0; j < dataListSize; j++)
            {
                nextNodeIndex = j;
                let data = dataList[j];
                let dataKey = data.key;

                let compareResult = await this.compareCallback(dataKey, key);

                if (compareResult == 0) 
                {
                    data.ref.value = value;
                    await this.mutex.release();
                    this.lock = false;
                    return true;
                }
                else if (compareResult > 0) break;
                else if (compareResult < 0) nextNodeIndex = nextNodeIndex + 1;
            }

            tempNode = tempNode.children[nextNodeIndex];
        }

        await this.mutex.release();
        this.lock = false;
        return false;
    }

    async delete(key)
    {
        let tempNode = this.root;
        let height = this.height;
        let nextNodeIndex = 0;
        let indexes = [0];
        let parents = [];

        if (!key || typeof key !== 'string' || !tempNode) return false;
        await this.waitForReadingCountToBeZero()
        this.lock = true;
        await this.mutex.acquire();

        if (this.size == 1)
        {
            if (this.start.key === key)
            {
                this.root = undefined;
                this.start = undefined;
                this.end = undefined;
                this.size = 0;
                this.height = 1;

                await this.mutex.release();
                this.lock = false;
                return true;
            }
            else
            {
                await this.mutex.release();
                this.lock = false;
                return false;
            }
        }

        for (let i = 0; i < height; i++)
        {
            let dataList = tempNode.dataList;
            let dataListSize = dataList.length;

            for (let j = 0; j < dataListSize; j++)
            {
                nextNodeIndex = j;
                let dataKey = dataList[j].key;
                let compareResult = await this.compareCallback(dataKey, key);

                if (compareResult > 0) break;
                else if (compareResult < 0) nextNodeIndex = nextNodeIndex + 1;
                else if (compareResult == 0)
                {
                    await this.deleteFromNode(tempNode, j, parents, indexes);
                    await this.mutex.release();
                    this.lock = false;
                    return true;
                }
            }

            if (tempNode.isLeaf)
            {
                await this.mutex.release();
                this.lock = false;
                return false;
            }

            parents.push(tempNode);
            indexes.push(nextNodeIndex);
            tempNode = tempNode.children[nextNodeIndex];
        }

        await this.mutex.release();
        this.lock = false;
        return false;
    }


    async deleteFromNode(node, dataIndex, parents, indexes)
    {
        if (node.isLeaf)
        {
            await this.removeListNode(node.dataList[dataIndex].ref);
            await this.removeData(dataIndex, node.dataList);
            this.size = this.size - 1;
            await this.balanceAfterDeletion(node, parents, parents.length - 1, indexes);
            return true;
        }
        else
        {
            parents.push(node);
            indexes.push(dataIndex);
            let maxNode = node.children[dataIndex];

            while (!maxNode.isLeaf)
            {
                parents.push(maxNode);
                indexes.push(maxNode.children.length - 1);
                maxNode = maxNode.children[maxNode.children.length - 1];
            }

            await this.removeListNode(node.dataList[dataIndex].ref);
            await this.removeData(dataIndex, node.dataList);
            this.size = this.size - 1;
            await this.addData(await this.removeData(maxNode.dataList.length - 1, maxNode.dataList), node.dataList)
            await this.balanceAfterDeletion(maxNode, parents, parents.length - 1, indexes);
            return true;
        }
    }

    async balanceAfterDeletion(node, parents, parentIndex, indexes)
    {
        let order = this.order;
        let mk = Math.ceil(order / 2) - 1;
        let dataList = node.dataList;
        let childIndex = indexes[parentIndex + 1];

        if (dataList.length < mk)
        {
            if (parentIndex < 0)
            {
                if (dataList.length == 0)
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

                if (childIndex > 0 && parent.children[childIndex - 1].dataList.length > mk)
                {
                    await this.borrowFromLeft(node, childIndex, parent);
                }
                else if (childIndex < parent.dataList.length && parent.children[childIndex + 1].dataList.length > mk)
                {
                    await this.borrowFromRight(node, childIndex, parent);
                }
                else if (childIndex == 0)
                {
                    await this.mergeRight(node, childIndex, parent);
                    await this.balanceAfterDeletion(parent, parents, parentIndex - 1, indexes);
                }
                else
                {
                    await this.mergeRight(parent.children[childIndex - 1], childIndex - 1, parent);
                    await this.balanceAfterDeletion(parent, parents, parentIndex - 1, indexes);
                }
            }
        }
    }

    async borrowFromLeft(child, childIndex, parent)
    {
        let leftChild = parent.children[childIndex - 1];

        if (!child.isLeaf)
        {
            await this.addChild(await this.removeChild(leftChild.dataList.length, leftChild.children), 0, child.children);
        }

        await this.addData(await this.removeData(childIndex - 1, parent.dataList), child.dataList);
        await this.addData(await this.removeData(leftChild.dataList.length - 1, leftChild.dataList), parent.dataList);
    }

    async borrowFromRight(child, childIndex, parent)
    {
        let rightChild = parent.children[childIndex + 1];

        await this.addData(await this.removeData(childIndex, parent.dataList), child.dataList);
        await this.addData(await this.removeData(0, rightChild.dataList), parent.dataList);

        if (!child.isLeaf)
        {
            await this.addChild(await this.removeChild(0, rightChild.children), child.dataList.length, child.children);
        }
    }

    async mergeRight(child, childIndex, parent)
    {
        let rightChild = parent.children[childIndex + 1];

        await this.addData(await this.removeData(childIndex, parent.dataList), child.dataList);

        while (rightChild.dataList.length > 0)
        {
            await this.addData(await this.removeData(0, rightChild.dataList), child.dataList);
        }

        if (!child.isLeaf)
        {
            let childChildren = child.children;
            let rightChildChildren = rightChild.children;

            while (rightChildChildren.length > 0)
            {
                await this.addChild(await this.removeChild(0, rightChildChildren), childChildren.length, childChildren);
            }
        }

        await this.removeChild(childIndex + 1, parent.children);
    }

    async removeListNode(listNode)
    {
        let prevListNode = listNode.prev;
        let nextListNode = listNode.next;

        if (prevListNode === undefined)
        {
            nextListNode.prev = undefined;
            this.start = nextListNode;
        }
        else prevListNode.next = nextListNode;

        if (nextListNode === undefined) this.end = prevListNode;
        else nextListNode.prev = prevListNode;
    }

    async getDataPos(data, dataList)
    {
        let pos = 0;
        let dataListSize = dataList.length;

        while (pos < dataListSize && await this.compareCallback(dataList[pos].key, data.key) < 0)
        {
            pos++;
        }

        return pos;
    }

    async addData(data, dataList)
    {
        let pos = 0;
        let dataListSize = dataList.length;

        while (pos < dataListSize && await this.compareCallback(dataList[pos].key, data.key) < 0)
        {
            pos++;
        }

        await dataList.splice(pos, 0, data);
    }

    async removeData(pos, dataList)
    {
        let dataListSize = dataList.length;

        if (pos >= dataListSize)
        {
            return null;
        }

        return dataList.splice(pos, 1)[0];
    }

    async addChild(node, pos, children)
    {
        children.splice(pos, 0, node);
    }

    async removeChild(pos, children)
    {
        return children.splice(pos, 1)[0];
    }

    async serialize()
    {
        let result = {};
        let size = this.size;
        result.order = this.order;
        result.size = size;
        result.height = this.height;

        if (size == 0) return JSON.stringify(result);

        let listNode = this.start;
        let list = {};
        let tracker;
        list.key = listNode.key;
        list.value = listNode.value;
        list.next = {};
        tracker = list.next;
        listNode = listNode.next;

        for (let i = 1; i < size; i++)
        {
            if (listNode === undefined) break;

            tracker.key = listNode.key;
            tracker.value = listNode.value;

            if (i < size - 1) tracker.next = {};

            tracker = tracker.next;
            listNode = listNode.next;
        }

        result.list = list;
        result.btree = JSON.parse(JSON.stringify(this.root, ['dataList', 'children', 'isLeaf', 'key']));
        return JSON.stringify(result);
    }

    async serializeToObj()
    {
        let result = {};
        let size = this.size;
        result.order = this.order;
        result.size = size;
        result.height = this.height;

        if (size == 0) return result;

        let listNode = this.start;
        let list = {};
        let tracker;
        list.key = listNode.key;
        list.value = listNode.value;
        list.next = {};
        tracker = list.next;
        listNode = listNode.next;

        for (let i = 1; i < size; i++)
        {
            if (listNode === undefined) break;

            tracker.key = listNode.key;
            tracker.value = listNode.value;

            if (i < size - 1) tracker.next = {};

            tracker = tracker.next;
            listNode = listNode.next;
        }

        result.list = list;
        result.btree = JSON.parse(JSON.stringify(this.root, ['dataList', 'children', 'isLeaf', 'key']));
        return result;
    }

    async deserialize(string)
    {
        let data = JSON.parse(string);
        this.order = data.order;
        this.size = data.size;
        this.height = data.height;

        if (data.size == 0)
        {
            this.root = undefined;
            this.start = undefined;
            this.end = undefined;
            return;
        }

        this.start = data.list;
        this.root = data.btree;
        let listNode = this.start;
        let prevNode = undefined;

        for (let i = 0; i < this.size; i++)
        {
            listNode.prev = prevNode;
            await this.connectRef(listNode);

            if (listNode.next === undefined) this.end = listNode;

            prevNode = listNode;
            listNode = listNode.next;
        }
    }

    async deserializeFromObj(data)
    {
        if (!data || data === null || data === undefined) return false;

        this.order = data.order;
        this.size = data.size;
        this.height = data.height;

        if (data.size == 0)
        {
            this.root = undefined;
            this.start = undefined;
            this.end = undefined;
            return;
        }

        this.start = data.list;
        this.root = data.btree;
        let listNode = this.start;
        let prevNode = undefined;

        for (let i = 0; i < this.size; i++)
        {
            listNode.prev = prevNode;
            await this.connectRef(listNode);

            if (listNode.next === undefined) this.end = listNode;

            prevNode = listNode;
            listNode = listNode.next;
        }
    }

    async connectRef(node)
    {
        let tempNode = this.root;

        if (!node || !tempNode || !node.key) return false;

        let key = node.key;

        let height = this.height;
        let nextNodeIndex = 0;

        for (let i = 0; i < height; i++)
        {
            let dataList = tempNode.dataList;
            let dataListSize = dataList.length;

            for (let j = 0; j < dataListSize; j++)
            {
                nextNodeIndex = j;
                let data = dataList[j];
                let dataKey = data.key;

                let compareResult = await this.compareCallback(dataKey, key);

                if (compareResult == 0) 
                {
                    data.ref = node;
                    return true;
                }
                else if (compareResult > 0) break;
                else if (compareResult < 0) nextNodeIndex = nextNodeIndex + 1;
            }

            tempNode = tempNode.children[nextNodeIndex];
        }

        return false;
    }

    async getAllKeys()
    {
        let tempNode = this.start;

        if (!tempNode) return [];

        let result = [];

        while (tempNode !== undefined)
        {
            if (tempNode.key === undefined) break;
            result.push(tempNode.key);
            tempNode = tempNode.next;
        }

        return result;
    }

    async getAllValues()
    {
        let tempNode = this.start;

        if (!tempNode) return [];

        let result = [];

        while (tempNode !== undefined)
        {
            if (tempNode.value === undefined) break;
            result.push(tempNode.value);
            tempNode = tempNode.next;
        }

        return result;
    }

    async getAll()
    {
        let tempNode = this.start;

        if (!tempNode) return [];

        let result = [];

        while (tempNode !== undefined)
        {
            if (tempNode.key === undefined || tempNode.value === undefined) break;
            result.push({ key: tempNode.key, value: tempNode.value });
            tempNode = tempNode.next;
        }

        return result;
    }

    async compareKey(key1, key2)
    {
        return key1.localeCompare(key2);
    }

    waitForReadingCountToBeZero()
    {
        return new Promise(resolve =>
        {
            const checkCount = () =>
            {
                if (this.readingCount === 0)
                {
                    resolve();
                } else
                {
                    setTimeout(checkCount, 10);
                }
            };
            checkCount();
        });
    }

    waitForUnlock()
    {
        return new Promise(resolve =>
        {
            const checkCount = () =>
            {
                if (this.lock == false)
                {
                    resolve();
                } else
                {
                    setTimeout(checkCount, 10);
                }
            };
            checkCount();
        });
    }
}