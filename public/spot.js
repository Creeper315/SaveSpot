// Use pagination ? ->  8 posts per page?
// Sort?  default by time created?  Reward least to most?  Time needed to get spot most recent to later?
// Need to represent time using a string to sort?
// Need to implement time system?

//->  Edit,

// If not searched at all, show recent new posts.

// Create new post
// -- General search:

// all yours
// all others

// all needing helped
// all helped by you
// recently deleted

// -- Filter search:
// all posted by one user
// all helped by one user

// -- Recently deleted

// all: all posts, (more recent posts)
// post_by_me
// post_by_others
// needing_help: return all posts needing help.

// ---------------- This User, Global Variable
var thisUser = '';
// ---------------- This All Spot Data loaded from server, Global Variable
var allSpotLoaded = [];
// window.sessionStorage.setItem('type') = 'all';
// window.sessionStorage.setItem('current_p') = 1;

window.addEventListener('load', () => {
    let type = sessionStorage.getItem('type');
    if (type == null) {
        type = 'all';
    }
    renderEverything(type);
});

let renderEverything = (type = 'all') => {
    // if (!type) {
    //     type = sessionStorage.getItem('type');
    // }
    fetchSpot(type)
        .then((e) => {
            // console.log('spot data, ', e.data);
            sessionStorage.setItem('type', type);
            renderSpot(e.data);
        })
        .catch((e) => {
            console.log('err during render spots: ', e);
        });
};

let fetchSpot = (type) => {
    return axios({
        // 说明 axios 本身是一个 promise
        method: 'get',
        url: '/spot/data/' + type,
        params: {
            page_num: sessionStorage.getItem('cp'),
        },
    });
};

let renderSpot = (data) => {
    thisUser = data.user;
    let ele = document.querySelector('#left-bottom-user-name');
    ele.innerText = thisUser;
    allSpotLoaded = data.spots;
    sessionStorage.setItem('cp', data.current_p);
    sessionStorage.setItem('tp', data.total_p);
    setPagination();
    appendOneByOne();
};
function setPagination() {
    let ele = document.querySelector('.page-number');
    ele.innerText =
        sessionStorage.getItem('cp') + ' / ' + sessionStorage.getItem('tp');
    let left = document.querySelector('.page-left');
    let right = document.querySelector('.page-right');
    let input = document.querySelector('.page-input');
    input.value = sessionStorage.getItem('cp');
    input.onkeyup = (e) => {
        if (e.key == 'Enter') {
            go_to_page(input.value);
        }
    };
    left.onclick = () => {
        flip_page('left');
    };
    right.onclick = () => {
        flip_page('right');
    };
}
function go_to_page(p) {
    let cp = sessionStorage.getItem('cp');
    let tp = sessionStorage.getItem('tp');
    if (p == cp) {
        return;
    }
    if (p > tp) {
        p = tp;
    }
    if (p <= 0) {
        p = 1;
    }
    // 先 load from server，如果成功，update 所有东西？
    console.log(
        'make sure data correct ',
        cp,
        tp,
        sessionStorage.getItem('type'),
        p
    );
    axios({
        method: 'get',
        url: '/spot/data/' + sessionStorage.getItem('type'),
        params: {
            page_num: p,
        },
    })
        .then((e) => {
            if (e.status == 200) {
                // window.ed = e.data;
                // console.log('success in go to page');
                renderSpot(e.data);
            }
        })
        .catch((e) => {
            console.log('flip page failed, ', e);
        });
}
function flip_page(direction) {
    let cp = sessionStorage.getItem('cp');
    let tp = sessionStorage.getItem('tp');
    if (direction == 'left') {
        if (cp == 1) {
            return;
        }
        go_to_page(parseInt(cp) - 1);
    } else if (direction == 'right') {
        if (cp == tp) {
            return;
        }
        go_to_page(parseInt(cp) + 1);
    }
}

function appendOneByOne() {
    // assume arr has attribute "id"
    let c = document.querySelector('.all-card-container');
    c.innerHTML = ''; // clear everything before render
    allSpotLoaded.forEach((e) => {
        let spotHTML = oneSpotHTML(e);
        c.appendChild(spotHTML);
    });
}

function oneSpotHTML(one_spot_data) {
    // thisUser 是当前用户的 email，也就是 session 里的 uId
    let card = document.createElement('div');
    card.className = 'card';
    let body = insertBody(one_spot_data);
    card.appendChild(body);

    let buttons = getButton(one_spot_data, card);
    card.appendChild(buttons);
    return card;
}

