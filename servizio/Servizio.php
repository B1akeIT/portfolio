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


}
