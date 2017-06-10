"use strict";
let fs = require("fs");

module.exports = class Writer {
  run(outDir, classes) {
    for(let cla in classes) {
      let contents = "";
      let meta = "";

      if (classes[cla].testing) {
        continue;
      } else if(classes[cla].interface) {
        contents = classes[cla].interface;
        meta = this.interfaceMeta(cla);
      } else {
        contents = classes[cla].def;
        if (classes[cla].impl) {
// some classes only inherits
          contents = contents + "\n\n" + classes[cla].impl;
        }
        meta = this.classMeta(cla);
      }

      if (cla.length > 30) {
        console.log("rename: " + cla);
      }

      contents = contents.replace(/\s*FRIENDS(\s+ltcl_\w+)+/, "");

      contents = contents.replace(/\s*CLASS zc(.)_(\w+) DEFINITION(\s+)/, "CLASS zc$1_$2 DEFINITION PUBLIC$3");
      contents = contents.replace(/\s*INTERFACE zif_(\w+)/, "INTERFACE zif_$1 PUBLIC");

      let ext = classes[cla].interface?"intf":"clas";

      fs.writeFileSync(outDir + cla + "." + ext + ".abap", contents, "UTF8");
      fs.writeFileSync(outDir + cla + "." + ext + ".xml", meta, "UTF8");
    }
  }

  interfaceMeta(name) {
    return "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n" +
      "<abapGit version=\"v1.0.0\" serializer=\"LCL_OBJECT_INTF\" serializer_version=\"v1.0.0\">\n" +
      " <asx:abap xmlns:asx=\"http://www.sap.com/abapxml\" version=\"1.0\">\n" +
      "  <asx:values>\n" +
      "   <VSEOINTERF>\n" +
      "    <CLSNAME>" + name.toUpperCase() + "</CLSNAME>\n" +
      "    <VERSION>1</VERSION>\n" +
      "    <LANGU>E</LANGU>\n" +
      "    <EXPOSURE>2</EXPOSURE>\n" +
      "    <STATE>1</STATE>\n" +
      "    <UNICODE>X</UNICODE>\n" +
      "   </VSEOINTERF>\n" +
      "  </asx:values>\n" +
      " </asx:abap>\n" +
      "</abapGit>";
  }

  classMeta(name) {
    return "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n" +
      "<abapGit version=\"v1.0.0\" serializer=\"LCL_OBJECT_CLAS\" serializer_version=\"v1.0.0\">\n" +
      " <asx:abap xmlns:asx=\"http://www.sap.com/abapxml\" version=\"1.0\">\n" +
      "  <asx:values>\n" +
      "   <VSEOCLASS>\n" +
      "    <CLSNAME>" + name.toUpperCase() + "</CLSNAME>\n" +
      "    <VERSION>1</VERSION>\n" +
      "    <LANGU>E</LANGU>\n" +
      "    <EXPOSURE>2</EXPOSURE>\n" +
      "    <STATE>1</STATE>\n" +
      "    <CLSCCINCL>X</CLSCCINCL>\n" +
      "    <FIXPT>X</FIXPT>\n" +
      "    <UNICODE>X</UNICODE>\n" +
      "   </VSEOCLASS>\n" +
      "  </asx:values>\n" +
      " </asx:abap>\n" +
      "</abapGit>";
  }
};