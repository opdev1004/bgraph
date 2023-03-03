# B-Graph
B-Graph. B-Tree that can perform ranged search.

![B-Graph Image](https://github.com/opdev1004/bgraph/blob/master/asset/BGraph.jpg?raw=true)

## 👨‍🏫 Notice
From v.1.1.0, everything has become asynchronous and i've added mutex to protect data during any data change. I will consider adding semaphore if too many data reading cause problems.

```
const bgraph = new BGraph(5, compareKey);

// It has to be asynchronous
async compareKey(key1, key2)
{
  if(key1.length > key2.length) return 1;
  else if (key1.length < key2.length) return -1;
  else return 0;
}
```

We also support having a fuction to compare 2 keys for ordering data in bgraph.This will let you have power to build a flexible bgraph structure that can be used to store data


## ▶️ install
```
npm i bgraph
```

## 👩‍🎓 Example
### Code :
```
const BGraph = require('./bgraph.js');

async function test()
{
    console.time("BGraph");
    const bgraph = new BGraph();
    await bgraph.insert("a", "a");
    await bgraph.insert("b", "b");
    await bgraph.insert("c", "c");
    await bgraph.insert("d", "d");
    await bgraph.insert("e", "e");
    await bgraph.insert("f", "f");
    await bgraph.delete("a");
    await bgraph.delete("f");
    await bgraph.insert("g", "g");
    let serializedGraph = await bgraph.serialize();
    await bgraph.insert("h", "h");
    await bgraph.insert("i", "i");
    await bgraph.insert("j", "j");
    await bgraph.insert("k", "k");
    await bgraph.insert("l", "l");
    await bgraph.insert("m", "m");
    await bgraph.insert("n", "n");
    await bgraph.insert("o", "o");
    await bgraph.delete("o");

    await bgraph.deserialize(serializedGraph);

    let size = bgraph.size;
    let start = bgraph.start;

    console.log(start);

    for (let i = 0; i < size; i++)
    {
        console.log(start.value);
        start = start.next;
    }

    console.log("Search: ", await bgraph.search("d"));

    let result = await bgraph.searchRange("b", 7);
    for (let data of result)
    {
        console.log("key: ", data.key, "value: ", data.value);
    }

    console.timeEnd("BGraph");
}

test();
```
### Result :
```
<ref *2> {
  key: 'b',
  value: 'b',
  next: <ref *1> {
    key: 'c',
    value: 'c',
    next: { key: 'd', value: 'd', next: [Object], prev: [Circular *1] },
    prev: [Circular *2]
  },
  prev: undefined
}
b
c
d
e
g
Search:  d
key:  b value:  b
key:  c value:  c
key:  d value:  d
key:  e value:  e
key:  g value:  g
BGraph: 15.503ms
```

## 📖 Simple document
| function | ``` search(key)  ``` | 
| - | - |
| description | This function is for searching value of key that is stored in b-graph  |
| arg: key | string |
| return | return value if it is found otherwise it will return undefined |

| function | ``` searchRange(key, total, position)  ``` | 
| - | - |
| description | This function is for getting list of data from where the key at. |
| arg: key | string |
| arg: total | number, number of data to grab |
| arg: position | number, number to skip data |
| return | return filled list when data exist, return empty list for when it couldn't find, otherwise return undefined such as for the case that root node does not exist or key isn't string type |

| function | ``` searchRangeBackward(key, total, position)  ``` | 
| - | - |
| description | This function is for getting list of data from where the key at. It adds data backward. |
| arg: key | string |
| arg: total | number, number of data to grab |
| arg: position | number, number to skip data |
| return | return filled list when data exist, return empty list for when it couldn't find, otherwise return undefined such as for the case that root node does not exist or key isn't string type |

| function | ``` searchKeyContains(substring, total, position, lastKey)  ``` | 
| - | - |
| description | This function is for finding list of data that its key contains substring. |
| arg: substring | string |
| arg: total | number, number of data to grab |
| arg: position | number, number to skip data |
| arg: lastKey | string, last key where it should start search from |
| return | return list of data, if root node does not exist it will return undefined |

| function | ``` searchValueContains(substring, total, position, lastKey)  ``` | 
| - | - |
| description | This function is for finding list of data that its value contains substring. |
| arg: substring | string |
| arg: total | number, number of data to grab |
| arg: position | number, number to skip data |
| arg: lastKey | string, last key where it should start search from |
| return | return list of data, if root node does not exist it will return undefined |

| function | ``` insert(key, value)  ``` | 
| - | - |
| description | This function inserts data into b-graph |
| arg: key | string, name of value |
| arg: value | anything but recommend the value that can be JSON.stringfy() |
| return | false for failure of inserting data, true for success  |

| function | ``` update(key, value)  ``` | 
| - | - |
| description | TThis function updates data into b-graph |
| arg: key | string, name of value |
| arg: value | new value. anything but recommend the value that can be JSON.stringfy() |
| return | false for failure of updating data, true for success  |

| function | ``` delete(key)  ``` | 
| - | - |
| description | This function deletes the key of data from b-graph |
| arg: key | string, name of value |
| return | false for failure of deleting data, true for success  |

| function | ``` getAllKeys()  ``` | 
| - | - |
| description | This function returns a list of all keys |
| return | returns list of key, it can be empty |

| function | ``` getAllValues()  ``` | 
| - | - |
| description | This function returns a list of all values |
| return | returns list of value, it can be empty |

| function | ``` getAll()  ``` | 
| - | - |
| description | This function returns a list of all data |
| return | returns list of data, it can be empty |

| function | ``` serialize() ``` | 
| - | - |
| description | serialize b-graph to string. |
| return | string, serialized b-graph |

| function | ``` deserialize(string) ``` | 
| - | - |
| description | deserialize string b-graph data. |
| arg: string | string, serialized b-graph |

| function | ``` serializeToObj() ``` | 
| - | - |
| description | serialize b-graph to object. |
| return | object, serialized b-graph object |

| function | ``` deserializeFromObj(data) ``` | 
| - | - |
| description | deserialize object b-graph data. |
| arg: data | object, serialized b-graph object |

## 💪 Sponsor 
[Github sponsor page](https://github.com/sponsors/opdev1004)

## 👨‍💻 Author
[Victor Chanil Park](https://github.com/opdev1004)

## 💯 License
MIT, See [LICENSE](./LICENSE).