// Configuração de Token
axios.defaults.headers.common["Authorization"] = "26Cc7zGn49HEzmcHoloFlgHq";


const login = document.querySelector('.login');
let username = '';


const addNewUser = username => {
  axios.post("https://mock-api.driven.com.br/api/vm/uol/participants", { name: username })
    .then((response) => {
      console.log(response);
      login.classList.add('hidden');
      updateMessages();
      sendUserActivity(username);
    })
    .catch((error) => {
      console.log(error);
    });
};

const getUserName = event => {
  event.preventDefault();
  username = event.target.username.value;
  addNewUser(username);
};

const sendUserActivity = () => {
  axios.post("https://mock-api.driven.com.br/api/vm/uol/status", { name: username })
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error, username);
    });
  setTimeout(sendUserActivity, 5000);
};

const updateParticipants = () => {
  axios.get("https://mock-api.driven.com.br/api/vm/uol/participants")
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error, username);
    });
};


const chat = document.querySelector('.chat');

const updateMessages = () => {
  axios.get("https://mock-api.driven.com.br/api/vm/uol/messages")
    .then(response => {
      chat.innerHTML = '';

      response.data.forEach(({ time, from, to, text, type }) => {
        const message_types = {
          'status': '',
          'message': 'para' + `<strong> ${to}</strong>` + ':&nbsp;',
          'private_message': 'reservadamente para' + `<strong> ${to}</strong>` + ':&nbsp;'
        };
        const message = document.createElement('li');
        message.setAttribute('data-test', 'message');
        message.classList = ['message', type];
        message.innerHTML = `<span>(${time}) </span><strong> ${from} </strong>${message_types[type]}&nbsp;${text}`;

        chat.appendChild(message);
        message.scrollIntoView();
      });
      console.log(response);

    })
    .catch(error => {
      console.log(error);
    });
};

setInterval(updateMessages, 3000);

const sendMessage = (event) => {
  event.preventDefault();

  console.log(username, event.target.message.value);

  //Saber o tipo da mensagem, direcionada ou não e privada ou pública
  axios.post("https://mock-api.driven.com.br/api/vm/uol/messages", {
    from: username,
    to: 'Todos',
    text: event.target.message.value,
    type: 'message'
  })
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
};

// menu-content ul li

const check = '<ion-icon data-test="check" class="check" name="checkmark"></ion-icon>';
//message.innerHTML = '<ion-icon name="person-circle-outline"></ion-icon>';
