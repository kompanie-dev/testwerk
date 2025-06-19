import { TestRunner } from "./testRunner.js";
import { formatDate } from "./formatDate.js";

export class TestRunnerConsole {
    #asyncTestTimeout;
    #afterEachTimeout;
    #beforeEachTimeout;

    constructor({ asyncTestTimeout = 5000, afterEachTimeout = 500, beforeEachTimeout = 500 }) {
        this.#asyncTestTimeout = asyncTestTimeout;
        this.#afterEachTimeout = afterEachTimeout;
        this.#beforeEachTimeout = beforeEachTimeout;
    }

    async run(...testClasses) {
        console.info("⏱️ Executing tests. Please wait...");

        const testRunnerConfig = {
            asyncTestTimeout: this.#asyncTestTimeout,
            afterEachTimeout: this.#afterEachTimeout,
            beforeEachTimeout: this.#beforeEachTimeout
        };
        const testRunner = new TestRunner(testRunnerConfig);
        const testResult = await testRunner.run(...testClasses);
    
        this.showResults(testResult);
    }

    showResults(testResult) {
        const timeStamp = formatDate(testResult.completionTime);
        console.info(`🏭 Tests finished on ${timeStamp}, taking ${testResult.executionTime}ms`);

        for (const testClass of testResult.testResults) {
            console.info("░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░");

            const successfulTests = testClass.results.filter(testFunctionResult => testFunctionResult.error === undefined).length;

            console.info(`▶️ ${testClass.name} (${successfulTests} of ${testClass.results.length} successful)`);

            for (const testFunctionResult of testClass.results) {
                const testFailed = testFunctionResult.error !== undefined;
                const testFunctionStatusIcon = testFailed ? "❌" : "✅";
            
                console.info(`${testFunctionStatusIcon} | ${testFunctionResult.name} | ${testFunctionResult.executionTime}ms`);

                if (testFailed === true) {
                    console.info(
                        `${testFunctionResult.error.message}`,
                        "\n",
                        `${testFunctionResult.error.stack}`,
                        "_____________________________"
                    );
                }
            }
        }
    }
}