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


## 👨‍💻 Author
[Victor Chanil Park](https://github.com/opdev1004)

## 💯 License
MIT, See [LICENSE](./LICENSE).