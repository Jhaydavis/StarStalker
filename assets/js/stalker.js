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
    var queryURL = "https://api.themoviedb.org/3/search/person?api_key=b87c09787f893f3fa630db9c1eef2c6b&query=" +starFirstName+starLastName;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function (results) {

        console.log(results);

    });
};









//reset the form
function clear() {

    $("#stalker-name").html(" ");
    $("#star-name").html(" ");
    $("#star-fav-mov").html(" ");
    $("#stalk-value").html(" ");
};

// clear();
