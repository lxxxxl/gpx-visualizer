ymaps.ready(function (){
	init();
});

// used to adjust animation speed
speedMultiplier = 1;


function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// Get distance between two points
function getDistance(point1, point2) {
	return Math.sqrt(
		Math.pow((point2[0] - point1[0]), 2) +
		Math.pow((point2[1] - point1[1]), 2)
	);
}


async function playAnimation(placemark, trackArr, interval){
	var prevCoords = trackArr[0]
	for (var i = 1; i < trackArr.length; i++){
		// calculate generation interval
		_interval = getDistance(trackArr[i], prevCoords) / trackArr[i][2] * (interval * speedMultiplier)
		var difference = [trackArr[i][0] - trackArr[i - 1][0], trackArr[i][1] - trackArr[i - 1][1]];
		var maxAmount = Math.max(Math.abs(difference[0] / _interval), Math.abs(difference[1] / _interval));
		var minDifference = [difference[0] / maxAmount, difference[1] / maxAmount];
		var lastCoord = trackArr[i - 1];
		// generate and visualize intermediate points 
		while (maxAmount > 1) {
			lastCoord = [lastCoord[0] + minDifference[0], lastCoord[1] + minDifference[1]];
			maxAmount--;
				
			placemark.geometry.setCoordinates(lastCoord)
			await sleep(interval)
		}
		// visualize track point
		placemark.geometry.setCoordinates(trackArr[i])
		// center map to current point
		placemark.geometry.getMap().panTo(trackArr[i])
		
		prevCoords = trackArr[i]
			
	}
}
function init() {
	// Create map object
	var myMap = new ymaps.Map("map", {
		center: track[0],
		zoom: 18
	}, {
		searchControlProvider: 'yandex#search'
	});
	
	
	speedDownButton = new ymaps.control.Button("<<");
	speedUpButton = new ymaps.control.Button(">>");
	
	
	speedDownButton.events.add([
		'click'
	], function (e) {
		speedMultiplier /= 2
	});
	
	speedUpButton.events.add([
		'click'
	], function (e) {
		speedMultiplier *= 2
	});
	
	myMap.controls.add(speedDownButton, {float: 'right', selectOnClick: false});
	myMap.controls.add(speedUpButton, {float: 'right', selectOnClick: false});
	
	// interval used to draw intermediate points
	var animationInterval = 20
	
	// Main placemark 
	var mark = new ymaps.Placemark(track[0],
		{
			iconContent: '<b>R</b>'
		}, {
			preset: 'islands#blueCircleIcon',
			iconColor: '#3b5998',
		})
		
	mark.events.add([
		'click'
	], function (e) {
		// TODO check if animation already running
		mark.geometry.getMap().panTo(track[0])
		playAnimation(mark, track, animationInterval)
	});

	myMap.geoObjects.add(mark)

	playAnimation(mark, track, animationInterval)
}


