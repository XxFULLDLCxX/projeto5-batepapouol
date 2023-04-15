// Configuração de Token
axios.defaults.headers.common["Authorization"] = "26Cc7zGn49HEzmcHoloFlgHq";


const login = document.querySelector('.login');
const chat = document.querySelector('.chat');
const participants = document.querySelector('.participants');
const users = document.querySelector('.users');
let from_username = false;
let to_username = 'Todos';
let message_status = 'message';

const addNewUser = from_username => {
  axios.post("https://mock-api.driven.com.br/api/vm/uol/participants", { name: from_username })
    .then(response => {
      console.log(response);
      login.classList.add('hidden');
      setInterval(sendUserActivity, 5000, from_username);
      setInterval(updateMessages, 3000, from_username);
    })
    .catch((error) => {
      console.log(error);
      // window.location.reload();
    });
};

const getUserName = event => {
  event.preventDefault();
  console.log(typeof (from_username));
  if (typeof (from_username) === 'boolean') {
    from_username = event.target.username.value;
    console.log(event.target.username.value);
    addNewUser(from_username);
  }
};

const sendUserActivity = from_username => {
  axios.post("https://mock-api.driven.com.br/api/vm/uol/status", { name: from_username })
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error, from_username);
      window.location.reload();
    });
};

const updateParticipants = () => {
  users.innerHTML = '';
  axios.get("https://mock-api.driven.com.br/api/vm/uol/participants")
    .then(response => {
      [{ name: 'Todos' }, ...response.data].forEach(({ name }) => {
        console.log(response);
        const participant = document.createElement('li');
        participant.setAttribute('data-test', 'participant');
        participant.classList.add('y-center');
        participant.classList.add(name);
        participant.onclick = () => {
          document.querySelector(`.${to_username} .check`).classList.add('hidden');
          to_username = participant.textContent;
          console.log(to_username);
          document.querySelector(`.${to_username} .check`).classList.remove('hidden');
        };
        if (name !== 'Todos') {
          participant.innerHTML += `<ion-icon name="person-circle-outline"></ion-icon>${name}${check}`;
          users.appendChild(participant);
        }
        // users.innerHTML += `
        // <li data-test="participant" class="y-center">
        //   <ion-icon name="person-circle-outline"></ion-icon>${name}
        // </li>`;
      });
    })
    .catch(error => {
      console.log(error, from_username);
      window.location.reload();
    });
};

const messageVisibility = element => {
  // erro ao pressionar o mesmo duas vezes.
  // analise e arrume o participants visto que nomes &¨**$% não pode ser seletores.
  document.querySelectorAll('.v.check').forEach(element => element.classList.toggle('hidden'));
  message_status = element.getAttribute('x-state');
};

const updateMessages = from_username => {
  console.log(typeof (from_username));
  if (typeof (from_username) === 'string') {
    axios.get("https://mock-api.driven.com.br/api/vm/uol/messages")
      .then(response => {
        chat.classList.remove('hidden');
        chat.innerHTML = '';

        response.data.forEach(({ time, from, to, text, type }) => {
          const message_types = {
            'status': '',
            'message': 'para' + `<strong> ${to}</strong>` + ':&nbsp;',
            'private_message': 'reservadamente para' + `<strong> ${to}</strong>` + ':&nbsp;'
          };
          const message = document.createElement('li');
          message.setAttribute('data-test', 'message');
          message.classList.add('message');
          message.classList.add(type);
          if (from !== from_username && to !== from_username && type === 'private_message') {
            message.classList.add('hidden');
          }
          message.innerHTML = `<span>(${time}) </span><strong> ${from} </strong>${message_types[type]}&nbsp;${text}`;

          chat.appendChild(message);
          message.scrollIntoView();
        });
        console.log(response);

      })
      .catch(error => {
        console.log(error);
        window.location.reload();
      });
  }
};

const sendMessage = (event) => {
  event.preventDefault();

  console.log(from_username, event.target.message.value);
  console.log(message_status);
  //Saber o tipo da mensagem, direcionada ou não e privada ou pública
  axios.post("https://mock-api.driven.com.br/api/vm/uol/messages", {
    from: from_username,
    to: to_username,
    text: event.target.message.value,
    type: message_status
  })
    .then(response => {
      console.log(response);
      updateMessages(from_username);
    })
    .catch(error => {
      console.log(error);
      //window.location.reload();
    });
};

let loop_menu;

const viewParticipants = () => {
  if (participants.classList.contains('hidden')) {
    updateParticipants();
    loop_menu = setInterval(updateParticipants, 10000);
  } else {
    clearInterval(loop_menu);
  }
  participants.classList.toggle('hidden');

};

// menu-content ul li

const check = '<ion-icon data-test="check" class="check hidden" name="checkmark"></ion-icon>';
//message.innerHTML = '<ion-icon name="person-circle-outline"></ion-icon>';
