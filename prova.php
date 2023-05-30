<?php
// Verifica se il form è stato inviato
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Leggi i dati dal form
    $nome = $_POST['nome'];
    $email = $_POST['email'];
    $messaggio = $_POST['messaggio'];

    // Scrivi i dati in un file di testo
    $file = fopen('contatti.txt', 'a');
    fwrite($file, "Nome: $nome");
    fwrite($file, "Email: $email");
    fwrite($file, "Messaggio: $messaggio");
    fclose($file);
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Form di contatto</title>
</head>
<body>
<h1>Form di contatto</h1>

<form method="post">
    <label for="nome">Nome:</label>
    <input type="text" name="nome" id="nome"><br>

    <label for="email">Email:</label>
    <input type="email" name="email" id="email"><br>

    <label for="messaggio">Messaggio:</label><br>
    <textarea name="messaggio" id="messaggio"></textarea><br>

    <input type="submit" value="Invia">
</form>
</body>
</html>