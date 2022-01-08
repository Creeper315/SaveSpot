const User = require('../model/user').model;

var userDB = [
    { id: 1, email: 'abc', password: '123' },
    { id: 2, email: 'elina@gmail.com', password: 'cool' },
    { id: 3, email: 'hello123', password: '123' },
];

var idCounter = 4;
function getNewId() {
    let result = idCounter;
    idCounter++;
    return result;
}

exports.getUser = async (email) => {
    for (let i = 0; i < userDB.length; i++) {
        const e = userDB[i];
        if (e.email == email) {
            return { email: e.email, password: e.password };
        }
    }
    return null;
};

exports.createUser = async (email, password) => {
    for (let i = 0; i < userDB.length; i++) {
        const e = array[i];
        if (e.email == email) {
            return false;
        }
    }
    let obj = new User(getNewId(), email, password);
    userDB.push(obj);
    return true;
};