function insertBody(one_spot_data) {
    // return card-body
    let aa = document.createElement('div');
    aa.className = 'card-body';

    for (const [key, value] of Object.entries(one_spot_data)) {
        switch (key) {
            case 'id':
                // a.key = value;
                break;
            case 'requester': {
                if (thisUser == value) {
                } else {
                }
                let p1 = document.createElement('p');
                p1.className = 'card-title';
                p1.innerText = 'Requester:';
                let p2 = document.createElement('p');
                p2.className = 'card-text';
                p2.innerText = value;
                aa.appendChild(p1);
                aa.appendChild(p2);
                break;
            }
            case 'time': {
                let p1 = document.createElement('p');
                p1.className = 'card-title';
                p1.innerText = 'Time:';
                let p2 = document.createElement('p');
                p2.className = 'card-text';
                p2.innerText = value;
                aa.appendChild(p1);
                aa.appendChild(p2);
                break;
            }
            case 'location': {
                let p1 = document.createElement('p');
                p1.className = 'card-title';
                p1.innerText = 'Location:';
                let p2 = document.createElement('p');
                p2.className = 'card-text';
                if (value) {
                    p2.innerText = value;
                } else {
                    p2.innerText = '* None *';
                }
                aa.appendChild(p1);
                aa.appendChild(p2);
                break;
            }
            case 'helper': {
                let p1 = document.createElement('p');
                p1.className = 'card-title';
                p1.innerText = 'Helper:';
                let p2 = document.createElement('p');
                p2.className = 'card-text';
                if (value) {
                    p2.innerText = value;
                    need_help = false;
                } else {
                    p2.innerText = '* None *';
                    need_help = true;
                }
                aa.appendChild(p1);
                aa.appendChild(p2);
                break;
            }
            case 'reward': {
                let p1 = document.createElement('p');
                p1.className = 'card-title';
                p1.innerText = 'Reward:';
                let p2 = document.createElement('p');
                p2.className = 'card-text';
                p2.innerText = value;
                aa.appendChild(p1);
                aa.appendChild(p2);
                break;
            }
            default:
                // console.log('other case : ', key, value);
                break;
        }
    }
    return aa;
}
function getAllSpot() {
    axios({
        // 说明 axios 本身是一个 promise
        method: 'get',
        url: '/spot/data/all',
    })
        .then((e) => {
            window.all = e.data.spots;
        })
        .catch((e) => {
            console.log('error', e);
        });
}

function deletePost(postID) {
    axios({
        method: 'post',
        url: '/spots/action/complete',
        data: { postID },
    });
}

// function saveEdit() {

//     let time, location, reward;
//     time = document.getElementById('edit-time');
//     time = time.getAttribute('placeholder');
//     location = document.getElementById('edit-location');
//     location = location.getAttribute('placeholder');
//     reward = document.getElementById('edit-reward');
//     reward = reward.getAttribute('placeholder');
//     axios({
//         method: 'post',
//         url: '/spot/action/saveEdit',
//         data:{
//             postID: one_spot_data.id,
//         }
//     });
// }

function signOut() {
    axios({
        method: 'post',
        url: '/signout',
    })
        .then((e) => {
            if (e.status == 200) {
                window.location.href = '/';
            }
        })
        .catch((e) => {
            console.log(e);
        });
}
function createPost() {
    let editTime = document.getElementById('edit-time');
    let editLocation = document.getElementById('edit-location');
    let editReward = document.getElementById('edit-reward');
    let editSaveBtn = document.querySelector('#edit-save-btn');
    editSaveBtn.innerText = 'Create';
    editTime.value = '';
    editLocation.value = '';
    editReward.value = '';
    editSaveBtn.onclick = () => {
        let t = editTime.value;
        let l = editLocation.value;
        let r = editReward.value;
        axios({
            method: 'post',
            url: '/spot/action/create',
            data: {
                time: t,
                location: l,
                reward: r,
            },
        })
            .then((e) => {
                if (e.status == 200) {
                    // one_spot_data 在 e.data 里面
                    let card = oneSpotHTML(e.data);
                    let con = document.querySelector('.all-card-container');

                    con.insertBefore(card, con.firstChild);
                    // changeCardBody(one_spot_data, card_html_element);
                    // alert('created !');
                    editSaveBtn.innerText = 'Created';
                } else {
                    editSaveBtn.innerText = 'Create failed';
                    alert('failed to save, status: ', e.status);
                }
            })
            .catch((e) => {
                editSaveBtn.innerText = 'Create failed';
                alert('failed to save, status: ', e.status);
            });
    };
}
