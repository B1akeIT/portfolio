<?php
session_start();
require_once('../servizio/Servizio.php');
$servizio = new Servizio();
$gestoreQuery = new GestoreQuery();

$idCategoria = $servizio->getParametro('id');
$modalitaModifica = $servizio->getParametro('modifica');

if ($idCategoria !== null) {
    $categoria = $gestoreQuery->getCategoriaUtenti($idCategoria);
} else {
    $categoria = [
        "id" => '0',
        "nome" => 'Nuova categoria',
        "gestione_progetti" => '0',
        "gestione_utenti" => '0',
        "gestione_categorie" => '0',
    ];
}

$_POST['categoria'] = $categoria;

print_r($idCategoria == null);
print_r($modalitaModifica == null);


function sottotitolo($id, $modifica): string
{
    if ($id == null) {
        return "Crea categoria";
    } elseif ($modifica && $modifica == '1') {
        return "Modifica categoria";
    } else {
        return "Visualizza categoria";
    }
}

function modificaPermesso($categoria, $settore, $concesso): void
{
    $categoria[$settore] = $concesso;
    $_POST['categoria'] = $categoria;
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
    <title> <?php if ($idCategoria === null) {
            echo 'Nuova categoria';
        } else {
            echo 'Categoria' . $categoria["nome"];
        } ?> - Davide Giuntoli </title>

    <link rel="icon" href="../img/logocode_small.svg">
</head>
<body>
<script src="gestore-dati.js"></script>
<div class="background pagina-gestione-categoria">

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

        <!-- Progetto -->
        <article id="gestione-categoria">

            <section>
                <div class="header">
                    <h2>
                        <samp><?php echo sottotitolo($idCategoria, $modalitaModifica) ?></samp>
                    </h2>
                    <div class="nome">
                        <h1><?php echo $categoria["nome"] ?></h1>
                    </div>
                </div>
            </section>
            <section>
                <div class="permessi" style="width: 50%; display: flex; flex-direction: column">
                    <form action="../servizio/database/modifica-categoria.php" method="post" name="categoria-form" id="categoria-form">
                    <div style="width: 100%; display: flex; flex-direction: row; justify-content: space-between; margin-bottom: 30px">
                        <label for="categoria_nome" class="label">
                            Nome
                        </label>
                        <?php if ($modalitaModifica === null && $idCategoria !== null) { ?>
                            <span style="color: var(--light-grey)"><?php echo $categoria["nome"] ?></span>
                        <?php } else { ?>
                            <input name="categoria_nome" id="categoria_nome" type="text"
                                   value="<?php echo $categoria["nome"] ?>">
                        <?php } ?>
                    </div>
                        <div style="width: 100%; display: flex; flex-direction: row; justify-content: space-between;">
                            <label for="permesso_progetti" class="label">
                                Può modificare i progetti?
                            </label>
                            <?php if ($modalitaModifica === null && $idCategoria !== null) { ?>
                                <span class="permesso"><?php echo $categoria["gestione_progetti"] == '1' ? 'Si' : 'No'; ?></span>
                            <?php } else { ?>
                                <div style="padding: 8px 10px">
                                    <label for="permessoProgettiSi">Si</label>
                                    <input type="radio" id="permessoProgettiSi" name="permessoProgetti"
                                           value="1" <?php if ($categoria['gestione_progetti'] == '1') {
                                        echo 'checked';
                                    } ?> onclick=" <?php modificaPermesso($categoria, 'gestione_progetti', '1') ?> ">
                                    <label for="permessoProgettiNo">No</label>
                                    <input type="radio" id="permessoProgettiNo" name="permessoProgetti"
                                           value="0" <?php if ($categoria['gestione_progetti'] == '0') {
                                        echo 'checked';
                                    } ?> onclick=" <?php modificaPermesso($categoria, 'gestione_progetti', '0') ?> ">
                                </div>
                            <?php } ?>
                        </div>
                        <div style="width: 100%; display: flex; flex-direction: row; justify-content: space-between;">
                            <label for="permesso_utenti" class="label">
                                Può modificare gli utenti?
                            </label>
                            <?php if ($modalitaModifica === null && $idCategoria !== null) { ?>
                                <span class="permesso"><?php echo $categoria["gestione_utenti"] == '1' ? 'Si' : 'No'; ?></span>
                            <?php } else { ?>
                                <div style="padding: 8px 10px">
                                    <label for="permessoUtentiSi">Si</label>
                                    <input type="radio" id="permessoUtentiSi" name="permessoUtenti"
                                           value="1" <?php if ($categoria['gestione_utenti'] == '1') {
                                        echo 'checked';
                                    } ?> onclick=" <?php modificaPermesso($categoria, 'gestione_utenti', '1') ?> ">
                                    <label for="permessoUtentiNo">No</label>
                                    <input type="radio" id="permessoUtentiNo" name="permessoUtenti"
                                           value="0" <?php if ($categoria['gestione_utenti'] == '0') {
                                        echo 'checked';
                                    } ?> onclick=" <?php modificaPermesso($categoria, 'gestione_utenti', '0') ?> ">
                                </div>
                            <?php } ?>
                        </div>
                        <div style="width: 100%; display: flex; flex-direction: row; justify-content: space-between;">
                            <label for="permesso_categorie" class="label">
                                Può modificare le categorie?
                            </label>
                            <?php if ($modalitaModifica === null && $idCategoria !== null) { ?>
                                <span class="permesso"><?php echo $categoria["gestione_categorie"] == '1' ? 'Si' : 'No'; ?></span>
                            <?php } else { ?>
                                <div style="padding: 8px 10px">
                                    <label for="permessoCategorieSi">Si</label>
                                    <input type="radio" id="permessoCategorieSi" name="permessoCategorie"
                                           value="1" <?php if ($categoria['gestione_categorie'] == '1') {
                                        echo 'checked';
                                    } ?> onclick=" <?php modificaPermesso($categoria, 'gestione_categorie', '1') ?> ">
                                    <label for="permessoCategorieNo">No</label>
                                    <input type="radio" id="permessoCategorieNo" name="permessoCategorie"
                                           value="0" <?php if ($categoria['gestione_categorie'] == '0') {
                                        echo 'checked';
                                    } ?> onclick=" <?php modificaPermesso($categoria, 'gestione_categorie', '0') ?> ">
                                </div>
                            <?php } ?>
                        </div>
                        <input type="hidden" name="categoriaId" id="categoriaId" value="<?php echo $idCategoria ?? 0 ?>">
                        <button type="button" class="button-login" id="button-login" onclick="modificaCategoria()">
                            Login
                        </button>
                    </form>
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
