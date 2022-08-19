const socket = io();

let productosForm = document.getElementById('productosForm')
const handleSubmit = (evt,form,route) =>{
    evt.preventDefault()
    let formData = new FormData(form);
    let obj = {};
    formData.forEach((value,key)=>obj[key]=value);
    fetch(route,{
        method:"POST",
        body:JSON.stringify(obj),
        headers:{
            "Content-Type":"application/json"
        }
    }).then(res =>res.json()).then(json=>console.log(json),socket.emit('newProducto',obj));
}
productosForm.addEventListener('submit',(e)=>handleSubmit(e,e.target,'/productos'))

socket.on('lista',data=>{
    let log = document.getElementById('lista');
    let messages = "";
    Array.from(data).forEach(message => {
       messages = messages+`
        <tr>
            <td>${message.title}</td>
            <td>${message.prices}</td>
            <td> <img src="${message.thumbnail}" alt="El enlace no esta disponible" width="60"></td>
        </tr>`
    });
    log.innerHTML = messages;
    document.getElementById("productosForm").reset()
})


///CHAT 


let username;
const chatBox = document.getElementById('chatBox')
Swal.fire({
    title: "Tu Gmail",
    input: "text",
    text: "Ingresa tu Gmail de identificacion en el chat",
    inputValidator: (value)=>{
        return !value && "Necesitas identificarte para poder continuar >:c"
    },
    allowOutsideClick:false,
    allowEscapeKey:false
}).then(result=>{
    username = result.value
    //socket.connect();
})

//Liseners

chatBox.addEventListener('keyup',evt=>{
    if(evt.key==="Enter"){
        if(chatBox.value.trim().length>0){
            socket.emit('message',{user:username,message:chatBox.value})
            chatBox.value="";

        }
        document.getElementById("Enter").click();
    }
})
chatBox.addEventListener('submit',evt=>{

        if(chatBox.value.trim().length>0){
            socket.emit('message',{user:username,message:chatBox.value})
            chatBox.value="";
        }
    
})

//Listeners

socket.on('log',data=>{
    let log = document.getElementById('log');
    let messages = "";
    Array.from(data).forEach(message => {
       messages = messages+`<h6><b>${message.user}</b><h7>  ${message.fecha}: </h7></h6><h8>${message.message}</h8></br>`
    });
    log.innerHTML = messages;
})

