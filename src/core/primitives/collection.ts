export const assignBase: Function = (assign, ...collections): Object => {
  return collections.reduceRight(function(source, destination) {
    Object.keys(source).forEach(function(key) {
      let value = assign(source, key, destination);
      if (value) {
        destination[key] = value;
      }
    });
    return destination;
  });
}

export const extend: Function = (...collections): Object => {
  return assignBase((source, key, destination) => {
    let value = source[key];
    return (value === void 0) ? null : value;
  }, ...collections);
}

export const defaults: Function = (...collections): Object => {
  return assignBase((source, key, destination) => {
    if (destination[key] !== void 0) {
      return null;
    }

    return source[key];
  }, ...collections);
}