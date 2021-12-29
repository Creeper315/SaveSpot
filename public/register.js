let myUrl = 'http://localhost:3000'; // ← 不需要把这个 url append 到 axios 的 url 前面。

// Register: add new email to server database, email cannot duplicate,
// How to check it's a valid email?

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

function sendPost() {
    console.log('sending from register.js');
    axios({
        method: 'POST',
        url: '/register',
    })
        .then((e) => {
            window.ee = e;

            console.log('respoo received');
        })
        .catch((e) => {
            console.log(e);
        });
}

function register() {
    console.log('nothing implemented yet.');
    data = getRegisterFormData();
    console.log('upon register, ', data);
}
