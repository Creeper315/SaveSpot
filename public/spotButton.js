// thisUser variable is from spot.js, it is global variable, can be accessed here.
let getButton = (one_spot_data, card_html_element) => {
    var result;
    if (one_spot_data.requester == thisUser) {
        let con = getButtonContainer();
        let b = getVisibilityButton(one_spot_data, card_html_element);
        con.appendChild(b);
        b = getEditButton(one_spot_data, card_html_element);
        con.appendChild(b);
        b = getDeleteButton(one_spot_data, card_html_element);
        con.appendChild(b);
        result = con;
    } else {
        if (one_spot_data.helper) {
            if (one_spot_data.helper == thisUser) {
                result = getHelpButton(one_spot_data, card_html_element, false);
            } else {
                result = document.createElement('div');
            }
        } else {
            result = getHelpButton(one_spot_data, card_html_element, true);
        }
    }

    return result;
};

// url:
// /spot/action/help  -  postID, helper
// /spot/action/cancelhelp  -  postID
// /spot/action/edit  -  postID, contentdata
// /spot/action/delete  -  postID
// /spot/action/public  -  postID
// /spot/action/invisible  -  postID

let getButtonContainer = () => {
    let con = document.createElement('div');
    con.className = 'btn-container';
    return con;
};
let getDeleteButton = (one_spot_data, card_html_element) => {
    let but = document.createElement('div');
    but.className = 'btn btn-danger btn-sm';
    but.style = 'border: 1px solid white;';
    but.innerText = 'Delete';
    return but;
};
{
    /* <div class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editSpotModal">
    Open modal
</div>; */
}
let getEditButton = (one_spot_data, card_html_element) => {
    let but = document.createElement('div');
    but.className = 'btn btn-primary btn-sm';
    but.style = 'border: 1px solid rgb(14, 13, 13);';
    but.innerText = 'Edit';
    but.setAttribute('data-bs-toggle', 'modal');
    but.setAttribute('data-bs-target', '#editSpotModal');
    but.onclick = () => {
        // console.log('edit butt, ', one_spot_data);
        let editTime = document.getElementById('edit-time');
        editTime.value = one_spot_data.time;
        let editLocation = document.getElementById('edit-location');
        editLocation.value = one_spot_data.location;
        let editReward = document.getElementById('edit-reward');
        editReward.value = one_spot_data.reward;
        let editSaveBtn = document.querySelector('#edit-save-btn');
        editSaveBtn.onclick = () => {
            editSaveBtn.innerText = '...';
            let t = editTime.value;
            let l = editLocation.value;
            let r = editReward.value;
            axios({
                method: 'post',
                url: '/spot/action/edit',
                data: {
                    postID: one_spot_data.id,
                    time: t,
                    location: l,
                    reward: r,
                },
            })
                .then((e) => {
                    if (e.status == 200) {
                        one_spot_data.time = t;
                        one_spot_data.location = l;
                        one_spot_data.reward = r;
                        changeCardBody(one_spot_data, card_html_element);
                        alert('Saved !');
                        editSaveBtn.innerText = 'Save';
                    } else {
                        editSaveBtn.innerText = 'Save';
                        alert('failed to save, status: ', e.status);
                    }
                })
                .catch((e) => {
                    editSaveBtn.innerText = 'Save';
                    alert('failed to save, status: ', e.status);
                });
        };
    };
    return but;
};

let getVisibilityButton = (one_spot_data, card_html_element, to_public) => {
    let but = document.createElement('div');
    but.className = 'btn btn-sm btn-warning';
    but.style = 'border: 1px solid rgb(24, 143, 255); color: white';
    but.innerText = to_public ? 'set Public' : 'set Invisible';
    // let onclick = ()=>{
    //     but.innerText = '...';
    //     axios({
    //         method: 'post',
    //         url: to_public ? '/spot/action/public' : '/spot/action/invisible',
    //         data:{
    //             postID: one_spot_data.id,
    //         }
    //     }).then(e=>{
    //         if
    //     })
    // }
    return but;
};

