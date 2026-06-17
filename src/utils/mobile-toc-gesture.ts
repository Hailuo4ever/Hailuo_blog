export interface MobileTocSwipe {
	startX: number;
	startY: number;
	currentX: number;
	currentY: number;
	viewportWidth: number;
}

const EDGE_INSET = 48;
const MIN_SWIPE_DISTANCE = 72;
const MAX_VERTICAL_DISTANCE = 48;
const HORIZONTAL_BIAS = 1.5;

export function shouldOpenMobileTocDrawer({
	startX,
	startY,
	currentX,
	currentY,
	viewportWidth,
}: MobileTocSwipe) {
	if (startX < EDGE_INSET || startX > viewportWidth - EDGE_INSET) {
		return false;
	}

	const deltaX = currentX - startX;
	const deltaY = currentY - startY;
	const absDeltaY = Math.abs(deltaY);

	return (
		deltaX <= -MIN_SWIPE_DISTANCE &&
		absDeltaY <= MAX_VERTICAL_DISTANCE &&
		Math.abs(deltaX) >= absDeltaY * HORIZONTAL_BIAS
	);
}
