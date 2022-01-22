import { pick } from 'lodash';

export function getStringifiedEntries(obj: Record<string, any>) {
  return JSON.stringify(Object.entries(obj).sort());
}

export function createMappedPropertySet<
  T extends Record<string, any> = Record<string, any>
>(array: T[], propertyList: (keyof T)[]) {
  return array.reduce<Record<string, T>>(
    (accuObj, element) => ({
      ...accuObj,
      [getStringifiedEntries(pick(element, propertyList))]: element,
    }),
    {}
  );
}
