// Initialize Firebase
var config = {
    apiKey: "AIzaSyDxw4PkTvxeB66BhbkaP0nLHjDchleQ_NM",
    authDomain: "starstalker-e2e6f.firebaseapp.com",
    databaseURL: "https://starstalker-e2e6f.firebaseio.com",
    projectId: "starstalker-e2e6f",
    storageBucket: "",
    messagingSenderId: "30070667248"
};
firebase.initializeApp(config);

var myData = firebase.database();

// admin panel animation
$("#adminArea").hide(100);
$("#toggleForm").click(function () {

    $("#adminArea").toggle(2500);
});

// set up event listener
$("#add-star").on("click", function (event) {

    event.preventDefault();
    displayStarInfo();

    var stalkerName = $("#stalker-name").val().trim();
    var starFirstName = $("#star-first-name").val().trim();
    var starLastName = $("#star-last-name").val().trim();
    var starFavMov = $("#star-fav-mov").val().trim();
    var stalkVal = $("#stalk-value").val().trim();

    alert(starFirstName);

    myData.ref("/Stars/").push({
        yName: stalkerName,
        sfName: starFirstName,
        slName: starLastName,
        Movie: starFavMov,
        sValue: stalkVal

    });
});



myData.ref("/Stars").on("child_added", function (snap) {

    var record = snap.val();



    // push updates back to client page
    $("#star-table").append("<tr><td>" + record.yName + "</td><td>" + record.sfName + "</td><td>" + record.slName + "</td><td>" + record.Movie + "</td><td>" + record.sValue + "</td></tr>)");



});
// This code section is for The Movie Datbase API to pull info by Actor Name instead of movie title

function displayStarInfo() {
    var starFirstName = $("#star-first-name").val().trim();
    var starLastName = $("#star-last-name").val().trim();
    var queryURL = "https://api.themoviedb.org/3/search/person?api_key=b87c09787f893f3fa630db9c1eef2c6b&query=" + starFirstName + "+" + starLastName;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function (res) {
        //alert(starFirstName+starLastName);
        console.log(res);
        //console.log(res.results[0].known_for[0].title);
        //console.log(res.results[0].known_for[0].poster_path);


        // Retrieving the URL for the image
        //var imgURL = "https://image.tmdb.org/t/p/w500"+res.results[0].known_for[0].poster_path;
        var imgURL = "https://image.tmdb.org/t/p/w500" + res.results[0].known_for[0].backdrop_path;
        console.log(imgURL);
        console.log(queryURL);
        var starKnownFor = res.results[0].known_for[0].title;
        console.log(starKnownFor);
        var starFullName = res.results[0].name;
        console.log(starFullName);
        var starID = res.results[0].id;
        console.log(starID);

        // Creating an element to hold the image
        //var movieDiv = $("<div class='movie'>");

        var image = $("<img>").attr("src", imgURL);
        $("#poster_image").append(image);


        // we take the starID return data and feed it into this new query to get
        // the bio info
        var actorQueryURL = "http://api.themoviedb.org/3/person/" + starID + "?api_key=b87c09787f893f3fa630db9c1eef2c6b";
        $.ajax({
            url: actorQueryURL,
            method: "GET"
        }).done(function (resBio) {
            //alert(starFirstName+starLastName);
            /*
            console.log(resBio);
            console.log(resBio.birthday);
            console.log(resBio.place_of_birth);
            console.log(resBio.biography);
            console.log(resBio.homepage);
            console.log(resBio.profile_path);
            */

            var starBirthDay = resBio.birthday;
            var starBirthPlace = resBio.place_of_birth;
            var starBio = resBio.biography;
            var starWebPage = resBio.homepage;
            var starPhotoURL = "https://image.tmdb.org/t/p/w500" + resBio.profile_path;

            var starImage = $("<img>").attr("src", starPhotoURL);

            $("#star_photo").append(starImage);
            $("#star_birthday").html("<p>" + starBirthDay + "</p>");
            $("#star_birthplace").html("<p>" + starBirthPlace + "</p>");
            $("#star_bio").html("<p>" + starBio + "</p>");


            // ******* Facial Recognition/Emotion Function **************

            function processImage() {

                var subscriptionKey = "7a8638a5843f46e3bf754e3bf1d13193";


                var uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";

                // Request parameters.
                var params = {
                    "returnFaceId": "true",
                    "returnFaceLandmarks": "false",
                    "returnFaceAttributes": "age,gender,emotion",
                };

                // Display the image.
                var sourceImageUrl = document.getElementById("inputImage").value;
                document.querySelector("#sourceImage").src = sourceImageUrl;

                // Perform the REST API call.
                $.ajax({
                        url: uriBase + "?" + $.param(params),

                        // Request headers.
                        beforeSend: function (xhrObj) {
                            xhrObj.setRequestHeader("Content-Type", "application/json");
                            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
                        },

                        type: "POST",

                        // Request body.
                        data: '{"url": ' + '"' + sourceImageUrl + '"}',
                    })

                    .done(function (data) {
                        // Show formatted JSON on webpage.
                        //$("#responseTextArea").val(JSON.stringify(data, null, 2));
                        $("#responseTextArea").val(JSON.stringify(data, null, 2));

                        console.log(data[0].faceAttributes.age);

                    })

                    .fail(function (jqXHR, textStatus, errorThrown) {
                        // Display error message.
                        var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
                        errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
                            jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
                        alert(errorString);
                    });
            };






        });
    });
};



// https://image.tmdb.org/t/p/w500/pQFoyx7rp09CJTAb932F2g8Nlho.jpg





//reset the form
function clear() {

    $("#stalker-name").html(" ");
    $("#star-name").html(" ");
    $("#star-fav-mov").html(" ");
    $("#stalk-value").html(" ");
};

// clear();
