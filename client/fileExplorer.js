/*------------------------------------------------------------------/
/                                                                   /
/                    Récupération des données                       /
/                                                                   /
/------------------------------------------------------------------*/

/**
 * Récupère sur l'API le contenue d'un dossier
 * 
 * @param {int} idersc L'identifiant d'un dossier dont il faut le contenue
 * @returns Le contenue d'un dossier
 */
async function getFolder(idersc) {
    let response = await fetch(`${BASE_URL}/folder`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `idersc=${idersc}`,
        credentials: 'include'
    });

    let data = await response.json();
    if (data.status === 'error') {
        if (data.message.includes('token')) return 'login';
        throw new Error(data.message);
    }   

    return data.content;
}

/**
 * Récupère sur l'API le contenue d'un fichier
 * 
 * @param {int} idersc L'identifiant d'un fichier dont il faut le contenue
 * @returns Le contenue du fichier
 */
async function getFile(idersc) {
    let response = await fetch(`${BASE_URL}/file`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `idersc=${idersc}`,
        credentials: 'include'
    });

    let data = await response.json();
    if(data.status === 'error') {
        if (data.message.includes('token')) return 'login';
        throw new Error(data.message);
    }
    
    return data;
}

/*------------------------------------------------------------------/
/                                                                   /
/                     Utilisation des données                       /
/                                                                   /
/------------------------------------------------------------------*/

/**
 * clearTable - Supprime la table avec l'id 'folderSelection' si elle existe
 */
function clearTable() {
    let existingTable = document.getElementById('folderSelection');
    if (existingTable) existingTable.remove();
}

/**
 * Génère un modal avec le contenue d'un fichier
 * 
 * @param {int} idersc Identifiant de la ressource
 */
async function showFile(idersc) {
    let file = await getFile(idersc);

    try { checkLogin(file); } catch (error) { throw error; }

    let content = createEntireElement('p', { innerText: file.content });

    createModal('file', file.file.nmersc, content);
}

/**
 * met à jour l'historique de navigation du local storage du navigateur.
 * 
 * @param {bool} goback Retour en arrière
 * @param {int} idersc Identifiant de ressource suivant
 * @returns Si retour en arrière, retourne l'identifiant du dossier précédent
 */
function updateHistory(goback = false, idersc = null) {
    let history = JSON.parse(localStorage.getItem('history'));

    if (goback) {
        history.pop();
        localStorage.setItem('history', JSON.stringify(history));
        return history[history.length-1];
    }

    history.push(idersc);
    localStorage.setItem('history', JSON.stringify(history));
}

/**
 * Revenir sur le dossier précédent
 *
 * @returns Un bouton de retour au dossier précédent (ou non si racine)
 */
function previousFolder() {
    let history = JSON.parse(localStorage.getItem('history'));

    if (history.length === 0) return createEntireElement('tr');

    return createEntireElement('tr', { child: [
        createEntireElement('td', {
            innerText: "⤶ Dossier précédent",
            colspan: 3,
            onclick: async function () {
                let previous = updateHistory(true);
                await showFolder(previous);
            }
        })
    ]});
}

/**
 * Génère l'entête d'un tableau 
 * 
 * @param {Object} resources les ressources présentes dans le dossier
 * @returns L'entête d'un tableau
 */
function getHead(resources) {
    return createEntireElement('thead', { child: [ 
        createEntireElement('tr', { child: [
            ...Object.keys(resources[0]).map((key) => {
                if (!key) return;
                if (key === 'idersc' || key === 'tpe' || key === 'ideusr' || key === 'ideprt') {
                    return createEntireElement('th', { innerText: key, hidden: true });
                }
                return createEntireElement('th', { 
                    innerText: key, 
                    onclick: () => { 
                        //TODO: ajouter trie colonne ici 
                    } 
                });
            })
        ]})
    ]})
}

/**
 * Génère le corps d'un tableau
 * 
 * @param {Object} resources Les ressources présentes dans le dossier
 * @returns Le corps d'un tableau
 */
function getBody(resources) {
    return createEntireElement('tbody', { child: [
        previousFolder(),
        ...Object.values(resources).map(resource => {
            let nmersc = resource.nmersc ?? "";
            let icon = (resource.tpe === 'folder') ? "📁" : "📄";
            return createEntireElement('tr', { 
                child: [
                    createEntireElement('td', { innerText: `${icon} ${nmersc}` }),
                    createEntireElement('td', { innerText: resource.sze ?? 0 }),
                    createEntireElement('td', { innerText: resource.lstmod ?? "" })
                ],
                onclick: async function () {
                    if (resource.tpe === 'folder') { updateHistory(false, resource.idersc); await showFolder(resource.idersc); } 
                    else await showFile(resource.idersc);
                }
            });
        })
    ]})
}

/**
 * Affiche le contenue d'un dossier
 * 
 * @param {int} idersc L'identifiant de la ressource à générer 
 */
async function showFolder(idersc = null){
    clearTable(); 

    try {
        let folders = await getFolder(idersc);

        try { checkLogin(folders); } catch (error) { throw error; }

        if (!folders || folders.length === 0) {
            document.getElementById('content').appendChild(
                createEntireElement('table', { id: 'folderSelection', child: [
                    createEntireElement('thead', { child: [
                        createEntireElement('tr', { child: [
                            createEntireElement('th', { innerText: 'Dossier Vide', colspan: 3 })
                        ]})
                    ]}),
                    createEntireElement('tbody', { child: [
                        previousFolder()
                    ]})
                ]})
            )
            return;
        }

        document.getElementById('content').appendChild(
            createEntireElement('table', { id: 'folderSelection', child: [
                getHead(folders),
                getBody(folders)
            ]})
        );

    } catch (error) {
        console.error("Erreur lors de la récupération des dossiers: ", error)
    }

}

if (!document.getElementById('content')) document.body.appendChild(createEntireElement('div', { class: 'cnt', id: 'content'}));
localStorage.setItem('history', JSON.stringify([]));

showFolder();