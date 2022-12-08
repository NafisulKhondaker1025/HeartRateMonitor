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
        "type" : "physician",
        "profileFields" : JSON.stringify({
            "fullName" : $("#fullName").val(),
            "designation" : $("#designation").val(),
            "email" : $("#email").val(),
            "phone" : $("#phone").val(),
            "institution" : $("#institution").val(),
            "address" : $("#address").val()
        })
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

$("#editLoginSubmit").on("click", function() {
    if(validate("EditLogin")) {
        if (!window.localStorage.getItem("token")) {
            window.location.replace("index.html")
        }
        else {
            txData = {
                type: "physician",
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
                alert("Login Credentials updated!")
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