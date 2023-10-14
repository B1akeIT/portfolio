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
        $result = $this->gestoreConnessione->getMysqli()->query("SELECT * FROM getSkills");
        if ($result->num_rows > 0) {
            foreach ($result->fetch_all(MYSQLI_ASSOC) as $row) {
                array_push($skills, $row["nome"]);
            }
        }
        return $skills;
    }

    /**
     * Chiamata al db per recuperare le icone dei social nelle sezioni aside e footer
     * @return Icona[] Array delle icone associate al sito, sotto forma di array associativo Icona[nome, codice]
     */
    public function getIcone()
    {
        $icone = [];
        $result = $this->gestoreConnessione->getMysqli()->query("SELECT nome, codice FROM portfolio.icone order BY id ASC;");
        foreach ($result->fetch_all(MYSQLI_ASSOC) as $row) {
            $icone[$row["nome"]] = $row["codice"];
        }
        return $icone;
    }

    public function getPulsantiHeader()
    {
        $result = $this->gestoreConnessione->getMysqli()->query("SELECT * FROM getPulsantiHeader;");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getProgetti()
    {
        $progetti = [];
        $result = $this->gestoreConnessione->getMysqli()->query("SELECT * FROM getProgetti");
        if ($result->num_rows > 0) {
            foreach ($result->fetch_all(MYSQLI_ASSOC) as $row) {
                $progetto = new Progetto($row["id"], $row["nome"], $row["href"], $row["tipo"], $row["testo_intro"], $row["tecnologie"] ?? [], $row["banner_src"], $row["banner_alt"], $this->getLinksProgetto($row["id"]));
                array_push($progetti, $progetto);
            }
        }
        return $progetti;
    }

    /**
     * Chiamata al db per recuperare i link di un progetto
     * @param int|string $id id del progetto in questione
     * @return Link[] Array dei link associati al progetto, sotto forma di oggetto Link{tipo, href}
     */
    public function getLinksProgetto($id): array
    {
        $links = [];
        $result = $this->gestoreConnessione->getMysqli()->query("SELECT * FROM link_progetto WHERE id_progetto=" . $id . ";");
        if ($result->num_rows > 0) {
            foreach ($result->fetch_all(MYSQLI_ASSOC) as $row) {
                $new_link = [];
                $new_link["tipo"] = $row["tipo"];
                $new_link["href"] = $row["href"];
                array_push($links, (object)$new_link);
            }
        }
        return $links;
    }
}