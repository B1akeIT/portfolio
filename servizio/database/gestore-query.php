<?php
require_once('gestore-connessione.php');

class GestoreQuery
{
    public GestoreConnessione $gestoreConnessione;

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
        $result = $this->gestoreConnessione->getMysqli()->query("SELECT * FROM link_progetto WHERE id_progetto=$id;");
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
        $result = $this->gestoreConnessione->getMysqli()->query("SELECT * FROM contenuto_progetto WHERE id_progetto=$id ORDER BY ordine;");
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
        $result = $this->gestoreConnessione->getMysqli()->query("SELECT id, nome, gestione_progetti, gestione_utenti, gestione_categorie, modificabile FROM utente_categoria ORDER BY id ASC");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getCategoriaUtenti($id): array
    {
        $result = $this->gestoreConnessione->getMysqli()->query("SELECT id, nome, gestione_progetti, gestione_utenti, gestione_categorie FROM utente_categoria WHERE id=" . (int)$id . " ORDER BY id ASC");
        return $result->fetch_assoc();
    }

    public function getUtenti()
    {
        $result = $this->gestoreConnessione->getMysqli()->query("SELECT * FROM getutenti;");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getUtente($idUtente)
    {
        $result = $this->gestoreConnessione->getMysqli()->query("SELECT * FROM getutenti WHERE id=" . (int)$idUtente);
        return $result->fetch_assoc();
    }

    /*
        public function login($username, $password)
        {
            $hashedPassword = hash("sha512", $password);
            $result = $this->gestoreConnessione->getMysqli()->query("SELECT utente.id, utente.nome_utente, utente_categoria.nome AS categoria, utente_categoria.gestione_progetti, utente_categoria.gestione_utenti, utente_categoria.gestione_categorie FROM utente LEFT JOIN utente_categoria ON utente.id_categoria = utente_categoria.id  WHERE utente.nome_utente =$username AND utente.password = $hashedPassword LIMIT 1;");
            return $result->fetch_all(MYSQLI_ASSOC);
        }*/

    /**
     * @param $username
     * @param $password
     * @return array|false Array associativo coi dati necessari, o false se non trova utenti
     */
    public function login($username, $password)
    {
        $result = [];
        $hashedPassword = hash("sha512", $password);
        $sql = "SELECT utente.id, utente.nome_utente, utente_categoria.nome AS categoria, utente_categoria.gestione_progetti, utente_categoria.gestione_utenti, utente_categoria.gestione_categorie FROM utente LEFT JOIN utente_categoria ON utente.id_categoria = utente_categoria.id WHERE utente.nome_utente =? AND utente.password = ? LIMIT 1;";
        $query = $this->gestoreConnessione->getMysqli()->prepare($sql);
        $query->bind_param("ss", $username, $hashedPassword);
        $query->bind_result($id, $nome_utente, $categoria, $gestione_progetti, $gestione_utenti, $gestione_categorie);
        $query->execute();
        $query->fetch();
        if ($query->num_rows) {
            $result["id"] = $id;
            $result["nome_utente"] = $nome_utente;
            $result["categoria"] = $categoria;
            $result["gestione_progetti"] = $gestione_progetti;
            $result["gestione_utenti"] = $gestione_utenti;
            $result["gestione_categorie"] = $gestione_categorie;
        } else {
            $result = false;
        }

        // $result = $this->gestoreConnessione->getMysqli()->query();
        // $rows = $result->fetch_all(MYSQLI_ASSOC);
        return $result;
    }
}