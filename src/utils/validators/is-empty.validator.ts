export function hasValue(value: any) {

  const isNull = value === undefined || value === null;
  if (!isNull) {    
    if (typeof value === 'string') {
      return value.trim().length !== 0;
    }

    if (typeof value === 'object') {
      return Object.keys(value).length !== 0;
    }
    
    return true;
  }
  return false;
}