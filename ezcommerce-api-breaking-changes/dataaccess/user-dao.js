const { person, user, sequelize } = require('../models');
const log = require('../utils/log.js');

const createUser = async (name, paternalSurname, maternalSurname, birthdate, email, phone, username, password, OTP, roleId) => {
    const transaction = await sequelize.transaction();

    try {
        let newPerson = await person.findOne({ where: { email: email } });
        if (!newPerson) {
            newPerson = await person.create({
                name,
                paternalSurname,
                maternalSurname,
                birthdate,
                email,
                phone
            }, { transaction: transaction });
        }

        let newUser = await user.create({
            username,
            password,
            otp: OTP,
            active: 0,
            roleId,
            personId: newPerson.id
        }, { transaction: transaction });

        await transaction.commit();
    
        return newUser;
    }
    catch(error) {
        await transaction.rollback();
        log.debug(`Failed to create user: ${error.message}`);
        throw new Error(error.message);
    }
}

const getUsers = async () => {
    try {
        // get person and user data
        let users = await user.findAll({
            include: {
                model: person
            }
        });

        //remove password and otp from user data
        users = users.map(user => {
            let userData = {}
            userData.username = user.username;
            userData.active = user.active;
            userData.role = user.roleId;
            userData.name = user.person.name;
            userData.paternalSurname = user.person.paternalSurname;
            userData.maternalSurname = user.person.maternalSurname;
            userData.birthdate = user.person.birthdate;
            userData.email = user.person.email;
            userData.phone = user.person.phone;
            return userData;
        });

        return users;
    }
    catch(error) {
        log.debug(`Failed to get users: ${error.message}`);
        throw new Error(error.message);
    }
};

const getUserByUsername = async (username) => {
    try {
        let targetUser = await user.findOne({
            where: {
                username
            }
        });
    
        return targetUser;
    }
    catch(error) {
        log.debug(`Failed to get user: ${error.message}`);
        throw new Error(error.message);
    }
};

const userExistsByUsername = async (username) => {
    try {
        let targetUser = await getUserByUsername(username);
    
        return targetUser !== null;
    }
    catch(error) {
        log.debug(`Failed to get user: ${error.message}`);
        throw new Error(error.message);
    }
};

const userExistsById = async (userId) => {
    try {
        let targetUser = await user.findByPk(userId);
    
        return targetUser !== null;
    }
    catch(error) {
        log.debug(`Failed to get user: ${error.message}`);
        throw new Error(error.message);
    }
};

const userExistsByPersonId = async (personId) => {
    try {
        let targetUser = await user.findOne({
            where: {
                personId
            }
        });
    
        return targetUser !== null;
    }
    catch(error) {
        log.debug(`Failed to get user: ${error.message}`);
        throw new Error(error.message);
    }
};

const deleteUser = async (username) => {
    try {
        let targetUser = await getUserByUsername(username);

        if(targetUser !== null) {
            let affectedRows = await targetUser.destroy();

            return affectedRows !== 0;
        }
        
        return false;
    } 
    catch(err) {
        log.debug(`Failed to delete user: ${err.message}`);
        throw new Error(err.message);
    }
};

const updateUser = async (currentUsername, name, paternalSurname, maternalSurname, birthdate, email, phone, username, password, role)  => {
    try {
        let targetUser = await getUserByUsername(currentUsername);

        if(targetUser !== null) {
            let targetPerson = await person.findOne({
                where: {
                    id: targetUser.personId
                }
            });

            if(targetPerson !== null) {
                if(password != "") {
                    await targetUser.update({
                        password
                    });
                }

                await targetUser.update({
                    username,
                    roleId: role
                });

                await targetPerson.update({
                    name,
                    paternalSurname,
                    maternalSurname,
                    birthdate,
                    email,
                    phone
                });

                await targetUser.save();
                await targetPerson.save();
                return true;
            }
        }

        return false;
    } catch(error) {
        log.debug(`Failed to update user:  ${error.message}`);
        throw new Error(error.message);
    }
};

const getPersonByUsername = async(username) => {
    try {
        let targetUser = await getUserByUsername(username);

        let targetPerson = await person.findOne({
            where: {
                id: targetUser.personId
            }
        });

        return targetPerson;
    }
    catch(err) {
        log.debug(`Failed to get person:  ${error.message}`);
        throw new Error(error.message);
    }
}

const activateUser = async (username, otp) => {
    try {
        let targetUser = await getUserByUsername(username);

        if(targetUser !== null && targetUser.active !== 1 && targetUser.otp === otp) {
            let affectedRows = await targetUser.update({
                active: 1
            });

            await targetUser.save();
            return affectedRows !== 0;
        }
        return false;
    }
    catch(error) {
        log.debug(`Failed to activate user: ${error.message}`);
        throw new Error(error.message);
    }
};

const getPersonById = async (personId) => {
    try {
        let targetPerson = await person.findByPk(personId);
        return targetPerson;
    }
    catch(error) {
        log.debug(`Failed to get person: ${error.message}`);
        throw new Error(error.message);
    }
};

module.exports = {
    createUser,
    getUserByUsername,
    userExistsByUsername,
    deleteUser,
    updateUser,
    userExistsById,
    getPersonByUsername,
    activateUser,
    getUsers,
    userExistsByPersonId,
    getPersonById
}
