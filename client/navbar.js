/*------------------------------------------------------------------/
/                                                                   /
/                    Récupération des données                       /
/                                                                   /
/------------------------------------------------------------------*/

async function getUser() {
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

/*------------------------------------------------------------------/
/                                                                   /
/                     Utilisation des données                       /
/                                                                   /
/------------------------------------------------------------------*/

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
    
    document.title = 'Accueil';
    let navElements = {
        "home": "Accueil",
        "fileExplorer": "Naviguer"
    }

    let nav = createEntireElement('nav', {id: 'navbar'});
    let h1 = createEntireElement('h1', {innerHTML: `Bonjour ${user.fnm}!`});
    
    nav.appendChild(h1);

    Object.entries(navElements).forEach(([key, value]) => {
        let a = createEntireElement('a', {
            id: (key == 'home') ? 'active' : undefined,
            name: key, 
            class: 'tab-link', 
            innerText: value
        });
        nav.appendChild(a);
    });

    //* Temporaire -> à déplacer ailleur au format automatique (et non un bouton !) 
    // let updateFSButton = createEntireElement('input', {
    //     type: 'submit', 
    //     value: 'Update File structure',
    //     class: 'bottom', 
    //     onclick: async function (e) {
    //         e.preventDefault();

    //         let data = await updateFileStructure();
    //         try { checkLogin(data); } catch (error) { throw error; }
    //     }
    // });
    // nav.appendChild(updateFSButton);

    return nav;
    // document.body.appendChild(nav);
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
        // return script;
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

async function init() {
    try {
      const nav = await navbar();
      document.body.appendChild(nav);
      await displayTab();
    } catch (error) {
      console.error(error);
    }
}
  
init();

// navbar().then(nav => { document.body.appendChild(nav); }).catch(error => { console.error(error); });

// //Y'a un monde ou display tab ne fonctionne pas car le chargement de la page se fait trop vite
// //Essayer de placer un point d'arret dans la fonction, et elle fonctionne 
// //Problème d'async ???????????????
// displayTab().catch(error => { console.error(error); });