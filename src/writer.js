'use strict';
var fs = require('fs');

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
        contents = classes[cla].def + "\n\n" + classes[cla].impl;
        meta = this.classMeta(cla);
      }

      if (cla.length > 30) {
        console.log("rename: " + cla);
      }

      fs.writeFileSync(outDir + cla + ".abap", contents, "UTF8");
      fs.writeFileSync(outDir + cla + ".xml", meta, "UTF8");
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
      "    <DESCRIPT></DESCRIPT>\n" +
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
      "    <DESCRIPT></DESCRIPT>\n" +
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
}