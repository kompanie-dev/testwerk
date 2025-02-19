import { Assert } from "../index.js";

export class AssertNumberTests {
    approximately_shouldPass_forValuesInsideTolerance() {
        Assert.approximately(5.01, 5, 0.1);
    }

    approximately_shouldFail_forValuesOutsideTolerance() {
        Assert.throws(() => Assert.approximately(5.2, 5, 0.1));
    }

    isAbove_shouldPass_forValuesAbove() {
        Assert.isAbove(10, 5);
    }

    isAbove_shouldFail_forValuesNotAbove() {
        Assert.throws(() => Assert.isAbove(3, 5));
    }

    isBelow_shouldPass_forValuesBelow() {
        Assert.isBelow(3, 5);
    }

    isBelow_shouldFail_forValuesNotBelow() {
        Assert.throws(() => Assert.isBelow(10, 5));
    }

    isBetween_shouldPass_forValuesInRange() {
        Assert.isBetween(5, 1, 10);
    }

    isBetween_shouldFail_forValuesOutOfRange() {
        Assert.throws(() => Assert.isBetween(15, 1, 10));
    }
}