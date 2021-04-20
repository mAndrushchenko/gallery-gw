import { TRegDataValidation } from "../types/validation"

export const isRegDataValid: TRegDataValidation = (email, password, firstName, lastName) => {
    return !!(email.length >= 4 &&
        email.length <= 320 &&
        email.match(/^[a-zA-Z]+[0-9]*([.\-_]?[0-9]*[a-zA-Z]+[0-9]*)*@([.\-_]?[0-9]*[a-zA-Z]+[0-9]*)+\.[a-zA-Z]+$/) &&
        password.length >= 6 &&
        password.match(/((?=.*[a-z])|(?=.*[а-я])).*((?=.*[A-Z])|(?=.*[А-Я])).*(?=.*\d).*/) &&
        firstName.length >= 2 &&
        firstName.match(/^([A-Z][a-z]+)$|^([А-ЯІЇҐЄ][а-яіґє]+)$/) &&
        lastName.length >= 2 &&
        lastName.match(/^([A-Z][a-z]+)$|^([А-ЯІЇҐЄ][а-яіґє]+)$/))
}