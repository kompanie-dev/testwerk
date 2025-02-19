import { Assert } from "../index.js";

export class AssertAsyncTests {
    async asyncEquals_shouldPass_forEqualValues() {
        return new Promise((resolve, reject) => {
            try {
                Assert.equal(1, 1);

                resolve("Test OK");
            }
            catch(error) {
                reject(error);
            }
        });
    }

    async asyncEquals_shouldFail_forDifferentValues() {
        return new Promise((resolve, reject) => {
            Assert.throws(async () => {
                Assert.equal(2, 1);

                reject("Test failed");
            });

            resolve("Test OK");
        });
    }

    async asyncEquals_shouldFail_ifHittingTimeout() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    Assert.equal(1, 1);

                    resolve("Test OK");
                }
                catch(error) {
                    reject(error);
                }
            }, 3000);
        });
    }

    async throws_shouldFail_whenFunctionDoesNotThrowAsync() {
        await Assert.throws(async () => {});
    }

    async throws_shouldPass_whenFunctionThrowsAsync() {
        await Assert.throws(async () => { throw new Error("Test"); });
    }
}