/**
 * This class creates a star (circle) which has variable size and position depending on  the input parameters
 * @class  
 */
class Word {
	
	/**
	 * This creates regular text at a given coordinate with a given size and text
	 *
	 * @constructor
	 *
	 * @param {String} text - text that the text box would show
	 * @param {Number} x - the x coordinate of the bottom left corner of the text bounding box
	 * @param {Number} y - the y coordinate of the bottom left corner of the text bounding box
	 * @param {Number} significance - how big the text is, typically the "significance" value of the star, dictating how big it shows up as (formula is to be decided by external program)
	 */
	constructor(text, x, y, significance) {
		this.text = text; // the text that is to be displayed
		this.x = x // the x coordinate of the bottom left corner of the text bounding box
		this.y = y // the y coordinate of the bottom left corner of the text bounding box
		this.significance = significance; // how big the text is, typically the "significance" value of the star, dictating how big it shows up as (formula is to be decided by external program)
	}
	
	/**     
	 * Shows the text with a set brightness and coordinates
	 */
	show() {
		textSize(this.significance);
		text(this.text, this.x, this.y);
	}
}