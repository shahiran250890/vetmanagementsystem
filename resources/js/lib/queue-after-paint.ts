/**
 * Runs {@link callback} after the browser paints, so DOM updates (e.g. closing an overlay)
 * are visible before follow-up UI such as modal dialogs.
 */
export function queueAfterPaint(callback: () => void): void {
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            callback();
        });
    });
}
