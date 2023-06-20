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
    public string $nome;
    public string $testo_intro;
    public Array $links;
}

class ProgettoInEvidenza extends AbstractProgetto {
    public Banner $banner;

    public function __construct()
    {
        $this->links = Array([new Link()]);
    }
}

class ProgettoSecondario extends AbstractProgetto {
    public Array $tecnologie;

    public function __construct()
    {
        $this->links = Array([new Link()]);
        $this->tecnologie = Array(['', '', '']);
    }
}

class GestoreProgetti {
}
?>