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
    console.log('begin login');
    // obj = {

    // };
    axios({
        method: 'POST',
        url: '/login',
        headers: {
            'Content-Type': 'application/json',
        },
        // params: {
        //     email: 'abc',
        //     password: '123',
        // },
        data: {
            email: 'abc',
            password: '123',
        },
    })
        .then((e) => {
            console.log(e.data);
        })
        .catch((e) => {
            console.log(e);
        });
}
