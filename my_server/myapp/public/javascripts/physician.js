(function() {
    if (!window.localStorage.getItem("token")) {
      window.location.replace("index.html")
    }
    else {
        txData = {
            type: "physician"
        }
        $.ajax({
          url: '/physician/data',
          method: 'GET',
          headers: {'x-auth' : window.localStorage.getItem("token")},
          data: txData,
          dataType: 'json'
        })
        .done(function (data, textStatus, jqXHR) {
          $("#fullName").attr("value", data.profileFields.fullName)
          $("#designation").attr("value", data.profileFields.designation)
          $("#email").attr("value", data.profileFields.email)
          $("#phone").attr("value", data.profileFields.phone)
          $("#institution").attr("value", data.profileFields.institution)
          $("#address").attr("value", data.profileFields.address)
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
        $(this).attr('readonly', false)
    })
}),

$("#saveProfileInfo").on("click", function() {
    $("#saveProfileInfo").css("display", "none")
    $("#editProfileInfo").css("display", "inline-grid")
    $(".col-sm-9 :input").each(function(){
        $(this).attr('readonly', true)
    })    
    txData = {
        fullName: $("#fullName").val(),
        designation: $("#designation").val(),
        email: $("#email").val(),
        phone: $("#phone").val(),
        institution: $("#institution").val(),
        address: $("#address").val()
    }
    $.ajax({
        url: '/physician/edit',
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