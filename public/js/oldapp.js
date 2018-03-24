const socket = io();

const state = {
  games: []
};

document.addEventListener("click", function (event) {
  console.warn("[[debug]]", "- :click", event.target);
  const buttonEl = event.target.closest("button");
  if (!buttonEl) { return; }
  const action = buttonEl.getAttribute("data-action");
  const contextEl = buttonEl.closest("[data-context]");

  switch (action) {
    case "create-game": {
      console.warn("[[debug]]", "> :create-game");
      socket.emit("create-game");
      break;
    }

    case "delete-game": {
      if (!contextEl) { return; }
      const gameId = contextEl.getAttribute("data-id");
      console.warn("[[debug]]", "> :delete-game");
      socket.emit("delete-game", gameId);
      break;
    }
  }
});

socket.on("games-list", function (games) {
  console.warn("[[debug]]", "< :games-list", games);
  state.games = games;
  render();
});

socket.on("game-created", function (game) {
  console.warn("[[debug]]", "< :game-created", game);
  state.games.push(game);
  render();
});

socket.on("game-deleted", function (gameId) {
  console.warn("[[debug]]", "< :game-deleted", gameId);

  const index = state.games.findIndex((v) => {
    return v._id === gameId;
  });

  if (index > -1) {
    state.games.splice(index, 1);
  }

  render();
});

function renderGamesList(data) {
  console.warn("[[debug]]", "- :renderGamesList");
  const oldGamesListEl = document.getElementById("games-list");
  if (!oldGamesListEl || !oldGamesListEl.parentNode) { return; }

  const newGamesListEl = document.createElement("div");
  newGamesListEl.setAttribute("id", "games-list")
  newGamesListEl.classList.add("list-group", "list-group-flush");

  data.games.forEach((game) => {
    const gameItemEl = document.createElement("div");
    const deleteButtonEl = document.createElement("button");
    const gameIdEl = document.createElement("span");

    gameItemEl.classList.add("list-group-item", "game");
    gameItemEl.setAttribute("data-context", "game");
    gameItemEl.setAttribute("data-id", game._id);
    deleteButtonEl.setAttribute("data-action", "delete-game");
    deleteButtonEl.classList.add("btn", "btn-danger");
    gameIdEl.classList.add("game-id");

    deleteButtonEl.textContent = "Delete";
    gameIdEl.textContent = game._id;
    gameItemEl.appendChild(deleteButtonEl);
    gameItemEl.appendChild(document.createTextNode(" "));
    gameItemEl.appendChild(gameIdEl);

    newGamesListEl.appendChild(gameItemEl);
  });

  oldGamesListEl.parentNode.replaceChild(newGamesListEl, oldGamesListEl);
}

function render () {
  console.warn("[[debug]]", "- :render");
  renderGamesList(state);
}

socket.emit("refresh-games-list");
