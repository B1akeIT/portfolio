<?php


class CustomAside
{

    public function __construct()
    {
    }

    function showSocialAside()
    {
        require_once('servizio/Servizio.php');
        $json = file_get_contents('dati.json');
        $data = json_decode($json);

        $socialAside = "<aside id='social'> <ul class='lista-social'> <li> <a class='icona-github'>";
        $socialAside .= $data->icone->github;
        $socialAside .= "</a> </li> <li> <a class='icona-linkedin'>";
        $socialAside .= $data->icone->linkedin;
        $socialAside .= "</a> </li> <li> <a class='icona-instagram'>";
        $socialAside .= $data->icone->instagram;
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