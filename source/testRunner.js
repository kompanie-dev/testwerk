export class TestRunner {
    #asyncTestTimeout;
    #afterEachTimeout;
    #beforeEachTimeout;

    constructor({ asyncTestTimeout = 5000, afterEachTimeout = 500, beforeEachTimeout = 500 }) {
        this.#asyncTestTimeout = asyncTestTimeout;
        this.#afterEachTimeout = afterEachTimeout;
        this.#beforeEachTimeout = beforeEachTimeout;
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

    async executeTestFunctionWithTimeout(testFunction, functionName, timeout) {
        const functionPromiseOrResult = testFunction();

        if (functionPromiseOrResult instanceof Promise) {
            functionPromiseOrResult.catch(promiseError => { throw promiseError; });

            const timeoutPromise = new Promise(
                (_, reject) => {
                    setTimeout(
                        () => reject(new Error(`${functionName} took longer than ${timeout}ms and timed out`)), timeout
                    );
                });
            
            await Promise.race([
                functionPromiseOrResult,
                timeoutPromise
            ]);
        }
    }

    async runTestFunction(testClassInstance, functionName) {
        const startTime = performance.now();
        let error;

        try {
            if (functionName !== "beforeAll" && functionName !== "afterAll" && testClassInstance.beforeEach instanceof Function) {
                await this.executeTestFunctionWithTimeout(testClassInstance.beforeEach, `${functionName}.beforeEach`, this.#beforeEachTimeout);
            }

            await this.executeTestFunctionWithTimeout(testClassInstance[functionName], functionName, this.#asyncTestTimeout);
            
            if (functionName !== "beforeAll" && functionName !== "afterAll" && testClassInstance.afterEach instanceof Function) {
                await this.executeTestFunctionWithTimeout(testClassInstance.afterEach, `${functionName}.afterEach`, this.#afterEachTimeout);
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