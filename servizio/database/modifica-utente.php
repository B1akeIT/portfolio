<?php
session_start();
require_once('../Servizio.php');
$servizio = new Servizio();
$gestoreQuery = new GestoreQuery();

$sql = '';
$result = [];
print_r($_POST);
$eliminaUtente = $servizio->getParametro('elimina');
if ($eliminaUtente === null) {
    if (isset($_POST['categoriaId']) && isset($_POST['categoria_nome']) && isset($_POST['permessoProgetti']) && isset($_POST['permessoUtenti']) && isset($_POST['permessoCategorie'])) {
        $categoria_id = $_POST['categoriaId'];
        $categoria_nome = $_POST['categoria_nome'];
        $categoria_progetti = $_POST['permessoProgetti'];
        $categoria_utenti = $_POST['permessoUtenti'];
        $categoria_categorie = $_POST['permessoCategorie'];

        // controllare i dati inseriti con delle regex: escludere caratteri virgole, virgolette, ecc per evitare sql injection

        if ($categoria_id !== '0') {
            $sql = 'UPDATE utente_categoria SET nome= "' . $categoria_nome . '", gestione_progetti=' . (int)$categoria_progetti . ', gestione_utenti=' . (int)$categoria_utenti . ', gestione_categorie= ' . (int)$categoria_categorie . ' WHERE id=' . (int)$categoria_id . ';';
        } else {
            // INSERT INTO `portfolio`.`utente` (`nome_utente`, `password`, `id_categoria`) VALUES ('Test creazione', '645896ce509577cbbc556b0745e0b92ee82fffa411330a48645b1b77596553cf4fbadde1baa56f888d450ae828133a9ad3e7777007171fc6984f46eb50406452', 5);
            $sql = 'INSERT INTO utente_categoria (nome, gestione_progetti, gestione_utenti, gestione_categorie) VALUES ("' . $categoria_nome . '", ' . (int)$categoria_progetti . ', ' . (int)$categoria_utenti . ', ' . (int)$categoria_categorie . ');';
        }
        print_r($sql);
        $result = $gestoreQuery->gestoreConnessione->getMysqli()->query($sql);

        // Per gli aggiornamenti, $result è un booleano 1/0
        if ($result) {
            header("Location: ../../backend/Backend.php");
        } else {
            echo 'Errore!';
            print_r($sql);
        }
    } else {
        echo 'Errore nei dati inseriti!';
    }
} else {
    if (isset($_POST['utenteId'])) {
        $idUtente = $_POST['utenteId'];
        $sql = 'CALL eliminaUtente(' . (int)$idUtente . ')';

        // Per gli aggiornamenti, $result è un booleano 1/0
        if ($result) {
            header("Location: ../../backend/Backend.php");
        } else {
            echo 'Errore!';
            print_r($sql);
        }
    } else {
        echo 'Errore nei dati inseriti!';
    }
}
?>