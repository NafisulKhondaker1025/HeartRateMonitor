//Function to load up initial html view
(function() {
    $("#bootstrapIcons").load("./images/icons.html");
    $("#display-view").load("./userProfile.html"); 
})();

$("#profile-btn").on("click", function() {
    $("#display-view").load("./userProfile.html");
    $("#profile-btn").addClass("active")
    $("#dashboard-btn").removeClass("active")
})

$("#dashboard-btn").on("click", function() {
    $("#display-view").load("./dashboardTest.html");
    $("#dashboard-btn").addClass("active")
    $("#profile-btn").removeClass("active")
})

$("#logout-btn").on("click", function() {
    localStorage.removeItem("token")
    window.location.replace("index.html")
})