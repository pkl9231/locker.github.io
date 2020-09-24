const form = require('express-form'),
    field = form.field;

module.exports = {
    checkSignIn:
        form(
            field('username', 'username / email')
                .trim()
                .required(),
            field("password")
                .trim()
                .required()
        ),
    checkSignUp:
        form(
            field('first_name')
                .trim()
                .is(/^[a-zA-Z0-9 "!?.-]+$/)
                .required(),
            field('last_name')
                .trim()
                .is(/^[a-zA-Z0-9 "!?.-]+$/)
                .required(),
            field('email')
                .trim()
                .isEmail()
                .required(),
            field('phoneNumber')
                .trim()
                .is(/^[0-9]+$/)
                .minLength(8)
                .maxLength(15),
            field("password")
                .trim()
                .required()
        ),
    checkAddRedFlags:
        form(
            field("title")
                .trim()
                .is(/^[a-zA-Z0-9 "!?.-]+$/)
                .required(),
            field("description", "description / comment")
                .trim()
                .required(),
            field("department")
                .trim()
                .is(/^[0-9]+$/)
                .required()
        ),
    checkAddIntervention:
        form(
            field("title")
                .trim()
                .is(/^[a-zA-Z0-9 "!?.-]+$/)
                .required(),
            field("description", "description / comment")
                .trim()
                .required(),
            field("department")
                .trim()
                .is(/^[0-9]+$/)
                .required()
        ),
    deleteInquiry:
        form(
            field("id")
                .trim()
                .is(/^[0-9]+$/)
                .required()
        ),
    checkUpdateRedFlags:
        form(
            field("title")
                .trim()
                .is(/^[a-zA-Z0-9 "!?.-]+$/)
                .required(),
            field("description", "description / comment")
                .trim()
                .required(),
            field("department")
                .trim()
                .is(/^[0-9]+$/)
                .required(),
            field("id")
                .trim()
                .is(/^[0-9]+$/)
                .required()
        ), checkUpdateIntervention:
        form(
            field("title")
                .trim()
                .is(/^[a-zA-Z0-9 "!?.-]+$/)
                .required(),
            field("description", "description / comment")
                .trim()
                .required(),
            field("department")
                .trim()
                .is(/^[0-9]+$/)
                .required(),
            field("id")
                .trim()
                .is(/^[0-9]+$/)
                .required()
        )
}