import { TestRunner } from "./testRunner.js";
import { formatDate } from "./formatDate.js";

export class TestRunnerConsole {
    #asyncTimeout;

    constructor(asyncTimeout = 5000) {
        this.#asyncTimeout = asyncTimeout;
    }

    async run(...testClasses) {
        console.info("Executing tests. Please wait...");

        const testRunner = new TestRunner(this.#asyncTimeout);
        const testResult = await testRunner.run(...testClasses);
    
        this.showResults(testResult);
    }

    showResults(testResult) {
        const timeStamp = formatDate(testResult.completionTime);
        console.info(`Test results ${timeStamp}`);

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