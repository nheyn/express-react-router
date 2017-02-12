/* @flow */

/**
 * Checks if the given element has was made using the gien component.
 */
export default function wasMadeUsing(el: any, Component: any): bool {
  if(!Component || !Component.displayName)    throw new Error('Invalid component, no displayName');
  if(!el || !el.type || !el.type.displayName) return false;

  return el.type.displayName === Component.displayName;
}
