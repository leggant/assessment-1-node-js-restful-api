import { assert } from "chai";
import { describe, it } from "mocha";
import compareAnswerStrings from "../../../utils/compareAnswerStrings.js";

/**
 * @param {String} a - users input answer
 * @param {String} b - answer stored in the database
 * @returns {Boolean} Answers Matched
 */
const compare = (a, b) => compareAnswerStrings(a, b);
const testA =
  "What type of dog is &#039;Handsome Dan&#039;, the mascot of Yale University?";
const testB =
  "whattypeofdogis&#039;HandsomeDan&#039;,themascotofyaleuniversity?";

describe("unit test example", () => {
  it("should return the ...", (done) => {
    // expect(compare(1, 2)).to.be.equal(3, "");
    assert.isTrue(compare(testA, testB), "Two String Parsed As Equal");
    done();
  });

  // it("should return the incorrect result for addTwoNums", (done) => {
  //   expect(compareAnswerStrings(1, 2)).to.not.equal(4, "");
  //   done();
  // });
});
