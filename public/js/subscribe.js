// (function() {
    $("#mc-embedded-subscribe-form").submit(function(e) {
        e.preventDefault();
        var $this = $(this);

        var isEmailValid = document.getElementById("mce-EMAIL").checkValidity();

        if (!isEmailValid) {
            displayError("Please enter a valid email address.")
            return;
        }

        var email = $("#mce-EMAIL").val();
        var type = getType();
        var data = "EMAIL=" + email + (type !== null ? "&TYPE=" + type : "") + "&b_df5bf00e508fb18b37ecd5a17_c510124f13=";

        $.getJSON(
            "https://quoralis.us17.list-manage.com/subscribe/post-json?u=cf5f59f8c820258fb30bdf359&amp;id=7b99786b1e&c=?", 
            data, 
            function(response) {
                if (response.result === "success") {
                    displaySuccess("Thank you for subscribing, we'll be in touch soon!");
                } else {
                    displayError("Oops! Something went wrong, please try again.");
                }
            });

        return false;
    });

    function displaySuccess(message) {
        var errorContainer = $("#mce-error-response");
        var successContainer = $("#mce-success-response");
        var formContainer = $("#mc-embedded-subscribe-form");
        errorContainer.hide(); 
        formContainer.hide()
        successContainer.show(); 
        successContainer.text(message);
    }

    function displayError(message) {
        var errorContainer = $("#mce-error-response");
        var successContainer = $("#mce-success-response");
        successContainer.hide(); 
        errorContainer.show(); 
        errorContainer.text(message);
    }

    function getType() {
        var options = $("#mce-TYPE").find("input").length;
        for (var i = 0; i < options; ++i) {
            var option = $("#mce-TYPE-" + i);
            var isChecked = option.prop("checked");
            if (isChecked) {
                return option.val();
            }
        }
        return null;
    }
// }());