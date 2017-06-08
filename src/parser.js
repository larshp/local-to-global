'use strict';

module.exports = class Parser {
  run(code) {
    this.list = {};

    let lines = code.split("\n");

    let start = "";
    let body = [];

    for (let line of lines) {
      line = line.replace(/lcl_/g, "zcl_abapgit_");
      line = line.replace(/lif_/g, "zif_abapgit_");
      line = line.replace(/lcx_/g, "zcx_abapgit_");
      line = line.replace(/LCL_/g, "ZCL_ABAPGIT_");
      line = line.replace(/LIF_/g, "ZIF_ABAPGIT_");
      line = line.replace(/LCX_/g, "ZCX_ABAPGIT_");

      if (start === ""
          && ( line.match(/^\s*CLASS \w.*/i)
          || line.match(/^\s*INTERFACE \w.*/i))
          && !line.includes("DEFERRED")) {
//        console.log("start" + line);
        start = line;
      } else if (line.match(/^\s*ENDCLASS\..*/i)
          || line.match(/^\s*ENDINTERFACE\..*/i)) {
        body.push(line);
        this.classify(start, body.join("\n"));
        start = "";
        body = [];
      }

      if (start !== "") {
        body.push(line);
      }
    }

    return this.list;
  }

  classify(start, body) {
    let name = "";
    if (start.includes("CLASS")) {
      name = start.match(/^\s*CLASS\s(\w+).*/i)[1];
    } else {
      name = start.match(/^\s*INTERFACE\s(\w+).*/i)[1];
    }

    if(!this.list[name]) {
      this.list[name] = {};
    }

    if(start.includes("DEFINITION")) {
      this.list[name].def = body;
    } else if(start.includes("IMPLEMENTATION")) {
      this.list[name].impl = body;
    } else {
      this.list[name].interface = body;
    }
    if(start.includes("FOR TESTING")) {
      this.list[name].testing = true;
    }
  }
}