$(function(){
  generateData("heartRate")
})

var daysBack = 0
var data_type = "heartRate"

function generateData(dataType) {
  var titleString = ""
  var units = ""
  if (dataType == "heartRate") {
    titleString = "Heart Rate"
    units = "BPM"
  }
  else if (dataType == "spo2") {
    titleString = "SPO2"
    units = "%"
  }

  if (!window.localStorage.getItem("token")) {
    window.location.replace("index.html")
  }
  else {
    txData = {
        type: dataType,
        daysBack: daysBack
    }
    $.ajax({
      url: '/user/dashboardData',
      method: 'GET',
      headers: {'x-auth' : window.localStorage.getItem("token")},
      data: txData,
      dataType: 'json'
    })
    .done(function (res, textStatus, jqXHR) {
      var ctxSc = document.getElementById('myChart')
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
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      window.location.replace("index.html")
    })
  }
}

$("#heartrate-btn").on("click", function() {
  data_type = "heartRate"
  generateData(data_type)
})
  
$("#spo2-btn").on("click", function() {
  data_type = "spo2"
  generateData(data_type)
})

$("#dayback-btn").on("click", function() {
  if (daysBack < 7) {
    daysBack++
  }
  generateData(data_type)
})

$("#dayforward-btn").on("click", function() {
  if (daysBack > 0) {
    daysBack--
  }
  generateData(data_type)
})