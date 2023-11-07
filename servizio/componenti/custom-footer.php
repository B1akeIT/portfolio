<?php

class CustomFooter
{
    private array $icone;

    public function __construct($icone)
    {
        $this->icone = $icone;
    }

    function showFooter($new = true)
    {
        $footer = "";
        if ($new === true) {
            $footer .= "<footer> <div class='footer-social'> <ul class='lista-social'> <li> <a class='icona-github'>";
            $footer .= $this->icone["Github"];
            $footer .= "</a> </li> <li> <a class='icona-linkedin'>";
            $footer .= $this->icone["LinkedIn"];
            $footer .= "</a> </li> <li> <a class='icona-instagram'>";
            $footer .= $this->icone["Instagram"];
            $footer .= "</a> </li> </ul> </div>";
            $footer .= "<div class='footer-contenuto'>
            <p>Sviluppato da Davide Giuntoli</p>
            <p>Junior frontend developer</p>
        </div> </footer>";
        } else {
            require_once('servizio/Servizio.php');
            $json = file_get_contents('dati.json');
            $data = json_decode($json);

            $footer = "<footer> <div class='footer-social'> <ul class='lista-social'> <li> <a class='icona-github'>";
            $footer .= $data->icone->github;
            $footer .= "</a> </li> <li> <a class='icona-linkedin'>";
            $footer .= $data->icone->linkedin;
            $footer .= "</a> </li> <li> <a class='icona-instagram'>";
            $footer .= $data->icone->instagram;
            $footer .= "</a> </li> </ul> </div>";
            $footer .= "<div class='footer-contenuto'>
            <p>Sviluppato da Davide Giuntoli</p>
            <p>Junior frontend developer</p>
        </div> </footer>";
        }
        echo $footer;
    }
}
