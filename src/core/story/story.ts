import {templateElement} from "./../dom/template";

export interface StoryData {
	title: string;
	titleNoFormatting: string
	content: string;
	image: StoryImageData;
	url: string;
	unescapedUrl: string;
	publisher: string;
	publishedDate: string;
	relatedStories: StoryRelatedData[];
}

export interface StoryImageData {
	originalContextUrl: string;
	publisher: string;
	url: string;
	
	//thumbnail
	tbUrl: string;
	tbHeight: number;
	tbWidth: number;
}

export interface StoryRelatedData {
	title: string;
	titleNoFormatting: string;
	publishedDate: string;
	publisher: string;
	url: string;
	unescapedUrl: string;
}

export default class Story {
	constructor(public data: StoryData) {

	}

	public template;
	public element;

	// public static createStoryTemplate = (data: StoryData): templateElement => {
	// 	return {
	// 		tag: 'article',
	// 		attributes: { class: 'story' },
	// 		content: 
	// 		{
	// 			tag: 'div',
	// 			content:
	// 			[
	// 				{
	// 					tag: 'div',
	// 					attributes: { class: 'story-body' },
	// 					content: 
	// 					[
	// 						{
	// 							tag: 'div',
	// 							attributes: {class: 'story-header'},
	// 							content: 
	// 							[
	// 								{
	// 									tag: 'h3',
	// 									attributes: {class: 'story-heading'},
	// 									content: data.title
	// 								},
	// 								{
	// 									tag: 'strong',
	// 									content: data.publisher
	// 								},
	// 								{
	// 									tag: 'span',
	// 									content: `(${data.publishedDate})`
	// 								}
	// 							]
	// 						},
	// 						{
	// 							tag: 'div',
	// 							attributes: 'story-media'
	// 						}
	// 					]
	// 				},
	// 				{
	// 					tag: 'div',
	// 					attributes: { class: 'story-footer' }
	// 				},
	// 				{
	// 					tag: 'div',
	// 					attributes: { class: 'story-collapsible' },
	// 					content:
	// 					[
	// 						{
	// 							tag: 'div',
	// 							attributes: { class: 'story-content' }
	// 						},
	// 						{
	// 							tag: 'div',
	// 							attributes: { class: 'story-related' }
	// 						}
	// 					]
	// 				}
	// 			]
	// 		}
	// 	}
	// }
}