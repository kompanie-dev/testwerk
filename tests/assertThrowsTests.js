import { Assert } from "../index.js";

export class AssertThrowsTests {
    throws_shouldPass_whenFunctionThrows() {
        Assert.throws(() => { throw new Error(); });
    }

    throws_shouldFail_whenFunctionDoesNotThrow() {
        Assert.throws(() => Assert.throws(() => {}));
    }

    notThrows_shouldPass_whenFunctionDoesNotThrow() {
        Assert.notThrows(() => {});
    }

    notThrows_shouldFail_whenFunctionThrows() {
        Assert.throws(() => Assert.notThrows(() => { throw new Error(); }));
    }
}