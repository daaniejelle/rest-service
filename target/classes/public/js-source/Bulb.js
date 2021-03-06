//turn the bulb on and off
//setbulbstatus na function geeft ie aan wat hij moet doen als het antwoord van de server komt
function bulbOnOffHandler(event){

    var image = event.target;
    var id = image.id
    var lightBulb = setBulbStatus(id, function(lightBulb) {

       if (lightBulb.on) {
            image.src ='img/bulb-on.png';
        }
        else {
            image.src ='img/bulb-off.png';
            }

        });
}

function rangeOpacity(event) {
    let slider = event.target;
    let value = slider.value;
    let bulb = $(".dimmableBulb.selected");
    setOpacity(bulb, value);
}

// value = 0 - 100
function setOpacity(img, value){
    // Opacity is 0.0 - 1;
   let opacity = value / 100;
   img.css("opacity", opacity);
}

//okCode code die uitgevoerd moet worden
function setBulbStatus(bulbId, okCode){
    let url = new URL("/setBulb", document.baseURI);
    url.searchParams.append("bulbId", bulbId);

    fetch(url)
        .then(response => {
            return response.json();
        })

        .then(
            (data) => {
                okCode(data);
            },
            (error) => {
                // console.error(error);
            });
}

function positionBulbs(){
    let floorPlan = $("#floorplanContainer")
    let lightbulbOff = "img/bulb-off.png";
    let lightbulbOn = "img/bulb-on.png";

    //functie wordt uitgevoerd als de respons van de server komt
   fetchBulbs(function(bulbs){
        bulbs.forEach(function(bulb){
            let img = $("<img>");
            img.attr("id", bulb.id)

            if (bulb.dimmable) {
                    // Create an absolute positioned div
                    // This is the container for the off light and the on light
                    let div = $("<div>");
                    div.css({top: bulb.yPosition, left: bulb.xPosition, position:'absolute'});

                    // Create the off light, this will be the background for the on light.
                    // When the on light changes opacity, the off light will be shown more or less
                    let imgLightBulbOff = $("<img>")
                    imgLightBulbOff.attr("src", lightbulbOff)
            		imgLightBulbOff.css({position: 'absolute', height: 60, width: 60});
                    div.append(imgLightBulbOff)

                    // Create the dimmable on light
                    img.attr("src", lightbulbOn)
            		img.addClass("dimmableBulb");
            		img.on("click", bulbSelectHandler);
            		img.css({position: 'absolute', height: 60, width: 60, opacity: 0.5});
                    setOpacity(img, bulb.intensity);
                    div.append(img);

                    floorPlan.append(div);
            	}

            	else {
                    let lightBulbSrc = bulb.on ? lightbulbOn : lightbulbOff;
                    img.attr("src", lightBulbSrc)
                    img.css({top: bulb.yPosition, left: bulb.xPosition, position:'absolute', height: 60, width: 60});
            		img.on("click", bulbOnOffHandler)
                    floorPlan.append(img);
            	}
        });
    });
}


function bulbSelectHandler(event){
	// remove the selected class from the currently selected bulb
	$(".dimmableBulb.selected").removeClass("selected");

    // Get the lightbulb and make it a jQuery object
	let lightBulb = $(event.target);
	// Add class to the bulb which is selected
	lightBulb.addClass("selected");

	let opacity = lightBulb.css("opacity");
	let slider = $("#slider");
	slider.val(opacity * 100);
}


function fetchBulbs(okCode){
    let url = new URL("/bulbs", document.baseURI);

    fetch(url)
        .then(response => {
            return response.json();
        })
        .then((data) => {
            okCode(data);
        },
            (error) => {
                console.log(error);
            });
}

//deze code wordt uitgevoerd als de hele pagina geladen is
$( document ).ready(function() {
    positionBulbs();
    $("#slider").on("input", rangeOpacity)
});