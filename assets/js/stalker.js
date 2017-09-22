 var audio = new Audio("assets/audio/EveryBreathYouTake.mp3")

     function bgMusicPlay() {
         audio.play();
         audio.loop = true;
     };

     bgMusicPlay();


     $("#sound-off").click(function () {

         audio.pause();

     });

     $("#sound-on").click(function () {

         bgMusicPlay();

     }); 

$(document).on('click', 'tr', function () {
     console.log($(this[0]))

     var first = ($(this).find('td:first').text());
     var last = ($(this).find('td:eq(1)').text());
     var queryURL = "https://api.themoviedb.org/3/search/person?api_key=b87c09787f893f3fa630db9c1eef2c6b&query=" + first + "+" + last;


    

     function DisplayStarInfo() {


         $.ajax({
             url: queryURL,
             method: "GET"
         }).done(function (res) {

             // Retrieving the URL for the image
             //var imgURL = "https://image.tmdb.org/t/p/w500"+res.results[0].known_for[0].poster_path;
             var imgURL = "https://image.tmdb.org/t/p/w500" + res.results[0].known_for[0].poster_path;
             var imgURL2 = "https://image.tmdb.org/t/p/w500" + res.results[0].known_for[1].poster_path;
             var imgURL3 = "https://image.tmdb.org/t/p/w500" + res.results[0].known_for[2].poster_path;

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

             $("#poster_image").empty();
            

             var image = $("<img>").attr("src", imgURL);
             $("#poster_image").append(image);
             var image2 = $("<img>").attr("src", imgURL2);
             $("#poster_image").append(image2);
             var image3 = $("<img>").attr("src", imgURL3);
             $("#poster_image").append(image3);


             // we take the starID return data and feed it into this new query to get
             // the bio info
             var actorQueryURL = "http://api.themoviedb.org/3/person/" + starID + "?api_key=b87c09787f893f3fa630db9c1eef2c6b";
             $.ajax({
                 url: actorQueryURL,
                 method: "GET"
             }).done(function (resBio) {
                 var starBirthDay = resBio.birthday;
                 var starBirthPlace = resBio.place_of_birth;
                 var starBio = resBio.biography;
                 var starWebPage = resBio.homepage;
                 var starPhotoURL = "https://image.tmdb.org/t/p/w500" + resBio.profile_path;

                 var starImage = $("<img>").attr("src", starPhotoURL);

                 $("#star_photo").html(starImage);
                 $("#star_name").html("<h2>Name : " + first + " " + last + "</h2><br>");
                 $("#star_birthday").html("Birthday : " + starBirthDay);
                 $("#star_birthplace").html("Hometown : " + starBirthPlace);
                 $("#star_webPage").html("Web Page :" + starWebPage + "<br>");

                 $("#star_bio").html("<h2> Bio Info : </h2><p>" + starBio + "</p>");




                 // NYT News API********************************************


                 var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
                 url += '?' + $.param({
                     'api-key': "565a7e37f7be44afa0b3d15d552a7e5c",
                     'q': first + " " + last
                 });
                 $.ajax({
                     url: url,
                     method: 'GET',
                 }).done(function (result) {
                     console.log(result.response.docs[0]);
                     var headline = result.response.docs[0].headline.main;
                     var byline = result.response.docs[0].snippet;
                     var headlineURL = result.response.docs[0].web_url;
                     $("#star_news").empty();
                     $("#star_news").html("<hr><h4>Lastest Headline : " + headline + "</h4>" + "<br>" + "<p>" + "'" + byline + "'" + "</p><hr>");

                     //$("#star_news").append(headlineURL);

                 }).fail(function (err) {
                     throw err;
                 });
                 // End of NYT API code***************************************






                 // ******* Facial Recognition/Emotion Function **************
                 //***********************************************************



                 var subscriptionKey = "7a8638a5843f46e3bf754e3bf1d13193";
                 var uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";

                 // Request parameters.
                 var params = {
                     "returnFaceId": "true",
                     "returnFaceLandmarks": "false",
                     "returnFaceAttributes": "age,gender,emotion",
                 };

                 // Display the image.
                 //var sourceImageUrl = document.getElementById("inputImage").value;
                 //document.querySelector("#sourceImage").src = sourceImageUrl;

                 var sourceImageUrl = starPhotoURL
                 console.log(starPhotoURL);


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

                         console.log(data[0]);
                         console.log(data[0].faceAttributes.emotion.anger);
                         console.log(data[0].faceAttributes.emotion.neutral);
                         console.log(data[0].faceAttributes.emotion.happiness);
                         var starHappiness = (data[0].faceAttributes.emotion.happiness) * 100 + "%";
                     
                         var starAnger = (data[0].faceAttributes.emotion.anger) * 100 + "%";
                         var starNeutral = (data[0].faceAttributes.emotion.neutral) * 100 + "%";

                         $("#responseTextArea").html("<h2>Image Emotional State Analysis</h2><br>");
                         $("#responseTextArea").append("<h3>Happines level: " + starHappiness + "</h3>  ");
                         $("#responseTextArea").append("<h3>Anger  level: " + starAnger + "</h3>  ");
                         $("#responseTextArea").append("<h3>Neutral level: " + starNeutral + "</h3>  ");



                     })

                     .fail(function (jqXHR, textStatus, errorThrown) {
                         // Display error message.
                         var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
                         errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
                             jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
                         alert(errorString);
                     });



             });

         });
     };


     //if (confirm("Wanna stalk " + first + " " + last + "?")){
     $("html, body").animate({
         scrollTop: 0
     }, "slow");
     //window.scrollTo(0, 0);        
     DisplayStarInfo();
     // } else{
     //alert("ok");
     //  }

 });



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




     //event.preventDefault();


     displayStarInfo();

     var stalkerName = $("#stalker-name").val().trim();
     var starFirstName = $("#star-first-name").val().trim();
     var starLastName = $("#star-last-name").val().trim();
     //var starFavMov = $("#star-fav-mov").val().trim();
     //var stalkVal = $("#stalk-value").val().trim();

     //alert(starFirstName);
     /*
          myData.ref("/Stars/").push({
              yName: stalkerName,
              sfName: starFirstName,
              slName: starLastName,
              Movie: starFavMov,
              sValue: stalkVal
     */
     //});
 });



 //myData.ref("/Stars").on("child_added", function (snap) {

 // var record = snap.val();



 // push updates back to client page
 //$("#star-table").append("<tr><td>" + record.yName + "</td><td>" + record.sfName + "</td><td>" + record.slName + "</td><td>" + record.Movie + "</td><td>" + record.sValue + "</td></tr>)");

 //    $('tr').click( function(){
 //    console.log(this)
 //})



 //});
 // This code section is for The Movie Datbase API to pull info by Actor Name instead of movie title

 function displayStarInfo() {
     var starFirstName = $("#star-first-name").val().trim();
     var starLastName = $("#star-last-name").val().trim();
     var queryURL = "https://api.themoviedb.org/3/search/person?api_key=b87c09787f893f3fa630db9c1eef2c6b&query=" + starFirstName + "+" + starLastName;

     $.ajax({
         url: queryURL,
         method: "GET"
     }).done(function (res) {
         
         console.log(res);
         var starKnownFor = res.results[0].known_for[0].title;

         myData.ref("/Stars/").push({

             sfName: starFirstName,
             slName: starLastName,
             savedQueryURL: starKnownFor


         });





         // Retrieving the URL for the image
         //var imgURL = "https://image.tmdb.org/t/p/w500"+res.results[0].known_for[0].poster_path;
         var imgURL = "https://image.tmdb.org/t/p/w500" + res.results[0].known_for[0].poster_path;
         var imgURL2 = "https://image.tmdb.org/t/p/w500" + res.results[0].known_for[1].poster_path;
         var imgURL3 = "https://image.tmdb.org/t/p/w500" + res.results[0].known_for[2].poster_path;

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

         $("#poster_image").empty();

         var image = $("<img>").attr("src", imgURL);
         $("#poster_image").append(image);
         var image2 = $("<img>").attr("src", imgURL2);
         $("#poster_image").append(image2);
         var image3 = $("<img>").attr("src", imgURL3);
         $("#poster_image").append(image3);



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

             $("#star_photo").html(starImage);
             $("#star_name").html("<h2>Name : " + starFirstName + " " + starLastName + "</h2><br>");
             $("#star_birthday").html("Birthday : " + starBirthDay);
             $("#star_birthplace").html("Hometown : " + starBirthPlace);
             $("#star_webPage").html("Web Page : " + starWebPage);
             $("#star_bio").html("<h2>Biography : </h2><p>" + starBio + "</p>");
             //**********************************************************

             // NYT News API********************************************


             var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
             url += '?' + $.param({
                 'api-key': "565a7e37f7be44afa0b3d15d552a7e5c",
                 'q': starFirstName + " " + starLastName
             });
             $.ajax({
                 url: url,
                 method: 'GET',
             }).done(function (result) {
                 console.log(result.response.docs[0]);
                 var headline = result.response.docs[0].headline.main;
                 var byline = result.response.docs[0].snippet;
                 var headlineURL = result.response.docs[0].web_url;
                 $("#star_news").empty();
                 $("#star_news").html("<h4>Lastest Headline : " + headline + "</h4>" + "<br>");
                 $("#star_news").append(byline);

             }).fail(function (err) {
                 throw err;
             });
             // End of NYT API code***************************************


             // ******* Facial Recognition/Emotion Function **************
             //***********************************************************



             var subscriptionKey = "7a8638a5843f46e3bf754e3bf1d13193";
             var uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";

             // Request parameters.
             var params = {
                 "returnFaceId": "true",
                 "returnFaceLandmarks": "false",
                 "returnFaceAttributes": "age,gender,emotion",
             };

             // Display the image.
             //var sourceImageUrl = document.getElementById("inputImage").value;
             //document.querySelector("#sourceImage").src = sourceImageUrl;

             var sourceImageUrl = starPhotoURL
             console.log(starPhotoURL);

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

                     console.log(data[0]);
                     console.log(data[0].faceAttributes.emotion.anger);
                     console.log(data[0].faceAttributes.emotion.neutral);
                     console.log(data[0].faceAttributes.emotion.happiness);
                     var starHappiness = (data[0].faceAttributes.emotion.happiness) * 100 + "%";
                    
                     var starAnger = (data[0].faceAttributes.emotion.anger) * 100 + "%";
                     var starNeutral = (data[0].faceAttributes.emotion.neutral) * 100 + "%";

                     $("#responseTextArea").html("<h2>Photo Analysis</h2><br>");
                     $("#responseTextArea").append("<h3>Happines level: " + starHappiness + "</h3>  ");
                     $("#responseTextArea").append("<h3>Anger  level: " + starAnger + "</h3>  ");
                     $("#responseTextArea").append("<h3>Neutral level: " + starNeutral + "</h3>");



                 })

                 .fail(function (jqXHR, textStatus, errorThrown) {
                     // Display error message.
                     var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
                     errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
                         jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
                     alert(errorString);
                 });
         });


     });


 };


 myData.ref("/Stars").on("child_added", function (snap) {

     var record = snap.val();
     $("#star-table > tbody").html("");
     $("form").trigger("reset");

     $("#star-table").append("<tr><td>" + record.sfName + "</td><td>" + record.slName + "</td><td>" + record.savedQueryURL + "</td></tr>)");

     //console.log(res);
 });
