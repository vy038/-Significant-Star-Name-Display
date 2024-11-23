/* 
	Significant Star Name Display (Proj. #2)
	Victor Yu
	Created: 2024-11-10
	Modified: 2024-11-17
	Purpose: To display the names of stars based on their proximity to earth and their apparent magnitude 
	
	Inspired by https://informationisbeautiful.net/visualizations/words-shakespeare-invented/
*/

// declare variables

// api data extraction
let api_start = "https://api.wordnik.com/v4/word.json/";
let backgroundSeedWord = "star";
let api_end = "/relatedWords?useCanonical=false&limitPerRelationshipType=100&api_key=";

let wikipediaLinkContructor = "https://en.wikipedia.org/wiki/";

let plottingData = []; // array for data
let classStarArray = []; // array for star class objects
let wordCoordinates = new Map(); // hashmap for positions
let minMagnitude = 12; // smallest apparent magnitude of star that will show, data from -1.44 - 22, best at 12
let maxMagnitude = -2; // biggest apparent magnitude of star that will show
let scaleFactor = 0.8; // constant

let starID;
let starName;

let backgroundWordData; // array to hold information about background words
let backgroundWordsArray = []; // array for background word class objects

/*
* function to pre-load the data
*/
function preload() {
	loadStrings('WordNik_API.txt', handleAPI);
	loadTable('./sortedTitle_hyglike_from_athyg_v24.csv', handleData);
	font = loadFont('./Roboto-Medium.ttf');
}

function setup() {
	// basic setup
	createCanvas(windowWidth/1.25, windowHeight/1.25);
	textFont(font);
	background(0);
	noStroke();
	
	// plot all the stars
	replotStars(1);
}

function draw() {
	
	// update star position and zoom size
	replotStars(0);
	
	// create text to show zoom, min mag, etc
	fill(128);
	textSize(10);
	text(`Minimum Mag: ${minMagnitude}`, windowWidth/1.25 - 100, windowHeight/1.25 - 5);
	text(`Scale Factor: ${scaleFactor}`, windowWidth/1.25 - 100, windowHeight/1.25 - 15);
	
	// edit HTML text to show the id, name, and pronunciation of the star
	document.getElementById("ID").innerHTML = `ID: ${starID}`;
	document.getElementById("Name").innerHTML = `Name: ${starName}`;
	document.getElementById("Pronunciation").innerHTML = `Pronunciation: ${RiTa.syllables(starName)}`;
}

/*
* function to load the API and make it usable
*/
function handleAPI(data) {
	let api_call = api_start + backgroundSeedWord + api_end + data;
	loadJSON(api_call, handleAPIData);	
}

/*
* function to handle the data given by the API and put it into a usable array
*/
function handleAPIData(data) {
	// related words from API 
	backgroundWordData = data[0]['words'];
	
	// create a word object for every one of the words in the API related to 'star' and push to array to be plotted later
	for (let i = 0; i < backgroundWordData.length; i++) {
		wordInBackground = new Word(backgroundWordData[i], random(0, windowWidth/1.25), random(0, windowHeight/1.25), 45);
		backgroundWordsArray.push(wordInBackground);
	}
}

/*
* function to extract data and put it into an object
*/
function handleData(data) {
	for (let i = 0; i < data.getRowCount(); i++) { // goes through every row
		if (data.get(i, 13) && data.get(i, 7) && data.get(i, 8) && isNaN(data.get(i, 13)) == false && isNaN(data.get(i, 8)) == false && isNaN(data.get(i, 7)) == false) { // ensures real data
				plottingData.push({"name": data.get(i, 6), // gets name of stars as string
											"id": data.get(i, 0), // gets id of stars as integer
											"apparentMagnitude" : data.get(i, 13), // takes raw unmodified apparent magnitude
											"distance" : map(data.get(i, 9), 0, 82083.9594, 0, windowHeight/1.25), // mapped distance of star from earth 
											"spectra" : data.get(i, 15), // spectra (color) of star https://en.wikipedia.org/wiki/Stellar_classification#Spectral_types
											"significance" : abs(8 + (1/(2*map(data.get(i, 9), 0, 82083.9594, 0, windowHeight)) + 1/(data.get(i, 13) + 3)) * scaleFactor)
										 });
		}
	}
}

/*
* function to reset the delta mouse x and mouse y values
*
*/
function mousePressed() {
	if (mouseButton == LEFT && name != "N/A" && mouseX <= windowWidth/1.25 && mouseX >= 0 && mouseY >= 0 && mouseY <= windowHeight/1.25) {
    window.open(wikipediaLinkContructor + starName, "_blank");
  }
}

