function login(error) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>Filmliste: Login</title>
    </head>
    <body>
    <p>
    ${error ? "Benutzername und/oder Passwort falsch" : ""}
    </p>
    <form action="/login" method="POST">
    <div>
    <label for="username">Benutzername:</label>
    <input type="text" id="username" name="username" value="sepp" autofocus>
    </div>
    <div>
    <label for="password">Passwort:</label>
    <input type="password" id="password" name="password" value="sepp">
    </div>
    <input type="submit" value="Anmelden">
    </form>
    </body>
    </html>`;
}
module.exports = { login };
