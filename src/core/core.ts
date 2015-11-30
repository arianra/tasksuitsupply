import XHR, {GetJSON} from "./async/xhr";
import {template, groupTemplate} from "./dom/template";
import {log} from "./utils/debug";

log('hello from core.ts');

//xhr test
var bar = new GetJSON({ url: 'data.json' }).done(success).fail(fail).notify(notify);

function success(r) {
	log('success:');
	console.dir(r);
}
function fail(er) {}
function notify(ev) {}

//template test

var templTest = {
	tag: 'div',
	content: { 
		tag: 'ul',
		content: [
			{
				tag:'li',
				content: {
					tag: 'input', 
					attributes: {
						'type': 'text', 
						'value': 'any value you like'}
					}
			},
			{
				tag:'li',
				content: 'simple text'
			},
			{
				tag:'li',
				content: ['mucho', 'text', 'gracias']
			}
		],
		attributes: { 'data-collapsible': 'very' } },
	attributes: { 'class': 'anything-you like' }
}

document.body.appendChild( template(templTest) )
document.body.appendChild( groupTemplate(templTest, templTest, templTest));