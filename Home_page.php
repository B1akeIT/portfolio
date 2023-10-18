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
                        foreach ($gestoreQuery->getSkills() as $skill) {
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
                    <?php
                    $gestoreProgetti->mostraProgettiInEvidenza();
                    ?>
            </section>
            <section id="altri-progetti">
                <h2 class="titolo-progetti-secondari">Altri progetti</h2>
                <p class="link-progetti-secondari">
                    <a href="Progetti.php">visualizza tutto</a>
                </p>
                <?php
                $gestoreProgetti->mostraProgettiSecondari();
                ?>
            </section>
        </article>

        <!-- Sezione contatti -->
        <article id="contatti">
            <section id="sezione-contatti" class="dettagli">
                <p class="contatti-sottotitolo">E adesso?</p>
                <h2 class="contatti-titolo">Realizziamo altre idee!</h2>
                <p class="contatti-descrizione">
                    Attualmente non sto cercando nuove opportunità di lavoro, ma la mia email è sempre aperta.
                    Se vuoi contattarmi per una domanda, un progetto o semplicemente per salutare, risponderò il prima
                    possibile!
                </p>
                <a class="contatti-email" href="Contatti.php">Parliamo</a>
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
