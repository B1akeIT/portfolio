<?php


class GestoreConnessione
{

    /**
     * Variabili per la connessione al database
     */

    private mysqli $mysqli;                    // connessione col database
    private PDO $pdo;                          // connessione col database
    private string $indirizzo = "localhost";   // indirizzo ip del database
    private string $db = "portfolio";          // nome del database
    private string $utente = "root";           // username dell'utente
    private string $password = "";             // password dell'utente
    private string $messaggio = "";            // messaggio da comunicare nei console.log()

    public function __construct()
    {
        $this->connessioneConMysqli();
        $this->connessioneConPdo();
    }

    /**
     * Connessione attraverso MySQLi
     * @return bool esito della connessione col database: true se riuscita, false in caso di errore
     */
    public function connessioneConMysqli(): bool
    {
        $this->mysqli = new mysqli($this->indirizzo, $this->utente, $this->password, $this->db);
        if (!($this->mysqli->connect_error)) {
            $this->messaggio = 'Connesso a ' . $this->mysqli->host_info . ' tramite MySQLi';
            return true;
        } else {
            $this->messaggio = 'Errore di connessione al database: (' . $this->mysqli->connect_errno . ') ' . $this->mysqli->connect_error;
            return false;
        }
    }

    /**
     * Connessione attraverso PDO
     * @return bool esito della connessione col database: true se riuscita, false in caso di errore
     */
    public function connessioneConPdo(): bool
    {

        try {
            $this->pdo = new PDO(
                "mysql:host=$this->indirizzo;dbname=$this->db",
                $this->utente,
                $this->password
            );
            $this->messaggio = '<br><br>Connesso a MySQL tramite PDO';
            return true;
        } catch
        (PDOException $exception) {
            $this->messaggio = '<br>Errore PDO: ' . $exception->getMessage();
            return false;
        }

    }

    /**
     * Comunicazione messaggio
     * @return string messaggio da inviare nei console.log()
     */
    public function getMessaggio(): string
    {
        return $this->messaggio;
    }

    /**
     * @return mysqli
     */
    public function getMysqli(): mysqli
    {
        return $this->mysqli;
    }

    /**
     * @return PDO
     */
    public function getPdo(): PDO
    {
        return $this->pdo;
    }
}