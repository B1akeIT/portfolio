<?php

class Link
{
    public string $tipo = "";
    public string $href = "";
}

class Banner
{
    public string $src = "";
    public string $alt = "";
}

abstract class AbstractProgetto
{
    public string $nome = "";
    public string $testo_intro = "";
    public array $links = array();
}

class ProgettoInEvidenza extends AbstractProgetto
{
    public Banner $banner;

    public function __construct()
    {
    }

    /*
    public function __construct($nome)
    {
        $this->links = Array();
        $this->nome = $nome;
    }
    */
}

class ProgettoSecondario extends AbstractProgetto
{
    public array $tecnologie = array();

    public function __construct()
    {
    }
}

class GestoreProgetti
{
    public array $progettiInEvidenza = array();
    public array $progettiSecondari = array();

    public function __construct($pie, $ps)
    {
        $this->progettiInEvidenza = $pie;
        $this->progettiSecondari = $ps;
    }

    /*
     *
     * @param Link[] $link che contiene i link del progetto
     *
     */
    public function costruisciLinks($links): string
    {
        $stringaLink = "";
        // Scorre i link del progetto
        foreach ($links as $link) {
            // Prepara il link di riferimento nel tag
            $stringaLink .= "<a class='link' href=" . $link->href . ">";
            // Stampa l'icona giusta, in base al tipo di icona
            if ($link->tipo == "GitHub") {
                $stringaLink .= "<svg xmlns='http://www.w3.org/2000/svg' role='img' viewBox='0 0 24 24'
                                     fill='none' stroke='currentColor' stroke-width='2'
                                     stroke-linecap='round'
                                     stroke-linejoin='round' class='feather feather-github'>
                                     <title>GitHub</title>
                                     <path d='M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22'></path>
                                 </svg>";
            }
            if ($link->tipo == "Link esterno") {
                $stringaLink .= "<svg xmlns='http://www.w3.org/2000/svg' role='img' viewBox='0 0 24 24'
                                     fill='none' stroke='currentColor' stroke-width='2'
                                     stroke-linecap='round'
                                     stroke-linejoin='round' class='feather feather-external-link'>
                                     <title>Link esterno</title>
                                     <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'></path>
                                     <polyline points='15 3 21 3 21 9'></polyline>
                                     <line x1='10' y1='14' x2='21' y2='3'></line>
                                 </svg>";
            }
            // Chiudo il tag che contiene il link e l'icona
            $stringaLink .= "</a>";
        }
        return $stringaLink;
    }

    public function mostraProgettiInEvidenza()
    {

        $lista = "<ul>";

        foreach ($this->progettiInEvidenza as $progetto) {
            $lista .= "<li class='progetto-in-evidenza'>
                <div class='contenuto-progetto'>
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
                </div>
            </li>";

        }
        $lista .= "</ul>";

        echo $lista;
    }

    public function mostraProgettiSecondari(): void
    {

        $lista = "<ul class='tabella-progetti-secondari'>";

        foreach ($this->progettiSecondari as $progetto) {
            $lista .= "<li class='progetto-secondario'>
                            <div class='contenuto-progetto'>
                                <div>
                                    <div class='header'>
                                        <div style='color: #64FFDA;'>
                                            <svg xmlns='http://www.w3.org/2000/svg' role='img' viewBox='0 0 24 24'
                                                 fill='none' stroke='currentColor' stroke-width='1' stroke-linecap='round'
                                                 stroke-linejoin='round' class='icona-cartella'>
                                                <title> Cartella </title>
                                                <path d='M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z'></path>
                                            </svg>
                                        </div>
                                        <div class='lista-link'>";
            $lista .= $this->costruisciLinks($progetto->links);
            $lista .= "
                                    </div>
                                </div>
                                <h3 class='titolo-progetto'>
                                    " . $progetto->nome . "
                                </h3>
                                <div class='descrizione-progetto'>
                                    <p>
                                        " . $progetto->testo_intro . "
                                    </p>
                                </div>
                            </div>
                            <div class='tecnologie-progetto'>
                                <ul class='lista-tecnologie'>";
            foreach ($progetto->tecnologie as $tecnologia) {
                $lista .= "<li>" . $tecnologia . "</li>";
            }
            $lista .= "</ul>
                            </div>
                        </div>
                    </li>";
        }

        $lista .= "</ul>";

        echo $lista;
    }
}

?>