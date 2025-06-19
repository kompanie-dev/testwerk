export class TestRunner {
    #asyncTimeout;

    constructor(asyncTimeout = 5000) {
        this.#asyncTimeout = asyncTimeout;
    }

    async run(...testClasses) {
        const startTime = Date.now();

        const testClassPromises = testClasses.map(
            testClass => this.runTestClass(testClass)
        );

        const testResults = await Promise.all(testClassPromises);
        const endTime = Date.now();

        return {
            testResults,
            completionTime: endTime,
            executionTime: endTime - startTime
        };
    }

    async runTestClass(testClass) {
        const instance = new testClass();
        const results = [];

        const testFunctionNames =
            Object
                .getOwnPropertyNames(testClass.prototype)
                .filter(
                    propertyName => ["constructor", "afterAll", "afterEach", "beforeAll", "beforeEach"].includes(propertyName) === false &&
                    instance[propertyName] instanceof Function
                );

        const testFunctionNamesWithLifeCycle = ["beforeAll", ...testFunctionNames, "afterAll"];

        for (let functionName of testFunctionNamesWithLifeCycle) {
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