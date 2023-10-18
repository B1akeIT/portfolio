<?php
require_once('servizio/Servizio.php');
require_once('servizio/componenti/gestore-progetti.php');
$json = file_get_contents('dati.json');
$data = json_decode($json);

$servizio = new Servizio();
$gestoreQuery = new GestoreQuery();

$lista_progetti = $gestoreQuery->getProgetti();
$gestoreProgetti = new GestoreProgetti($lista_progetti);
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
    <title> Progetti - Davide Giuntoli </title>

    <link rel="icon" href="img/logocode_small.svg">
</head>
<body>
<div class="background pagina-progetti">

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
        <article id="progetti">
            <h1>I miei progetti</h1>
            <h2 class="sottotitolo">L'archivio dei progetti in cui ho lavorato</h2>

            <section id="progetti-in-evidenza">
                <?php
                $gestoreProgetti->mostraProgettiInEvidenza();
                ?>
            </section>
            <section id="altri-progetti">

                <h2 class="titolo-progetti-secondari">Altri progetti degni di nota</h2>
                <?php
                $gestoreProgetti->mostraProgettiSecondari();
                ?>
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
