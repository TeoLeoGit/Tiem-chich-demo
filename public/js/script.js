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
    var vaccineNameHtml = '<li>' + vaccineName + '</li>';
    
    $('#orderFormItems1').append($(vaccineInputHtml));
    $('#orderFormItems1').append($(vaccineNameHtml));
    document.getElementById(vaccineName).style.display = 'none'; 

    $('#orderFormItems2').append($(vaccineNameHtml));
    $('#orderFormItems2').append($(vaccineInputHtml));
    document.getElementById(vaccineName).style.display = 'none'; 
    
    $('#signupFormItems').append($(vaccineNameHtml));
    $('#signupFormItems').append($(vaccineInputHtml));
    document.getElementById(vaccineName).style.display = 'none'; 
}

function appendQuestionIdToModal(id) {
  var questionInputHtml = '<input type="hidden" class="form-control" value="' + id + 
  '" name="_id" id="temporaryInput">'
  $('#answerForm').append($(questionInputHtml));
}

function removeOldInput() {
  document.getElementById("temporaryInput").remove();
}

