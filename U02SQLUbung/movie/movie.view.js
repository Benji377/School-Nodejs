function renderHeader(request) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>Filmliste</title>
    <link rel="stylesheet" href="/style.css">
    </head>
    <body>
    <h1>Filmliste</h1>
    ${request.user
      ? `<p class="title">Sie sind angemeldet als ${request.user.username}. Ihr Name lautet ${request.user.firstname} ${request.user.secondname}</p>
        <div class="inline">
        <a href="/logout">Logout</a>
        <a href="/movie/edit">Neuer Film</a>
        </div>   
        ${importMovie()}`
      : `<p class="title">Melden Sie sich an, um Ihre Filme hinzuzufügen</p>
        <a href="/login">Login</a>`
    }
    `
}

function renderList(movies, request) {
  return `
    ${renderHeader(request)}
    <table>
    <tr><th>Titel</th><th>Jahr</th><th>Öffentlich</th><th>Besitzer</th>
    <th></th><th></th></tr>
    ${request.user ? movies.map((movie) =>
    movie.owner == request.user.username || movie.published == 1 ?
      `<tr>
        <td>${movie.title}</td>
        <td>${movie.year}</td>
        <td>${movie.published ? "Ja" : "Nein"}</td>
        <td>${movie.owner}</td>
        ${request.user && request.user.username == movie.owner
        ? `<td><a href="/movie/remove/${movie.id}">Löschen</a></td>
                <td><a href="/movie/edit/${movie.id}">Ändern</a></td>`
        : `<td><a href="/movie/view/${movie.id}">Ansehen</a>
                </td><td></td>`
      }
        </tr>` : ''
  )
      .join("")
      :
      movies.map((movie) =>
        !movie.published ? '' :
          `<tr>
            <td>${movie.title}</td>
            <td>${movie.year}</td>
            <td>${movie.published ? "Ja" : "Nein"}</td>
            <td>${movie.owner}</td>
            ${request.user && request.user.username == movie.owner
            ? `<td><a href="/movie/remove/${movie.id}">Löschen</a></td>
                    <td><a href="/movie/edit/${movie.id}">Ändern</a></td>`
            : `<td><a href="/movie/view/${movie.id}">Ansehen</a>
                    </td><td></td>`
          }
            </tr>`
      )
        .join("")
    }
    </table>
    </body>
    </html>
    `;
}
function renderMovie(movie, request) {
  return `
  ${renderHeader(request)}
    <table>
    <tr>
    <td>Titel:</td>
    <td>${movie.title}</td>
    </tr>
    <tr>
    <td>Jahr:</td>
    <td>${movie.year}</td>
    </tr>
    <tr>
    <td>Öffentlich:</td>
    <td>${movie.published ? "Ja" : "Nein"}</td>
    </tr>
    <tr>
    <td>Besitzer:</td>
    <td>${movie.owner}</td>
    </tr>
    </table>
    <a href="/">Zurück</a>
    </body>
    </html>
    `;
}

function editMovie(movie, request) {
  return `
  ${renderHeader(request)}
    <form action="/movie/save" method="post">
    <input type="hidden" name="id" value="${movie.id}">
    <table class="noborder">

    <tr>
    <td><label for="title">Titel:</label></td>
    <td><input type="text" id="title" name="title" value="${movie.title}"></td>
    </tr>

    <tr>
    <td><label for="year">Jahr:</label></td>
    <td><input type="text" id="year" name="year" value="${movie.year}"></td>
    </tr>

    <tr>
    <td><label for="published">Öffentlich:</label></td>
    <td><input type="checkbox" id="published" name="published" value="${movie.published}" ${movie.published ? "checked" : ""}></td>
    </tr>

    <tr>
    <td><label>Besitzer:</label></td>
    <td><input type="text" id="owner" name="owner" value="${request.user.username}" readonly></td>
    </tr>
    </table>

    <input type="submit" value="Speichern">
    <a href="/">Zurück</a>

    </form>
    </body>
    </html>
    `;
}

function errorDisplay() {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <title>Filmliste</title>
  <link rel="stylesheet" href="/style.css">
  </head>
  <body>
  <h1>Meldung</h1>
  <p>Die Web-Anwendung ist momentan überlastet. Probieren sie es später wieder...</p>
  <a href="#">Wiederholen</a>
  <a href="/">Zurück</a>
  </body>
  `;
}

function errorCatcher(error) {
  console.log("Failed: ", error);
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <title>Filmliste</title>
  <link rel="stylesheet" href="/style.css">
  </head>
  <body>
  <h1>Meldung</h1>
  <p>Import meldet:</p>
  <p>${error}</p>
  <a href="/">Zurück</a>
  </body>
  `;
}

function importMovie() {
  return `
  <form action="/movie/import" method="post" enctype="multipart/form-data" class="inline">
  <div class="inputdiv">
  <input type="file" id="importfile" name="importfile">
  <input type="submit" value="Importieren" class="filesubmit">
  </div>
  </form>
  `;
}

module.exports = { renderList, renderMovie, editMovie, errorDisplay, errorCatcher };
