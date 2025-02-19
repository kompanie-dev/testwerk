import { Assert } from "../index.js";

export class AssertEqualityTests {
    equal_shouldPass_forEqualValues() {
        Assert.equal(5, 5);
    }

    equal_shouldFail_forNotEqualValues() {
        Assert.throws(() => Assert.equal(5, 10));
    }

    notEqual_shouldPass_forNotEqualValues() {
        Assert.notEqual(5, 10);
    }

    notEqual_shouldFail_forEqualValues() {
        Assert.throws(() => Assert.notEqual(5, 5));
    }
}