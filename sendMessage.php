<?php 

include'../login/db_connection.php';


$fullname=$_POST["fullname"];
$msg=$_POST["message"];
$email=$_POST["email"];


$sql = "INSERT INTO user_message (name, email, message , time) VALUES ('$fullname','$email','$msg',CURRENT_TIMESTAMP())";
	//$sql="ALTER TABLE `user` AUTO_INCREMENT=100000";
if ($conn->query($sql) === TRUE) {
	echo "success";
	header('Location: index.php?message_successful');
} else {
	echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();

?>