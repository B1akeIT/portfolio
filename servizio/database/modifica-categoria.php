<?php
session_start();
require_once('../Servizio.php');
$servizio = new Servizio();
$gestoreQuery = new GestoreQuery();

$sql = '';
$result = [];
print_r($_POST);
$eliminaCategoria = $servizio->getParametro('elimina');
if ($eliminaCategoria === null) {
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
    $categoria_id = $servizio->getParametro('id');
    if ($categoria_id) {
        $sql = 'CALL deleteCategoria(' . (int)$categoria_id . ')';
        print_r($sql);
        $result = $gestoreQuery->gestoreConnessione->getMysqli()->query($sql);
        print_r($result);
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