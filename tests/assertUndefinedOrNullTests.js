import { Assert } from "../index.js";

export class AssertUndefinedOrNullTests {
    isUndefinedOrNull_shouldPass_forUndefinedOrNull() {
        Assert.isUndefinedOrNull(null);
    }

    isUndefinedOrNull_shouldFail_forDefinedValue() {
        Assert.throws(() => Assert.isUndefinedOrNull(123));
    }

    isNotUndefinedOrNull_shouldPass_forDefinedValue() {
        Assert.isNotUndefinedOrNull(123);
    }

    isNotUndefinedOrNull_shouldFail_forUndefinedOrNull() {
        Assert.throws(() => Assert.isNotUndefinedOrNull(null));
    }
}
