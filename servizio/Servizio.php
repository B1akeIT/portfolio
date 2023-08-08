<?php

require_once('componenti/custom-header.php');
require_once('componenti/custom-aside.php');
require_once('componenti/custom-footer.php');


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

    public function inviaDati($nomeFile, $nome = '', $email = '', $messaggio = '') {
        $stringa = "";
        $stringa .= "Nome: ";
        $stringa .= $nome;
        $stringa .= "Email: ";
        $stringa .= $email;
        $stringa .= "Messaggio: ";
        $stringa .= $messaggio;

        $this->scriviTesto($nomeFile, $stringa);
    }

    // "<script>console.log({stringa});</script>" permette di usare la console consultabile dal browser.
    public function scriviTesto($nomeFile, $testoDaScrivere)
    {
        echo "testoDaScrivere " . $testoDaScrivere;
        $successo = null;
        if (!$fp = fopen($nomeFile, 'a')) {
            echo "Errore: Non posso aprire il file " . $nomeFile;
        } else {
            if (!is_writable($nomeFile)) {
                echo "Errore: Non posso scrivere nel file " . $nomeFile;
            } else {
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
