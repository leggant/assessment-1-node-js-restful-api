import chai, { assert, expect } from "chai";
import { describe, it } from "mocha";

/**
 * @param {Number} a
 * @param {Number} b
 * @returns the sum of a and b
 */
const addTwoNums = (a, b) => a + b;

describe("unit test example", () => {
  it("should return the correct result for addTwoNums", (done) => {
    expect(addTwoNums(1, 2)).to.be.equal(3);
    done();
  });

  it("should return the incorrect result for addTwoNums", (done) => {
    expect(addTwoNums(1, 2)).to.not.equal(4);
    done();
  });
});
