<?php
require_once('servizio/Servizio.php');
$json = file_get_contents('dati.json');
$data = json_decode($json);
$servizio = new Servizio();

$nome = '';
$email = '';
$messaggio = '';

$nomeValido = null;
$emailValida = null;
$messaggioValido = null;
$classeForm = '';

$inviato = $servizio->getParametro('inviato');
if ($inviato) {
    $nome = $servizio->getParametro('nome');
    $nomeValido = $servizio->validazioneStringa($nome);
    $email = $servizio->getParametro('email');
    $emailValida = $servizio->validazioneStringa($email);
    $messaggio = $servizio->getParametro('messaggio');
    $messaggioValido = $servizio->validazioneStringa($messaggio);

    if ($nomeValido && $emailValida && $messaggioValido) {
        $classeForm = 'inviato-successo';
        $servizio->inviaDatiContatto("dettagliContatto.txt", $nome, $email, $messaggio);
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
    <title> Contatti - Davide Giuntoli </title>

    <link rel="icon" href="img/logocode_small.svg">
</head>
<body>


<div class="background pagina-contatti">

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
        <article id="contatti">

            <section>

                <div class="container-testo">
                    <h2><samp>Hai un problema da risolvere?</samp></h2>
                    <h1>Mettiamoci in contatto e lavoriamo ad una soluzione!</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ante justo,
                        faucibus sed sodales eget, pellentesque vitae nulla. Donec accumsan, felis id
                        sodales posuere, ex massa maximus lectus, congue venenatis libero tellus vitae
                        turpis.
                    </p>
                </div>

                <div <?php echo 'class="container-form ' . $classeForm . '"' ?>>
                    <form action="Contatti.php" method="POST">
                        <div class="form-nome" style="margin-bottom: 10px">
                            <label for="nome">
                                <span>Nome *</span>
                            </label>
                            <div class="input-container">
                                <div class="icona-nome">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#495670">
                                        <path d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h17z"></path>
                                    </svg>
                                </div>
                                <input placeholder="Nome" id="nome" name="nome" type="text" required maxlength="50"
                                       value="<?php echo $nome ?>"/>
                            </div>
                        </div>
                        <div class="form-mail" style="margin-bottom: 10px; margin-top: 10px">
                            <label for="mail">
                                <span>Email *</span>
                            </label>
                            <div class="input-container">
                                <div class="icona-mail">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#495670">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                                    </svg>
                                </div>
                                <input placeholder="Email" id="mail" name="email" type="email" required
                                       value="<?php echo $email ?>"/>
                            </div>
                        </div>
                        <div class="form-messaggio" style="margin-top: 10px">
                            <label for="messaggio">
                                <span>Messaggio *</span>
                            </label>
                            <div class="input-container">
                                <textarea placeholder="Messaggio" id="messaggio" name="messaggio" rows="6"
                                          required><?php echo $messaggio ?></textarea>
                            </div>
                        </div>

                        <div class="alert-errore">
                            <p>Attenzione ai dati inseriti!</p>
                        </div>

                        <input type="hidden" name="inviato" value="1">
                        <button type="submit" class="button-invia-email">
                            Invia!
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
