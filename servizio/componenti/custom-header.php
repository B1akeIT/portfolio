<?php

class CustomHeader
{
    private array $pulsanti_header;

    public function __construct($pulsanti_header)
    {
        $this->pulsanti_header = $pulsanti_header;
    }

    function showHeader($indietro = 0)
    {
        $indietroText = "";
        if ($indietro > 0) {
            $indietroText = str_repeat("../", $indietro);
        }
        $headerText = "<header>
        <nav>
            <input type='checkbox' id='nav-check'>
            <div class='header-logo'>
                <a href='" . $indietroText . "Home_page.php'>
                    <img src='" . $indietroText . "img/logocode_small.svg' alt='Davide Giuntoli' title='Davide Giuntoli' />
                </a>
            </div>
            <ul class='button-list'>";

        foreach ($this->pulsanti_header as $pulsante_header) {
            $headerText = $headerText .
                "<li class='" . $pulsante_header["classe_css"] . "'>
                    <a href='" . $indietroText . $pulsante_header["href"] . "'>" . $pulsante_header["label"] . "</a>
                 </li>";
        }

        $headerText = $headerText .
            "</ul>
            <div class='nav-btn'>
                <label for='nav-check'>
                    <span></span>
                    <span></span>
                    <span></span>
                </label>
            </div>
            <div class='mobile-button-list'>";

        foreach ($this->pulsanti_header as $pulsante_header) {
            $headerText = $headerText .
                "<span class='" . $pulsante_header["classe_css"] . "'>
                    <a href='" . $indietroText . $pulsante_header["href"] . "'>" . $pulsante_header["label"] . "</a>
                 </span>";
        }

        $headerText = $headerText .
            "</div>
        </nav>
    </header>";

        echo $headerText;
    }
}