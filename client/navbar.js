

async function updateFileStructure() {
    let BASE_URL = 'https://api.drivegsb.local/index.php';
    let response = await fetch(`${BASE_URL}/updateFileStructure`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        credentials: 'include'
    });

    // let rawText = await response.text();
    // console.log('Raw Response:', rawText); // Affiche la réponse brute

    let data = await response.json();
    if (data.status === 'error') {
        if (data.message.includes('token')) return 'login';
        throw new Error(data.message);
    }    
}

updateFileStructure().then(data => {
    if (data === 'login') {
        // document.getElementById('nav').remove();
        document.body.appendChild(createEntireElement('script', {src: './login.js'}));
        console.error('user not logged (token invalid or null)');
    }
});


// async function showUsers() {
//     let users = await home();
//     if (users === 'login') {
//         document.getElementById('nav').remove();
//         document.body.appendChild(createEntireElement('script', {src: './login.js'}));
//         throw new Error('user not logged (token invalid or null)');
//     }
    
//     // table
//     let table = createEntireElement('table');
//     // table head
//     let thead = createEntireElement('thead');
//     let trHead = createEntireElement('tr');
//     Object.keys(users[0]).forEach(key => {
//         let th = createEntireElement('th', {innerText: key})
//         trHead.appendChild(th);
//     });
//     thead.appendChild(trHead);
//     table.appendChild(thead);
    
//     // table body
//     let tbody = createEntireElement('tbody');

//     users.forEach(user => {
//         let tr = createEntireElement('tr');
//         Object.values(user).forEach(value => {
//             let td = createEntireElement('td', {innerText: value});
//             tr.appendChild(td);
//         });
//         tbody.appendChild(tr);
//     })
//     table.appendChild(tbody);

//     // container content
//     let cnt = createEntireElement('div', {class: 'cnt box'});
//     let h2 = createEntireElement('h2', {innerText: 'Liste des utilisateurs'});

//     cnt.appendChild(h2);
//     cnt.appendChild(table);

//     return cnt;
// }


// showUsers().then(cnt => {
//     document.body.appendChild(cnt);
// }).catch(error => {
//     console.error('Error', error);
// });
