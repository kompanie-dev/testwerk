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
        const testResults = await Promise.all(testClasses.map(testClass => this.runTestClass(testClass)));
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
                    propertyName =>
                        ["constructor", "afterAll", "afterEach", "beforeAll", "beforeEach"].includes(propertyName) === false &&
                        typeof instance[propertyName] === "function"
                );

        const allFunctions = ["beforeAll", ...testFunctionNames, "afterAll"];

        for (const functionName of allFunctions) {
            const testFunctionResult = await this.runTestFunction(instance, functionName);

            results.push(testFunctionResult);
        }

        return {
            name: testClass.name,
            results
        };
    }

    async executeTestFunctionWithTimeout(fn, functionName, timeout) {
        try {
            await Promise.race([
                Promise.resolve(fn()),
                new Promise(
                    (_, reject) => setTimeout(
                        () => reject(new Error(`${functionName} timed out after ${timeout}ms`)),
                        timeout
                    )
                )
            ]);
        }
        catch (error) {
            throw error;
        }
    }

    async runTestFunction(testClassInstance, functionName) {
        const startTime = performance.now();
        const isLifecycleFunction = ["beforeAll", "afterAll"].includes(functionName);
        let error;

        try {
            if (isLifecycleFunction === false && typeof testClassInstance.beforeEach === "function") {
                await this.executeTestFunctionWithTimeout(testClassInstance.beforeEach, `${functionName}.beforeEach`, this.#beforeEachTimeout);
            }

            await this.executeTestFunctionWithTimeout(testClassInstance[functionName].bind(testClassInstance), functionName, this.#asyncTestTimeout);

            if (isLifecycleFunction === false && typeof testClassInstance.afterEach === "function") {
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