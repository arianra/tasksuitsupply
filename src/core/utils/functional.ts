export const compose: Function = (...functions): Function => {
	return noop()
}

export const noop: Function = (): Function => {
	return function() { }
}

export const recurse: Function = (amount, innerFn) => { 
	return function(){ 
		if(!amount-- || amount < 0){
			return innerFn();
		} 
		return recurse( amount, recurse );
	}
}