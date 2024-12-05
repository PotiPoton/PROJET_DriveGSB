/* export */ function createEntireElement(element, attributes){
    let elm = document.createElement(element);
    if (!elm) throw new Error("Erreur lors de la création de l'élément")

    // console.log(`Création de l'élément : ${element} avec les attributs : ${attributes}`);

    if (attributes === undefined){
        return elm
    }
    for (let [key, value] of Object.entries(attributes)) {
        if (value === undefined) throw new Error(`Erreur lors de l'ajout de l'attribut ${key}`);
        if (key === 'innerText') elm.innerText = value;
        else if (key === 'innerHTML') elm.innerHTML = value;
        else if (key === 'style' && typeof value === 'object') {
            Object.assign(elm.style, value);
        } else if (key.startsWith('on') && typeof value === 'function') {
            elm.addEventListener(key.slice(2), value);
        } else elm.setAttribute(key, value);
    }
    return elm;
}

//*Exemple d'utilisation de createEntireElement :
// let div = createEntireElement('div', { id: 'cnt' });
// let iptBtn = createEntireElement('input', { 
//     type: 'button', 
//     value: 'Bonjour toi', 
//     onclick: function (e) {
//         e.preventDefault();
//         let existingP = document.getElementById('p');
//         if (existingP) existingP.remove();
//         else {
//             let p = createEntireElement('p', { 
//                 id: 'p', 
//                 innerText: 'SALUT BOTÉDAIZIL' });
//             document.body.appendChild(p);
//         }
//     }
// });
// document.body.appendChild(div);
// document.body.appendChild(iptBtn);

// function title(title){
//     let div = createEntireElement('div', {class: 'cnt'});    
//     let h1 = createEntireElement('h1', {innerText: title});
//     div.appendChild(h1);

//     return div;
// }

// //!=============================|
// //!    Useless For the moment   |
// //!=============================|
// function setCookie(name, value, days){
//     let expires = "";
//     if(days) {
//         const date = new Date();
//         date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
//         expires = `; expires=${date.toUTCString()}`;
//     }
//     document.cookie = `${name}=${encodeURIComponent(value) + expires}; path=/`;
// }

// function getCookie(name){
//     const nameEQ = `${name}=`;
//     const cookies = document.cookie.split(';');
//     for (let i = 0; i < cookies.length; i++) {
//         let cookie = cookies[i].trim();
//         if (cookie.indexOf(nameEQ) === 0){
//             return decodeURIComponent(cookie.substring(nameEQ.length));
//         }
//     }
//     return null;
// }