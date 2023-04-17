// Configuração de Token
axios.defaults.headers.common["Authorization"] = "26Cc7zGn49HEzmcHoloFlgHq";

const chat = document.querySelector('.chat');
const recipient = document.querySelector('.recipient');
const side_menu = document.querySelector('.side-menu aside');
const users = document.querySelector('.users');
let from_username = false;
let to_username = 'Todos';
let message_status = 'message';
let view_status = { 'message': 'publicamente', 'private_message': 'reservadamente' };

const login = document.querySelector('.login');

const getUserName = event => {
  event.preventDefault();
  if (typeof (from_username) === 'boolean') {
    from_username = event.target.username.value;
    addNewUser(from_username);
  }
};

const start = document.querySelector('.start');
const addNewUser = from_username => {
  axios.post("https://mock-api.driven.com.br/api/vm/uol/participants", { name: from_username })
    .then(() => {
      login.classList.add('hidden');
      setInterval(updateParticipants, 10000);
      setInterval(sendUserActivity, 5000, from_username);
      setInterval(updateMessages, 3000, from_username);
    })
    .catch(() => window.location.reload());
};

const sendUserActivity = from_username => {
  axios.post("https://mock-api.driven.com.br/api/vm/uol/status", { name: from_username })
    .then(() => updateMessages(from_username))
    .catch(() => window.location.reload());
};

const createRecipientMessage = (to, status) => `Enviando para ${to} (${status})`;


const selectParticipant = (element) => {
  document.querySelectorAll(`.check:not(.view)`).forEach(
    element => element.classList.add('hidden'));
  element.querySelector('.check').classList.remove('hidden');
  to_username = element.textContent.trim();
  recipient.innerHTML = createRecipientMessage(to_username, view_status[message_status]);
};

const updateParticipants = () => {
  users.innerHTML = '';
  axios.get("https://mock-api.driven.com.br/api/vm/uol/participants")
    .then(response => {
      response.data.forEach(({ name }) => {
        const participant = document.createElement('li');
        participant.setAttribute('data-test', 'participant');
        participant.classList.add('y-center');
        participant.onclick = () => selectParticipant(participant);
        participant.innerHTML += `<ion-icon name="person-circle-outline"></ion-icon>${name}${check}`;
        users.appendChild(participant);
      });
    })
    .catch(() => window.location.reload());
};

const messageVisibility = element => {
  document.querySelectorAll('.view.check').forEach(
    element => element.classList.add('hidden'));
  element.querySelector('.view.check').classList.remove('hidden');
  message_status = element.getAttribute('x-state');
  recipient.textContent = createRecipientMessage(to_username, view_status[message_status]);
};

const updateMessages = from_username => {
  if (typeof (from_username) === 'string' || true) {
    axios.get("https://mock-api.driven.com.br/api/vm/uol/messages")
      .then(response => {
        chat.innerHTML = '';

        response.data.forEach(({ time, from, to, text, type }) => {
          reversed = from !== from_username && to !== from_username && to !== 'Todos';
          const message = document.createElement('li');

          if (!(reversed && type === 'private_message')) {
            chat.appendChild(message);
            const message_types = {
              'status': '',
              'message': 'para' + `<strong> ${to}</strong>` + ':&nbsp;',
              'private_message': 'reservadamente para' + `<strong> ${to}</strong>` + ':&nbsp;'
            };
            message.classList.add('message');
            message.classList.add(type);
            message.innerHTML = `<span>(${time}) </span><strong> ${from} </strong>${message_types[type]}&nbsp;${text}`;
            message.scrollIntoView();
          }
          message.setAttribute('data-test', 'message');

          if (!start.classList.contains('hidden')) {
            start.classList.add('hidden');
            textarea.focus();
          }
        });
      })
      .catch(() => window.location.reload());
  }
};

const sendMessage = () => {
  if (textarea.value) {
    setTimeout(() => updateMessages(from_username), 100);
    axios.post("https://mock-api.driven.com.br/api/vm/uol/messages", {
      from: from_username,
      to: to_username,
      text: textarea.value,
      type: message_status
    })
      .then(() => updateMessages(from_username)
      )
      .catch(() => window.location.reload());
  }
};

let loop_menu;
const overlay = document.querySelector('.overlay');

const viewParticipants = () => {
  if (overlay.classList.contains('hidden')) {
    updateParticipants();
  } else {
    textarea.focus();
  }
  overlay.classList.toggle('hidden');
  setTimeout(() => side_menu.classList.toggle('slide-left'), 200);
};

// menu-content ul li

const check = '<ion-icon data-test="check" class="check hidden" name="checkmark"></ion-icon>';
//message.innerHTML = '<ion-icon name="person-circle-outline"></ion-icon>';

const textarea = document.querySelector('textarea');
textarea.addEventListener("keydown", event => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage(event.target.form);
  }
});

/*
Lista de participantes distoantes entre 10 segundos e userActivity há 5 segundos,
 há um momento que pode haver um participante no menu e não na message
 Muito inconclusivo.
 Pode ser só o recarregar da pagina que é necessário, 
 Pode haver a necessidade de criar um array de participants logo no inicio.
 O Avaliador só ver as messages, talvez elas devam está todas com view none... 
 case sensitive Jm != JM, mas no avaliador, talvez não. 
 a ordem de execução pode inferir no resultado.
 setInterval a ser pode não ser uma boa metódologia.
*/