import XHR, {GetJSON} from "./async/xhr";
import {log} from "./utils/debug";

log('hello from core.ts');


var bar = new GetJSON({url:'data.json'}).done(success).fail(fail).notify(notify);

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