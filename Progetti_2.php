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
    <title> Progetti - Davide Giuntoli </title>

    <link rel="icon" href="img/logocode_small.svg">
</head>
<body>


<div class="background">

    <!-- Header con logo e pulsanti per la navigazione -->
    <header>
        <nav>
            <input type="checkbox" id="nav-check">
            <div class="header-logo">
                <a href="Home_page_2.php">
                    <img
                            src="img/logocode_small.svg" alt="Davide Giuntoli"
                            title="Davide Giuntoli"
                    />
                </a>
            </div>
            <ul class="button-list">
                <li class="button-chi-sono">
                    <a href="Home_page_2.php#introduzione">Chi sono</a>
                </li>
                <li class="button-esperienze">
                    <a href="Home_page_2.php#esperienze-lavorative">Esperienze</a>
                </li>
                <li class="button-progetti">
                    <a href="Progetti_2.php" style="color: #64FFDA;">Progetti</a>
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
                    <a href="Home_page_2.php">Chi sono</a>
                </span>
                <span class="button-esperienze">
                    <a href="Home_page_2.php">Esperienze</a>
                </span>
                <span class="button-progetti">
                    <a href="Progetti_2.php" style="color: #64FFDA;">Progetti</a>
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
                         stroke-linejoin="round">
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
    <main class="page-wrapper pagina-progetti">

        <!-- Sezione progetti -->
        <article id="progetti">
            <h1>I miei progetti</h1>
            <h2 class="sottotitolo">L'archivio dei progetti in cui ho lavorato</h2>

            <section id="progetti-in-evidenza">
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

                <h2 class="titolo-progetti-secondari">Altri progetti degni di nota</h2>
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
                </ul>
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
