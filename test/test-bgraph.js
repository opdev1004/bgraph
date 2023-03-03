const BGraph = require('../src/index.js')
const Buffer = require('buffer').Buffer;

async function getBinarySize(string)
{
    return Buffer.byteLength(string, 'utf8');
}

async function test()
{
    console.time("BGraph");
    const bgraph = new BGraph(5);

    console.log(await bgraph.serialize());

    console.log(bgraph.order);
    await bgraph.insert("a", "a");
    await bgraph.delete("a", "a");
    await bgraph.insert("a", "a");
    await bgraph.insert("a", "a");
    await bgraph.insert("a", "a");
    await bgraph.insert("a", "a");
    await bgraph.insert("a", "a");
    await bgraph.insert("a", "a");

    console.log(await bgraph.serialize());

    await bgraph.insert("b", "b");
    console.log("start: ", bgraph.start.key);
    console.log("end: ", bgraph.end.key);
    await bgraph.insert("c", "c");
    console.log("start: ", bgraph.start.key);
    console.log("end: ", bgraph.end.key);
    await bgraph.insert("d", "d");
    await bgraph.insert("e", "e");
    await bgraph.insert("f", "f");
    await bgraph.delete("a");
    await bgraph.delete("f");
    await bgraph.insert("g", "g");
    await bgraph.insert("hiwork", "dogo");
    //let serializedGraph = bgraph.serialize();
    await bgraph.insert("h", "h");
    await bgraph.insert("i", "i");
    await bgraph.insert("j", "j");
    await bgraph.insert("k", "k");
    await bgraph.insert("l", "l");
    await bgraph.insert("itworks", "dogogo");
    await bgraph.insert("m", "m");
    console.log("start: ", bgraph.start.key);
    console.log("end: ", bgraph.end.key);
    await bgraph.insert("n", "n");
    await bgraph.insert("o", "o");
    console.log("start: ", bgraph.start.key);
    console.log("end: ", bgraph.end.key);
    await bgraph.insert("a", "a");
    await bgraph.insert("goodwork", "doooogo");
    await bgraph.delete("o");
    console.log("start: ", bgraph.start.key);
    console.log("end: ", bgraph.end.key);

    console.log("=============================");
    await console.log(bgraph.serialize());
    console.log("=============================");

    await bgraph.update("b", "bbb");
    await bgraph.insert("h", "h");
    await bgraph.insert("h", "h");
    await bgraph.insert("h", "h");
    await bgraph.insert("h", "h");
    console.log("=============================");
    console.log(bgraph.serialize());


    let list = await bgraph.searchRangeBackward("n", 6, 1);
    console.log(list);
    console.log("=============================");
    list = await bgraph.getAllKeys();
    console.log(list);
    console.log("=============================");
    list = await bgraph.getAllValues();
    console.log(list);
    console.log("=============================");
    list = await bgraph.getAll();
    console.log(list);
    console.log("=============================");
    /*
    let list = bgraph.searchKeyContains("work", 2);
    console.log(list);
    list = bgraph.searchKeyContains("work", 2, 1, "hiwork");
    console.log(list);
    list = bgraph.searchValueContains("go", 3);
    console.log(list);

    console.log("=============================");
    console.log(bgraph.serializeToObj());
    */
    //bgraph.deserialize(serializedGraph);


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

    const bgraph2 = new BGraph(5);

    for (let i = 0; i < 100; i++)
    {
        let key = i.toString();
        let value = await makeid(8);
        await bgraph2.insert(key, value);
    }

    let serializedBgraph2 = await bgraph2.serialize();

    console.log(await bgraph2.serialize());

    console.log(serializedBgraph2 == await bgraph2.serialize(await bgraph2.deserialize(serializedBgraph2)));
    console.log(await getBinarySize(serializedBgraph2));

}


async function makeid(length)
{
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++)
    {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

test();