export const assignBase: Function = (assign, ...collections): Object => {
  return collections.reduceRight(function(source, destination) {
    forEachKey(source, function(key) {
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
    if (destination[key] !== void 0) return null;
    return source[key];
  }, ...collections);
}

export const forEachKey: Function = (collection: Object, assign:any): void => {
  Object.keys(collection).forEach( assign );
}

// @quick&dirty - get object property from string 
// @example: var o = {a:{b:{c:'found me!'}}}; resolve(o, 'a.b.c') , resolve(o, 'a[b]["c"]'), etc... resolve(o, '[a][][][""b]c[]][]')
export const resolve: Function = (obj, prop) => {
	return prop.split(/\[|\]|\.|'|"/g).filter((v)=>{return v}).reduce((a,b)=>{ return a[b] },obj);
}