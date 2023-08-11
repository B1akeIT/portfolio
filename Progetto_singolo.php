<?php
require_once('servizio/Servizio.php');
$json = file_get_contents('dati.json');
$data = json_decode($json);

$servizio = new Servizio();
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
    <title> Accademia CODE - Davide Giuntoli </title>

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

                <div style="margin-bottom: 50px">
                    <h2><samp>Progetto in evidenza</samp></h2>
                    <div style="display: flex; flex-direction: row; align-content: center; gap: 15px;">
                        <h1>Accademia CODE</h1>

                        <div class="lista-link">
                            <a class="link" href="Progetto_singolo.php">
                                <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" stroke-width="2"
                                     stroke-linecap="round"
                                     stroke-linejoin="round" class="feather feather-external-link">
                                    <title>Link esterno</title>
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                    <polyline points="15 3 21 3 21 9"></polyline>
                                    <line x1="10" y1="14" x2="21" y2="3"></line>
                                </svg>
                            </a>
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
