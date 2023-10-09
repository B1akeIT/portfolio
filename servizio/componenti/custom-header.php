<?php

require_once('servizio/database/gestore-query.php');

class CustomHeader
{
    private $gestoreQuery;

    public function __construct()
    {
        $this->gestoreQuery = new GestoreQuery();
    }

    function showHeader()
    {
        $json = file_get_contents('dati.json');
        $data = json_decode($json);
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

        foreach ($data->pulsanti_header as $pulsante_header) {
            $headerText = $headerText .
                "<span class='" . $pulsante_header->classe_css . "'>
                    <a href='" . $pulsante_header->href . "'>" . $pulsante_header->label . "</a>
                 </span>";
        }

        $headerText = $headerText .
            "</div>
        </nav>
    </header>";

        echo $headerText;
    }
}

/*
<?php

class CustomHeader {

public string $headerText = "<header>
        <nav>
            <input type='checkbox' id='nav-check'>
            <div class='header-logo'>
                <a href='Home_page.php'>
                    <img
                            src='img/logocode_small.svg' alt='Davide Giuntoli'
                            title='Davide Giuntoli'
                                />
                </a>
            </div>
            <ul class='button-list'>
                <li class='button-chi-sono'>
                    <a href='Home_page.php#introduzione'>Chi sono</a>
                </li>
                <li class='button-esperienze'>
                    <a href='Home_page.php#esperienze-lavorative'>Esperienze</a>
                </li>
                <li class='button-progetti'>
                    <a href='Progetti.php'>Progetti</a>
                </li>
                <li class='button-contatti'>
                    <a href='Contatti.php'>Contatti</a>
                </li>
            </ul>
            <div class='nav-btn'>
                <label for='nav-check'>
                    <span></span>
                    <span></span>
                    <span></span>
                </label>
            </div>
            <div class='mobile-button-list'>
                <span class='button-chi-sono'>
                    <a href='Home_page.php#introduzione'>Chi sono</a>
                </span>
                <span class='button-esperienze'>
                    <a href='Home_page.php#esperienze-lavorative'>Esperienze</a>
                </span>
                <span class='button-progetti'>
                    <a href='Progetti.php'>Progetti</a>
                </span>
                <span class='button-contatti'>
                    <a href='Contatti.php'>Contatti</a>
                </span>
            </div>
        </nav>
    </header>";

    function showHeader() {
        echo $this->headerText;
    }
}

 */