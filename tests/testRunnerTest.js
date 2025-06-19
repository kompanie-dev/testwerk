export class TestRunnerTest {
    afterAll() {
        console.log("afterAll");
    }

    beforeAll() {
        console.log("beforeAll");
    }

    syncFunction_throwingNoError_shouldPass() {

    }

    syncFunction_throwingError_shouldFail() {
        throw Error("My error message");
    }

    async asyncFunction_throwingNoError_shouldPass() {

    }

    async asyncFunction_throwingError_shouldFail() {
        throw Error("My error message");
    }

    async asyncFunction_promiseResolve_shouldPass() {
        return Promise.resolve();
    }

    async asyncFunction_promiseReject_shouldPass() {
        return Promise.reject();
    }

    async asyncFunction_takingTooLong_shouldFail() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    resolve("Test OK");
                }
                catch(error) {
                    reject(error);
                }
            }, 3000);
        });
    }
}