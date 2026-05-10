/**
 * Staff create flow only exposes the Personal tab until the record exists;
 * edit mode may navigate all tabs.
 */
export function isStaffFormTabSelectable(tabId: string, isEdit: boolean): boolean {
    return isEdit || tabId === 'personal';
}
