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
const testC =
  "##WHICH#dog#is&#039;HandsomeDan&#039;,themascotofOTAGOuniversity?";

describe("Test Answer Comparison Utility Function", () => {
  it("Parsed Strings Are The Same/True", (done) => {
    assert.isTrue(
      compare(testA, testB),
      `\nThe parsed (user) input string:\n${testA}\nis not equal to the (stored) string:\n${testB}\n`,
    );
    done();
  });
  it("Parsed Strings Are Not The Same/True", (done) => {
    assert.isFalse(
      compare(testA, testC),
      `\nThe parsed (user) input string:\n${testA}\nis equal to the (stored) string:\n${testC}\n`,
    );
    done();
  });
});
