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

$("#editLoginSubmit").on("click", function() {
    if(validate("EditLogin")) {
        if (!window.localStorage.getItem("token")) {
            window.location.replace("index.html")
        }
        else {
            txData = {
                type: "user",
                username: $("#usernameEditLogin").val(),
                oldPassword: $("#oldPasswordEditLogin").val(),
                newPassword: $("#newPasswordEditLogin").val()
            }
            $.ajax({
                url: '/edit/login',
                method: 'POST',
                headers: {'x-auth' : window.localStorage.getItem("token")},
                data: txData,
                dataType: 'json'
            })
            .done(function (data, textStatus, jqXHR) {
                localStorage.setItem("token", data.token) //Save token to local storage
                closeModal("EditLogin")
                alert("Login Credentials Updated")
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                alert("Invalid Credentials!")
            })
        }
    }
}) 

function closeModal(type) {
    let errors = document.querySelector('#formErrors' + type)
    let username = document.querySelector('#username' + type)
    let oldPassword = document.querySelector('#oldPassword' + type)
    let newPassword = document.querySelector('#newPassword' + type)
    username.value = ''
    oldPassword.value = ''
    newPassword.value = ''
    username.style.border = '1px solid #ccc'
    oldPassword.style.border = '1px solid #ccc'
    newPassword.style.border = '1px solid #ccc'
    errors.innerHTML = ''
}

//For new account validation
function validate(type) {
    let formValid = true;
    let re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    let errorString = '';
    let errors = document.querySelector('#formErrors' + type);
    let username = document.querySelector('#username' + type);
    let password = document.querySelector('#newPassword' + type);
    let usernameBorder = '1px solid #ccc';
    let passwordBorder = '1px solid #ccc';
  
    if (username.value == '') { //If username field is left blank
        formValid = false;
        errorString += 'Missing full name.\t';
        username.style.border = '2px solid red';
    }
    else {
        username.style.border = usernameBorder;
    }
    if (password.value.length < 10 || password.value.length > 20) { //If password is less than 10 chars or more than 20 chars
        formValid = false;
        errorString += 'Password must be between 10 and 20 characters.\t';
        password.style.border = '2px solid red';
    }
    if (password.value.toUpperCase() == password.value) { //If there are no lowercase letters
        formValid = false;
        errorString += 'Password must contain at least one lowercase character.\t';
        password.style.border = '2px solid red';
    }
    if (password.value.toLowerCase() == password.value) { //If there are no uppercase letters
        formValid = false;
        errorString += 'Password must contain at least one uppercase character.\t';
        password.style.border = '2px solid red';
    }
    re = /\d/;
    if (re.exec(password.value) == null) { //If password has no digits
        formValid = false;
        errorString += 'Password must contain at least one digit.\t';
        password.style.border = '2px solid red';
    }
    if (!formValid) { //If form has any errors
        let parse = errorString.split('\t');
        let container = document.createElement('ul');
        errors.innerHTML = '';
        let err = null
        errors.appendChild(container);
        for (i = 0; i < parse.length; i++) {
            if (parse[i] != '') {
                err = document.createElement('li');
                err.innerHTML = parse[i];
                container.appendChild(err)
            }
        }
        container.style.color = 'red';
        errors.style.display = 'block';
    }
    else {
        errors.style.display = 'none';
        password.style.border = passwordBorder;
    }
    return(formValid)
  }