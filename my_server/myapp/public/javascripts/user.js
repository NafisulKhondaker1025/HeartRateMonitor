//Function to load up initial html view
(function() {
    $("#bootstrapIcons").load("./images/icons.html");
    $("#display-view").load("./userProfile.html"); 
})();

$("#profile-btn").on("click", function() {
    $("#display-view").load("./userProfile.html");
    $("#profile-btn").addClass("active")
    $("#dashboard-btn").removeClass("active")
    $("#select-physician-btn").removeClass("active")
})

$("#dashboard-btn").on("click", function() {
    $("#display-view").load("./dashboard.html");
    $("#dashboard-btn").addClass("active")
    $("#profile-btn").removeClass("active")
    $("#select-physician-btn").removeClass("active")
})

$("#select-physician-btn").on("click", function() {
    $("#select-physician-btn").addClass("active")
    $("#profile-btn").removeClass("active")
    $("#dashboard-btn").removeClass("active")
    $("#display-view").empty()
    
    if (!window.localStorage.getItem("token")) {
        window.location.replace("index.html")
    }
    else {
        txData = {
            type: "physician"
        }
        $.ajax({
            url: '/physician/all',
            method: 'GET',
            headers: {'x-auth' : window.localStorage.getItem("token")},
            data: txData,
            dataType: 'json'
        })
        .done(function (data, textStatus, jqXHR) {
            for (item of data) {
                $("#display-view").append(`
                    <div class="card" style="border-radius: 15px;">
                    <div class="card-body p-4">
                    <div class="d-flex text-black">
                        <div class="flex-grow-1 ms-3">
                        <div>  
                            <h5 class="mb-1">${ item.fullName }</h5>
                            <p class="mb-2 pb-1" style="color: #2b2a2a;">${ item.designation }</p>
                        </div>
                        <div class="d-flex justify-content-start rounded-3 p-2 mb-2"
                            style="background-color: #efefef;">
                            <div>
                            <p class="small text-muted mb-1">Institution</p>
                            <p class="mb-0" id="average">${ item.institution }</p>
                            </div>
                            <div class="px-3">
                            <p class="small text-muted mb-1">Email</p>
                            <p class="mb-0" id="minimum">${ item.email }</p>
                            </div>
                            <div>
                            <p class="small text-muted mb-1">Phone Number</p>
                            <p class="mb-0" id="maximum">${ item.phone }</p>
                            </div>
                        </div>
                        <div class="d-flex pt-1">
                            <button id="${ item.objID }" type="button" class="btn btn-outline-primary me-1 flex-grow-1" onclick="selectedPhysician(event)">Select Physician</button>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            `)}
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            window.location.replace("index.html")
        })
    }
})

function selectedPhysician(event) {
    let physObj = event.target.id
    if (!window.localStorage.getItem("token")) {
        window.location.replace("index.html")
    }
    else {
        txData = {
            objID: physObj
        }
        $.ajax({
            url: '/physician/select',
            method: 'POST',
            headers: {'x-auth' : window.localStorage.getItem("token")},
            data: txData,
            dataType: 'json'
        })
        .done(function (data, textStatus, jqXHR) {
            alert(JSON.stringify(data))
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            window.location.replace("index.html")
        })
    }
}

$("#logout-btn").on("click", function() {
    localStorage.removeItem("token")
    window.location.replace("index.html")
})