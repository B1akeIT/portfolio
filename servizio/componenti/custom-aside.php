<?php

class CustomAside
{
    private array $icone;

    public function __construct($icone)
    {
        $this->icone = $icone;
    }

    function showSocialAside()
    {

        $socialAside = "<aside id='social'> <ul class='lista-social'> <li> <a class='icona-github'>";
        $socialAside .= $this->icone["Github"];
        $socialAside .= "</a> </li> <li> <a class='icona-linkedin'>";
        $socialAside .= $this->icone["LinkedIn"];
        $socialAside .= "</a> </li> <li> <a class='icona-instagram'>";
        $socialAside .= $this->icone["Instagram"];
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