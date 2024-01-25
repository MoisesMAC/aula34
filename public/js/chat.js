const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
const socket = new WebSocket(`${wsProtocol}://${window.location.host}`);

const $onlineUsersList = document.querySelector(".online-users");
const $messagesContainer = document.querySelector(".messages-container");

const $form = document.querySelector(".chat-form");
const $nameInput = $form.querySelector("[name=name]");
const $messageInput = $form.querySelector("[name=message]");

$form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = $nameInput.value;
  const message = $messageInput.value;

  socket.send(
    JSON.stringify({
      name,
      message,
    })
  );
});

socket.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);

  const name = data.name;
  const message = data.message;

  if (!name || !message) {
    return;
  }

  const $message = document.createElement("div");
  const $userName = document.createElement("span");
  const $messageText = document.createElement("p");

  $message.classList.add("message");
  $userName.classList.add("user-name");
  $messageText.classList.add("message-text");

  $message.appendChild($userName);
  $message.appendChild($messageText);

  $userName.innerText = name;
  $messageText.innerText = message;

  $messagesContainer.appendChild($message);
});

socket.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);

  if (!data.onlineUsers) {
    return;
  }

  $onlineUsersList.innerHTML = "";

  data.onlineUsers.forEach((name) => {
    const $onlineUserItem = document.createElement("li");

    $onlineUserItem.innerText = name;

    $onlineUsersList.appendChild($onlineUserItem);
  });

  console.log(data.onlineUsers);
});
