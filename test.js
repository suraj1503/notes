const fs = require("fs");

console.log(process.argv)
const stream = fs.createReadStream("./automator-mobile-agent.txt", {
    highWaterMark: 1024 // chunk size in bytes
});
var i = 0
stream.on("data", (chunk) => {
    console.log("Received chunk:", ++i);
});
console.log("stream: ", i);