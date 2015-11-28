export const extend: Function = (...args): {} => {
  return args.reduceRight(function(source, destination) {
    Object.keys(source).forEach(function(key) {
      var value = source[key];
      if (value === void 0) return;
      destination[key] = value;
    });
    return destination;
  });
}