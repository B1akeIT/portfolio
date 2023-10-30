function controllaLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const form = document.getElementById('login-form');

    var errori = 0;
    if (username.length === 0 || password.length === 0) {
        errori++;
        const formElement = document.getElementById('container-form');
        formElement.classList.add('inviato-required');
    }
    if (errori === 0) {

        form.submit();
/*        jQuery.ajax({
            url: 'servizio/database/login.php',
            type: 'post',
            data: { username: username, password: password},
            success: function(response) { alert(response); console.log('response'); console.log(response) }
        }).done(function (data) {
            console.log('data');
            console.log(data);
        });*/

        /*jQuery.ajax({
            url: "Login.php",
            data: {
                functionName: 'tentaLogin',
                arguments: [username, password]
            },
            success: function (obj, status) {
                console.log(status);
            }
        })*/
    }
}