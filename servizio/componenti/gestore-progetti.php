<?php

class Link {
    public string $tipo = "";
    public string $href = "";
}

class Banner {
    public string $src = "";
    public string $alt = "";
}

abstract class AbstractProgetto {
    public string $nome = "";
    public string $testo_intro = "";
    public Array $links = Array();
}

class ProgettoInEvidenza extends AbstractProgetto {
    public Banner $banner;

    public function __construct()
    {
        $this->links = Array();
    }

    /*
    public function __construct($nome)
    {
        $this->links = Array();
        $this->nome = $nome;
    }
    */
}

class ProgettoSecondario extends AbstractProgetto {
    public Array $tecnologie = Array();

    public function __construct()
    {
        $this->links = Array();
    }
}

class GestoreProgetti {
    public Array $progettiInEvidenza = Array();
    public Array $progettiSecondari = Array();

    public function __construct()
    {
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
}
?>