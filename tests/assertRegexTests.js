import { Assert } from "../index.js";

export class AssertRegexTests {
    match_shouldPass_forMatchingRegex() {
        Assert.match("hello123", /hello\d+/u);
    }

    match_shouldFail_forNonMatchingRegex() {
        Assert.throws(() => Assert.match("hello", /world/u));
    }

    notMatch_shouldPass_forNonMatchingRegex() {
        Assert.notMatch("hello", /world/u);
    }

    notMatch_shouldFail_forMatchingRegex() {
        Assert.throws(() => Assert.notMatch("hello123", /hello\d+/u));
    }
}