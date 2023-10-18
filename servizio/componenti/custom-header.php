<?php

require_once(realpath($_SERVER["DOCUMENT_ROOT"] . '/portfolio/servizio/database/gestore-query.php'));

class CustomHeader
{
    private $gestoreQuery;

    public function __construct()
    {
        $this->gestoreQuery = new GestoreQuery();
    }

    function showHeader()
    {
        $headerText = "<header>
        <nav>
            <input type='checkbox' id='nav-check'>
            <div class='header-logo'>
                <a href='Home_page.php'>
                    <img src='img/logocode_small.svg' alt='Davide Giuntoli' title='Davide Giuntoli' />
                </a>
            </div>
            <ul class='button-list'>";

        foreach ($this->gestoreQuery->getPulsantiHeader() as $pulsante_header) {
            $headerText = $headerText .
                "<li class='" . $pulsante_header["classe_css"] . "'>
                    <a href='" . $pulsante_header["href"] . "'>" . $pulsante_header["label"] . "</a>
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

        foreach ($this->gestoreQuery->getPulsantiHeader() as $pulsante_header) {
            $headerText = $headerText .
                "<span class='" . $pulsante_header["classe_css"] . "'>
                    <a href='" . $pulsante_header["href"] . "'>" . $pulsante_header["label"] . "</a>
                 </span>";
        }

        $headerText = $headerText .
            "</div>
        </nav>
    </header>";

        echo $headerText;
    }
}