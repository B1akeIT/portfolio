<?php
require_once(realpath($_SERVER["DOCUMENT_ROOT"] . '/portfolio/servizio/Servizio.php'));
$servizio = new Servizio();
$gestoreQuery = new GestoreQuery();
$nome = '';
$password = '';

$nomeValido = null;
$passwordValida = null;
$classeForm = '';

$inviato = $servizio->getParametro('inviato');
if ($inviato) {
    $nome = $servizio->getParametro('nome');
    $nomeValido = $servizio->validazioneStringa($nome);
    $password = $servizio->getParametro('password');
    $passwordValida = $servizio->validazioneStringa($password);

    if ($nomeValido && $passwordValida) {
        $classeForm = 'inviato-successo';
    } else {
        $classeForm = 'inviato-errore';
    }
}

?>

<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta name="description"
          content="Davide Giuntoli è uno sviluppatore frontend focalizzato nei framework JavaScript, in special modo Angular, per creare esperienze digitali ottimali.">

    <link href="https://fonts.googleapis.com/css?family=Poppins" rel="stylesheet">
    <link href="https://fonts.cdnfonts.com/css/calibre" rel="stylesheet">
    <link href="https://fonts.cdnfonts.com/css/sf-mono" rel="stylesheet">
    <link href="stile.css" type="text/css" rel="stylesheet"/>
    <title> Login - Davide Giuntoli </title>

    <link rel="icon" href="img/logocode_small.svg">
</head>
<body>
<script src="backend/gestore-dati.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>

<div class="background pagina-login">

    <!-- Header con logo e pulsanti per la navigazione -->
    <?php
    $servizio->customHeader->showHeader();
    ?>

    <!-- Contenuto laterale social -->
    <?php
    $servizio->customAside->showSocialAside();
    ?>

    <!-- Contenuto laterale email -->
    <?php
    $servizio->customAside->showEmailAside();
    ?>

    <!-- Contenuto principale -->
    <main class="page-wrapper">

        <!-- Sezione progetti -->
        <article id="login">

            <section>

                <div class="container-testo">
                    <h2><samp>Bentornato/a!</samp></h2>
                    <h1>Effettua il login</h1>
                </div>

                <div id="container-form" <?php echo 'class="container-form ' . $classeForm . '"' ?>>
                    <form name="login-form">
                        <div class="form-nome">
                            <label for="username">
                                <span>Nome</span>
                            </label>
                            <div class="input-container">
                                <div class="icona-nome">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#495670">
                                        <path d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h17z"></path>
                                    </svg>
                                </div>
                                <input placeholder="Nome" id="username" name="username" type="text" required maxlength="50"/>
                            </div>
                        </div>
                        <div class="form-password">
                            <label for="password">
                                <span>Password</span>
                            </label>
                            <div class="input-container">
                                <div class="icona-password">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="#495670">
                                        <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"/>
                                    </svg>
                                </div>
                                <input placeholder="Password" id="password" name="password" type="password" required/>
                            </div>
                        </div>

                        <div class="alert-errore">
                            <p>Attenzione ai dati inseriti!</p>
                        </div>

                        <div class="alert-required">
                            <p>Inserire dati che non siano spazi!</p>
                        </div>

                        <input type="hidden" name="inviato" value="1">
                        <button type="button" class="button-login" id="button-login" onclick="controllaLogin()">
                            Login
                        </button>
                    </form>
                </div>

            </section>
        </article>
    </main>

    <!-- Footer -->
    <?php
    $servizio->customFooter->showFooter();
    ?>

</div>

</body>
</html>
