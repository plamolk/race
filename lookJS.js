function getinforToken(){
    const token = localStorage.getItem("token");

    return fetch('/profile',{
        headers:{"Authorization": "Bearer "+token}
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('name').innerHTML = data.client_fullname;
        return data;
    })
}
function upload(){
    
}
function get_client(txt){
    return fetch('/select/client/' + txt)
    .then(res => res.json())
    .then(data =>{
        return data;
    })
}
function get_department(txt){
    return fetch('/select/department/' + txt)
    .then(res => res.json())
    .then(data =>{
        return data;
    })
}
function get_position(txt){
    return fetch('/select/position/' + txt)
    .then(res => res.json())
    .then(data =>{
        return data;
    })
}
function get_institution(txt){
    return fetch('/select/institution/' + txt)
    .then(res => res.json())
    .then(data =>{
        return data;
    })
}

function score (score){
    let id = score.id;
    let num = score.value;

    fetch('/ub/score_as/'+ id ,{
        method:'PUT',
        headers:{'content-type':'application/json'},
        body:JSON.stringify({num:num})
    })
}

function choice_1(choice){
    let dox = document.getElementsByName(choice.name);
    dox.forEach(item =>{
        if(item != choice){
            item.checked = false;
        }
        if(item == choice){
            let id = choice.id;
            let num = 1;
            fetch('/ub/choice_as/'+ id ,{
                method:'PUT',
                headers:{'content-type':'application/json'},
                body:JSON.stringify({num:num})
            })
        }
    })
}
function choice_0(choice){
    let dox = document.getElementsByName(choice.name);
    dox.forEach(item =>{
        if(item != choice){
            item.checked = false;
        }
        if(item == choice){
            let id = choice.id;
            let num = 0;
            fetch('/ub/choice_as/'+ id ,{
                method:'PUT',
                headers:{'content-type':'application/json'},
                body:JSON.stringify({num:num})
            })
        }
    })
}

function status(txt){
    if(txt == 0){
        return "<span class='font-bold text-gray-700'>ขอรับการประเมิน</span>"
    } else if(txt == 1){
        return "<span class='font-bold text-ornage-600'>ประเมินตนเอง</span>"
    } else if (txt == 2){
        return "<span class='font-bold text-red-700'>รอกรรมการประเมิน</span>"
    } else if (txt == 3){
        return "<span class='font-bold text-green-700'>เสร็จสิ้นการประเมิน</span>"
    }
}