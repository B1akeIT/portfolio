<?php

class CustomHeader {

public string $headerText = "<header>
        <nav>
            <input type=\"checkbox\" id=\"nav-check\">
            <div class=\"header-logo\">
                <a href=\"Home_page_2.php\">
                    <img
                            src=\"img/logocode_small.svg\" alt=\"Davide Giuntoli\"
                            title=\"Davide Giuntoli\"
                                />
                </a>
            </div>
            <ul class=\"button-list\">
                <li class=\"button-chi-sono\">
                    <a href=\"#introduzione\">Chi sono</a>
                </li>
                <li class=\"button-esperienze\">
                    <a href=\"#esperienze-lavorative\">Esperienze</a>
                </li>
                <li class=\"button-progetti\">
                    <a href=\"Progetti.html\">Progetti</a>
                </li>
                <li class=\"button-contatti\">
                    <a href=\"Contatti.html\">Contatti</a>
                </li>
            </ul>
            <div class=\"nav-btn\">
                <label for=\"nav-check\">
                    <span></span>
                    <span></span>
                    <span></span>
                </label>
            </div>
            <div class=\"mobile-button-list\">
                <span class=\"button-chi-sono\">
                    <a href=\"#introduzione\">Chi sono</a>
                </span>
                <span class=\"button-esperienze\">
                    <a href=\"#esperienze-lavorative\">Esperienze</a>
                </span>
                <span class=\"button-progetti\">
                    <a href=\"Progetti.html\">Progetti</a>
                </span>
                <span class=\"button-contatti\">
                    <a href=\"Contatti.html\">Contatti</a>
                </span>
            </div>
        </nav>
    </header>";

    function showHeader() {
        echo $this->headerText;
    }
}
