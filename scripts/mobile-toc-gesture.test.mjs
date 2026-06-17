import assert from "node:assert/strict";
import { shouldOpenMobileTocDrawer } from "../src/utils/mobile-toc-gesture.ts";

const baseSwipe = {
	startX: 240,
	startY: 300,
	currentX: 140,
	currentY: 318,
	viewportWidth: 390,
};

assert.equal(shouldOpenMobileTocDrawer(baseSwipe), true);
assert.equal(
	shouldOpenMobileTocDrawer({
		...baseSwipe,
		startX: 24,
	}),
	false,
);
assert.equal(
	shouldOpenMobileTocDrawer({
		...baseSwipe,
		startX: 366,
	}),
	false,
);
assert.equal(
	shouldOpenMobileTocDrawer({
		...baseSwipe,
		currentX: 190,
	}),
	false,
);
assert.equal(
	shouldOpenMobileTocDrawer({
		...baseSwipe,
		currentX: 340,
	}),
	false,
);
assert.equal(
	shouldOpenMobileTocDrawer({
		...baseSwipe,
		currentY: 390,
	}),
	false,
);

console.log("mobile toc gesture tests passed");
