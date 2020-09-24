$(document).ready(function () {
    $("#myForm").submit(function () {
        $(this).find("").prop("disabled", true);
    });
    $("#myForm").validate({
        rules: {
            "first_name": {
                required: true
            },
            "last_name": {
                required: true
            },
            "email": {
                required: true
            },
            "password": {
                required: true
            },
            "confirm-password": {
                required: true
            },

        },
        messages: {
            "first_name": {
                required: "Please enter first name"
            },
            "last_name": {
                required: "Please enter last name"
            },
            "email": {
                required: "Please enter email address"
            },
            "password": {
                required: "Please enter password"
            },
            "confirm-password": {
                required: "Please enter confirm password"
            },
        },
    });
});