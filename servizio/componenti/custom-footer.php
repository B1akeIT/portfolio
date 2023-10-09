<?php

class CustomFooter
{

    public function __construct()
    {
    }

    function showFooter()
    {
        require_once('servizio/database/gestore-query.php');
        $gestoreQuery = new GestoreQuery();
        $icone = $gestoreQuery->getIcone();

        $footer = "<footer> <div class='footer-social'> <ul class='lista-social'> <li> <a class='icona-github'>";
        $footer .= $icone["Github"];
        $footer .= "</a> </li> <li> <a class='icona-linkedin'>";
        $footer .= $icone["LinkedIn"];
        $footer .= "</a> </li> <li> <a class='icona-instagram'>";
        $footer .= $icone["Instagram"];
        $footer .= "</a> </li> </ul> </div>";
        $footer .= "<div class='footer-contenuto'>
            <p>Sviluppato da Davide Giuntoli</p>
            <p>Junior frontend developer</p>
        </div> </footer>";
        echo $footer;
    }
}
