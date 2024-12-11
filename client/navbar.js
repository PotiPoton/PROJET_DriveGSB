async function getUser() {
    let BASE_URL = 'https://api.drivegsb.local/index.php';
    let response = await fetch(`${BASE_URL}/user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        credentials: 'include'
    });

    let data = await response.json();
    if (data.status === 'error') {
        if (data.message.includes('token')) return 'login';
        throw new Error(data.message);
    }   

    return data.user;
}

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

// updateFileStructure().then(data => {
//     if (data === 'login') {
//         // document.getElementById('nav').remove();
//         document.body.appendChild(createEntireElement('script', {src: './login.js'}));
//         console.error('user not logged (token invalid or null)');
//     }
// }).catch(error => { console.error(error); });

function checkLogin(data){
    if (data === "login") {
        if (document.getElementById('nav')) document.getElementById('nav').remove();
        document.body.appendChild(createEntireElement('script', {src: './login.js'}));
        throw new Error('user not logged (token invalid or null)');
    }
}

async function navbar(){
    let user = await getUser();
    try { checkLogin(user); } catch (error) { throw error; }
    

    let navElements = {
        "home": "Accueil"
    }

    let nav = createEntireElement('nav', {id: 'navbar'});
    let h1 = createEntireElement('h1', {innerHTML: `Bonjour ${user.fnm}!`});
    
    nav.appendChild(h1);

    Object.entries(navElements).forEach(([dataTab, affichage]) => {
        let a = createEntireElement('a', {
            id: (dataTab == 'home') ? 'active' : undefined,
            name: dataTab, 
            class: 'tab-link', 
            innerText: affichage
        });
        nav.appendChild(a);
    });

    let updateFSButton = createEntireElement('input', {
        type: 'submit', 
        value: 'Update File structure',
        class: 'bottom', 
        onclick: async function (e) {
            e.preventDefault();

            let data = await updateFileStructure();
            try { checkLogin(data); } catch (error) { throw error; }
        }
    });

    nav.appendChild(updateFSButton);

    document.body.appendChild(nav);
}

function displayTab(){

    function loadTab(tabName) {
        // Supprimer l'ancienne div avec la classe "content" si elle existe
        const oldContent = document.querySelector('.content');
        if (oldContent) oldContent.remove();

        // Supprimer un script existant correspondant à un autre onglet
        const oldScript = document.getElementById('dynamic-script');
        if (oldScript) oldScript.remove();

        // Créer un nouveau script pour charger dynamiquement le fichier JS
        let script = createEntireElement('script', {id: 'dynamic-script', src: `./${tabName}.js`});
        
        // Ajouter le script en bas de la page
        document.body.appendChild(script);
    }

    //Charger l'onglet actif par défaut au démarrage
    const activeLink = document.getElementById('active');
    if (activeLink) {
        const tabName = activeLink.getAttribute('name');
        loadTab(tabName);
    }

    // Sélectionner tous les liens de la navbar
    const tabLinks = document.querySelectorAll('.tab-link');

    // Boucler sur chaque lien et ajouter un écouteur d'événement
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Empêcher le comportement par défaut du lien (rechargement)

            //Récuperer le nom de l'onglet selectionnée
            const tabName = this.getAttribute('name');

            //Charger l'onglet correspondant
            loadTab(tabName);

            // Supprimer l'ID 'active' de l'ancien onglet actif
            const activeLink = document.getElementById('active');
            if (activeLink) activeLink.removeAttribute('id');

            // Ajouter l'ID 'active' à l'onglet cliqué
            this.setAttribute('id', 'active');
        });
    });
}


navbar()
// displayTab();


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
