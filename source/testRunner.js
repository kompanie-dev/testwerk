export class TestRunner {
    #asyncTimeout;

    constructor(asyncTimeout = 5000) {
        this.#asyncTimeout = asyncTimeout;
    }

    async run(...testClasses) {
        const testClassPromises = testClasses.map(
            testClass => this.runTestClass(testClass)
        );

        const testResults = await Promise.all(testClassPromises);

        return {
            testResults,
            completionTime: Date.now()
        };
    }

    async runTestClass(testClass) {
        const instance = new testClass();
        const results = [];

        const functionNames =
            Object
                .getOwnPropertyNames(testClass.prototype)
                .filter(
                    propertyName => propertyName !== "constructor" && instance[propertyName] instanceof Function
                );

        for (let functionName of functionNames) {
            const testFunctionResult = await this.runTestFunction(instance, functionName);

            results.push(testFunctionResult);
        }

        return {
            name: testClass.name,
            results
        };
    }

    async runTestFunction(testClassInstance, functionName) {
        const startTime = performance.now();
        let error;

        try {
            const functionPromiseOrResult = testClassInstance[functionName]();

            if (functionPromiseOrResult instanceof Promise) {
                functionPromiseOrResult.catch(promiseError => { throw promiseError; });

                const timeoutPromise = new Promise(
                    (_, reject) => {
                        setTimeout(
                            () => reject(new Error("Test timed out")), this.#asyncTimeout
                        );
                    });
               

                await Promise.race([
                    functionPromiseOrResult,
                    timeoutPromise
                ]);
            }
        }
        catch (executionError) {
            error = executionError;
        }

        return {
            name: functionName,
            executionTime: performance.now() - startTime,
            error
        };
    }
}