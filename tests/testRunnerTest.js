export class TestRunnerTest {
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