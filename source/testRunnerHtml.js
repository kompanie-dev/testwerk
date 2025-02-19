import { TestRunner } from "./testRunner.js";
import { formatDate } from "./formatDate.js";

export class TestRunnerHtml {
    #asyncTimeout;

    constructor(asyncTimeout = 5000) {
        this.#asyncTimeout = asyncTimeout;
    }

    async run(containerElement, ...testClasses) {
        containerElement.innerHTML = `Executing tests. Please wait...`;

        const testRunner = new TestRunner(this.#asyncTimeout);
        const testResult = await testRunner.run(...testClasses);
    
        this.showResults(testResult, containerElement);
    }

    showResults(testResult, containerElement) {
        const timeStamp = formatDate(testResult.completionTime);
        let finalHtml = `<h1>Test Results</h1><span>Finished on ${timeStamp}</span>`;

        for (const testClass of testResult.testResults) {
            const successfulTests = testClass.results.filter(testFunctionResult => testFunctionResult.error === undefined).length;
            const testClassStatusIcon = successfulTests === testClass.results.length ? "✅" : "❌";

            finalHtml += /*html*/`
                <h2>${testClassStatusIcon} ${testClass.name} (${successfulTests} of ${testClass.results.length} successful)</h2>
                <table>
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
                            <p class="testwerk-error-message">${testFunctionResult.error.message}</p>
                            <hr>
                            <textarea class="testwerk-error-stack" readonly cols="90" rows="12">${testFunctionResult.error.stack}</textarea>
                        </td>
                    `;
                }
                else {
                    finalHtml += /*html*/`<td class="testwerk-function-data-error">-</td>`;
                }

                finalHtml += "</tr>";
            }

            finalHtml += "</table>";
        }

        containerElement.innerHTML = finalHtml;
    }
}