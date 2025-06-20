import { TestRunner } from "./testRunner.js";
import { formatDate } from "./formatDate.js";

export class TestRunnerHtml {
    #asyncTestTimeout;
    #afterEachTimeout;
    #beforeEachTimeout;

    constructor({ asyncTestTimeout = 5000, afterEachTimeout = 500, beforeEachTimeout = 500 }) {
        this.#asyncTestTimeout = asyncTestTimeout;
        this.#afterEachTimeout = afterEachTimeout;
        this.#beforeEachTimeout = beforeEachTimeout;
    }

    async run(containerElement, ...testClasses) {
        containerElement.innerHTML = "⏱️ Executing tests. Please wait...";

        const testRunnerConfig = {
            asyncTestTimeout: this.#asyncTestTimeout,
            afterEachTimeout: this.#afterEachTimeout,
            beforeEachTimeout: this.#beforeEachTimeout
        };
        const testRunner = new TestRunner(testRunnerConfig);
        const testResult = await testRunner.run(...testClasses);
    
        this.showResults(testResult, containerElement);
    }

    showResults(testResult, containerElement) {
        const timeStamp = formatDate(testResult.completionTime);

        let totalTests = 0;
        let successfulTests = 0;

        for (const testClass of testResult.testResults) {
            totalTests += testClass.results.length;
            successfulTests += testClass.results.filter(testFunctionResult => testFunctionResult.error === undefined).length;
        }

        let finalHtml = /*html*/`<h1>🏭 Test Results — ${successfulTests} of ${totalTests} tests successful</h1><span>⏱️ Finished on ${timeStamp}, taking ${testResult.executionTime}ms</span>`;

        for (const testClass of testResult.testResults) {
            const successfulTests = testClass.results.filter(testFunctionResult => testFunctionResult.error === undefined).length;
            const allTestsSuccessful = successfulTests === testClass.results.length;
            const testClassStatusIcon = allTestsSuccessful ? "✅" : "❌";

            finalHtml += /*html*/`
                <details ${allTestsSuccessful === false ? "open" : ""}>
                    <summary class="testwerk-summary">${testClassStatusIcon} ${testClass.name} (${successfulTests} of ${testClass.results.length} successful)</summary>
                    <table class="testwerk-table">
            `;

            for (const testFunctionResult of testClass.results) {
                const testFailed = testFunctionResult.error !== undefined;
                const testFunctionStatusIcon = testFailed ? "❌" : "✅";
            
                finalHtml += /*html*/`<tr>
                    <td>${testFunctionStatusIcon}</td>
                    <td class="testwerk-function-data-name">${testFunctionResult.name}</td>
                    <td class="testwerk-function-data-executiontime">${testFunctionResult.executionTime}ms</td>
                `;

                if (testFailed === true) {
                    finalHtml += /*html*/`
                        <td class="testwerk-function-data-error">
                            <div class="testwerk-error-message">${testFunctionResult.error.message}</div>
                            <hr class="testwerk-hr">
                            <textarea class="testwerk-error-stack" readonly cols="90" rows="12">${testFunctionResult.error.stack}</textarea>
                        </td>
                    `;
                }
                else {
                    finalHtml += /*html*/`<td class="testwerk-function-data-error">-</td>`;
                }

                finalHtml += "</tr>";
            }

            finalHtml += "</table></details>";
        }

        containerElement.innerHTML = finalHtml;
    }
}