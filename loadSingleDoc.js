const fs = require("fs")
const request = require("request-promise-native")
const util = require("util")

let files = ["60052-0.txt", "60062-0.txt", "60063-0.txt", "pg60060.txt"]
const readFile = util.promisify(fs.readFile)

async function indexBook(fid, title, body) {
    let url = "http://localhost:9200/books/_doc/" + fid
    let payload = {
        url: url, 
        body: {
            title: title, 
            body: body.join("\n")
        },
        json: true
    }
    return request.put(payload)
}
( _ => {
    files.forEach( async f => {
        let book = await readFile("./books/" + f);
        [title, ...body] = book.toString().split("\n");
        try {
            let result = await indexBook(f, title, body);
            console.log("Indexing result: ", result);
        } catch (err) {
            console.log("ERROR: ", err)
        }
    })
})();