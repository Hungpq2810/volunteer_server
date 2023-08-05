const pick = (object: any, keys: any[]) => {
  return keys.reduce((obj: any, key: string | number) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

export default pick;
