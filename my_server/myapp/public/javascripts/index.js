//For user login
$("#userLoginSubmit").on("click", function () {
  var xhr = new XMLHttpRequest()
  xhr.addEventListener("load", function () {
    if(xhr.status == 200) {
      alert("Success")
      localStorage.setItem("token", xhr.response.token) //Save token to local storage
      window.location.replace("user.html")
    }
  })

  xhr.responseType = "json"

  var serverLink = "http://localhost:3000"

  var data = { //Data object sent to server for login validation
    "type" : "user",
    "user" :  {
      "username" : $("#usernameUserLogin").val(),
      "password" : $("#passwordUserLogin").val()
    }
  }

  xhr.open("POST", serverLink + "/login");
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(JSON.stringify(data));
})

//For physician login
$("#physicianLoginSubmit").on("click", function () {
  var xhr = new XMLHttpRequest()
  xhr.addEventListener("load", function () {
    if(xhr.status == 200) {
      localStorage.setItem("token", xhr.response.token) //Save token to local storage
      window.location.replace("physician.html")
    }
  })

  xhr.responseType = "json"

  var serverLink = "http://localhost:3000"

  var data = { //Data object sent to server for login validation
    "type" : "physician",
    "physician" :  {
      "username" : $("#usernamePhysicianLogin").val(),
      "password" : $("#passwordPhysicianLogin").val()
    }
  }

  xhr.open("POST", serverLink + "/login");
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(JSON.stringify(data));
})

//For user account creation
$("#userCreateAccount").on("click", function () {
  if(validate("UserSignUp")) {
    var xhr = new XMLHttpRequest()
    xhr.addEventListener("load", function () {
      if(xhr.status == 200) {
        alert("Success")
        localStorage.setItem("token", xhr.response.token) //Save token to local storage
        window.location.replace("user.html")
      }
    })

    xhr.responseType = "json"

    var serverLink = "http://localhost:3000"

    var data = { //Data object sent to server for account creation
      "type" : "user",
      "user" :  {
        "username" : $("#usernameUserSignUp").val(),
        "password" : $("#passwordUserSignUp").val()
      }
    }

    xhr.open("POST", serverLink + "/signup");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(data));
  }
})

//For physician account creation
$("#physicianCreateAccount").on("click", function () {
  if(validate("PhysicianSignUp")) {
    var xhr = new XMLHttpRequest()
    xhr.addEventListener("load", function () {
      if(xhr.status == 200) {
        alert("Success")
        localStorage.setItem("token", xhr.response.token) //Save token to local storage
        window.location.replace("physician.html")
      }
    })

    xhr.responseType = "json"

    var serverLink = "http://localhost:3000"

    var data = { //Data object sent to server for account creation
      "type" : "physician",
      "physician" :  {
        "username" : $("#usernamePhysicianSignUp").val(),
        "password" : $("#passwordPhysicianSignUp").val()
      }
    }

    xhr.open("POST", serverLink + "/signup");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(data));
  }
})

//For new account validation
function validate(type) {
  let formValid = true;
  let re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
  let errorString = '';
  let errors = document.querySelector('#formErrors' + type);
  let username = document.querySelector('#username' + type);
  let password = document.querySelector('#password' + type);
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

function closeModal(type) {
    let errors = document.querySelector('#formErrors' + type)
    let username = document.querySelector('#username' + type)
    let password = document.querySelector('#password' + type)
    username.value = ''
    password.value = ''
    username.style.border = '1px solid #ccc'
    password.style.border = '1px solid #ccc'
    errors.innerHTML = ''
}

/*function openHomePage(type) {
  console.log('im here')
  if (type == 'physician') {
    var xhr = new XMLHttpRequest()

    xhr.responseType = "document"

    var serverLink = "http://localhost:3000"

    var data = {
      "type" : "physician",
      "token" : localStorage.getItem("token")
    }

    xhr.open("POST", serverLink + "/homePage");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(data));

    location.replace = serverLink + "/homePage"

  }

  else if (type == 'user') {

  }
}*/