/**
* replots all the stars in the array
*
* @param {Number} mode - the mode in which to plot the stars, either 1 for setup, or 0 for update
*
**/
function replotStars(mode) { 
	// redraw background to make canvas look less messy
	background(0);
	
	if (mode == 1) { // if in initial setup mode
		
		// configure fill and stroke for the background words
		fill(50, 50);
		noStroke();
		
		// show all the background words taken from the API in the background
		for (let backgroundWord of backgroundWordsArray) {
			backgroundWord.show();
		}
		
		// sort the stars to be plotted from biggest to smallest, plotting the bigger ones first
		let plottingDataSizeSorted = plottingData.slice(0);
		plottingDataSizeSorted.sort(function(a,b) {
				return b.significance - a.significance;
		});
		
		// go through every star in the array
		for (let i of plottingDataSizeSorted) {
			if (i.apparentMagnitude <= minMagnitude && i.apparentMagnitude >= maxMagnitude && i.distance) {  // if star brightness is within range
				
				// configure text outline and text size
				strokeWeight(1);
				stroke(0);
				textSize(i.significance);

				// determine x and y coordinates randomly taking into account the dimensions of the text
				let boundBox = font.textBounds(i.name, 0, 0);

				let x = random(0, windowWidth/1.25 - boundBox.w*1.5);
				let y = random(0 + boundBox.h*1.5, windowHeight/1.25);

				// test if any overlap, good for basic overlap prevention, pick another random position if yes
				for (let [key, existingWordCoord] of wordCoordinates) {
					// standard overlap cases
					if (((x >= existingWordCoord[0] && x + boundBox.w <= existingWordCoord[2]) || (x >= existingWordCoord[0] && x <= existingWordCoord[2])) && ((y <= existingWordCoord[1] && y - boundBox.h >= existingWordCoord[3]) || (y >= existingWordCoord[3] && y <= existingWordCoord[1]))) { // case 1 overlapping
						x = random(0, windowWidth/1.25 - boundBox.w*1.5);
						y = random(0 + boundBox.h*1.5, windowHeight/1.25);
					} 
					if (x <= existingWordCoord[2] && x >= existingWordCoord[0] && y - boundBox.h >= existingWordCoord[3] && y - boundBox.h <= existingWordCoord[1]) { // case 2 overlapping
						x = random(0, windowWidth/1.25 - boundBox.w*1.5);
						y = random(0 + boundBox.h*1.5, windowHeight/1.25);
					} 
					if (((x + boundBox.w <= existingWordCoord[2] && x + boundBox.w >= existingWordCoord[0]) || (x >= existingWordCoord[0] && x + boundBox.w <= existingWordCoord[2])) && ((y - boundBox.h >= existingWordCoord[3] && y - boundBox.h <= existingWordCoord[1]) || (y - boundBox.h <= existingWordCoord[3] && y - boundBox.h >= existingWordCoord[0]))) { // case 3 overlapping
						x = random(0, windowWidth/1.25 - boundBox.w*1.5);
						y = random(0 + boundBox.h*1.5, windowHeight/1.25);
					} 
					if (x + boundBox.w <= existingWordCoord[2] && x + boundBox.w >= existingWordCoord[0] && y >= existingWordCoord[3] && y <= existingWordCoord[1]) { // case 4 overlapping
						x = random(0, windowWidth/1.25 - boundBox.w*1.5);
						y = random(0 + boundBox.h*1.5, windowHeight/1.25);
					} 
					if (x >= existingWordCoord[0] && x + boundBox.w <= existingWordCoord[2] && y <= existingWordCoord[1] && y - boundBox.h >= existingWordCoord[3]) {
						x = random(0, windowWidth/1.25 - boundBox.w*1.5);
						y = random(0 + boundBox.h*1.5, windowHeight/1.25);
					}
				}	

				// push the new adjusted coordinates into a hashmap so the position is taken into account when doing overlap check again
				wordCoordinates.set(i.name, [x, y, x + boundBox.w, y - boundBox.h]);

				// create a new star (text) at that location
				starPoint = new Star(i.apparentMagnitude, windowWidth/1.25, windowHeight/1.25, i.spectra, scaleFactor, minMagnitude, maxMagnitude, i.id, i.name, x, y, i.significance);

				// add this new star to an array of all stars and show it
				classStarArray.push(starPoint);
				starPoint.show();	
			}
		}
	} else { // basic code to check if mouse is overlapping
		
		// remake the background after resetting it
		fill(50, 50);
		noStroke();
		for (let backgroundWord of backgroundWordsArray) {
			backgroundWord.show();
		}
		
		// check if the mouse coordinates overlap with any star text
		for (let star of classStarArray) { 
			if (star.overlap(mouseX, mouseY) != 0) {
				starID = star.overlap(mouseX, mouseY);
				starName = star.extractName(mouseX, mouseY);
			}
			// reshow the star text
			star.show();
		}
	}
}

console.log = function() {} // disable console log preventing rita from sending messages