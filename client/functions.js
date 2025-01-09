function createEntireElement(element, attributes){
    let elm = document.createElement(element);

    // console.log(`Création de l'élément : ${element} avec les attributs : ${attributes}`);

    if (attributes === undefined){
        return elm
    }
    for (let [key, value] of Object.entries(attributes)) {
        if (value !== undefined) {
            if (key === 'innerText') elm.innerText = value;
            else if (key === 'innerHTML') elm.innerHTML = value;
            else if (key === 'style' && typeof value === 'object') {
                Object.assign(elm.style, value);
            } else if (key.startsWith('on') && typeof value === 'function') {
                elm.addEventListener(key.slice(2), value);
            } else if (key === 'child' && Array.isArray(value)) {
                value.forEach(child => { 
                    if (typeof child === 'function') child = child();
                    if (child !== undefined) elm.appendChild(child); 
                });
            } else elm.setAttribute(key, value);
        }
    }
    return elm;
}

function checkLogin(data){
    if (data === "login") {
        if (document.getElementById('nav')) document.getElementById('nav').remove();
        document.body.appendChild(createEntireElement('script', {src: './login.js'}));
        throw new Error('user not logged (token invalid or null)');
    }
}