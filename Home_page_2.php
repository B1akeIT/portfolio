<?php

$json = file_get_contents('dati.json');
$data = json_decode($json);

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
<div class="background">

    <!-- Header con logo e pulsanti per la navigazione -->
    <header>
        <nav>
            <input type="checkbox" id="nav-check">
            <div class="header-logo">
                <a href="Home_page.html">
                    <img
                            src="img/logocode_small.svg" alt="Davide Giuntoli"
                            title="Davide Giuntoli"
                    />
                </a>
            </div>
            <ul class="button-list">
                <li class="button-chi-sono">
                    <a href="#introduzione">Chi sono</a>
                </li>
                <li class="button-esperienze">
                    <a href="#esperienze-lavorative">Esperienze</a>
                </li>
                <li class="button-progetti">
                    <a href="Progetti.html">Progetti</a>
                </li>
                <li class="button-contatti">
                    <a href="Contatti.html">Contatti</a>
                </li>
            </ul>
            <div class="nav-btn">
                <label for="nav-check">
                    <span></span>
                    <span></span>
                    <span></span>
                </label>
            </div>
            <div class="mobile-button-list">
                <span class="button-chi-sono">
                    <a href="#introduzione">Chi sono</a>
                </span>
                <span class="button-esperienze">
                    <a href="#esperienze-lavorative">Esperienze</a>
                </span>
                <span class="button-progetti">
                    <a href="Progetti.html">Progetti</a>
                </span>
                <span class="button-contatti">
                    <a href="Contatti.html">Contatti</a>
                </span>
            </div>
        </nav>
    </header>

    <!-- Contenuto laterale social -->
    <aside id="social">
        <ul class="lista-social">
            <li>
                <a>
                    <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24"
                         fill="none" stroke="currentColor" stroke-width="2"
                         stroke-linecap="round"
                         stroke-linejoin="round" class="feather feather-github">
                        <title>GitHub</title>
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                </a>
            </li>
            <li>
                <a>
                    <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                         class="feather feather-linkedin">
                        <title>LinkedIn</title>
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                </a>
            </li>
            <li style="margin-bottom: 20px;">
                <a>
                    <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                         class="feather feather-instagram">
                        <title>Instagram</title>
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                </a>
            </li>
        </ul>
    </aside>

    <!-- Contenuto laterale email -->
    <aside id="email">
        <div>
            <a>giuntolidavide@gmail.com</a>
        </div>
    </aside>

    <!-- Contenuto principale -->
    <main class="page-wrapper home-page">

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

                        <!--
                        <li>Angular 12+</li>
                        <li>JavaScript Es6</li>
                        <li>HTML + SCSS</li>
                        <li>PHP</li>
                        <li>MySQL</li>
                        <li>Wordpress</li>
                        -->
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
                    <!--
                    <li class="progetto-in-evidenza">
                        <div class="contenuto-progetto">
                            <div>
                                <p class="sottotitolo-progetto">Progetto in evidenza</p>
                                <h3 class="titolo-progetto">
                                    <a href="Progetto_singolo.html">Accademia CODE</a>
                                </h3>
                                <div class="descrizione-progetto">
                                    <p>
                                        Un corso per programmatori di tutti i livelli, progettato per una preparazione
                                        come full stack developer
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="immagine-progetto">
                            <a href="Progetto_singolo.html">
                                <div style="max-width: 700px; display: block;">
                                    <img alt="Immagine progetto CODE" src="img/progetto_code.png"/>
                                </div>
                            </a>
                        </div>
                    </li>
                    <li class="progetto-in-evidenza">
                        <div class="contenuto-progetto">
                            <div>
                                <p class="sottotitolo-progetto">Progetto in evidenza</p>
                                <h3 class="titolo-progetto">
                                    <a href="Progetto_singolo.html">Accademia Artesport di Pinerolo</a>
                                </h3>
                                <div class="descrizione-progetto">
                                    <p>
                                        Un'accademia pensata per il benessere delle persone a 360 gradi, seguita da
                                        specialisti delle arti marziali e con una grande varietà di corsi ed
                                        intrattenimenti.
                                        <br>
                                        La loro pagina web è stata da poco rinnovata. Vai a dare un'occhiata!
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="immagine-progetto">
                            <a href="Progetto_singolo.html">
                                <div style="max-width: 700px; display: block;">
                                    <img alt="Immagine progetto palestra Artesport" src="img/progetto_artesport.jpg"/>
                                </div>
                            </a>
                        </div>
                    </li>
                    <li class="progetto-in-evidenza">
                        <div class="contenuto-progetto">
                            <div>
                                <p class="sottotitolo-progetto">Progetto in evidenza</p>
                                <h3 class="titolo-progetto">
                                    <a href="Progetto_singolo.html">Netflix? Si, ma niente di serio</a>
                                </h3>
                                <div class="descrizione-progetto">
                                    <p>
                                        Prendendo spunto dalla famosa piattaforma Netflix, ho pensato di costruire una
                                        sito per streaming dalla struttura semplice ma accattivante.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="immagine-progetto">
                            <a href="Progetto_singolo.html">
                                <div style="max-width: 700px; display: block;">
                                    <img alt="Immagine progetto Netflix" src="img/progetto_netflix.jpg"/>
                                </div>
                            </a>
                        </div>
                    </li>
                    -->
                </ul>
            </section>
            <section id="altri-progetti">

                <h2 class="titolo-progetti-secondari">Altri progetti</h2>
                <p style="text-align: center">
                    <a class="link-progetti-secondari" href="Progetti.html">visualizza tutto</a>
                </p>
                <ul class="tabella-progetti-secondari">
                    <?php
                    foreach ($data->progetti_secondari as $progetto) {
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
                                            // Scorre i link del progetto
                                            foreach ($progetto->links as $link) {
                                                // Prepara il link di riferimento nel tag
                                                echo "<a class=\"link\" href=" . $link->href . ">";
                                                // Stampa l'icona giusta, in base al tipo di icona
                                                if ($link->tipo == "GitHub") {
                                                    echo "<svg xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" viewBox=\"0 0 24 24\"
                                                         fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"
                                                         stroke-linecap=\"round\"
                                                         stroke-linejoin=\"round\" class=\"feather feather-github\">
                                                        <title>GitHub</title>
                                                        <path d=\"M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22\"></path>
                                                    </svg>";
                                                }
                                                if ($link->tipo == "Link esterno") {
                                                    echo "<svg xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" viewBox=\"0 0 24 24\"
                                                         fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"
                                                         stroke-linecap=\"round\"
                                                         stroke-linejoin=\"round\" class=\"feather feather-external-link\">
                                                        <title>Link esterno</title>
                                                        <path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"></path>
                                                        <polyline points=\"15 3 21 3 21 9\"></polyline>
                                                        <line x1=\"10\" y1=\"14\" x2=\"21\" y2=\"3\"></line>
                                                    </svg>";
                                                }
                                                // Chiudo il tag che contiene il link e l'icona
                                                echo "</a>";
                                            }
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
                    <!--
                    <li class="progetto-secondario">
                        <div class="contenuto-progetto">
                            <div>
                                <div class="header">
                                    <div style="color: #64FFDA;">
                                        <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24"
                                             fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"
                                             stroke-linejoin="round" class="icona-cartella">
                                            <title> Cartella </title>
                                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                        </svg>
                                    </div>
                                    <div class="lista-link">


/*                                        foreach ($data->progetti_secondari as $progetto) {
                                            foreach ($progetto->links as $link)
                                            if ($link->tipo == "GitHub") {
                                                echo "<a class=\"link\">
                                                        <svg xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" viewBox=\"0 0 24 24\"
                                                             fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"
                                                             stroke-linecap=\"round\"
                                                             stroke-linejoin=\"round\" class=\"feather feather-github\">
                                                            <title>GitHub</title>
                                                            <path d=\"M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22\"></path>
                                                        </svg>
                                                    </a>";
                                            }
                                            if ($link->tipo == "Link esterno") {
                                                echo "<a class=\"link\" href=\"Progetto_singolo.html\">
                                                        <svg xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" viewBox=\"0 0 24 24\"
                                                             fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"
                                                             stroke-linecap=\"round\"
                                                             stroke-linejoin=\"round\" class=\"feather feather-external-link\">
                                                            <title>Link esterno</title>
                                                            <path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"></path>
                                                            <polyline points=\"15 3 21 3 21 9\"></polyline>
                                                            <line x1=\"10\" y1=\"14\" x2=\"21\" y2=\"3\"></line>
                                                        </svg>
                                                    </a>";
                                            }
                                        }
                                        */
                                        <a class="link">
                                            <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24"
                                                 fill="none" stroke="currentColor" stroke-width="2"
                                                 stroke-linecap="round"
                                                 stroke-linejoin="round" class="feather feather-github">
                                                <title>GitHub</title>
                                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                            </svg>
                                        </a>
                                        <a class="link" href="Progetto_singolo.html">
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
                                <h3 class="titolo-progetto">
                                    Clone Spotify
                                </h3>
                                <div class="descrizione-progetto">
                                    <p>
                                        Seguendo la stessa filosofia del progetto di Netflix, ho creato una copia dello
                                        stile di Spotify, moderno e chiaro.
                                    </p>
                                </div>
                            </div>
                            <div class="tecnologie-progetto">
                                <ul class="lista-tecnologie">
                                    <li>Alpine.js</li>
                                    <li>Tailwind CSS</li>
                                    <li>PHP</li>
                                </ul>
                            </div>
                        </div>
                    </li>
                    <li class="progetto-secondario">
                        <div class="contenuto-progetto">
                            <div>
                                <div class="header">
                                    <div style="color: #64FFDA;">
                                        <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24"
                                             fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"
                                             stroke-linejoin="round" class="icona-cartella">
                                            <title> Cartella </title>
                                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                        </svg>
                                    </div>
                                    <div class="lista-link">
                                        <a class="link" href="Progetto_singolo.html">
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
                                <h3 class="titolo-progetto">
                                    Lorem ipsum library
                                </h3>
                                <div class="descrizione-progetto">
                                    <p>
                                        Una vasta lista di font e colori per aiutarmi nella scelta degli stili nei siti
                                        che
                                        costruisco
                                    </p>
                                </div>
                            </div>
                            <div class="tecnologie-progetto">
                                <ul class="lista-tecnologie">
                                    <li>Javascript</li>
                                    <li>SCSS</li>
                                </ul>
                            </div>
                        </div>
                    </li>
                    <li class="progetto-secondario">
                        <div class="contenuto-progetto">
                            <div>
                                <div class="header">
                                    <div style="color: #64FFDA;">
                                        <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24"
                                             fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"
                                             stroke-linejoin="round" class="icona-cartella">
                                            <title> Cartella </title>
                                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                        </svg>
                                    </div>
                                    <div class="lista-link">
                                        <a class="link" href="Progetto_singolo.html">
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
                                <h3 class="titolo-progetto">
                                    Compatibilità coi browser
                                </h3>
                                <div class="descrizione-progetto">
                                    <p>
                                        Quali tag sono supportati in Google Chrome? Ed in Safari? Questa pagina chiarirà
                                        tutti i dubbi a riguardo!
                                    </p>
                                </div>
                            </div>
                            <div class="tecnologie-progetto">
                                <ul class="lista-tecnologie">
                                    <li>Angular 10</li>
                                    <li>Bootstrap CSS</li>
                                    <li>PHP</li>
                                </ul>
                            </div>
                        </div>
                    </li>
                    <li class="progetto-secondario">
                        <div class="contenuto-progetto">
                            <div>
                                <div class="header">
                                    <div style="color: #64FFDA;">
                                        <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24"
                                             fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"
                                             stroke-linejoin="round" class="icona-cartella">
                                            <title> Cartella </title>
                                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                        </svg>
                                    </div>
                                    <div class="lista-link">
                                        <a class="link">
                                            <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24"
                                                 fill="none" stroke="currentColor" stroke-width="2"
                                                 stroke-linecap="round"
                                                 stroke-linejoin="round" class="feather feather-github">
                                                <title>GitHub</title>
                                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                                <h3 class="titolo-progetto">
                                    Clone Google Calendar
                                </h3>
                                <div class="descrizione-progetto">
                                    <p>
                                        Seguendo la stessa filosofia del progetto di Netflix, ho creato una copia dello
                                        stile dell'usatissimo Google Calendar.
                                    </p>
                                </div>
                            </div>
                            <div class="tecnologie-progetto">
                                <ul class="lista-tecnologie">
                                    <li>Angular</li>
                                    <li>Tailwind CSS</li>
                                </ul>
                            </div>
                        </div>
                    </li>
                    <li class="progetto-secondario">
                        <div class="contenuto-progetto">
                            <div>
                                <div class="header">
                                    <div style="color: #64FFDA;">
                                        <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24"
                                             fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"
                                             stroke-linejoin="round" class="icona-cartella">
                                            <title> Cartella </title>
                                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                        </svg>
                                    </div>
                                    <div class="lista-link">
                                        <a class="link" href="Progetto_singolo.html">
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
                                <h3 class="titolo-progetto">
                                    CV Personale
                                </h3>
                                <div class="descrizione-progetto">
                                    <p>
                                        Uno dei miei primi progetti: replicare il mio CV creato online in codice HTML e
                                        CSS
                                    </p>
                                </div>
                            </div>
                            <div class="tecnologie-progetto">
                                <ul class="lista-tecnologie">
                                    <li>HTML</li>
                                    <li>CSS</li>
                                </ul>
                            </div>
                        </div>
                    </li>
                    <li class="progetto-secondario">
                        <div class="contenuto-progetto">
                            <div>
                                <div class="header">
                                    <div style="color: #64FFDA;">
                                        <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24"
                                             fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"
                                             stroke-linejoin="round" class="icona-cartella">
                                            <title> Cartella </title>
                                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                        </svg>
                                    </div>
                                    <div class="lista-link">
                                        <a class="link">
                                            <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24"
                                                 fill="none" stroke="currentColor" stroke-width="2"
                                                 stroke-linecap="round"
                                                 stroke-linejoin="round" class="feather feather-github">
                                                <title>GitHub</title>
                                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                            </svg>
                                        </a>
                                        <a class="link" href="Progetto_singolo.html">
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
                                <h3 class="titolo-progetto">
                                    Lista IDE
                                </h3>
                                <div class="descrizione-progetto">
                                    <p>
                                        Non sai quale IDE fa al caso tuo per i tuoi progetti e per il tuo codice? Temi
                                        che Visual Studio Code non sia la scelta giusta? Questo sito compara un vasto
                                        numero di programmi che puoi usare per il tuo lavoro!
                                    </p>
                                </div>
                            </div>
                            <div class="tecnologie-progetto">
                                <ul class="lista-tecnologie">
                                    <li>Vue.js</li>
                                    <li>Bootstrap CSS</li>
                                    <li>PHP</li>
                                </ul>
                            </div>
                        </div>
                    </li>
                    -->
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
    <footer>
        <!--
        Questa parte del footer con i dettagli dei social compare
        solo se lo schermo non è abbastanza largo per fare spazio ai contenuti laterali
        -->
        <div class="footer-social">
            <ul class="lista-social">
                <li>
                    <a>
                        <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24"
                             fill="none" stroke="currentColor" stroke-width="2"
                             stroke-linecap="round"
                             stroke-linejoin="round" class="feather feather-github">
                            <title>GitHub</title>
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                    </a>
                </li>
                <li>
                    <a>
                        <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             class="feather feather-linkedin">
                            <title>LinkedIn</title>
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                            <rect x="2" y="9" width="4" height="12"></rect>
                            <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                    </a>
                </li>
                <li>
                    <a>
                        <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             class="feather feather-instagram">
                            <title>Instagram</title>
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                    </a>
                </li>
            </ul>
        </div>
        <div class="footer-contenuto">
            <p>Sviluppato da Davide Giuntoli</p>
            <p>Junior frontend developer</p>
        </div>
    </footer>
</div>
</body>
</html>
