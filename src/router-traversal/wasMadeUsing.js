/* @flow */

/**
 * Checks if the given element has was made using the gien component.
 */
export default function wasMadeUsing(el: any, Component: any): bool {
  if(!el || !el.type || !el.type.displayName) return false;
  if(!Component || !Component.displayName)    return false;

  return el.type.displayName === Component.displayName;
}
