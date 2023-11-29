<?php
session_start();
require_once('../Servizio.php');
$gestoreQuery = new GestoreQuery();

$result = [];
if (isset($_POST['username']) && isset($_POST['password'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // controllare i dati inseriti con delle regex: escludere caratteri virgole, virgolette, ecc per evitare sql injection

    // consigli per registrare il video da consegnare: obs studio

    $hashedPassword = hash("sha512", $password);
    $sql = 'SELECT utente.id, utente.nome_utente, utente_categoria.nome AS categoria, utente_categoria.gestione_progetti, utente_categoria.gestione_utenti, utente_categoria.gestione_categorie FROM utente LEFT JOIN utente_categoria ON utente.id_categoria = utente_categoria.id  WHERE utente.nome_utente = "' . $username . '" AND utente.password = "' . $hashedPassword . '" LIMIT 1;';
    $result = $gestoreQuery->gestoreConnessione->getMysqli()->query($sql);

    if ($result && $result->num_rows === 1) {
        $row = $result->fetch_assoc();
        $_SESSION['gestioneProgetti'] = $row["gestione_progetti"];
        $_SESSION['gestioneUtenti'] = $row["gestione_utenti"];
        $_SESSION['gestioneCategorie'] = $row["gestione_categorie"];

        // session_write_close();
        // echo "<script type=\"text/javascript\"> window.location.rel=\"noopener\" target=\"_blank\" href = 'backend/Backend.php';</script>";

        header("Location: ../../backend/Backend.php");
    } else {
        echo 'Errore! Utente non trovato!';
        print_r($sql);
    }
} else {
    echo 'Errore nei dati inseriti!';
}