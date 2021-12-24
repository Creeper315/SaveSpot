function getLoginFormData() {
    console.log('from login form');
    let e = document.getElementById('email-input').value;
    let pass = document.getElementById('login-password').value;
    console.log(e, pass);
    return {
        email: e,
        password: pass,
    };
    // return [e, pass];
}

function getRegisterFormData() {
    console.log('from register');
    let e = document.getElementById('email-input');
    let pass = document.getElementById('login-password');
    console.log(e, pass);
    return {
        email: e,
        password: pass,
    };
}
