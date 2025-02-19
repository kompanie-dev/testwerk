import { Assert } from "../index.js";

export class AssertNanTests {
    isNaN_shouldPass_forNaN() {
        Assert.isNaN(NaN);
    }

    isNaN_shouldFail_forNonNaN() {
        Assert.throws(() => Assert.isNaN(123));
    }

    isNotNaN_shouldPass_forNonNaN() {
        Assert.isNotNaN(123);
    }

    isNotNaN_shouldFail_forNaN() {
        Assert.throws(() => Assert.isNotNaN(NaN));
    }
}