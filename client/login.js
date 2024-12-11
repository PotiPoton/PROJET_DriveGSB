// import { createEntireElement } from './organistionHTML.tempName';
// const BASE_URL = 'https://api.drivegsb.local/index.php';

/**
 *! Pour une sécurité complète il faut passer le site en https pour le mot de passe 
 *! passé en post soit masquer dans un paquet tracer par exemple. (wireshark)
 * 
 * @param {*} lgn 
 * @param {*} pwd 
 * @returns 
 */
async function login(lgn, pwd) {
    let BASE_URL = 'https://api.drivegsb.local/index.php';
    let response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `lgn=${lgn}&pwd=${pwd}`,
        credentials: 'include'
    });

    let data = await response.json();

    // uncomment to see into the logs
    // console.log('data : ', data);

    if (data.status === 'error') {
        if (data.message.includes('token')) return 'login';
        throw new Error(data.message);
    }    

    return data.goTo;
}

function form_login() {

    document.head.title = 'Login'
    let div = createEntireElement('div', {id: 'form_login', class: 'cnt center box medium'});
    let h2 = createEntireElement('h2', {innerText: 'Connexion'});
    let form = createEntireElement('form', {action: '', method: 'post'});
    let iptlgn = createEntireElement('input', {type: 'text', name: 'login', id: 'lgn', placeholder: 'Nom d\'utilisateur'});
    let iptpwd = createEntireElement('input', {type: 'password', name: 'password', id: 'pwd', placeholder: 'Mot de passe'});
    let iptsbm = createEntireElement('input', {type: 'submit', id: 'connect', value: 'Se connecter', 
        onclick: async function (e) {
            e.preventDefault();
            
            let lgn = document.getElementById('lgn').value;
            let pwd = document.getElementById('pwd').value;
            try {
                if (!lgn || !pwd) throw new Error('Veuillez remplir tous les champs !'); 
                let goTo = await login(lgn, pwd);
                
                let formLogin = document.getElementById('form_login');
                if (formLogin) formLogin.remove();

                let index = createEntireElement('script', {src: `./${goTo}.js`});
                document.body.appendChild(index);
            } catch(error) {
                console.error('ERREUR', error.message);
                alert(error.message);
            }
        }
    });

    form.appendChild(iptlgn);
    form.appendChild(iptpwd);
    form.appendChild(iptsbm);
    div.appendChild(h2);
    div.appendChild(form);

    document.body.appendChild(div);
    return div;
}

form_login();