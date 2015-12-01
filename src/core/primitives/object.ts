// @quick&dirty - get object property from string 
// @example: var o = {a:{b:{c:'found me!'}}}; resolve(o, 'a.b.c') , resolve(o, 'a[b]["c"]'), etc... resolve(o, '[a][][][""b]c[]][]')
export const resolve: Function = (obj, prop) => {
	return prop.split(/\[|\]|\.|'|"/g).filter((v)=>{return v}).reduce((a,b)=>{ return a[b] },obj);
}