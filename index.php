<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="./css/accueil_style.css" rel="stylesheet">
    <title>Jeu en ligne</title>
</head>
    <body>
        <div class="container">
            <div class="titre">
                <h1>Bienvenue &agrave; vous sur notre site de jeu en ligne</h1>
            </div>
            <div class="jeux_dispos">
                <button id="4" onclick="color(id)">Pendu</button>
                <button id="5" onclick="color(id)">Quizz_bin</button>
                <button id="6" onclick="color(id)">Memori</button>

            </div>
            <script type="text/javascript">
                function color(id) {
                    document.getElementById(id).style.backgroundColor = "red"

                }
            </script>
        </div>
    </body>
</html>
