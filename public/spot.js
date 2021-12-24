let spotsData = [
    {
        id: 1,
        requester: 'abc@saveaspot.com',
        time: '2021-10-01 9:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        complete: false,
    },
    {
        id: 2,
        requester: 'elina@gmail.com',
        time: '2021-10-30 6:00AM',
        location: 'UBC EOSC first row, any seat',
        helper: 'def@saveaspot.com',
        reward: '$10',
        complete: false,
    },
];

let fetchSpot = (type) => {
    return axios({
        method: 'get',
        url: '/spot/data/' + type,
    });
};

window.addEventListener('load', () => {
    fetchSpot('worked_by_me')
        .then((e) => {
            console.log('spot data, ', e.data);
            renderSpot(e.data);
        })
        .catch((e) => {
            console.log('err ', e);
        });
});

function getContainer() {
    return document.querySelector('.all-card-container');
}

function clearContent(ele) {
    ele.innerHTML = '';
}

{
    /* <div class="card">
    <div class="card-body">
        <p class="card-title"> oh wow 爱仕达大所大</p>
        <p class="card-text">
            hihi texttt asdasdadadadasdas asdasda dadadasdas asdasdad adadasdas
        </p>
        <p class="card-title"> oh wow</p>
        <p class="card-text">hihi texttt</p>
        <p class="card-title"> oh wow</p>
        <p class="card-text">hihi texttt</p>
        <p class="card-title"> oh wow</p>
        <p class="card-text">hihi texttt</p>
        <p class="card-title"> oh wow</p>
        <p class="card-text">hihi texttt</p>
        <div class="btn btn-primary">clickk</div>
    </div>
</div>; */
}

function oneSpotHTML(one_spot_data) {
    let a = document.createElement('div');
    let aa = document.createElement('div');
    a.className = 'card';
    aa.className = 'card-body';
    a.appendChild(aa);

    for (const [key, value] of Object.entries(one_spot_data)) {
        switch (key) {
            case 'id':
                a.key = key;
                break;
            case 'requester': {
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
                } else {
                    p2.innerText = '* None *';
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
                console.log('shouldnt get here ! ', key, value);
                break;
        }
    }
    return a;
}

function appendOneByOne(arrSpot) {
    // assume arr has attribute "id"
    let c = getContainer();
    clearContent(c);
    arrSpot.forEach((e) => {
        let spotHTML = oneSpotHTML(e);
        c.appendChild(spotHTML);
    });
}

let renderSpot = (data) => {
    let array_of_spot = data.spots;
    appendOneByOne(array_of_spot);
};
