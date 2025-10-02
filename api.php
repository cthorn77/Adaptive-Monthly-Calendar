<?php
if (!isset($_GET["query"])) {
    echo "No question sent";
    exit;
}

$env = parse_ini_file('.env');
$OPENAI_API_KEY = $env['OPENAI_API_KEY'] ?? "YOUR_OPENAI_API_KEY_HERE";

$headerParameters = array(
    "Content-Type: application/json",
    "Authorization: Bearer " . $OPENAI_API_KEY
);

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "https://api.openai.com/v1/chat/completions");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headerParameters);

$parameters = array(
    "model" => "gpt-3.5-turbo",
    "messages" => array(
        array("role" => "user", "content" => $_GET["query"])
    ),
    "max_tokens" => 200,
    "temperature" => 1.0
);

curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($parameters));

$response = curl_exec($ch);

if ($response === false) {
    echo curl_error($ch);
    exit;
}

$httpStatusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if ($httpStatusCode !== 200) {
    echo "HTTP Error: " . $httpStatusCode . " " . $response;
} else {
    $result = json_decode($response);
    echo $result->choices[0]->message->content;
}

curl_close($ch);
?>