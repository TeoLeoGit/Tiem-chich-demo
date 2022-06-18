//Toggle sidebar js 
$(document).ready(function () {

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

});

function onChange() {
    const password = document.querySelector('input[name=password]');
    const confirm = document.querySelector('input[name=confirm]');
    if (confirm.value === password.value) {
      confirm.setCustomValidity('');
    } else {
      confirm.setCustomValidity('Passwords do not match');
    }
  }
//char js
const ctx = document.getElementById('topSales').getContext('2d');
const products = document.getElementById("products").value.split(', ').filter(item => item);
const datas = document.getElementById("datas").value.split(', ').filter(item => item);
console.log(datas)
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: products,
        datasets: [{
            label: 'Number of orders',
            data: datas,
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(241, 206, 86, 1)',
                'rgba(79, 192, 192, 1)',
                'rgba(184, 112, 255, 1)',
                'rgba(222, 154, 64, 1)',
            ],
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

const ctx2 = document.getElementById('monthlyIncome').getContext('2d');
const incomes = document.getElementById("incomes").value.split(', ').filter(item => item);
const myChart2 = new Chart(ctx2, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'August', 'Sep', 'Oct','Nov', 'Dec'],
        datasets: [{
            label: 'Income',
            data: incomes,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
