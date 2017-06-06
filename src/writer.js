'use strict';
var fs = require('fs');

module.exports = class Writer {
  run(outDir, classes) {
    for(let cla in classes) {
      if (classes[cla].testing) {
        continue;
      }
      fs.writeFileSync(outDir + cla + ".abap",
        classes[cla].def + "\n\n" + classes[cla].impl,
        "UTF8");
    }
  }
}