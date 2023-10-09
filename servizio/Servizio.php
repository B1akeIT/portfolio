<?php

require_once('componenti/custom-header.php');
require_once('componenti/custom-aside.php');
require_once('componenti/custom-footer.php');

require_once('database/gestore-query.php');


class Servizio
{
    // Componenti custom
    public CustomHeader $customHeader;
    public CustomAside $customAside;
    public CustomFooter $customFooter;

    public function __construct()
    {
        $this->customHeader = new CustomHeader();
        $this->customAside = new CustomAside();
        $this->customFooter = new CustomFooter();
    }

    /**
     * Dopo aver inviato una richiesta POST, per esempio nella pagina Contatti,
     * questa funzione si assicura di recuperare il valore di un parametro tra i dati della richiesta
     *
     * @param string $parametro Parametro da cercare
     * @return string|null
     */
    public function getParametro($parametro): ?string
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

    /**
     * Questa funzione controlla che la stringa che riceve non sia vuota
     * (include un filtro trim).
     *
     * @param string $stringa Stringa da controllare
     * @return bool
     */
    public function validazioneStringa(string $stringa): bool
    {
        return strlen(trim($stringa)) > 0;
    }

    public function inviaDatiContatto($nomeFile, $nome = '', $email = '', $messaggio = '')
    {
        $stringa = "";
        $stringa .= "Nome: ";
        $stringa .= $nome;
        $stringa .= "\nEmail: ";
        $stringa .= $email;
        $stringa .= "\nMessaggio: ";
        $stringa .= $messaggio;

        $this->scriviTesto($nomeFile, $stringa);
    }

    // "<script>console.log({stringa});</script>" permette di usare la console consultabile dal browser.
    public function scriviTesto($nomeFile, $testoDaScrivere)
    {
        $successo = null;
        if (!$fp = fopen($nomeFile, 'a')) {
            echo "Errore: Non posso aprire il file " . $nomeFile;
        } else {
            if (!is_writable($nomeFile)) {
                echo "Errore: Non posso scrivere nel file " . $nomeFile;
            } else {
                // Prima di inserire il testo nel file lo ripulisco, in modo da non accumulare i dati man mano che le richieste vengono inviate
                file_put_contents($nomeFile, "");
                if (!fwrite($fp, $testoDaScrivere)) {
                    echo "Errore: Errore nella scrittura nel file " . $nomeFile;
                } else {
                    $successo = true;
                }
            }
        }
        fclose($fp);
        return $successo;
    }

}
