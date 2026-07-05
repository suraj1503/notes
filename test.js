const fs = require("fs");
const EventEmitter = require("events");


console.log(process.argv)

//readable stream with highWaterMark 
const stream = fs.createReadStream("./code-snippet.txt", {
    highWaterMark: 1024 // chunk size in bytes
});
var i = 0
stream.on("data", (chunk) => {
    console.log("Received chunk:", ++i);
});
console.log("stream: ", i);


//event emitter
const emitter =new EventEmitter();
//listener
emitter.on("greet", (name) => {
    console.log(`Hello ${name}`);
});
//emitter
emitter.emit("greet", "Suraj");


