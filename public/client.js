let x;
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://all-students-related.herokuapp.com/api/username', false);
xhr.onload = function () {
    x = this.responseText;
    console.log(x);
}
xhr.send();


const btn = document.querySelector('#send');
const icon = document.querySelector('i');
const inp = document.querySelector('input');
const socket = io('https://all-students-related.herokuapp.com/');
const recognition = new webkitSpeechRecognition();

btn.addEventListener('click', sendMsg);

socket.on('message', (data) => {
    CreateMsg('Rmessage',data)
})


function sendMsg() {
    let data = {
        username: x,
        message: inp.value
    }
    if(inp.value=="")
        return;
    CreateMsg('Smessage',data,'You')

    socket.emit("message", data);
    inp.value= null;
}


function CreateMsg(className,data,str){
    const para = document.createElement('p')
    const h3 = document.createElement('h3')
    h3.innerHTML= str||data.username;
    para.innerHTML = data.message;

    const newDiv = document.createElement('div');
    newDiv.classList.add(className);
    newDiv.appendChild(h3);
    newDiv.appendChild(para);
    var screen = document.querySelector('.screen')
    screen.appendChild(newDiv)
    screen.scrollTop = screen.scrollHeight; 

}

inp.addEventListener('keypress',(e)=>{
    if(e.keyCode===13){
        sendMsg();
    }
})


icon.addEventListener('click',e=>{
    if(icon.classList.contains('fa-microphone'))
       recognition.start();
    else
        recognition.stop();
 
})

recognition.addEventListener('start',e=>{
    console.log('started')
    icon.classList.remove('fa-microphone')
    icon.classList.add('fa-microphone-slash')
})

recognition.addEventListener('result',e=>{
    w = e.results[0][0].transcript;
    w = w.slice(w.length-4,w.length)
    if(w=="send"||"over"||"done"){
        inp.value= e.results[0][0].transcript.slice(0,length-5);
        sendMsg();
    }else
        inp.value= e.results[0][0].transcript;
}) 

recognition.addEventListener('end' ,e=>{
    console.log('ended')
    icon.classList.add('fa-microphone')
    icon.classList.remove('fa-microphone-slash')
})