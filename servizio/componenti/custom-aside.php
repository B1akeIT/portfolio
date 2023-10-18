<?php


class CustomAside
{

    public function __construct()
    {
    }

    function showSocialAside()
    {
        require_once(realpath($_SERVER["DOCUMENT_ROOT"] . '/portfolio/servizio/database/gestore-query.php'));
        $gestoreQuery = new GestoreQuery();
        $icone = $gestoreQuery->getIcone();

        $socialAside = "<aside id='social'> <ul class='lista-social'> <li> <a class='icona-github'>";
        $socialAside .= $icone["Github"];
        $socialAside .= "</a> </li> <li> <a class='icona-linkedin'>";
        $socialAside .= $icone["LinkedIn"];
        $socialAside .= "</a> </li> <li> <a class='icona-instagram'>";
        $socialAside .= $icone["Instagram"];
        $socialAside .= "</a> </li> </ul> </aside>";
        echo $socialAside;
    }

    function showEmailAside()
    {
        echo "<aside id='email'> <div>
            <a>giuntolidavide@gmail.com</a>
        </div></aside>";
    }

}