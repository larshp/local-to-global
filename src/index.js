// node src/index.js ../abapGit/src/ ./out/

"use strict";
let fs = require("fs");
let Parser = require("./parser.js");
let Writer = require("./writer.js");

class Run {
  execute(input, outDir) {
    console.log("input: " + input);
    console.log("output: " + outDir);

    let code = this.readFiles(input);
    let classes = new Parser().run(code);
    new Writer().run(outDir, classes);

    console.log("done");
  }

// read all files into 1 string
  readFiles(input) {
    let files = fs.readdirSync(input);
    let ret = "";
    for(let file of files) {
      ret = ret + fs.readFileSync(input + file, "UTF8") + "\n";
    }
    return ret;
  }

}

new Run().execute(process.argv[2], process.argv[3]);