# B-Graph
B-Graph. B-Tree that can perform ranged search.

## ▶️ install
```
npm i bgraph
```

## 👩‍🎓 Example
### Code :
```
const BGraph = require('./bgraph.js');

console.time("BGraph");
const bgraph = new BGraph();
bgraph.insert("a", "a");
bgraph.insert("b", "b");
bgraph.insert("c", "c");
bgraph.insert("d", "d");
bgraph.insert("e", "e");
bgraph.insert("f", "f");
bgraph.delete("a");
bgraph.delete("f");
bgraph.insert("g", "g");

let serializedGraph = bgraph.serialize();

bgraph.insert("h", "h");
bgraph.insert("i", "i");
bgraph.insert("j", "j");
bgraph.insert("k", "k");
bgraph.insert("l", "l");
bgraph.insert("m", "m");
bgraph.insert("n", "n");
bgraph.insert("o", "o");
bgraph.delete("o");

bgraph.deserialize(serializedGraph);

let size = bgraph.size;
let start = bgraph.start;

console.log(start);

for(let i = 0; i < size; i++)
{
    console.log(start.value);
    start = start.next;
}

console.log("Search: ", bgraph.search("d"));

bgraph.update("b", "bb");

let result = bgraph.searchRange("b", 7, 0);
for(let data of result)
{
    console.log("key: ", data.key, "value: ", data.value);
}

console.timeEnd("BGraph");
```
### Result :
```
<ref *2> {
  next: <ref *1> {
    next: { next: [Object], key: 'd', value: 'd', prev: [Circular *1] },
    key: 'c',
    value: 'c',
    prev: [Circular *2]
  },
  key: 'b',
  value: 'b',
  prev: undefined
}
b
c
d
e
g
Search:  d
key:  b value:  bb
key:  c value:  c
key:  d value:  d
key:  e value:  e
key:  g value:  g
BGraph: 49.267ms
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


## 👨‍💻 Author
[Victor Chanil Park](https://github.com/opdev1004)

## 💯 License
MIT, See [LICENSE](./LICENSE).