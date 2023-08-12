<?php
require_once('servizio/Servizio.php');
require_once('servizio/componenti/gestore-progetti.php');
$json = file_get_contents('dati.json');
$data = json_decode($json);

$servizio = new Servizio();
$gestoreProgetti = new GestoreProgetti();
$listaProgetti = $data->lista_progetti;
$idProgetto = $servizio->getParametro('id');
print_r($idProgetto);
$progetto = array_filter($listaProgetti, function ($obj) use ($idProgetto) {
    return $obj->id == $idProgetto;
})[1];
print_r($progetto)
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
    <title> <?php echo $progetto->nome ?> - Davide Giuntoli </title>

    <link rel="icon" href="img/logocode_small.svg">
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
                    <h2><samp>Progetto in evidenza</samp></h2>
                    <div class="header-info">
                        <h1><?php echo $progetto->nome ?></h1>

                        <div class="lista-link">
                            <?php echo $gestoreProgetti->costruisciLinks($progetto->links) ?>
                        </div>
                    </div>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ante justo,
                        faucibus sed sodales eget, pellentesque vitae nulla. Donec accumsan, felis id
                        sodales posuere, ex massa maximus lectus, congue venenatis libero tellus vitae
                        turpis.
                    </p>
                </div>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eu turpis quis diam bibendum
                    dictum ac in quam.
                    Nulla facilisi. Fusce a sem vitae nisl dignissim viverra. Aliquam quis urna ornare,
                    dapibus lectus eu, finibus nisi. In ullamcorper tempor quam at faucibus. Nullam quis libero sed
                    sapien aliquet pulvinar.
                    Integer eleifend, nibh ac sollicitudin finibus, nibh dolor convallis
                    lorem, id luctus augue mi eget felis.
                </p>
                <div class="immagine-progetto-singolo">
                    <img src="img/progetto_code.png" title="Accademia CODE" alt="Accademia CODE"/>
                </div>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eu turpis quis diam bibendum
                    dictum ac in quam.
                    Nulla facilisi. Fusce a sem vitae nisl dignissim viverra. Aliquam quis urna ornare,
                    dapibus lectus eu, finibus nisi. In ullamcorper tempor quam at faucibus. Nullam quis libero sed
                    sapien aliquet pulvinar.
                    Integer eleifend, nibh ac sollicitudin finibus, nibh dolor convallis
                    lorem, id luctus augue mi eget felis.
                    Nulla facilisi. Fusce a sem vitae nisl dignissim viverra. Aliquam quis urna ornare,
                    dapibus lectus eu, finibus nisi. In ullamcorper tempor quam at faucibus. Nullam quis libero sed
                    sapien aliquet pulvinar.
                    Integer eleifend, nibh ac sollicitudin finibus, nibh dolor convallis
                    lorem, id luctus augue mi eget felis.
                </p>
                <div class="immagine-progetto-singolo">
                    <img src="img/progetto_code_2.jpeg" title="Accademia CODE" alt="Accademia CODE"/>
                </div>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eu turpis quis diam bibendum
                    dictum ac in quam.
                    Nulla facilisi. Fusce a sem vitae nisl dignissim viverra. Aliquam quis urna ornare,
                    dapibus lectus eu, finibus nisi. In ullamcorper tempor quam at faucibus. Nullam quis libero sed
                    sapien aliquet pulvinar.
                    Integer eleifend, nibh ac sollicitudin finibus, nibh dolor convallis
                    lorem, id luctus augue mi eget felis.
                    Nulla facilisi. Fusce a sem vitae nisl dignissim viverra. Aliquam quis urna ornare,
                    dapibus lectus eu, finibus nisi. In ullamcorper tempor quam at faucibus. Nullam quis libero sed
                    sapien aliquet pulvinar.
                    Integer eleifend, nibh ac sollicitudin finibus, nibh dolor convallis
                    lorem, id luctus augue mi eget felis.
                </p>

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
