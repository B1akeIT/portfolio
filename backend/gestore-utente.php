<?php
require_once('../servizio/Servizio.php');
require_once('servizio/componenti/gestore-progetti.php');
$servizio = new Servizio();
$gestoreQuery = new GestoreQuery();
$gestoreProgetti = new GestoreProgetti();

$idProgetto = $servizio->getParametro('id');

$progetto = $gestoreQuery->getProgetto($idProgetto);
$contenuti = $gestoreQuery->getContenutiProgetto($idProgetto);
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
    <link href="../stile.css" type="text/css" rel="stylesheet"/>
    <title> <?php echo $progetto->nome ?> - Davide Giuntoli </title>

    <link rel="icon" href="../img/logocode_small.svg">
</head>
<body>
<div class="background pagina-progetto-singolo">

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

        <!-- Progetto -->
        <article id="progetto-singolo">

            <section>

                <div class="header">
                    <h2><samp><?php echo $progetto->tipo ?></samp></h2>
                    <div class="header-info">
                        <h1><?php echo $progetto->nome ?></h1>

                        <div class="lista-link">
                            <?php echo $gestoreProgetti->costruisciLinks($progetto->links) ?>
                        </div>
                    </div>
                    <p>
                        <?php echo $progetto->testo_intro ?>
                    </p>
                </div>
                <?php
                foreach ($contenuti as $contenuto) {
                    if ($contenuto["tipo"] == 'testo') {
                        echo '<p>' . $contenuto["testo"] . '</p>';
                    } elseif ($contenuto["tipo"] == 'immagine') {
                        echo '<div class="immagine-progetto-singolo">
                    <img src="' . $contenuto["immagine"] . '" title="' . $contenuto["nome"] . '" alt="' . $contenuto["nome"] . '"/>
                </div>';
                    }
                }
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
