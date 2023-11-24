<?php
require_once('../servizio/Servizio.php');
$servizio = new Servizio();
$gestoreQuery = new GestoreQuery();

$idUtente = $servizio->getParametro('id');
$modalitaModifica = $servizio->getParametro('modifica');

$utente = $gestoreQuery->getUtente($idUtente);
$listaCategorie = $gestoreQuery->getCategorieUtenti();

print_r($utente);

function sottotitolo($id, $modifica): string
{
    if ($id == null) {
        return "Crea utente";
    } elseif ($modifica && $modifica == '1') {
        return "Modifica utente";
    } else {
        return "Visualizza utente";
    }
}
?>

<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta name="description"
          content="Davide Giuntoli è uno sviluppatore frontend focalizzato nei framework JavaScript, in special modo Angular, per creare esperienze digitali ottimali.">

    <link href="https://fonts.googleapis.com/css?family=Poppins" rel="stylesheet">
    <link href="https://fonts.cdnfonts.com/css/calibre" rel="stylesheet">
    <link href="https://fonts.cdnfonts.com/css/sf-mono" rel="stylesheet">
    <link href="../stile.css" type="text/css" rel="stylesheet"/>
    <title> <?php echo $utente["nome_utente"] ?> - Davide Giuntoli </title>

    <link rel="icon" href="../img/logocode_small.svg">
</head>
<body>
<div class="background pagina-progetto-singolo">

    <!-- Header con logo e pulsanti per la navigazione -->
    <?php
    $servizio->customHeader->showHeader(1);
    ?>

    <!-- Contenuto laterale social -->
    <?php
    $servizio->customAside->showSocialAside();
    ?>

    <!-- Contenuto laterale email -->
    <?php
    $servizio->customAside->showEmailAside();
    ?>

    <!-- Contenuto principale -->
    <main class="page-wrapper">

        <!-- Utente -->
        <article id="progetto-singolo">
            <section>
                <div class="header">
                    <h2>
                        <samp><?php echo sottotitolo($idUtente, $modalitaModifica) ?></samp>
                    </h2>
                    <div class="nome">
                        <h1><?php echo $utente["nome_utente"] ?></h1>
                    </div>
                </div>
            </section>
            <section>
                <div style="width: 50%; display: flex; flex-direction: column">

                    <form action="../servizio/database/modifica-categoria.php" method="post" name="utente-form" id="utente-form">
                        <div style="width: 100%; display: flex; flex-direction: row; justify-content: space-between; margin-bottom: 30px">
                            <label for="utente_nome" class="label">
                                Nome
                            </label>
                            <?php if ($modalitaModifica === null && $idUtente !== null) { ?>
                                <span style="color: var(--light-grey)"><?php echo $utente["nome_utente"] ?></span>
                            <?php } else { ?>
                                <input name="utente_nome" id="utente_nome" type="text"
                                       value="<?php echo $utente["nome_utente"] ?>">
                            <?php } ?>
                        </div>
                    </form>
                </div>
                <div style="width: 100%; display: flex; flex-direction: row; justify-content: space-between;">
                    <label for="utente-categoria" class="label">
                        Categoria
                    </label>
                    <?php if ($modalitaModifica === null && $idUtente !== null) { ?>
                        <span class="permesso" style="color: var(--light-grey)"><?php echo $utente["categoria"]; ?></span>
                    <?php } else { ?>
                        <div style="padding: 8px 10px">
                            <!-- TODO Select con le categorie -->
                            <select name="utente-categoria">
                                <?php
                                    foreach ($listaCategorie as $categoria) {
                                        $option = "";
                                        $option .= "<option value='". $categoria["id"] ."'";
                                        if ($utente["id_categoria"] == $categoria["id"]) {
                                            $option .= " selected ";
                                        }
                                        $option .= " >" . $categoria["nome"] . "</option>";
                                        echo $option;
                                    }
                                ?>
                            </select>
                        </div>
                    <?php } ?>
                </div>
            </section>
        </article>
    </main>

    <!-- Footer -->
    <?php
    $servizio->customFooter->showFooter();
    ?>

</div>

</body>
</html>
