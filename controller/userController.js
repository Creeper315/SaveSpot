const { getUser, createUser } = require('../repository/userRepo');

function inputValidation(email, pass) {
    // nothing implemented.
    return [];
}

function hashPassword(pass) {
    // nothing
    return pass;
}

// 200,
// 400: input validation
// 403: password
// 500: try-catch error?

exports.login = async (q, s) => {
    // 1 看是否已经登录 （session）
    // 2 input validation？ error 是一个 array of message 虽然 validation在前端可能已经做了
    // 3 从DB 拿这个 email 的用户，检查 password ， hash 用户的 pass，和 DB 里的 hashed 比较
    // 4 除非用户存在，password 对，不然就 return ，用户名密码不对。
    if (q.session != undefined && q.session.uId != undefined) {
        s.status(200).send('user already logged in !, id: ', q.session.uId);
        return;
    }

    let email = q.body.email;
    let password = q.body.password;
    let message = inputValidation();
    if (message.length != 0) {
        s.status(400).send('bad input, error: ', message.join(', '));
        return;
    }
    let got = await getUser(email);
    console.log('got ', got);
    if (got != null) {
        let hashed = got.password;
        if (hashPassword(password) == hashed) {
            q.session.uId = q.body.email;
            s.status(200).send('success, logged in as user: ' + email);
            return;
        } else {
            // s.status(403).send('password incorrect.');
        }
    } else {
        // s.status(400).send('user does not exist, you entered: ', email);
    }
    s.status(403).send(
        'user name or password incorrect, you entered: ',
        email,
        password
    );

    // if (!email || !password) {
    //     s.status(400).send('Please provide both email & password');
    //     return;
    // }
    // let match_any_user = false;
    // currentUsers.forEach((e) => {
    //     if (email == e.email && password == e.password) {
    //         match_any_user = true;
    //         q.session.uId = q.body.email;
    //         s.status(200).send('success, logged in as user: ' + email);
    //         return;
    //     }
    // });
    // if (!match_any_user) {
    //     s.status(403).send('wrong email or password');
    // }
};

exports.register = async (q, s) => {
    // input validation, error array message
    // hash password, store it by repo
    // repo return : 1 成功 : 2 用户已被注册
    let email = q.body.email;
    let password = q.body.password;
    let error = validation(email, password);
    if (error.length != 0) {
        s.status(400).send('bad request, input validation: ', error.join(', '));
    }
    let addResult = await createUser(email, password);
    if (addResult) {
        s.status(200).send('add success');
    } else {
        s.status(400).send('user already existed');
    }
};

exports.logout = async (q, s) => {
    try {
        if (q.session) {
            q.session.destroy();
        }
    } catch (error) {
        s.status(500).send('failed to sign out');
        s.end();
    }
    s.status(200).send('success');
};

// class UserController {
//     constructor(email, pass) {
//         this.email = email;
//         this.pass = pass;
//     }

//     async login() {
//         // ... login with email, pass
//     }

//     static login(email, pass) {
//         // ... login with email, pass
//     }
// }

// exports = { UserController };
