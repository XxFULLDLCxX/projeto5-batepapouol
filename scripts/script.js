// Configuração de Token
axios.defaults.headers.common["Authorization"] = "26Cc7zGn49HEzmcHoloFlgHq";


const login = document.querySelector('.login');
let username = false;


const addNewUser = username => {
  axios.post("https://mock-api.driven.com.br/api/vm/uol/participants", { name: username })
    .then((response) => {
      console.log(response);
      login.classList.add('hidden');
      setInterval(sendUserActivity, 5000, username);
      setInterval(updateMessages, 3000, username);
    })
    .catch((error) => {
      console.log(error);
      // window.location.reload();
    });
};

const getUserName = event => {
  event.preventDefault();
  console.log(typeof (username));
  if (typeof (username) === 'boolean') {
    username = event.target.username.value;
    console.log(event.target.username.value);
    addNewUser(username);
  }
};

const sendUserActivity = username => {
  axios.post("https://mock-api.driven.com.br/api/vm/uol/status", { name: username })
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error, username);
      // window.location.reload();
    });
};

const updateParticipants = () => {
  axios.get("https://mock-api.driven.com.br/api/vm/uol/participants")
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error, username);
      // window.location.reload();
    });
};


const chat = document.querySelector('.chat');

const updateMessages = username => {
  console.log(typeof (username));
  if (typeof (username) === 'string') {
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
          message.classList.add('message');
          message.classList.add(type);
          if ((from === username || to === username) && type === 'private_message') {
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
        // window.location.reload();
      });
  }
};

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
      updateMessages(username);
    })
    .catch(error => {
      console.log(error);
      // window.location.reload();
    });
};

// menu-content ul li

const check = '<ion-icon data-test="check" class="check" name="checkmark"></ion-icon>';
//message.innerHTML = '<ion-icon name="person-circle-outline"></ion-icon>';
