import * as db from './db.js';
import config from '../config.js';
import bcrypt from 'bcrypt';
import Err from './customError.js';
import emailValidator from "email-validator";
import logger from '../services/logging.js';
import fs from 'fs/promises';
import path from 'path';

function getAllUsers(page = 1) {
    const offset = (page - 1) * config.USER_LIST_PER_PAGE;
    const data = db.queryAll(`select * FROM users LIMIT ?,?`, [offset, config.USER_LIST_PER_PAGE]);
    const meta = {page};
    return {
        data,
        meta
    };
}

function getUserByEmail(email) {
    return db.queryOne(`select * FROM users WHERE email = ?`, email);
}

function getUserInfoByID(id) {
    return db.queryOne(`select * FROM users WHERE id = ?`, id);
}

/*Validate if req.body have fields reqiured for function
NOTE: this function doe not validate if all the NOT NULL fields are populated.
Since that is handled by DB.
*/
function validateNewUser(user) {
    logger.info(`user: ${user}`);

    if (!user) {
        throw new Err('No user is provided', 400);
    }

    if (!user.email) {
        throw new Err('email is empty', 400);
    }

    if (!emailValidator.validate(user.email)) {
        throw new Err(`invalid email format`, 400);
    }

    const emailDomain = user.email.substring(user.email.lastIndexOf('@') + 1);
    logger.info(`emailDomain: ${emailDomain}`);
    if (!config.VALID_EMAIL_DOMAINS.includes(emailDomain)) {
        throw new Err("Only @london.ac.uk or @student.london.ac.uk emails are allowed", 401);
    }


    if (!user.password) {
        throw new Err('password is empty', 400);
    }

    if (user.password.length < config.PASSWORD_MIN_LENGTH) {
       throw new Err(`Password must be with length greater than ${config.PASSWORD_MIN_LENGTH} characters`, 400);
    }

    user = getUserByEmail(user.email);
    if (user != undefined) {
        throw new Err(`login or reset password.`, 400);
    }
}

function isUserAdmin(email) {
    const admin_email = db.queryOne(`select * FROM admin_emails WHERE email = ?`, email);
    logger.info(`admin_email: ${admin_email}, ${admin_email != undefined}`);
    const is_admin = Number(admin_email != undefined);
    return is_admin;
}

async function register(userBody) {
    validateNewUser(userBody);
    let { email, password, first_name, last_name, profile_picture } = userBody;
    if (!profile_picture || length(profile_picture) <= 0) {
        profile_picture = config.DEFAULT_PROFILE_PICTURE;
    }
    let role = isUserAdmin(email);
    let password_hash = await bcrypt.hash(password, config.BCRYPT_SALT);
    const result = db.run('INSERT INTO users (email, password_hash, role, first_name, last_name, profile_picture) VALUES (@email, @password_hash, @role, @first_name, @last_name, @profile_picture)', { email, password_hash, role, first_name, last_name, profile_picture });
    let message = 'Error in creating user';
    if (result.changes) {
      message = 'User created successfully';
    }
  
    return {message};
}

async function updateUserField(id, name, value) {
    if (!id) {
        throw new Err(`Invalid user Id ${id}`, 500);
    }
    if (!name) {
        throw new Err(`Invalid name ${name}`, 500);
    }
    if (!value) {
        throw new Err(`Invalid value ${value}`, 500);
    }
    const result = db.run(`UPDATE users SET ${name}=@value WHERE id=@id`, {value, id});
    if (!result.changes) {
     throw new Err(`Error updating user ${name}: ${value}`, 500);
    }
    return `updated ${name}: ${value}`;
}

async function update(userBody) {
    let { email, first_name, last_name, profile_picture } = userBody;
    let user = getUserByEmail(email);
    if (user == undefined) {
        return new Err(`no user in the system for the given email: ${email}`, 404);
    }
    let id = user.id;

    let updates = [];
    
    if (first_name) {
        updates.push(await updateUserField(id, 'first_name', first_name));
    }

    if (last_name) {
        updates.push(await updateUserField(id, 'last_name', last_name));
    }

    if (profile_picture) {
        if (user.profile_picture != config.DEFAULT_PROFILE_PICTURE && user.profile_picture != profile_picture) {
            try {
                await fs.unlink(path.resolve(user.profile_picture));
            } catch (error) {
                logger.error(`deleting previous file at :${user.profile_picture} failed with error: ${error.message}`);
            }
        }
        updates.push(await updateUserField(id, 'profile_picture', profile_picture));
    }

    logger.info(`${updates.join(', ')}`);
    return getUserByEmail(email);
}

async function login(loginBody) {
    const { email, password } = loginBody;
    if (!email || !password) {
        throw new Err("invalid email or password", 401);
    }

    let user = getUserByEmail(email);
    if (user == undefined) {
        let error = new Error("User does not exist.");
        error.statusCode = 400;
        throw error;
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordMatched) {
        throw new Err("wrong password", 401);
    }

    return {user};
}

async function resetPassword(resetBody) {
    const { email, oldPassword, newPassword } = resetBody;
    if (newPassword == oldPassword) {
        throw new Err(`Password must be not equal to previous password.`, 401);
    }
        
    if (newPassword.length < config.PASSWORD_MIN_LENGTH) {
        throw new Err(`Password must be with length greater than ${config.PASSWORD_MIN_LENGTH} characters`, 404);
    }

    const { user } = await login({email, password: oldPassword});
    logger.info(`resetting password for user: ${user}`);
    
    let newPasswordhash = await bcrypt.hash(newPassword, config.BCRYPT_SALT);
    const results = db.run(`UPDATE users SET password_hash = (@newPasswordhash) WHERE email = (@email)`, {newPasswordhash, email});
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
    let user = getUserByEmail(email);
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

export {
    getAllUsers,
    register,
    login,
    resetPassword,
    getUserByEmail,
    getUserInfoByID,
    deleteUser,
    update,
};