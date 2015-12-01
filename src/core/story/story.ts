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

	public createTemplate = (): templateElement => {
		return
	}
}