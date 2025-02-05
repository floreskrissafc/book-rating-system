const db = require('./db');
const config = require('../config');
const bcrypt = require('bcrypt');
var emailValidator = require("email-validator");

function getAllUsers(page = 1) {
    const offset = (page - 1) * config.USER_LIST_PER_PAGE;
    const data = db.queryAll(`select * FROM users LIMIT ?,?`, [offset, config.USER_LIST_PER_PAGE])
    const meta = {page}
    return {
        data,
        meta
    }
}

function getUserByEmail(email) {
    return db.queryOne(`select * FROM users WHERE email = ?`, email)
}

/*Validate if req.body have fields reqiured for function
NOTE: this function doe not validate if all the NOT NULL fields are populated.
Since that is handled by DB.
*/
function validateNewUser(user) {
    console.log('user:\n', user);
    let messages = [];

    if (!user) {
        messages.push('No user is provided');
    }

    if (!user.email) {
        messages.push('email is empty');
    }

    if (!emailValidator.validate(user.email)) {
        messages.push(`invalid email format`);
    }

    if (!user.password) {
        messages.push('password is empty');
    }

    if (user.password.length < 5) {
        messages.push('password must have more that 5 characters');
    }

    user = getUserByEmail(user.email)
    if (user != undefined) {
        messages.push(`login or recover password.`);
    }

    if (messages.length) {
        let error = new Error(messages.join('\n'));
        error.statusCode = 400;
        throw error;
    }
}

function isUserAdmin(email) {
    admin_email = db.queryOne(`select * FROM admin_emails WHERE email = ?`, email);
    console.log('admin_email: ', admin_email, admin_email != undefined)
    is_admin = Number(admin_email != undefined)
    return is_admin
}

async function register(userBody) {
    validateNewUser(userBody)
    const { email, password, first_name, last_name, profile_picture } = userBody;
    role = isUserAdmin(email)
    let password_hash = await bcrypt.hash(password, config.BCRYPT_SALT);
    const result = db.run('INSERT INTO users (email, password_hash, role, first_name, last_name, profile_picture) VALUES (@email, @password_hash, @role, @first_name, @last_name, @profile_picture)', { email, password_hash, role, first_name, last_name, profile_picture });
    let message = 'Error in creating user';
    if (result.changes) {
      message = 'User created successfully';
    }
  
    return {message};
}

async function login(loginBody) {
    const { email, password } = loginBody;
    if (!email || !password) {
        let error = new Error("invalid email or password")
        error.statusCode = 400;
        throw error;
    }

    user = getUserByEmail(email);
    if (user == undefined) {
        let error = new Error("invalid email or password");
        error.statusCode = 400;
        throw error;
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordMatched) {
        let error = new Error("invalid email or password");
        error.statusCode = 400;
        throw error;
    }

    return {user};
}

async function resetPassword(resetBody) {
    const { email, oldPassword, newPassword } = resetBody;
    if (newPassword.length < 5) {
        let error = new Error("password must have more that 5 characters");
        error.statusCode = 400;
        throw error;
    }

    const { user } = await login({email, password: oldPassword})
    console.log('resetting password for user: ', user);
    
    let newPasswordhash = await bcrypt.hash(newPassword, config.BCRYPT_SALT);
    const results = db.run(`UPDATE users SET password_hash = (@newPasswordhash) WHERE email = (@email)`, {newPasswordhash, email})
    let message = 'Error in creating user';
    if (results.changes) {
      message = 'password reset successfully';
    }
    return {message};
}

module.exports = {
    getAllUsers,
    register,
    login,
    resetPassword,
}