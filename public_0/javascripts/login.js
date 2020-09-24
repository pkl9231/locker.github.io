$(document).ready(function () {
    $("#request-approval").submit(function () {
        $(this).find("").prop("disabled", true);
    });
    $("#request-approval").validate({
        rules: {
            "username": {
                required: true
            },
            "password": {
                required: true
            },

        },
        messages: {
            "username": {
                required: "Please enter email / username"
            },
            "password": {
                required: "Please enter password"
            },
        },
    });
});