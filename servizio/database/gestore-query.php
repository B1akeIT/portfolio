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
        $result = $this->gestoreConnessione->getMysqli()->query("SELECT * FROM getProgetti;");
        if ($result->num_rows > 0) {
            foreach ($result->fetch_all(MYSQLI_ASSOC) as $row) {
                $progetto = new Progetto($row["id"], $row["nome"], $row["href"], $row["tipo"], $row["testo_intro"], $row["tecnologie"] ?? [], $row["banner_src"], $row["banner_alt"], $this->getLinksProgetto($row["id"]));
                array_push($progetti, $progetto);
            }
        }
        return $progetti;
    }

    public function getProgetto($id): Progetto
    {
        $result = $this->gestoreConnessione->getMysqli()->query("SELECT progetto.id, nome, tipo, LEFT(testo_intro, 256) AS testo_intro, IFNULL(tecnologie, '') AS tecnologie, href, IFNULL(banner_progetto.src, 'img/immagine_placeholder_progetti_2.jpg') AS banner_src, IFNULL(banner_progetto.alt, '') AS banner_alt FROM progetto LEFT JOIN banner_progetto ON progetto.id = banner_progetto.id_progetto WHERE progetto.id = $id;");
        $row = $result->fetch_all(MYSQLI_ASSOC)[0];
        return new Progetto($row["id"], $row["nome"], $row["href"], $row["tipo"], $row["testo_intro"], $row["tecnologie"] ?? [], $row["banner_src"], $row["banner_alt"], $this->getLinksProgetto($row["id"]));
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

    public function getContenutiProgetto($id): array
    {
        $result = $this->gestoreConnessione->getMysqli()->query("SELECT * FROM contenuto_progetto WHERE id_progetto=" . $id . " ORDER BY ordine;");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function createUtente($username, $password, $categoria): void
    {
        $hashedPassword = hash("sha512", $password);
        $sql = "INSERT INTO utente (nome_utente, password, id_categoria) VALUES (?, ?, ?)";
        $query = $this->gestoreConnessione->getMysqli()->prepare($sql);
        $query->bind_param("ssi", $username, $hashedPassword, $categoria);
        $result = $query->execute();
    }

    public function getCategorieUtenti(): array
    {
        $result = $this->gestoreConnessione->getMysqli()->query("SELECT id, nome, gestione_progetti, gestione_utenti, gestione_categorie FROM utente_categoria ORDER BY id ASC");
        return $result->fetch_all(MYSQLI_ASSOC);
    }
}