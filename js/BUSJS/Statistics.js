
function stats() {
  console.log("STATIS");

  $.ajax({
    method: "GET",
    url: SITE.location + "/stats/interact/user/store",
    data: {"user_id": USER.currentUser}
  }).done(function(response) {
    console.log(response);
    for (var i = 0; i < response.length; i++) {
      response[i].date = helper.convertTime(response[i].date);
    }
    console.log(response);

    var allStoreData = helper.generateAggregateStoreData(response);
    var allBeaconsData = helper.generateAggregateBeaconData(response);
    var allPromotionData = helper.generateAggregatePromotionData(response);

    var ctz = $("#overall")[0].getContext('2d');
    console.log(ctz);
    var myChart = new Chart(ctz, {
        type: 'bar',
        data: {
            labels: allStoreData.labels,
            datasets: [{
                label: '# Of Customers',
                data: allStoreData.data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });

    var bb = $("#byBeacons")[0].getContext('2d');
    var myChart = new Chart(bb, {
        type: 'bar',
        data: {
            labels: allBeaconsData.labels,
            datasets: [{
                label: '# Beacon Interactions',
                data: allBeaconsData.data,
                backgroundColor: [
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });

    var bP = $("#byPromotions")[0].getContext('2d');
    var myChart = new Chart(bP, {
        type: 'bar',
        data: {
            labels: allPromotionData.labels,
            datasets: [{
                label: '# Of People Who Interacted with Promotion',
                data: allPromotionData.data,
                backgroundColor: [
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
    helper.hideLoader();

  });
};
