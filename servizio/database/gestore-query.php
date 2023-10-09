<?php
require_once('gestore-connessione.php');

class GestoreQuery
{
    private GestoreConnessione $gestoreConnessione;

    public function __construct()
    {
        $this->gestoreConnessione = new GestoreConnessione();
    }

    public function getSkills(): array
    {
        $skills = [];
        $result = $this->gestoreConnessione->getMysqli()->query("SELECT nome FROM portfolio.skills AS skills order BY id ASC;");
        if ($result->num_rows > 0) {
            foreach ($result->fetch_all(MYSQLI_ASSOC) as $row) {
                array_push($skills, $row["nome"]);
            }
        }
        return $skills;
    }

    public function getIcone()
    {
        $icone = [];
        $result = $this->gestoreConnessione->getMysqli()->query("SELECT nome, codice FROM portfolio.icone order BY id ASC;");
        foreach ($result->fetch_all(MYSQLI_ASSOC) as $row) {
            $icone[$row["nome"]] = $row["codice"];
        }
        return $icone;
    }

    public function getPulsantiHeader() {
        $result = $this->gestoreConnessione->getMysqli()->query("SELECT label,  classe_css, href FROM portfolio.pulsanti_header order BY id ASC;");
        return $result->fetch_all(MYSQLI_ASSOC);
    }
}