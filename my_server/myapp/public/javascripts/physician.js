(function(){
    $("#bootstrapIcons").load("./images/icons.html")
    $("#display-view").load("./physicianProfile.html") 
})();

$("#profile-btn").on("click", function() {
    $("#display-view").load("./physicianProfile.html")
    $("#profile-btn").addClass("active")
    $("#patient-btn").removeClass("active")
})

$("#patient-btn").on("click", function() {
    $("#patient-btn").addClass("active")
    $("#profile-btn").removeClass("active")
    $("#display-view").html("")
    if (!window.localStorage.getItem("token")) {
      window.location.replace("index.html")
    }
    else {
        txData = {
            type: "user"
        }
        $.ajax({
            url: '/user/all',
            method: 'GET',
            headers: {'x-auth' : window.localStorage.getItem("token")},
            data: txData,
            dataType: 'json'
        })
        .done(function (data, textStatus, jqXHR) {
            console.log(data)
            if (data.length == 0) {
                $("#display-view").append(`<h1>You have no Patients assigned to you at the moment</h1>`)
            }
            else {
              for (item of data) {
                $("#display-view").append(`
                  <div class="card" style="border-radius: 15px;">
                    <div class="card-body p-4">
                      <div class="d-flex text-black">
                        <div class="flex-grow-1 ms-3">
                        <div>  
                            <h5 class="mb-1">${ item.fullName }</h5>
                        </div>
                        <div class="d-flex justify-content-start rounded-3 p-2 mb-2"
                            style="background-color: #efefef;">
                            <div class="px-3">
                              <p class="small text-muted mb-1">Email</p>
                              <p class="mb-0" id="minimum">${ item.email }</p>
                            </div>
                            <div>
                              <p class="small text-muted mb-1">Minimum Weekly Heart Rate</p>
                              <p class="mb-0" id="maximum">${ item.min }</p>
                            </div>
                            <div>
                              <p class="small text-muted mb-1">Maximum Weekly Heart Rate</p>
                              <p class="mb-0" id="maximum">${ item.max }</p>
                            </div>
                            <div>
                              <p class="small text-muted mb-1">Average Weekly Heart Rate</p>
                              <p class="mb-0" id="maximum">${ item.avg }</p>
                            </div>
                        </div>
                        <div class="d-flex pt-1">
                            <button id="${ item.objID }" type="button" class="btn btn-outline-primary me-1 flex-grow-1" onclick="selectedPatient(event)">View User Data</button>
                        </div>
                      </div>
                      </div>
                    </div>
                  </div>
            `)}
          }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            window.location.replace("index.html")
        })
    }
})

function selectedPatient(event) {
  let userObj = event.target.id
  if (!window.localStorage.getItem("token")) {
      window.location.replace("index.html")
  }
  else {
      window.localStorage.setItem("userObjID", userObj)
      $("#display-view").load("./dashboard.html")
  }
}

$("#logout-btn").on("click", function() {
    localStorage.removeItem("token")
    window.location.replace("index.html")
})

$("#logout-btn").on("click", function() {
    localStorage.removeItem("token")
    window.location.replace("index.html")
    localStorage.removeItem("userObjID")
})