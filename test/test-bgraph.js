const BGraph = require('../src/index.js')
const Buffer = require('buffer').Buffer;

function getBinarySize(string) {
    return Buffer.byteLength(string, 'utf8');
}

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
    let serializedGraph = bgraph.serialize();
    await bgraph.insert("h", "h");
    await bgraph.insert("i", "i");
    await bgraph.insert("j", "j");
    await bgraph.insert("k", "k");
    await bgraph.insert("l", "l");
    await bgraph.insert("m", "m");
    await bgraph.insert("n", "n");
    await bgraph.insert("o", "o");
    await bgraph.delete("o");

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