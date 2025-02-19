import { Assert } from "../index.js";

export class AssertFailTests {
    fail_shouldFail_whenCalled() {
        Assert.throws(() => Assert.fail());
    }
}