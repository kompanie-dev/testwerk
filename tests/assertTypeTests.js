import { Assert } from "../index.js";

export class AssertTypeTests {
    isTypeOf_shouldPass_forCorrectType() {
        Assert.isTypeOf("hello", "string");
    }

    isTypeOf_shouldFail_forIncorrectType() {
        Assert.throws(() => Assert.isTypeOf(123, "string"));
    }

    isNotTypeOf_shouldPass_forIncorrectType() {
        Assert.isNotTypeOf(123, "string");
    }

    isNotTypeOf_shouldFail_forCorrectType() {
        Assert.throws(() => Assert.isNotTypeOf("hello", "string"));
    }
}