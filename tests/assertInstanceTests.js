import { Assert } from "../index.js";

export class AssertInstanceTests {
    isInstanceOf_shouldPass_forCorrectInstance() {
        Assert.isInstanceOf(new Date(), Date);
    }

    isInstanceOf_shouldFail_forIncorrectInstance() {
        Assert.throws(() => Assert.isInstanceOf({}, Date));
    }

    isNotInstanceOf_shouldPass_forIncorrectInstance() {
        Assert.isNotInstanceOf({}, Date);
    }

    isNotInstanceOf_shouldFail_forCorrectInstance() {
        Assert.throws(() => Assert.isNotInstanceOf(new Date(), Date));
    }
}