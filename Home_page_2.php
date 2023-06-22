<?php
require_once('servizio/Servizio.php');
$json = file_get_contents('dati.json');
$data = json_decode($json);

$customHeader = new CustomHeader;
$customAside = new CustomAside;
$customFooter = new CustomFooter;

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
    <title> Davide Giuntoli </title>

    <link rel="icon" href="img/logocode_small.svg">
</head>
<body>
<div class="background home-page">

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

        <!-- Introduzione -->
        <article id="introduzione">
            <section class="introduzione">
                <h1>
                    <span class="titolo-piccolo"> Ciao, mi chiamo </span>
                    <span class="titolo-grande"> Davide Giuntoli. </span>
                </h1>
                <h2 class="titolo-secondario">Costruisco idee per il web.</h2>
                <p class="dettagli-introduzione">
                    Sono uno sviluppatore web focalizzato nella costruzione di esperienze digitali ottimali.
                    Attualmente, ricopro una posizione da sviluppatore front-end in
                    <a href="https://myvirtualab.it/" target="_blank">
                        MyVirtualab
                    </a>
                </p>
            </section>
        </article>

        <!-- Sezione Chi sono -->
        <article id="chi-sono">
            <h2 class="titolo-numerato">Chi sono</h2>

            <section class="dettagli">
                <div>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eu turpis quis diam bibendum
                        dictum
                        ac in quam. Nulla facilisi. Fusce a sem vitae nisl dignissim viverra. Aliquam quis urna ornare,
                        dapibus lectus eu, finibus nisi. In ullamcorper tempor quam at faucibus. Nullam quis libero sed
                        sapien aliquet pulvinar. Integer eleifend, nibh ac sollicitudin finibus, nibh dolor convallis
                        lorem,
                        id luctus augue mi eget felis.
                    </p>
                    <p>
                        Fino ad ora, ho avuto il piacere di lavorare con
                        <a target="_blank">una giovane startup</a> ed
                        <a target="_blank"> un'agenzia di inbound marketing</a> e di studiare con
                        <a target="_blank">un'agenzia formativa</a>.
                    </p>
                    <p>
                        Infine, sto frequentando un corso di formazione tenuto dall'
                        <a target="_blank">Accademia CODE</a> di Torino.
                        Questo stesso sito sarà sottoposto alla loro valutazione!
                    </p>
                    <p>
                        Questi sono i linguaggi e le tecnologie con cui sto lavorando attualmente:
                    </p>
                    <ul class="lista-skills">
                        <?php
                        foreach ($data->lista_skills as $skill) {
                            echo "<li>" . $skill . "</li>";
                        }

                        ?>
                    </ul>
                </div>
                <div class="immagine-chi-sono">
                    <div class="immagine-background">
                        <div>
                            <img width="500" height="500"
                                 src="img/immagine_placeholder.jpg" alt="Immagine placeholder"
                                 title="Immagine placeholder"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </article>

        <!-- Sezione esperienze lavorative -->
        <article id="esperienze-lavorative">
            <h2 class="titolo-numerato">Dove ho lavorato</h2>

            <section class="dettagli" style="padding-top: 0;">
                <h3 class="esperienza-lavorativa">Angular Developer
                    <span class="nome-azienda">@ <a>MyVirtualab</a></span></h3>
                <p class="periodo-lavorativo">Gen 2023 - Attuale</p>
                <div>
                    <ul>
                        <li>Sviluppo front-end in Angular, HTML e SCSS</li>
                        <li>Lavoro dinamico in più progetti e team</li>
                        <li>
                            Confronto costante coi membri del team tramite utilizzo di Git e della metodologia Agile
                        </li>
                    </ul>
                </div>
            </section>

            <section class="dettagli">
                <h3 class="esperienza-lavorativa">Full stack Developer
                    <span class="nome-azienda">@ <a>Mediaus</a></span></h3>
                <p class="periodo-lavorativo">Dic 2021 - Dic 2022</p>
                <div>
                    <ul>
                        <li>Sviluppo front-end in Vue.js, HTML e SCSS</li>
                        <li>Sviluppo ed assistenza su piattaforme WordPress e Magento 2.4.2 con l'ausilio di PHP</li>
                        <li>Confronto costante con membri dei team e clienti</li>
                    </ul>
                </div>
            </section>

            <section class="dettagli">
                <h3 class="esperienza-lavorativa">Angular Developer
                    <span class="nome-azienda">@ <a>Hastega</a></span></h3>
                <p class="periodo-lavorativo">Nov 2020 - Dic 2021</p>
                <div>
                    <ul>
                        <li>Sviluppo front-end in Angular, HTML e SCSS</li>
                        <li>Utilizzo dei framework Bootstrap e Tailwind</li>
                        <li>
                            Confronto costante coi membri del team tramite utilizzo di Git e della metodologia Agile
                            Scrum
                        </li>
                    </ul>
                </div>
            </section>
        </article>

        <!-- Sezione progetti -->
        <article id="progetti">
            <h2 class="titolo-numerato">I miei progetti</h2>
            <section id="progetti-in-evidenza" style="padding-top: 10px">
                <ul>
                    <?php
                    foreach ($data->progetti_in_evidenza as $progetto) {
                        echo "<li class='progetto-in-evidenza'>" .
                            "<div class='contenuto-progetto'>
                            <div>
                                <p class='sottotitolo-progetto'>Progetto in evidenza</p>
                                <h3 class='titolo-progetto'>
                                    <a target='_blank' href='" . $progetto->href . "'>" . $progetto->nome . "</a>
                                </h3>
                                <div class='descrizione-progetto'>
                                    <p>" . $progetto->testo_intro . "
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class='immagine-progetto'>
                            <a target='_blank' href='" . $progetto->href . "'>
                                <div style='max-width: 700px; display: block;'>
                                    <img alt='" . $progetto->banner->alt . "' src='" . $progetto->banner->src . "'/>
                                </div>
                            </a>
                        </div>";
                    }
                    ?>
                </ul>
            </section>
            <section id="altri-progetti">

                <h2 class="titolo-progetti-secondari">Altri progetti</h2>
                <p style="text-align: center">
                    <a class="link-progetti-secondari" href="Progetti_2.php">visualizza tutto</a>
                </p>
                <ul class="tabella-progetti-secondari">
                    <?php
                    foreach (array_slice($data->progetti_secondari, 0, 6) as $progetto) {
                        echo "<li class=\"progetto-secondario\">
                            <div class=\"contenuto-progetto\">
                                <div>
                                    <div class=\"header\">
                                        <div style=\"color: #64FFDA;\">
                                            <svg xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" viewBox=\"0 0 24 24\"
                                                 fill=\"none\" stroke=\"currentColor\" stroke-width=\"1\" stroke-linecap=\"round\"
                                                 stroke-linejoin=\"round\" class=\"icona-cartella\">
                                                <title> Cartella </title>
                                                <path d=\"M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z\"></path>
                                            </svg>
                                        </div>
                                        <div class=\"lista-link\">";
                                            echo $servizio->gestoreProgetti->costruisciLinks($progetto->links);
                                        echo "
                                    </div>
                                </div>
                                <h3 class=\"titolo-progetto\">
                                    " . $progetto->nome . "
                                </h3>
                                <div class=\"descrizione-progetto\">
                                    <p>
                                        " . $progetto->testo_intro . "
                                    </p>
                                </div>
                            </div>
                            <div class=\"tecnologie-progetto\">
                                <ul class=\"lista-tecnologie\">";
                                    foreach ($progetto->tecnologie as $tecnologia) {
                                        echo "<li>" . $tecnologia . "</li>";
                                    }
                                echo "</ul>
                            </div>
                        </div>
                    </li>";
                    } ?>
                </ul>
            </section>
        </article>

        <!-- Sezione contatti -->
        <article id="contatti">
            <section id="sezione-contatti" class="dettagli" style="align-items: center;">
                <p class="contatti-sottotitolo">E adesso?</p>
                <h2 class="contatti-titolo">Realizziamo altre idee!</h2>
                <p class="contatti-descrizione">
                    Attualmente non sto cercando nuove opportunità di lavoro, ma la mia email è sempre aperta.
                    Se vuoi contattarmi per una domanda, un progetto o semplicemente per salutare, risponderò il prima
                    possibile!
                </p>
                <a class="contatti-email" href="Contatti.html">Parliamo</a>
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
