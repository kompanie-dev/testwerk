export class AssertionError extends Error {}

export class Assert {
    static fail(message = "The code reached a fail condition") {
        throw new AssertionError(message);
    }

    // Numbers
    static approximately(actual, expected, tolerance) {
        if (Math.abs(actual - expected) > tolerance) {
            throw new AssertionError(`Expected approximately ${expected} ±${tolerance}, but got ${actual}`);
        }
    }

    static isAbove(actual, value) {
        if (actual <= value) {
            throw new AssertionError(`Expected above ${value}, but got ${actual}`);
        }
    }

    static isBelow(actual, value) {
        if (actual >= value) {
            throw new AssertionError(`Expected below ${value}, but got ${actual}`);
        }
    }

    static isBetween(actual, min, max) {
        if (actual < min || actual > max) {
            throw new AssertionError(`Expected between ${min} and ${max}, but got ${actual}`);
        }
    }

    // Equality
    static equal(actual, expected) {
        if (actual !== expected) {
            throw new AssertionError(`Expected ${expected}, but got ${actual}`);
        }
    }

    static notEqual(actual, expected) {
        if (actual === expected) {
            throw new AssertionError(`Expected not equal to ${expected}`);
        }
    }

    // Instances
    static isInstanceOf(actual, type) {
        if (!(actual instanceof type)) {
            throw new AssertionError(`Expected instance of ${type.name}, but got ${actual.name}`);
        }
    }

    static isNotInstanceOf(actual, type) {
        if (actual instanceof type) {
            throw new AssertionError(`Expected not instance of ${type.name}`);
        }
    }

    // Regex
    static #isRegexString(actual) {
        if (typeof actual !== "string") {
            throw new AssertionError(`Expected ${actual} to be type of String, but got ${typeof actual}. Only strings are supported in match().`);
        }
    }

    static match(actual, regex) {
        Assert.#isRegexString(actual);

        if (regex.test(actual) === false) {
            throw new AssertionError(`Expected ${actual} to match Regex ${regex}`);
        }
    }

    static notMatch(actual, regex) {
        Assert.#isRegexString(actual);

        if (regex.test(actual)) {
            throw new AssertionError(`Expected ${actual} to not match Regex ${regex}`);
        }
    }

    // NaN
    static isNaN(actual) {
        if (!Number.isNaN(actual)) {
            throw new AssertionError(`Expected NaN, but got ${actual}`);
        }
    }

    static isNotNaN(actual) {
        if (Number.isNaN(actual)) {
            throw new AssertionError(`Expected not NaN`);
        }
    }

    // Type checks
    static isTypeOf(object, type) {
        if (typeof object !== type) {
            throw new AssertionError(`Expected type ${type}, but got ${typeof object}`);
        }
    }

    static isNotTypeOf(object, type) {
        if (typeof object === type) {
            throw new AssertionError(`Expected not type ${type}`);
        }
    }

    // Throws
    static async throws(fn) {
        try {
            const result = fn();

            if (result instanceof Promise) {
                await result;
            }
        }
        catch {
            return;
        }

        throw new AssertionError("Expected an error, but none was thrown");
    }
    
    static async notThrows(fn) {
        try {
            const result = fn();

            if (result instanceof Promise) {
                await result;
            }
        }
        catch (error) {
            throw new AssertionError(`Expected no error, but got ${error}`);
        }
    }

    // Undefined or null
    static isUndefinedOrNull(actual) {
        if (actual !== undefined && actual !== null) {
            throw new AssertionError(`Expected undefined or null, but got ${actual}`);
        }
    }

    static isNotUndefinedOrNull(actual) {
        if (actual === undefined || actual === null) {
            throw new AssertionError(`Expected not undefined or null`);
        }
    }
}
