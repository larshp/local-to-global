'use strict';

let chai = require('chai');
let Parser = require("./../src/parser.js");

let expect = chai.expect;

function check(result, impl = true) {
  expect(result).to.be.a('object');
  expect(result.def).to.be.a('string');
  if (impl) {
    expect(result.impl).to.be.a('string');
  }
}

let basic =
  'CLASS lcl_foo DEFINITION.\n' +
  '  def.\n' +
  'ENDCLASS.\n' +
  'CLASS lcl_foo IMPLEMENTATION.\n' +
  '  imp.\n' +
  'ENDCLASS.\n';

describe("test 1, basic", () => {
  let result = new Parser().run(basic);
  it("should have 1 class", () => {
    expect(Object.keys(result).length).to.equals(1);
  });
  it("foo class", () => {
    check(result['zcl_abapgit_foo']);
  });
});

describe("test 2, preceding comment", () => {
  let test = "* comment\n" + basic;
  let result = new Parser().run(test);
  it("should have 1 class", () => {
    expect(Object.keys(result).length).to.equals(1);
  });
  it("foo class", () => {
    check(result['zcl_abapgit_foo']);
  });
});

describe("test 3, two classes", () => {
  let test = basic + "\n" + basic.replace(/lcl_foo/g, "lcl_bar");
  let result = new Parser().run(test);
  it("should have 2 class", () => {
    expect(Object.keys(result).length).to.equals(2);
  });
  it("foo class", () => {
    check(result['zcl_abapgit_foo']);
  });
  it("bar class", () => {
    check(result['zcl_abapgit_bar']);
  });
});

describe("test 4, mixed", () => {
  let test =
    'CLASS lcl_foo DEFINITION.\n' +
    '  def.\n' +
    'ENDCLASS.\n' +
    'CLASS lcl_bar DEFINITION.\n' +
    '  def.\n' +
    'ENDCLASS.\n' +
    'CLASS lcl_foo IMPLEMENTATION.\n' +
    '  imp.\n' +
    'ENDCLASS.\n' +
    'CLASS lcl_bar IMPLEMENTATION.\n' +
    '  imp.\n' +
    'ENDCLASS.\n';

  let result = new Parser().run(test);
  it("should have 2 class", () => {
    expect(Object.keys(result).length).to.equals(2);
  });
  it("foo class", () => {
    check(result['zcl_abapgit_foo']);
  });
  it("bar class", () => {
    check(result['zcl_abapgit_bar']);
  });
});

describe("test 5, no implementation", () => {
  let test =
    "CLASS lcl_object_w3ht DEFINITION INHERITING FROM lcl_object_w3super FINAL.\n" +
    "ENDCLASS.                \"lcl_object_W3HT DEFINITION";
  let result = new Parser().run(test);
  it("should have 1 class", () => {
    expect(Object.keys(result).length).to.equals(1);
  });
  it("foo class", () => {
    check(result['zcl_abapgit_object_w3ht'], false);
  });
});

describe("test 6, exception", () => {
  let test =
    "CLASS lcx_cancel DEFINITION INHERITING FROM cx_static_check FINAL.\n" +
    "def\n" +
    "ENDCLASS.\n" +
    "CLASS lcx_cancel IMPLEMENTATION.\n" +
    "imp\n" +
    "ENDCLASS.";
  let result = new Parser().run(test);
  console.dir(result);
  it("should have 1 class", () => {
    expect(Object.keys(result).length).to.equals(1);
  });
  it("foo class", () => {
    check(result['zcx_abapgit_cancel'], false);
  });
});