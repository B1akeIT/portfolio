<?php
session_start();
require_once('../servizio/Servizio.php');
// $servizio = new Servizio();
// $gestoreQuery = new GestoreQuery();

//$idCategoria = $servizio->getParametro('id');
//$modalitaModifica = $servizio->getParametro('modifica');

$idCategoria = getParametro('id');
$modalitaModifica = getParametro('modifica');

if ($idCategoria !== null) {
    // $categoria = $gestoreQuery->getCategoriaUtenti($idCategoria);
    $categoria = [
        "id" => '0',
        "nome" => 'Categoria default',
        "gestione_progetti" => '1',
        "gestione_utenti" => '0',
        "gestione_categorie" => '1',
    ];
} else {
    $categoria = [
        "id" => '0',
        "nome" => '',
        "gestione_progetti" => '0',
        "gestione_utenti" => '0',
        "gestione_categorie" => '0',
    ];
}
echo $idCategoria;
print_r($modalitaModifica === null);
print_r($categoria);
print_r($categoria["gestione_progetti"] == 1);
print_r($categoria["gestione_progetti"] == '1');
print_r(gettype($categoria["gestione_progetti"]));

print_r($_SESSION);

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

function modificaPermesso($categoria, $settore, $concesso)
{
    $categoria[$settore] = $concesso;
    return $categoria;
}

function getParametro($parametro): ?string
{
    $valore = null;
    if ($parametro !== null) {
        if (isset($_POST[$parametro])) {
            $valore = $_POST[$parametro];
        } elseif (isset($_GET[$parametro])) {
            $valore = $_GET[$parametro];
        }
    }
    return $valore;
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
<div class="background pagina-gestione-categoria">

    <!-- Header con logo e pulsanti per la navigazione -->
    <?php
    // $servizio->customHeader->showHeader(1);
    ?>

    <!-- Contenuto laterale social -->
    <?php
    // $servizio->customAside->showSocialAside();
    ?>

    <!-- Contenuto laterale email -->
    <?php
    // $servizio->customAside->showEmailAside();
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
                    <div style="width: 100%; display: flex; flex-direction: row; justify-content: space-between; margin-bottom: 30px">
                        <label for="categoria_nome" class="label">
                            Nome
                        </label>
                        <?php if ($modalitaModifica === null && $idCategoria !== null) { ?>
                            <span style="color: var(--light-grey)"><?php echo $categoria["nome"] ?></span>
                        <?php } else { ?>
                            <input name="categoria_nome" id="categoria_nome" type="text"
                                   value="<?php echo $categoria["nome"] ?>" <?php if ($modalitaModifica !== null) echo 'readonly'; ?>>
                        <?php } ?>
                    </div>
                    <div style="width: 100%; display: flex; flex-direction: row; justify-content: space-between;">
                        <label for="permesso_progetti" class="label">
                            Può modificare i progetti?
                        </label>
                        <?php if ($modalitaModifica === null && $idCategoria !== null) { ?>
                            <span class="permesso"><?php echo $categoria["gestione_progetti"] == '1' ? 'Si' : 'No'; ?></span>
                        <?php } else { ?>
                            <!--<select name="permesso_progetti" id="permesso_progetti">
                                <option value="0"
                                        label="No" <?php /*if ($modalitaModifica !== null && $idCategoria !== null && $categoria["gestione_progetti"] === '0') {
                                    echo 'selected';
                                } */?>
                                        onselect="<?php /*$categoria = modificaPermesso($categoria, 'gestione_progetti', '0') */?>">
                                    No
                                </option>
                                <option value="1"
                                        label="Si" <?php /*if ($modalitaModifica !== null && $idCategoria !== null && $categoria["gestione_progetti"] === '1') {
                                    echo 'selected';
                                } */?>
                                        onselect="<?php /*$categoria = modificaPermesso($categoria, 'gestione_progetti', '1') */?>">
                                    Si
                                </option>
                            </select>-->
                            <div style="padding: 8px 10px">
                                <label for="permessoProgettiSi">Si</label>
                                <input type="radio" id="permessoProgettiSi" name="permessoProgetti" value="1">
                                <label for="permessoProgettiNo">No</label>
                                <input type="radio" id="permessoProgettiNo" name="permessoProgetti" value="0">
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
                            <!--<select name="permesso_utenti" id="permesso_utenti">
                                <option value="0"
                                        label="No" <?php /*if ($modalitaModifica !== null && $idCategoria !== null && $categoria["gestione_utenti"] === '0') {
                                    echo 'selected';
                                } */?>
                                        onselect="<?php /*$categoria = modificaPermesso($categoria, 'gestione_utenti', '0') */?>">
                                    No
                                </option>
                                <option value="1"
                                        label="Si" <?php /*if ($modalitaModifica !== null && $idCategoria !== null && $categoria["gestione_utenti"] === '1') {
                                    echo 'selected';
                                } */?>
                                        onselect="<?php /*$categoria = modificaPermesso($categoria, 'gestione_utenti', '1') */?>">
                                    Si
                                </option>
                            </select>-->
                            <div style="padding: 8px 10px">
                                <label for="permessoUtentiSi">Si</label>
                                <input type="radio" id="permessoUtentiSi" name="permessoUtenti" value="1" <?php if ($categoria['gestione_utenti'] == '1') {
                                    echo 'checked';} ?> onclick=" <?php $categoria['gestione_utenti'] = 1 ?> ">
                                <label for="permessoUtentiNo">No</label>
                                <input type="radio" id="permessoUtentiNo" name="permessoUtenti" value="0" <?php if ($categoria['gestione_utenti'] == '0') {
                                    echo 'checked';} ?> onclick=" <?php $categoria['gestione_utenti'] = 0 ?> ">
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
                            <!--<select name="permesso_categorie" id="permesso_categorie">
                                <option value="0"
                                        label="No" <?php /*if ($modalitaModifica !== null && $idCategoria !== null && $categoria["gestione_categorie"] === '0') {
                                    echo 'selected';
                                } */?>
                                        onselect="<?php /*$categoria = modificaPermesso($categoria, 'gestione_categorie', '0') */?>">
                                    No
                                </option>
                                <option value="1"
                                        label="Si" <?php /*if ($modalitaModifica !== null && $idCategoria !== null && $categoria["gestione_categorie"] === '1') echo 'selected'; */?>
                                        onclick="<?php /*$categoria = modificaPermesso($categoria, 'gestione_categorie', '1'); */?>">
                                    Si
                                </option>
                            </select>-->
                            <div style="padding: 8px 10px">
                                <label for="permessoCategorieSi">Si</label>
                                <input type="radio" id="permessoCategorieSi" name="permessoCategorie" value="1"<?php if ($categoria['gestione_categorie'] == 1) {
                                    echo 'checked';} ?> onclick=" <?php $categoria['gestione_categorie'] = 1 ?> ">
                                <label for="permessoCategorieNo">No</label>
                                <input type="radio" id="permessoCategorieNo" name="permessoCategorie" value="0"<?php if ($categoria['gestione_categorie'] == 0) {
                                    echo 'checked';} ?> onclick=" <?php $categoria['gestione_categorie'] = 0 ?> ">
                            </div>
                        <?php } ?>
                    </div>
                </div>
            </section>
        </article>
    </main>

    <!-- Footer -->
    <?php
    // $servizio->customFooter->showFooter();
    ?>

</div>

</body>
</html>
