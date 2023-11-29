function controllaLogin() {
    const form = document.getElementById('login-form');
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    var errori = 0;
    if (username.length === 0 || password.length === 0) {
        errori++;
        const formElement = document.getElementById('container-form');
        formElement.classList.add('inviato-required');
    }
    if (errori === 0) {
        form.submit();
    }
}

function modificaCategoria() {
    const form = document.getElementById('categoria-form');
    const nomeCategoria = document.getElementById('categoria_nome').value.trim();
    var errori = 0;
    if (nomeCategoria.length === 0) {
        errori++;
    }

    if (errori === 0) {
        form.submit();
    }
}

function modificaUtente() {
    const form = document.getElementById('utente-form');
    const nomeUtente = document.getElementById('utente-nome').value.trim();
    var errori = 0;
    if (nomeUtente.length === 0) {
        errori++;
    }

    if (errori === 0) {
        form.submit();
    }
}