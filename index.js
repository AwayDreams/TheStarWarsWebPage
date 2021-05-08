var rota = 'https://swapi.dev/api/people/1/'; //Endereço inicial
var container;
$(document).ready(function(){ //Aguarda o documento ser carregado pelo browser para iniciar as consultas
    container = document.getElementById("container");
    getData();
});

function getData(){ //Obtem as informações da API
    axios.get(rota) //biblioteca Axios foi utilizada para facilitar os requests
    .then(function (response) {
        container.innerHTML = ''; //apaga o conteudo da div assim que recebe a resposta
        var chaves = Object.keys(response.data); //obtem as chaves do JSON recebido como resposta
        for (i of chaves) { //executa uma operação para cada chave obtida
            if(Array.isArray(response.data[i]) && (Array.from(response.data[i]).length > 0)){ //caso seja um array
                getEmbedArray(response.data[i], i); 
            }else{
                if(String(response.data[i]).includes('http://') && i != 'url'){ //caso seja um link
                    getEmbed(response.data[i], i, (name, i) =>{
                        console.log("verificando", i, response.data[i], name);
                        container.innerHTML += `<div class="center">${i} <a onClick="router('${response.data[i]}')">${name}</a>`
                    });
                }
                else if(response.data[i] != ""){ //caso seja uma chave simples
                    container.innerHTML += `<div class="center">${i}<textarea ${i == "opening_crawl" ? `id="opening"`: null} readonly>${response.data[i]}`;
                }
            }
        }
        console.log(response);
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
}

function getEmbedArray(data, i){ //realiza a consulta de cada link no array para obter o nome das referencias e exibir na tela
    var links = [];
    console.log("data", data);
    var div = document.createElement('div');
    div.setAttribute("id", i);
    div.setAttribute("class", "center");
    div.innerHTML = `${i}</br>`;
    container.appendChild(div);
    data.map(async (link) =>{
        if(link.includes('http://')){
            getEmbed(link, i, (name, i) =>{
                document.getElementById(i).innerHTML += `<a onClick="router('${link}')">${name}</a>`;
                console.log("name",name);
            })
        }
    })

}

function getEmbed(endereco, i, callback){ //obtem o nome da referencia do link
    axios.get(endereco)
    .then((response)=>{
        if(response.data["name"] != undefined){
            callback(response.data["name"], i);
        }else{
            callback(response.data["title"], i);
        }
        
    })
    .catch(function (error) {
        console.log("error", error);
        callback("não foi possivel recuperar o nome"); 
    })
}

function carregando(){ //limpa a tela e exibi a mensagem de carregando
    container.innerHTML = "carregando..";
}

function router(endereco){ //sobrescreve o endereço, e prepara a pagina para receber os novos dados
    rota = endereco;
    carregando();
    getData();
}



