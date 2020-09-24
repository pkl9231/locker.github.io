$(document).ready(function () {
    $(".redFalgDelate").click(function () {
        var attId = $(this).attr('data-id');
        var type = "redFlag";
        var url = $(this).attr('data-url');
        var confirmation = confirm("Are you sure you want to delete?");
        if (confirmation == true) {
            // alert('deleted id =' + attId)
            location.href = "/delete/" + attId + "/" + type;
        }
    });

    $(".redFlagEdit").click(function () {
        var attId = $(this).attr('data-id');
        var url = $(this).attr('data-url');
        location.href = "/edit/" + attId;
    });

    $(".inveDelate").click(function () {
        var attId = $(this).attr('data-id');
        var type = "interverntion";
        var url = $(this).attr('data-url');
        var confirmation = confirm("Are you sure you want to delete?");
        if (confirmation == true) {
            // alert('deleted id =' + attId)
            location.href = "/delete/" + attId + "/" + type;
        }
    });

    $(".inveEdit").click(function () {
        var url = $(this).attr('data-url');
        location.href = "/edit/" + attId;
    });

    $("#addred-flag").submit(function () {
        $(this).find("").prop("disabled", true);
    });
    $("#addred-flag").validate({
        rules: {
            "title": {
                required: true
            },
            "department": {
                required: true
            },
            "description": {
                required: true
            },

        },
        messages: {
            "title": {
                required: "Please enter title name"
            },
            "department": {
                required: "Please select department"
            },
            "description": {
                required: "Please write description"
            },
        },
    });
    // invention add-inv
    $("#add-inv").submit(function () {
        $(this).find("").prop("disabled", true);
    });
    $("#add-inv").validate({
        rules: {
            "title": {
                required: true
            },
            "department": {
                required: true
            },
            "description": {
                required: true
            },

        },
        messages: {
            "title": {
                required: "Please enter title name"
            },
            "department": {
                required: "Please select department"
            },
            "description": {
                required: "Please write description"
            },
        },
    });
});