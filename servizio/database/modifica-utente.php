<?php
session_start();
require_once('../Servizio.php');
$servizio = new Servizio();
$gestoreQuery = new GestoreQuery();

$sql = '';
$result = [];
print_r($_POST);
$utenteId = $servizio->getParametro('id');
$eliminaUtente = $servizio->getParametro('elimina');
if ($utenteId !== null) {
    if ($eliminaUtente === null) {
        if (validazione()) {
            if (isset($_POST['utente-categoria']) && validazionePassword($utenteId)) {
                $utenteNome = $_POST['utente-nome'];
                $utenteIdCategoria = $_POST['utente-categoria'];

                // controllare i dati inseriti con delle regex: escludere caratteri virgole, virgolette, ecc per evitare sql injection

                if ($utenteId !== '0') {
                    $sql = 'UPDATE utente SET nome_utente= "' . $utenteNome . '", id_categoria=' . $utenteIdCategoria . ' WHERE id=' . (int)$utenteId . ' AND eliminabile=1;';
                } else {
                    $utentePassword = $_POST['utente-password'];
                    $hashedPassword = hash("sha512", $utentePassword);
                    // INSERT INTO `portfolio`.`utente` (`nome_utente`, `password`, `id_categoria`) VALUES ('Test creazione', '645896ce509577cbbc556b0745e0b92ee82fffa411330a48645b1b77596553cf4fbadde1baa56f888d450ae828133a9ad3e7777007171fc6984f46eb50406452', 5);
                    $sql = 'INSERT INTO utente (nome_utente, password, id_categoria) VALUES ("' . $utenteNome . '", "' . $hashedPassword . '", ' . (int)$utenteIdCategoria . ');';
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
            header("Location: ../../backend/gestore-utente.php");
        }
    } else {
        $sql = 'CALL deleteUtente(' . (int)$utenteId . ');';
        $result = $gestoreQuery->gestoreConnessione->getMysqli()->query($sql);

        // Per gli aggiornamenti, $result è un booleano 1/0
        if ($result) {
            header("Location: ../../backend/Backend.php");
        } else {
            echo 'Errore!';
            print_r($sql);
        }
    }
} else {
    echo 'Errore con l\'ID inserito!';
}

function validazione(): bool
{
    return trim($_POST['utente-password']) != '' && ($_POST['utente-password'] === $_POST['utente-ripeti-password']);
}

function validazionePassword($utenteId)
{
    // Se l'utente è da creare, la password sarà necessaria
    if ($utenteId == 0) {
        return isset($_POST['utente-password']) && trim($_POST['utente-password']) !== '';
    }
    return true;
}

?>