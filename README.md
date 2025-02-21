# Testwerk 🏭

A dependency-free, buildless test runner for browsers and node.js environments.

## Getting Started

At first you need to install the package using the following command:

```console
npm i @kompanie/testwerk
```

### Writing tests

Tests are organized into classes.
Each public function is treated as a test.
If you need helper functions inside your test class, use [private functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties).
Async functions are also supported and will automatically fail if they reach the configured `asyncTimeout`.

The following examples use `@kompanie/assert`. You can use any other assertion library that throws errors if an assertion fails.

```js
import { Assert } from "@kompanie/assert";

export class MyTests {
    add_shouldCorrectlyAdd() {
        const actual = 1 + 1;

        Assert.equal(actual, 2);
    }

    async async_add_shouldCorrectlyAdd() {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const actual = 1 + 1;

        Assert.equal(actual, 2);
    }

    #myHelperFunction() {
        // I'm not treated as test
    }
}
```

### Running tests

Your tests can be executed and visualized either as HTML (browser) or in the console (browser or node.js).

#### Running tests with HTML output

```js
import { TestRunnerHtml } from "@kompanie/testwerk";
import { MyTests } from "./tests/myTest.js";

const asyncTimeout = 5000; // Optional, 5000ms by default
const testResultContainer = document.getElementById("test-result-container");
const testRunnerHtml = new TestRunnerHtml(asyncTimeout);
testRunnerHtml.run(testResultContainer, MyTest); // Add your test classes here. No array declaration needed.
```

#### Running tests with console output

```js
import { TestRunnerConsole } from "@kompanie/testwerk";
import { MyTests } from "./tests/myTest.js";

const asyncTimeout = 5000; // Optional, 5000ms by default
const testRunnerConsole = new TestRunnerConsole(asyncTimeout);
testRunnerConsole.run(MyTest); // Add your test classes here. No array declaration needed.
```

#### Running tests without visual output

You can also use your own code to parse and visualize the output of `TestRunner`.

```js
import { TestRunner } from "@kompanie/testwerk";
import { MyOtherTests } from "./tests/myOtherTests.js";

const asyncTimeout = 5000; // Optional, 5000ms by default
const testRunner = new TestRunner(asyncTimeout);
const testResults = await testRunner.run(MyOtherTests); // Add your test classes here. No array declaration needed.
```

This example shows what `testResults` can look like.

```json
{
    "completionTime": 1739974557847,
    "testResults": [
        {
            "name": "MyOtherTests",
            "results": [
                {
                    "name": "throws_shouldFail_whenFunctionDoesNotThrowAsync",
                    "executionTime": 0,
                    "error": {
                        "columnNumber": 8,
                        "fileName": "http://localhost:8000/source/assert.js",
                        "lineNumber": 1,
                        "message": "Expected an error, but none was thrown",
                        "stack": "AssertionError@http://localhost:8000/source/assert.js:1:8..."
                    }
                },
                {
                    "name": "throws_shouldPass_whenFunctionThrowsAsync",
                    "executionTime": 2
                }
            ]
        }
    ]
}
```

## Test project

Testwerk includes tests which can be run with the following command:

```
npm test
```

You can then open your browser.
The test project outputs to the console and HTML.
It also has two failing tests to show the visualization of failed tests in the console and the HTML.