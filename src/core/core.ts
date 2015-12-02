import XHR, {GetJSON, GetHTML} from "./async/xhr";
import {template, groupTemplate} from "./dom/template";
import {Δ, interpolateTextNode, replaceTextNode} from "./dom/manipulation";
import {dateString} from "./primitives/date"; //remove this after testing
import {log} from "./utils/debug";


log('hello from core.ts');

//xhr test
var foo = new GetHTML({ url: 'story.html' }).done(successHTML).fail(failHTML).notify(notifyHTML);


function successHTML(r) {
	var bar = new GetJSON({ url: 'data.json' }).done(success).fail(fail).notify(notify);
	
	document.body.insertAdjacentHTML('beforeend', r); // debug insert story template
}
function failHTML(er) {}
function notifyHTML(ev) {}

function success(r) {
	var r = r.results[0];
	
	
	interpolateTextNode(document.body, 'story', r); // debug interpolate of story data on template
	console.log(relatedStoryFragmentTest(r.relatedStories))
	replaceTextNode(document.body, 'story-related', relatedStoryFragmentTest(r.relatedStories))
}
function fail(er) {}
function notify(ev) {}

//relatedstories test
function relatedStoryFragmentTest(data){
	var relatedStoryTemplates = data.map(function(v,k,c){
		return {
			tag: 'div',
			content: 
				{
					tag: 'h4',
					content: {
						tag: 'a',
						attributes: {href: decodeURIComponent(v.url)},
						content: [
							{tag: 'span', content: v.title },
							{tag: 'span', content: ` ( ${dateString(v.publishedDate)} ) ` }
						]
					}
				}
			
		}
	});

	return groupTemplate.apply(null, relatedStoryTemplates);
}
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
				content: '<p>Average text for <b>average</b> websites</h3>'
			},
			{
				tag:'li',
				content: 'simple text'
			},
			{
				tag:'li',
				content: ['mucho', 'text', 'gracias']
			},
			{
				tag:'li',
				content: '<h2>Huge text for huge websites</h2>'
			}
		],
		attributes: { 'data-collapsible': 'very' } },
	attributes: { 'class': 'anything-you like' }
}

document.body.appendChild( template(templTest) )
document.body.appendChild( groupTemplate(templTest, templTest, templTest));