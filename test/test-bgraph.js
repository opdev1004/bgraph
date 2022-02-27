const BGraph = require('../src/index.js')
const Buffer = require('buffer').Buffer;

function getBinarySize(string) {
    return Buffer.byteLength(string, 'utf8');
}

function test()
{
    
    console.time("BGraph");
    const option = {
        order: 5
    }
    const bgraph = new BGraph(option);
    console.log(bgraph.order);
    bgraph.insert("a", "a");
    bgraph.insert("b", "b");
    console.log("start: ", bgraph.start.key);
    console.log("end: ", bgraph.end.key);
    bgraph.insert("c", "c");
    console.log("start: ", bgraph.start.key);
    console.log("end: ", bgraph.end.key);
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
    console.log("start: ", bgraph.start.key);
    console.log("end: ", bgraph.end.key);
    bgraph.insert("n", "n");
    bgraph.insert("o", "o");
    console.log("start: ", bgraph.start.key);
    console.log("end: ", bgraph.end.key);
    bgraph.insert("a", "a");
    bgraph.delete("o");
    console.log("start: ", bgraph.start.key);
    console.log("end: ", bgraph.end.key);
    
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

    let result = bgraph.searchRange("b", 7);
    for(let data of result)
    {
        console.log("key: ", data.key, "value: ", data.value);
    }

    console.timeEnd("BGraph");
    
    const bgraph2 = new BGraph({order: 5});

    for(let i = 0; i < 100; i++)
    {
        let key = i.toString();
        let value = makeid(16);
        bgraph2.insert(key, value);
    }

    let serializedBgraph2 = bgraph2.serialize();
    
    console.log(bgraph2.serialize());

    console.log(serializedBgraph2 == bgraph2.serialize(bgraph2.deserialize(serializedBgraph2)));
    console.log(getBinarySize(serializedBgraph2));
    
}


function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

test();