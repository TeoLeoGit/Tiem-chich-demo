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

function appendVaccine(buttonValue, vaccineName) {
    var vaccineInputHtml = '<input type="hidden" class="form-control" id="vaccines" value="' + buttonValue + 
    '" name="vaccines">'
    $('#orderFormItems').append($(vaccineInputHtml));
    var vaccineNameHtml = '<li>' + vaccineName + '</li>'
    $('#orderFormItems').append($(vaccineNameHtml));
    document.getElementById(vaccineName).style.display = 'none'; 
}


