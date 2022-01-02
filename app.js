var session = require('express-session');
const express = require('express');
const app = express();
const port = 3003;
var {
    currentUsers,
    allSpots,
    deletedID,
    session_conf,
    getUniqueID,
    pagination,
} = require('./helper');

const path = require('path');

// Cache-Control no store, 只在 '/' 里面设定了，不在 store 里面设定，但是也不会跳回到 spot 里面
// 页面跳转，res.redirect 在 post login 里面 call，就没法跳转到 get /spot. 但是在 client 里面 location.herf 才行
// 我自己的 project，多个大页面联合起来，怎么弄呢

// app.use(express.static('public'));
// console.log(path.join(__dirname, '/view/public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use(session(session_conf));

app.listen(port, () => {
    console.log('hheheh');
});

app.get('/', (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.sendFile('login.html', {
        root: 'view',
    });
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/view/register.html');
});

app.get('/spot', (q, s) => {
    if (q.session.uId) {
        s.sendFile(__dirname + '/view/spot.html');
    } else {
        console.log('Session Expired! back login');
        s.redirect('/');
    }
});

app.post('/login', (q, s) => {
    // s.json({ result: q });
    // return;
    // console.log('?@@@');
    // console.log(q.body);
    // console.log(q.query);
    // console.log(q.session);
    let email = q.body.email;
    let password = q.body.password;
    if (!email || !password) {
        s.status(400).send('Please provide both email & password');
        return;
    }
    let match_any_user = false;
    currentUsers.forEach((e) => {
        if (email == e.email && password == e.password) {
            match_any_user = true;
            q.session.uId = q.body.email;
            s.status(200).send('success, logged in as user: ' + email);
            return;
        }
    });
    if (!match_any_user) {
        s.status(403).send('wrong email or password');
    }
});

app.post('/register', (q, s) => {
    // console.log('is uId set ?', q.session.uId);
    // console.log('all session, ', q.session);
    s.json({ result: 'sucess' });
});

app.get('/login_test', (q, s) => {
    // console.log('from test: ', q.session);
    if (q.session.uId) {
        s.send('uId is : ' + q.session.uId);
    } else {
        s.send('uId NOT defined' + q.session.uId);
    }
});

app.get('/spot/data/:type', (q, s) => {
    if (q.session.uId) {
        var my_email = q.session.uId;
    } else {
        s.redirect('/'); // TODO , check if this work.
    }
    const type = q.params['type'];
    console.log('server ', q.query);
    if (q.query) {
        var page_num = q.query.page_num;
    } else {
        var page_num = undefined;
    }
    if (page_num <= 0) {
        page_num = 1;
    }
    let result = [];
    let filterHelper = (obj) => {
        // Check if helper == undefined, if it is, make sure it is null.
        if (!obj.helper) {
            return {
                ...obj,
                helper: null,
            };
        } else {
            return obj;
        }
    };
    // 先过滤一遍 visible 的：
    // console.log('print before get ', allSpots);
    result = allSpots.filter((e) => {
        // console.log(e);
        return e.requester == my_email || e.visible == true; // 如果是自己的 post，或者不是自己的post 但是 visible 是true
    });
    // console.log('result after filter: ', result);
    //
    switch (type) {
        case 'all':
            result = result.flatMap((e) => {
                if (!e.helper) {
                    return filterHelper(e);
                } else {
                    return e;
                }
            });
            break;

        case 'needing_help':
            result = result.flatMap((e) => {
                if (!e.helper) {
                    return filterHelper(e);
                } else {
                    return [];
                }
            });
            break;
        case 'posted_by_me':
            result = result.flatMap((e) => {
                if (e.requester == my_email) {
                    return filterHelper(e);
                } else {
                    return [];
                }
            });
            break;
        case 'helped_by_me':
            result = result.flatMap((e) => {
                if (e.helper == my_email) {
                    return filterHelper(e);
                } else {
                    return [];
                }
            });
            break;

        default:
            console.log('invalid spot type !! you entered: ', type);
            break;
    }
    // 这里，拿到所有要给 client 的数据后，来 pagination：
    const num_post_per_page = 8;
    let current_p, total_p;
    [result, current_p, total_p] = pagination(
        result,
        page_num,
        num_post_per_page
    );

    result = {
        spots: result,
        user: my_email,
        current_p,
        total_p,
    };
    s.status(200).json(result);
    s.end();
});
// id: 1,
// requester: 'abc',
// time: '2021-10-01 9:00AM',
// location: 'UBC Math 100 first row, any seat',
// helper: 'elina@gmail.com',
// reward: '$20',
// complete: false,
// visible: true,
app.post('/spot/action/:act', (q, s) => {
    if (q.session.uId) {
        var my_email = q.session.uId;
    } else {
        s.redirect('/'); // TODO , check if this work.
    }
    let type = q.params['act'];
    let data = q.body;
    // console.log('act here, ', type, data);
    switch (type) {
        case 'create': {
            let obj = {
                id: getUniqueID(),
                requester: my_email,
                time: data.time,
                location: data.location,
                helper: null,
                reward: data.reward,
                visible: true,
            };
            allSpots.unshift(obj);
            s.status(200).json(obj);
            s.end();
            break;
        }
        case 'help': {
            allSpots = allSpots.map((e) => {
                if (e.id == data.postID) {
                    return {
                        ...e,
                        helper: data.user,
                    };
                } else {
                    return e;
                }
            });
            // console.log('what ? ', allSpots[1]);
            s.status(200).send('helper added!');
            s.end();
            break;
        }
        case 'cancelhelp': {
            allSpots = allSpots.map((e) => {
                if (e.id == data.postID) {
                    return {
                        ...e,
                        helper: null,
                    };
                } else {
                    return e;
                }
            });
            s.status(200).send('helper removed!');
            s.end();
            break;
        }
        case 'public': {
            allSpots = allSpots.map((e) => {
                if (e.id == data.postID) {
                    return {
                        ...e,
                        visible: true,
                    };
                } else {
                    return e;
                }
            });
            s.status(200).send('success public');
            s.end();
            break;
        }

        case 'invisible': {
            allSpots = allSpots.map((e) => {
                if (e.id == data.postID) {
                    return {
                        ...e,
                        visible: false,
                    };
                } else {
                    return e;
                }
            });
            s.status(200).send('success invisible');
            s.end();
            break;
        }

        case 'edit': {
            allSpots = allSpots.map((e) => {
                if (e.id == data.postID) {
                    // console.log('edit this', data);
                    return {
                        ...e,
                        location: data.location,
                        time: data.time,
                        reward: data.reward,
                    };
                } else {
                    return e;
                }
            });
            s.status(200).send('edit saved!');
            s.end();
            break;
        }

        case 'delete': {
            allSpots = allSpots.filter((e) => {
                return e.id != data.postID;
            });
            deletedID.push(data.postID);
            s.status(200).send('success');
            s.end();
            break;
        }

        default:
            console.log('shouldnt get here, unknown type: ', type);
            break;
    }
});

app.post('/signout', (q, s) => {
    try {
        q.session.destroy();
    } catch (error) {
        s.status(500).send('failed to sign out');
        s.end();
    }
    s.status(200).send('success');
});
