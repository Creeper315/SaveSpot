let myUrl = 'http://localhost:3000'; // ← 不需要把这个 url append 到 axios 的 url 前面。

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

function login() {
    axios({
        method: 'POST',
        url: '/login',
        headers: {
            'Content-Type': 'application/json',
        },

        data: getLoginFormData(),
    })
        .then((e) => {
            if (e.data.result == 'success') {
                window.location.href = '/spot';
            }
        })
        .catch((e) => {
            console.log(e);
        });
}

function jumpRegister() {
    window.location.href = '/register';
}

function register() {
    console.log('nothing implemented yet.');
    data = getRegisterFormData();
    console.log('upon register, ', data);
}
