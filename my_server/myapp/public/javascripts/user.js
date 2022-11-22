(function() {
    if (!window.localStorage.getItem("token")) {
      window.location.replace("index.html")
    }
    else {
        txData = {
            type: "user"
        }
        $.ajax({
          url: '/user/data',
          method: 'GET',
          headers: {'x-auth' : window.localStorage.getItem("token")},
          data: txData,
          dataType: 'json'
        })
        .done(function (data, textStatus, jqXHR) {
          $("#fullName").attr("value", data.profileFields.fullName)
          $("#email").attr("value", data.profileFields.email)
          $("#phone").attr("value", data.profileFields.phone)
          $("#address").attr("value", data.profileFields.address)
          $("#deviceID").attr("value", data.deviceID)
          $("#apiKey").attr("value", data.apiKey)
          $("body").css("display", "block")
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          window.location.replace("index.html")
        })
    }
})()
$(function(){
    $("#bootstrapIcons").load("./images/icons.html"); 
});

$("#editProfileInfo").on("click", function() {
    $("#editProfileInfo").css("display", "none")
    $("#saveProfileInfo").css("display", "inline-grid")
    $(".col-sm-9 :input").each(function(){
        if ($(this).attr('id') != 'deviceID') {
            $(this).attr('readonly', false)
        }
    })
}),

$("#saveProfileInfo").on("click", function() {
    $("#saveProfileInfo").css("display", "none")
    $("#editProfileInfo").css("display", "inline-grid")
    $(".col-sm-9 :input").each(function(){
        if ($(this).attr('id') != 'deviceID') {
            $(this).attr('readonly', true)
        }
    })    
    txData = {
        "type" : "user",
        "profileFields" : JSON.stringify({
            "fullName" : $("#fullName").val(),
            "email" : $("#email").val(),
            "phone" : $("#phone").val(),
            "address" : $("#address").val(),
        }) 
    }
    $.ajax({
        url: '/user/edit',
        method: 'POST',
        headers: {'x-auth' : window.localStorage.getItem("token")},
        data: txData,
        dataType: 'json'
    })
    .done(function (data, textStatus, jqXHR) {
        alert("saved profile info")
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        alert(errorThrown)
    })
})

$("#editDeviceID").on("click", function() {
    $("#editDeviceID").css("display", "none")
    $("#saveDeviceID").css("display", "block")
    $(".col-sm-9 :input").each(function(){
        if ($(this).attr('id') == 'deviceID') {
            $(this).attr('readonly', false)
        }
    })
})

$("#saveDeviceID").on("click", function() {
    $("#saveDeviceID").css("display", "none")
    $("#editDeviceID").css("display", "block")
    $(".col-sm-9 :input").each(function(){
        if ($(this).attr('id') == 'deviceID') {
            $(this).attr('readonly', true)
        }
    })
    txData = {
        "deviceID" : $("#deviceID").val()
    }
    $.ajax({
        url: '/user/deviceID',
        method: 'POST',
        headers: {'x-auth' : window.localStorage.getItem("token")},
        data: txData,
        dataType: 'json'
    })
    .done(function (data, textStatus, jqXHR) {
        alert("saved device ID")
        $("#apiKey").attr("value", data.apiKey)
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        alert(errorThrown)
    }) 
})

$("#logout-btn").on("click", function() {
    localStorage.removeItem("token")
    window.location.replace("index.html")
})