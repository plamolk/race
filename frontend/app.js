const $ = (txt) => document.getElementById(txt);

const get_profile = () =>{

let token = localStorage.getItem('token');
return fetch('/profile' ,{
    headers:{'Authrization' : 'Bearer ' +token}
})
.then(res => res.json())
.then(data =>{
    return data;
})
}

const get_client = (id) => {
    return fetch('/select/client/' +id)
    .then(res => res.json())
    .then(data =>{
        return data
    })
}

const score = (score) =>{
    let id = score.id;
    let value = score.value;
    let assessor = score.name;
    return fetch('/add/score/'+ id , {
        method:'PUT',
        headers:{'content-type':'application/json'},
        body:JSON.stringify({value:value , assessor:assessor , assessId:assessId})
    })
}