let getHelpButton = (one_spot_data, card_html_element, to_help) => {
    // 1.创造一个 button ，如果 onclick，那么 1.在 server 里改，如果 200：1.先改 one_spot_data，再通过改过的 one_spot_data，在 html 上改

    let con = getButtonContainer();
    let but = document.createElement('div');
    but.className = 'btn btn-primary btn-sm';
    but.style = 'display:block; margin:auto;';
    con.appendChild(but);
    but.innerText = to_help ? 'Help' : 'Cencel Help';
    let onclick = () => {
        if (!one_spot_data.helper) {
            var to_help = true;
        } else {
            var to_help = false;
        }
        but.innerText = '...';
        axios({
            method: 'post',
            url: to_help ? '/spot/action/help' : '/spot/action/cancelhelp',
            data: {
                user: thisUser,
                postID: one_spot_data.id,
            },
        })
            .then((e) => {
                if (e.status == 200) {
                    if (to_help) {
                        but.innerText = 'Cancel Help';
                        one_spot_data.helper = thisUser;
                    } else {
                        but.innerText = 'Help';
                        one_spot_data.helper = null;
                    }

                    changeCardBody(one_spot_data, card_html_element);
                } else {
                    // console.log('then, status not 200 ??? , ', e.status);
                    but.innerText = to_help ? 'Help' : 'Cencel Help';
                    alert('help post failed, error status: ', e.status);
                }
            })
            .catch((e) => {
                but.innerText = to_help ? 'Help' : 'Cencel Help';
                alert('help post failed, error status: ', e.status);
            });
    };
    but.onclick = onclick;
    return con; //  黏贴到 card-body 下方
};

function changeCardBody(one_spot_data, card_html_element) {
    let body = card_html_element.childNodes[0].childNodes;
    for (let i = 0; i < body.length; i = i + 2) {
        let tit = body[i];
        let txt = body[i + 1];
        // console.log('change card body, detail ', tit, txt);
        switch (tit.innerText) {
            case 'Requester:':
                txt.innerText = one_spot_data.requester;
                break;
            case 'Time:':
                txt.innerText = one_spot_data.time;
                break;
            case 'Location:':
                txt.innerText = one_spot_data.location;
                break;
            case 'Helper:':
                if (one_spot_data.helper) {
                    txt.innerText = one_spot_data.helper;
                } else {
                    txt.innerText = '* None *';
                }
                break;
            case 'Reward:':
                txt.innerText = one_spot_data.reward;
                break;
            default:
                console.log('change card body, other case? ', tit.innerText);
                break;
        }
    }
}

// let getCancelHelp = (one_spot_data, card_html_element) => {
//     let con = getButtonContainer();
//     let but = document.createElement('div');
//     but.className = 'btn btn-primary btn-sm';
//     but.style = 'display:block; margin:auto;';
//     con.appendChild(but);
//     but.innerText = 'Cancel Help';
//     let onclick = () => {
//         but.innerText = '...';
//         axios({
//             method: 'post',
//             url: '/spot/action/cancelhelp',
//             data: {
//                 user: thisUser,
//                 postID: one_spot_data.id,
//             },
//         })
//             .then((e) => {
//                 if (e.status == 200) {
//                     but.innerText = 'Help';
//                     one_spot_data.helper = thisUser;
//                     changeCardBody(one_spot_data, card_html_element);
//                 } else {
//                     console.log('then, status not 200 ??? , ', e.status);
//                     but.innerText = 'Cancel Help';
//                     alert('help post failed, error status: ', e.status);
//                 }
//             })
//             .catch((e) => {
//                 but.innerText = 'Cancel Help';
//                 alert('help post failed, error status: ', e.status);
//             });
//     };
//     but.onclick = onclick;
//     return con; //  黏贴到 card-body 下方
// };
