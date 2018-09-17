#!/usr/bin/env node

var program = require('commander');
var colors = require('colors/safe');
const RandExp = require('randexp');

program
    .version('1.0.0', '-v, --version')
    .option('-l, --length <length>', 'password length. Minimal length is 8 characters, default length is 14 characters. Cannot be less than uppercase + digits + special', 14)
    .option('-u, --uppercase <uppercase>', 'minimal number of uppercase characters. Default is 1. Cannot be greater than length – digits - special', 1)
    .option('-d, --digits <digits>', 'minimal number of digits Default is 1. Cannot be greater than length – uppercase - special', 1)
    .option('-s, --special <special>', 'minimal number of special characters. Default is 1. Cannot be greater than length – uppercase - digits', 1)
    .parse(process.argv);


/**
 * Validation
 * @param l - password length
 * @param u - uppercase characters
 * @param d - digits
 * @param s - special characters
 * @returns {Array}
 */
function lengthValidation(l, u, d, s) {
    let errors = [];

    if (l < (u + d + s)) {
        errors.push('-l, --length – Cannot be less than uppercase (' + program.uppercase + ') + digits (' + program.digits + ') + special (' + program.special + ')');
    }

    if (u > (l - d - s)) {
        errors.push('-u, --uppercase – Cannot be greater than length (' + program.uppercase + ') – digits (' + program.digits + ') + special (' + program.special + ')');
    }

    if (d > (l - u - s)) {
        errors.push('-d, --digits – Cannot be greater than length (' + program.digits + ') – uppercase (' + program.uppercase + ') - special (' + program.special + ')');
    }

    if (s > (l - u - d)) {
        errors.push('-s, --special – Cannot be greater than length (' + program.special + ') – uppercase (' + program.uppercase + ') - digits (' + program.digits + ')');
    }

    return errors;
}

/**
 *
 * @param number
 * @param string
 * @returns {boolean}
 */
function checkLength(number, string) {
    return (typeof number !== 'number' || number.toString().length !== string.length);
}

/**
 *
 * @param l length
 * @param u uppercase
 * @param d digits
 * @param s special
 * @returns {Array}
 */
function validation(l, u, d, s) {
    let errors = lengthValidation(l, u, d, s);

    if (l < 8 || checkLength(l, program.length)) {
        errors.push('Minimal password length is 8 characters');
    }

    if (u < 1 || checkLength(u, program.uppercase)) {
        errors.push('At least 1 upper-case character');
    }

    if (d < 1 || checkLength(d, program.digits)) {
        errors.push('At least 1 digit');
    }

    if (s < 1 || checkLength(s, program.special)) {
        errors.push('At least 1 special character');
    }

    return errors;
}

/**
 *
 * @param a
 * @returns {*}
 */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}


let length = parseInt(program.length);
let uppercase = parseInt(program.uppercase);
let digits = parseInt(program.digits);
let special = parseInt(program.special);

let errors = validation(length, uppercase, digits, special);

if (errors.length) {
    errors.forEach(function (value) {
        console.error(colors.red.inverse('ERROR:') + ' ' + colors.red.underline(value));
    });
    process.exit(1);
}

let array_password = [];


array_password.push(new RandExp('[a-z]{' + (length - uppercase - digits - special) + '}').gen());
array_password.push(new RandExp('[A-Z]{' + uppercase + '}').gen());
array_password.push(new RandExp('[0-9]{' + digits + '}').gen());
array_password.push(new RandExp('[(.,-&?$#@!*<>]{' + special + '}').gen());

const final_password = shuffle(array_password.join('').split('')).join('');

console.log(colors.green.inverse(final_password));