<?php
session_start();
require_once('../Servizio.php');
$gestoreQuery = new GestoreQuery();

$result = [];
print_r($_POST);
if (isset($_POST['categoriaId']) && isset($_POST['categoria_nome']) && isset($_POST['permessoProgetti']) && isset($_POST['permessoUtenti']) && isset($_POST['permessoCategorie'])) {
    $categoria_id = $_POST['categoriaId'];
    $categoria_nome = $_POST['categoria_nome'];
    $categoria_progetti = $_POST['permessoProgetti'];
    $categoria_utenti = $_POST['permessoUtenti'];
    $categoria_categorie = $_POST['permessoCategorie'];

    // controllare i dati inseriti con delle regex: escludere caratteri virgole, virgolette, ecc per evitare sql injection

    $sql = 'UPDATE utente_categoria SET nome= "' . $categoria_nome . '", gestione_progetti=' . (int)$categoria_progetti . ', gestione_utenti=' . (int)$categoria_utenti . ', gestione_categorie= ' . (int)$categoria_categorie . ' WHERE id=' . (int)$categoria_id . ';';
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

// UPDATE utente_categoria SET nome='Test', gestione_progetti=0, gestione_utenti=1, gestione_categorie=1 WHERE id=7;
?>