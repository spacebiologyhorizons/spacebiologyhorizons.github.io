jQuery(document).ready(function($) {
  "use strict";

  // Contact
  $('form.contactForm').submit(function(event) {
    event.preventDefault(); // Prevent default form submission
    var f = $(this).find('.form-group'),
        ferror = false,
        emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;

    // Validate inputs
    f.children('input').each(function() {
      var i = $(this); // Current input
      var rule = i.attr('data-rule');
      if (rule !== undefined) {
        var ierror = false; // Error flag for current input
        var pos = rule.indexOf(':', 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case 'required':
            if (i.val() === '') {
              ferror = ierror = true;
            }
            break;

          case 'minlen':
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;

          case 'email':
            if (!emailExp.test(i.val())) {
              ferror = ierror = true;
            }
            break;

          case 'checked':
            if (!i.is(':checked')) {
              ferror = ierror = true;
            }
            break;

          case 'regexp':
            exp = new RegExp(exp);
            if (!exp.test(i.val())) {
              ferror = ierror = true;
            }
            break;
        }
        i.next('.validation').html((ierror ? (i.attr('data-msg') !== undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }
    });

    f.children('textarea').each(function() {
      var i = $(this); // Current textarea
      var rule = i.attr('data-rule');
      if (rule !== undefined) {
        var ierror = false; // Error flag for current textarea
        var pos = rule.indexOf(':', 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case 'required':
            if (i.val() === '') {
              ferror = ierror = true;
            }
            break;

          case 'minlen':
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;
        }
        i.next('.validation').html((ierror ? (i.attr('data-msg') !== undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }
    });

    if (ferror) return false;

    // Serialize form data
    var formData = $(this).serializeArray();
    var data = {};
    formData.forEach(function(field) {
      data[field.name] = field.value;
    });

    // Google Sheets Web App URL
    var googleSheetUrl = "https://script.google.com/macros/s/AKfycbwyukER_5E-hhZy68q_8xVeovS7AA_3Cksr3vzUcm5v9wcq36fM2N4JCjSlmLWq46hx/exec";

    // Send data to Google Sheets
    $.ajax({
      type: "POST",
      url: googleSheetUrl,
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function(response) {
        if (response.status === "success") {
          $("#sendmessage").addClass("show");
          $("#errormessage").removeClass("show");
          $('.contactForm').find("input, textarea").val("");
        } else {
          $("#sendmessage").removeClass("show");
          $("#errormessage").addClass("show");
          $('#errormessage').html("Error submitting the form. Please try again.");
        }
      },
      error: function(error) {
        console.error("Error:", error);
        $("#sendmessage").removeClass("show");
        $("#errormessage").addClass("show");
        $('#errormessage').html("An error occurred. Please try again later.");
      }
    });
    return false;
  });
});
