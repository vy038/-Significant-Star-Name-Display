/**
 * This class creates a star (circle) which has variable size and position depending on  the input parameters
 * @class  
 */
class Star extends Word {
	
	/**
	 * This creates special star text which changes color depending on the spectra of a given star, and changes text size based on its "significance"
	 *
	 * @constructor
	 *
	 * @param {Number} canvasWidth - width of the canvas
	 * @param {Number} canvasHeight - height of the canvas
	 * @param {String} color - color value of the star
	 * @param {Number} scaleFactor - determines how big to scale the size of the star should be
	 * @param {Number} apparentMagnitude - unmodified apparent magnitude of the star
	 * @param {Number} minMagnitude - the minimum apparent magnitude required for the star to display
	 * @param {Number} maxMagnitude - the maximum apparent magnitude required for the star to display
	 * @param {Number} id - the id of the star
	 * @param {String} text - name of the star if it has one
	 * @param {Number} x - the x coordinate of the bottom left corner of the text bounding box
	 * @param {Number} y - the y coordinate of the bottom left corner of the text bounding box
	 * @param {Number} significance - the "significance" value of the star, dictating how big it shows up as (formula is to be decided by external program)
	 */
	constructor(apparentMagnitude, canvasWidth, canvasHeight, color, scaleFactor, minMagnitude, maxMagnitude, id, text, x, y, significance) {
		super(text, x, y, significance); // takes properties from superclass
		this.apparentMagnitude = apparentMagnitude; // unmodified magnitude of star
		this.canvasWidth = canvasWidth; // width of canvas
		this.canvasHeight = canvasHeight; // height of canvas
		this.color = color; // determine whether or not user wants color for this star
		this.scaleFactor = scaleFactor; // a variable which is multiplied with the size to determine how big the star must be
		this.minMagnitude = minMagnitude; // the minimum apparent magnitude required for the star to display
		this.maxMagnitude = maxMagnitude; // the maximum apparent magnitude required for the star to display
		this.id = id; // id of star
		this.text = text; // name of the star if it has one
		
		// configure sizing box domains and text size
		let boundBox = font.textBounds(this.text, 0, 0);
		this.boundBoxWidth = boundBox.w;
		this.boundBoxHeight = boundBox.h;
		textSize(this.significance);
	}
	
	/**     
	 * Shows the star text with the given positions and sizes, as well as their appropriate color
	 */
	show() {
		// if star text is within boundries and within accepted magnitude range
		if (this.x >= 0 && this.x <= this.canvasWidth && this.y >= 0 && this.y <= this.canvasHeight && this.apparentMagnitude <= this.minMagnitude && this.apparentMagnitude >= this.maxMagnitude) {
			if (this.color == 0) { // if there is no spectra for star then give it B&W
				if (255 - this.apparentMagnitude < 0) {
					this.fillColor = 0;
				} else {
					this.fillColor = 255 - this.apparentMagnitude;
				}
				fill(this.fillColor, 255);
			} else { // if color extraction failed or colorCheck is false, give it B&W color
				if (colorExtraction(this.color) == -1 || this.colorCheck == false) {
					if (255 - this.apparentMagnitude < 0) {
						fill(0, 255);
					} else {
						fill(255 - this.apparentMagnitude, 255);
					}
					
				} else { // if there is a successful spectra extraction, give the star a fill color
					colorMode(HSB);
					fill(colorExtraction(this.color), saturationExtraction(this.color), 100-((this.apparentMagnitude/255)*100));
					colorMode(RGB);
				}
			}
			// create the star with constructor sizes and new color
			textSize(this.significance);
			text(this.text, this.x, this.y);
		}
	} 
	
	/*
	* checks to see if the mouse overlaps with a star
	*
	* @param {Number} mouseX - the x position of the mouse
	* @param {Number} mouseY - the y position of the mouse
	*/
	overlap(mouseX, mouseY) {
		// if mouse is in close proximity of a star, return the id of that star, else return nothing
		if (mouseX <= this.x + this.boundBoxWidth && mouseX >= this.x && mouseY + this.boundBoxHeight >= this.y && mouseY <= this.y) {
			return this.id;
		} else {
			return 0;
		}
	}
	
	/*
	* checks to see if the overlapping star has a name
	*
	* @param {Number} mouseX - the x position of the mouse
	* @param {Number} mouseY - the y position of the mouse
	*/
	extractName(mouseX, mouseY) {
		// if mouse is in close proximity of a star, return the id of that star, else return nothing
		if (mouseX <= this.x + this.boundBoxWidth && mouseX >= this.x && mouseY + this.boundBoxHeight >= this.y && mouseY <= this.y) {
			return this.text;
		} else {
			return "N/A";
		}
	}
}

/*
* returns a numeric hue HSB value for a star after extracting a character in its spectra
*
* @param {String} colorStr - the complete string of the star spectra in which to convert the character from
* 
* @returns {Number} the numeric hue value for HSB
*/
function colorExtraction(colorStr) {
		// extracts a letter from the spectra and returns a value based on that for color extraction
		if (colorStr[0] == 'O' || colorStr[0] == 'W') { 
			return 240;
		} else if (colorStr[0] == 'B') {
			return 240;
		} else if (colorStr[0] == 'A') {
			return 240;
		} else if (colorStr[0] == 'F') {
			return 240;
		} else if (colorStr[0] == 'G') {
			return 50;
		} else if (colorStr[0] == 'K') {
			return 350;
		} else if (colorStr[0] == 'M' || colorStr[0] == 'C') {
			return 0;
		}	else {
			return -1;
		}
}

/*
* returns a numeric saturation HSB value for a star after extracting a character in its spectra
*
* @param {String} colorStr - the complete string of the star spectra in which to convert the character from
* 
* @returns {Number} the numeric saturation value for HSB
*/
function saturationExtraction(colorStr) {
		// extracts a letter from the spectra and returns a value based on that for saturation extraction
		if (colorStr[0] == 'O' || colorStr[0] == 'W') {
			return 80;
		} else if (colorStr[0] == 'B') {
			return 30;
		} else if (colorStr[0] == 'A') {
			return 20;
		} else if (colorStr[0] == 'F') {
			return 0;
		} else if (colorStr[0] == 'G') {
			return 60;
		} else if (colorStr[0] == 'K') {
			return 50;
		} else if (colorStr[0] == 'M' || colorStr[0] == 'C') {
			return 90;
		} else {
			return 0;
		}
}