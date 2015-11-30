import XHR from "./async/xhr";
import {log} from "./utils/debug";

log('hello from core.ts', XHR);


var foo = new XHR({url:'data.json', responseType: 'json', headers: [{header:"Content-Type",value:"application/json"}]}).done(success).fail(fail).notify(notify);

function success(r){
	log('success:');
	console.dir(r);
}
function fail(er){
	log('error:', er);
}
function notify(ev){
	log('notify:', ev);
}