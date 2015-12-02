import {resolve} from "./collection";

export const capitalize:Function = (base:string):string => {
	return base.charAt(0).toUpperCase() + base.slice(1);
}

export const uppercase:Function = (base:string):string => {
	return base.toUpperCase();
}

export const prefixCamelCase:Function = (prefix:string, base:string):string => {
	return prefix + capitalize(base);
}

//object resolve delimited with {{ ... }}
export const interpolate: Function = (base:String, data:any, delimiter:RegExp):string => {
	return base.replace(delimiter||/\{\{([\s\S]+?)\}\}/m, (m, p1)=>{return resolve(data, p1.trim())});	
}