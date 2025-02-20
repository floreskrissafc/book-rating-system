const db = require('./db');
const config = require('../config');
const bcrypt = require('bcrypt');
const Err = require('./customError');
const emailValidator = require("email-validator");

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

function getUserInfoByID(id) {
    return db.queryOne(`select first_name, last_name, role FROM users WHERE id = ?`, id);
}

/*Validate if req.body have fields reqiured for function
NOTE: this function doe not validate if all the NOT NULL fields are populated.
Since that is handled by DB.
*/
function validateNewUser(user) {
    console.log('user:\n', user);
    let messages = [];

    if (!user) {
        throw new Err('No user is provided', 400);
    }

    if (!user.email) {
        throw new Err('email is empty', 400);
    }

    if (!emailValidator.validate(user.email)) {
        throw new Err(`invalid email format`, 400);
    }

    if (!user.password) {
        throw new Err('password is empty', 400);
    }

    if (user.password.length < config.PASSWORD_MIN_LENGTH) {
       throw new Err(`Password must be with length greater than ${config.PASSWORD_MIN_LENGTH} characters`, 400);
    }

    user = getUserByEmail(user.email)
    if (user != undefined) {
        throw new Err(`login or reset password.`, 400);
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
        let error = new Error("no user in the system for the given email, create a new account");
        error.statusCode = 400;
        throw error;
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordMatched) {
        let error = new Error("wrong password");
        error.statusCode = 400;
        throw error;
    }

    return {user};
}

async function resetPassword(resetBody) {
    const { email, oldPassword, newPassword } = resetBody;
    if (newPassword == oldPassword) {
        let error = new Error(`Password must be not equal to previous password.`);
    }
        
    if (newPassword.length < config.PASSWORD_MIN_LENGTH) {
        let error = new Error(`Password must be with length greater than ${config.PASSWORD_MIN_LENGTH} characters`);
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

function deleteUser(userObj, currentUser) {
    const { email } = userObj;
    if (!emailValidator.validate(email)) {
        throw new Err(`Please write an institutional email of the accepted form`, 400);
    }
    user = getUserByEmail(email);
    if (!user) {
        throw new Err(`An user with email ${email} is not present in the system, please search for another email or Add a new user here`, 400);
    }
    
    if (currentUser.id == user.id) {
        throw new Err(`Can't delete currently active logged in user`, 400);
    }

    const id = user.id;
    const result = db.run('DELETE FROM users WHERE id = @id', {id});
    if (!result.changes) {
      throw new Err("Error deleting user", 400);
    }

    let message = `You have successfully removed ${email} from the system`;
    return { message };
}

module.exports = {
    getAllUsers,
    register,
    login,
    resetPassword,
    getUserByEmail,
    getUserInfoByID,
    deleteUser,
}