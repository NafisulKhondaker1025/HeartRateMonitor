$(function(){
  generateData()
})

var daysBack = 0
var data_type = "heartRate"
var data_view = "daily"

function generateData() {
  var titleString = ""
  var units = ""
  if (data_type == "heartRate") {
    titleString = "Heart Rate"
    units = "BPM"
  }
  else if (data_type == "spo2") {
    titleString = "SPO2"
    units = "%"
  }

  if (!window.localStorage.getItem("token")) {
    window.location.replace("index.html")
  }
  else {
    if (!window.localStorage.getItem("userObjID")) {
      txData = {
        type: data_type,
        daysBack: daysBack,
        view: data_view
      }
    } 
    else {
      txData = {
        type: data_type,
        daysBack: daysBack,
        view: data_view,
        userID: window.localStorage.getItem("userObjID")
      }
    }
    $.ajax({
      url: '/user/dashboardData',
      method: 'GET',
      headers: {'x-auth' : window.localStorage.getItem("token")},
      data: txData,
      dataType: 'json'
    })
    .done(function (res, textStatus, jqXHR) {
      if (res.responseArray) {
        var ctxSc = document.getElementById('myChart')
        $("#myChart").html("")
        var scatterData = {
          datasets: [{
            borderColor: 'rgba(99,0,125, .2)',
            backgroundColor: 'rgba(99,0,125, .5)',
            label: titleString,
            data: res.responseArray
          }]
        }
        var config1 = new Chart.Scatter(ctxSc, {
          data: scatterData,
          options: {
            title: {
              display: true,
              text: titleString + " - " + res.date
            },
            elements: {
              point: {
                radius : function(context) {
                            var index = context.dataIndex;
                            var value = context.dataset.data[index];
                            if (value.y == res.min || value.y == res.max) { return 5 }
                            else { return 2 }
                        },
                display: true
              }
            },
            scales: {
              xAxes: [{
                type: 'linear',
                position: 'bottom',
                ticks: {
                  beginAtZero: true,
                  max: 24,
                  userCallback: function (tick) {
                    return tick.toString() + ':00';
                  },
                },
                scaleLabel: {
                  labelString: 'Time (h)',
                  display: true,
                },
              }],
              yAxes: [{
                type: 'linear',
                ticks: {
                  userCallback: function (tick) {
                    return tick.toString();
                  }
                },
                scaleLabel: {
                  labelString: titleString + " (" + units + ")",
                  display: true
                }
              }]
            }
          }
        });
      }
      else if (res.average) {
        $("#weekly-div h4").html(titleString + " Summary for the week of " + res.date_start + " to " + res.date_end)
        $("#max").html(res.max)
        $("#min").html(res.min)
        $("#avg").html(res.average)
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      window.location.replace("index.html")
    })
  }
}

$("#heartrate-btn").on("click", function() {
  data_type = "heartRate"
  generateData()
})
  
$("#spo2-btn").on("click", function() {
  data_type = "spo2"
  generateData()
})

$("#dayback-btn").on("click", function() {
  if (daysBack < 6) {
    daysBack++
  }
  if (daysBack == 6) {
    $("#dayback-btn").attr("disabled", true)
  }
  else {
    $("#dayforward-btn").attr("disabled", false)
  }
  generateData()
})

$("#dayforward-btn").on("click", function() {
  if (daysBack > 0) {
    daysBack--
  }
  if (daysBack == 0) {
    $("#dayforward-btn").attr("disabled", true)
  }
  else {
    $("#dayback-btn").attr("disabled", false)
  }
  generateData()
})

$("#data-view-btn").on("click", function() {
  if($("#data-view-btn").html() == "Show Daily View") {
    $("#data-view-btn").html("Show Weekly View")
    data_view = "daily"
    generateData()
    $("#weekly-div").css("display", "none")
    $("#daily-div").css("display", "block")
  }
  else {
    $("#data-view-btn").html("Show Daily View")
    data_view = "weekly"
    generateData()
    $("#daily-div").css("display", "none")
    $("#weekly-div").css("display", "block")
  }
})

$("#submit-times").on("click", function() {
  let time_start = $("#time-start").val()
  let time_end = $("#time-end").val()
  let time_interval = $("#time-interval").val()
  if (time_start != "" && time_end != "" && time_interval != "") {
    time_start = parseInt(time_start.slice(0, 2))
    time_end = parseInt(time_end.slice(0,2))
    time_interval = parseInt(time_interval.slice(0,2))
    if (time_end > time_start) {
      if (!window.localStorage.getItem("token")) {
        window.location.replace("index.html")
      }
      else {
        if (!window.localStorage.getItem("userObjID")) {
          txData = {
            timeStart: time_start,
            timeEnd: time_end,
            timeInterval: time_interval
          }
        }
        else {
          txData = {
            timeStart: time_start,
            timeEnd: time_end,
            timeInterval: time_interval,
            userID: window.localStorage.getItem("userObjID")
          }
        }
          
          $.ajax({
              url: '/time/set',
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
    else {
      alert("End time cannot be before start time")
    }
  }
  else {
    alert("Please specify all fields!")
  }
})