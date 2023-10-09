<?php
require_once('gestore-connessione.php');

class GestoreQuery
{
    private GestoreConnessione $gestoreConnessione;

    public function __construct()
    {
        $this->gestoreConnessione = new GestoreConnessione();
        $this->getSkills();
    }

    public function getSkills()
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
}