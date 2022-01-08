let myUrl = 'http://localhost:3000'; // ← 不需要把这个 url append 到 axios 的 url 前面。

function getLoginFormData() {
    let e = document.getElementById('email-input').value;
    let pass = document.getElementById('login-password').value;
    // console.log(e, pass);
    return {
        email: e,
        password: pass,
    };
    // return [e, pass];
}

window.addEventListener('keyup', (e) => {
    if (e.key == 'Enter') {
        // console.log(e.keyCode);
        login();
    }
});

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
            if (e.status == 200) {
                // console.log('login status: ', e.status);
                window.location.href = '/spot';
            }
            // if (e.data.result == 'success') {
            //     window.location.href = '/spot';
            // }
        })
        .catch((e) => {
            window.ee = e;

            alert('login faileddd, ', e.response.data);
            // console.log('Login Error, \n', e.response.data);
        });
}

function jumpRegister() {
    window.location.href = '/register';
}
