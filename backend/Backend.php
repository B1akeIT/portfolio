<?php
require_once('../servizio/Servizio.php');
require_once('../servizio/componenti/gestore-progetti.php');

$servizio = new Servizio();
$gestoreQuery = new GestoreQuery();

$listaProgetti = $gestoreQuery->getProgetti();
$gestoreProgetti = new GestoreProgetti($listaProgetti);
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
    <title> Progetti - Davide Giuntoli </title>

    <link rel="icon" href="../img/logocode_small.svg">
</head>
<body>
<div class="background pagina-backend">

    <!-- Header con logo e pulsanti per la navigazione -->
    <?php
    $servizio->customHeader->showHeader(1);
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

        <!-- Sezione introduzione -->
        <article id="introduzione">
            <section id="introduzione">
                <h1>Backend</h1>
                <h2 class="sottotitolo">Da qui è possibile gestire i progetti e gli utenti in questo sito</h2>
            </section>
        </article>

        <!-- Sezione progetti -->
        <article>
            <section id="progetti">
                <h3 class="titolo-contenuto">Progetti</h3>
                <table class="tabella-progetti">
                    <thead>
                        <tr>
                            <th>Titolo</th>
                            <th class="hide-on-mobile">Construito con</th>
                            <th class="hide-on-mobile">Tipo progetto</th>
                            <th>Link</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    <?php
                    $testoProgetti = "";
                    foreach ($listaProgetti as $progetto) {
                        $testoProgetti .= "<tr>";
                        // Aggiungo i link del progetto
                        $testoProgetti .= "<td class='link-progetto'>";
                        $testoProgetti .= $gestoreProgetti->costruisciLinks($progetto->links, 1);
                        // Aggiungo titolo del progetto
                        $testoProgetti .= "</td><td class='titolo-progetto'>";
                        $testoProgetti .= $progetto->nome;
                        // Aggiungo tecnologie del progetto
                        $testoProgetti .= "</td><td class='tecnologie-progetto'>";
                        $testoProgetti .= str_replace(',', ' ·', $progetto->tecnologie);
                        // Aggiungo tipo del progetto
                        $testoProgetti .= "</td><td class='tipo-progetto'>";
                        $testoProgetti .= $progetto->tipo;
                        // Aggiungo icone per le operazioni
                        $testoProgetti .= "</td><td class='operazioni-progetto'>";
                        $testoProgetti .= "<a href='Backend.php' title='Visualizza progetto' class='visualizza-progetto'><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 512'><path d='M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z'/></svg></a>";
                        $testoProgetti .= "<a href='Backend.php' title='Modifica progetto' class='modifica-progetto'><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path d='M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z'/></svg></a>";
                        $testoProgetti .= "<a href='Backend.php' title='Elimina progetto' class='elimina-progetto'><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512'><path d='M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z'/></svg></a>";
                        $testoProgetti .= "</td></tr>";
                    }
                    echo $testoProgetti;

                    ?>
                    </tbody>
                </table>
            </section>

            <section id="utenti">
                <h3 class="titolo-contenuto">Utenti</h3>
            </section>

            <section id="categorie">
                <h3 class="titolo-contenuto">Categorie di utenti</h3>
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
