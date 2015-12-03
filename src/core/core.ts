//
// This is temporary & ugly code for the prototype, and substitutes unfinished parts for quick debugging
//


import XHR, {GetJSON, GetHTML} from "./async/xhr";
import {template, groupTemplate} from "./dom/template";
import {Δ, interpolateTextNode, replaceTextNode} from "./dom/manipulation";
import {dateString} from "./primitives/date"; //remove this after testing
import {log} from "./utils/debug";


log('hello from core.ts');

//xhr test
var foo = new GetHTML({ url: 'story.html' }).done(function(r0) {
	var bar = new GetJSON({ url: 'data.json' }).done(function(r1) {
		var r1 = r1.results[0];
		
		document.body.insertAdjacentHTML('beforeend', r0); // debug insert story template
		interpolateTextNode(document.body, 'story', r1); // debug interpolate of story data on template
		console.log(relatedStoryFragmentTest(r1.relatedStories))
		replaceTextNode(document.body, 'story-related', relatedStoryFragmentTest(r1.relatedStories))
	});
});


//relatedstories test
function relatedStoryFragmentTest(data) {
	var relatedStoryTemplates = data.map(function(v, k, c) {
		return {
			tag: 'div',
			content:
			{
				tag: 'h4',
				content: {
					tag: 'a',
					attributes: { href: decodeURIComponent(v.url) },
					content: [
						{ tag: 'span', content: v.title },
						{ tag: 'span', content: ` ( ${dateString(v.publishedDate) } ) ` }
					]
				}
			}

		}
	});

	return groupTemplate.apply(null, relatedStoryTemplates);
}