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
            if (data.physData) {
                console.log(data.physData)
                $("#phys-title").html("Your Physician")
                $("#phys-info").css("display", "flex") //figure out correct display format
                $("#phys-name").html(data.physData.name)
                $("#phys-email").html(data.physData.email)
                $("#phys-phone").html(data.physData.phone)
                $("#remove-phys-div").css("display", "block")
            }
            else {
                $("#phys-title").html("No Physician Selected")
                $("#phys-info").css("display", "none")
                $("#remove-phys-div").css("display", "none")
            }
            $("#fullName").attr("value", data.user.profileFields.fullName)
            $("#email").attr("value", data.user.profileFields.email)
            $("#phone").attr("value", data.user.profileFields.phone)
            $("#address").attr("value", data.user.profileFields.address)
            $("#deviceID").attr("value", data.user.deviceID)
            $("#apiKey").attr("value", data.user.apiKey)
            $("body").css("display", "block")
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          window.location.replace("index.html")
        })
    }
})()

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

$("#remove-phys-btn").on("click", function() {
    if (!window.localStorage.getItem("token")) {
        window.location.replace("index.html")
    }
    else {
        txData = {
            objID: "none"
        }
        $.ajax({
            url: '/physician/select',
            method: 'POST',
            headers: {'x-auth' : window.localStorage.getItem("token")},
            data: txData,
            dataType: 'json'
        })
        .done(function (data, textStatus, jqXHR) {
            alert("Physician Removed. You are no longer assigned to a physician")
            $("#phys-title").html("No Physician Selected")
            $("#phys-info").css("display", "none")
            $("#remove-phys-div").css("display", "none")
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            window.location.replace("index.html")
        })
    }
})