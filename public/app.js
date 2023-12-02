const lightMode = document.getElementById("light-mode");
const darkMode = document.getElementById("dark-mode");
const ChatBox = document.querySelector(".app");
const Login = document.querySelector(".Login");
const chat = document.querySelector(".app");
const join_server = document.querySelector(".join-server");
const exit_server = document.getElementById("exit");
const MessageBox = document.querySelector(".messages-box");
const UserName = document.getElementById("user-name");
const socket = io("http://localhost:3000/");

function LightUI(){
    ChatBox.classList.add("light-Chat");
    lightMode.style.display = "none";
    darkMode.style.display = "inline-block";
}

function DarkUI(){
    ChatBox.classList.remove("light-Chat");
    lightMode.style.display = "inline-block";
    darkMode.style.display = "none";
}

function PreventTheDefault(event){
    event.preventDefault();
}

darkMode.addEventListener("click", DarkUI);
lightMode.addEventListener("click", LightUI);


join_server.addEventListener("click",()=>{
    if(UserName.checkValidity()){
        Login.classList.add("disabled");
        chat.classList.remove("disabled");
    }
});

const Message_Input = document.getElementById("user-message");
const Send_Message = document.getElementById("send");
const Online = document.querySelector(".users");

socket.on("connect", ()=>{
    socket.on("onlineusers",function(user){
        Online.innerHTML = user + " online";
    });
});

socket.on("disconnect", ()=>{
    socket.on("onlineusers", function(user){
        Online.innerHTML = user + " online";
    })
});

join_server.addEventListener("click", function(){
    socket.emit("newuser", UserName.value);
});

Send_Message.addEventListener("click", function(){
    let message = Message_Input.value;
    if(message.length == 0){
        return;
    }
    renderMessage("my", {
        username:UserName.value,
        text:message
    });
    socket.emit("chat", {
        username:UserName.value,
        text:message
    });

    Message_Input.value = "";
});

socket.on("update", function(update){
    renderMessage("update", update);
});

socket.on("chat", function(message){
    renderMessage("other", message);
});

exit_server.addEventListener("click",function(){
    let username = UserName.value;

    socket.emit("exituser", username);
    window.location.href = window.location.href;
})

function renderMessage(type, message){
    if(type == "my"){
        let el = document.createElement("div");
        el.setAttribute("class", "message my-message");
        el.innerHTML = `
        <div class="message-box">
           <div class="name">You</div>
           <div class="text">${message.text}</div>
        </div>
        `;
        MessageBox.appendChild(el);
    }else if(type == "other"){
        let el = document.createElement("div");
        el.setAttribute("class", "message other-message");
        el.innerHTML = `
        <div class="message-box">
           <div class="name">${message.username}</div>
           <div class="text">${message.text}</div>
        </div>
        `;
        MessageBox.appendChild(el);
    }else if(type == "update"){
        let el = document.createElement("div");
        el.setAttribute("class", "update");
        el.innerHTML = message;
        MessageBox.appendChild(el);
    }
    MessageBox.scrollTop = MessageBox.scrollHeight - MessageBox.clientHeight;
}