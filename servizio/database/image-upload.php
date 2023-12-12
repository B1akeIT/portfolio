<?php
session_start();
require_once('../Servizio.php');
$servizio = new Servizio();
$gestoreQuery = new GestoreQuery();

// If file upload form is submitted
$status = $statusMsg = '';
if (!empty($_FILES["playground-immagine"]["name"])) {
    // Get file info
    $fileName = basename($_FILES["playground-immagine"]["name"]);
    $fileType = pathinfo($fileName, PATHINFO_EXTENSION);

    // Allow certain file formats
    $allowTypes = array('jpg', 'png', 'jpeg', 'gif');
    if (in_array($fileType, $allowTypes)) {
        $image = $_FILES['playground-immagine']['tmp_name'];
        $imgContent = addslashes(file_get_contents($image));

        $sql = "INSERT into immagine (image) VALUES ('$imgContent')";

        // Insert image content into database
        $insert = $gestoreQuery->gestoreConnessione->getMysqli()->query($sql);

        if ($insert) {
            $status = 'success';
            $statusMsg = "File uploaded successfully.";
        } else {
            $statusMsg = "File upload failed, please try again.";
        }
    } else {
        $statusMsg = 'Sorry, only JPG, JPEG, PNG, & GIF files are allowed to upload.';
    }
} else {
    $statusMsg = 'Please select an image file to upload.';
}

// Display status message
echo $statusMsg;

?>