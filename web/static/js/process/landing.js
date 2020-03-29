
try{
    const access = window.localStorage.getItem('access');
    validate_token(access);
}
catch(error){
    console.log(error);
}

//load div to document --> these are set of get_
function load_login(){
    load_div(login_div(), 'body')
    const login_btn = document.getElementById("login_btn");
    const fields = document.getElementsByClassName("form-control");
    
    login_btn.addEventListener("click", login);
    document.addEventListener('keyup', function(event){
        if (event.keyCode == 13){
            login();
        }
    })
    
    for (var i=0; i<fields.length; i++){
        fields[i].addEventListener('keyup', update_message);
    }
}

function load_home(access, refresh){
    load_div(navbar_div(), 'body');
    get_profile('#profile_col', access, refresh);
    get_questions(undefined, access, refresh);
}

function load_div(div, where){
    document.querySelector(where).prepend(div);
}

//string divs
function login_div(){
    const login_elem = document.querySelector('#login');
    const clone = document.importNode(login_elem.content, true); 
    return clone;
}

function profile_div(data){
    const row_icon = document.createElement('div');
    row_icon.style['background-image'] = `linear-gradient(rgba(0,0,0,0.05), black), url(${data.background})`;
    row_icon.style['background-size'] = 'cover';
    row_icon.style['background-position'] = 'center';
    row_icon.classList.add('container');

    const icon = document.createElement('div');
    icon.style['background-image'] = `url(${data.icon})`;
    icon.style['background-size'] = 'cover';
    icon.style['width'] = '25%';
    icon.style['padding-bottom'] = '25%';
    icon.style['background-position'] = 'center';
    icon.classList.add('rounded-circle','m-2','col-4','card','primary','shadow-lg');
    
    const div = document.createElement('div');
    div.classList.add('card','text-white','bg-primary');

    const header = document.createElement('div');
    header.classList.add('card-header');
    header.innerHTML = `@${data.username}`;

    const body = document.createElement('div');
    body.classList.add('card-body');

    const name = document.createElement('H4');
    name.textContent = `${data.first_name} ${data.last_name}`;

    const desc = document.createElement('p');
    desc.classList.add('card-text');
    desc.innerHTML = "Hello world tang ina mo!";

    
    row_icon.appendChild(icon);
    body.appendChild(name);
    body.appendChild(desc);

    div.appendChild(header);
    div.appendChild(row_icon);
    div.appendChild(body);

    return div;
}

{/* <div class="square m-0" id="pic" style="background-image: url('{{ data.product_image }}');width: 100%;padding-bottom: 100%;background-size: cover;background-position: center;"></div> */}

function question_box_div(data){
    const div = document.createElement('div');
    div.classList.add('card', 'border-primary', 'mb-2');

    const header = document.createElement('div');
    header.classList.add('card-header');
    header.innerHTML = `From @${data.asker} to @${data.asked}`;

    const body = document.createElement('div');
    body.classList.add('card-body','pb-2');

    const question = document.createElement('H4');
    question.classList.add('card-title')
    question.innerHTML = data.question;

    const blockquote = document.createElement('blockquote');
    blockquote.classList.add('blockquote');

    const answer = document.createElement('p');
    answer.classList.add('mb-0');
    answer.innerHTML = data.answer;

    const cite_footer = document.createElement('footer');
    cite_footer.classList.add('blockquote-footer');

    const cite = document.createElement('cite');
    cite.classList.add('Source', 'Title');
    cite.innerHTML = `@${data.asked}`;

    cite_footer.append(cite);
    blockquote.append(answer);
    blockquote.append(cite_footer);

    body.append(question);
    body.append(blockquote);

    div.append(header);
    div.append(body);

    return div;
}

function navbar_div(){
    const login_elem = document.querySelector('#navbar');
    const clone = document.importNode(login_elem.content, true); 
    return clone;
}

function update_message(){
    const message = document.getElementById('message');
    message.classList.remove('text-danger');
    message.innerHTML = "Please login";
}

function validate_token(access){
    fetch("/ask/api/validate", {
        method: "POST",
        headers: {
            'Authorization': 'Bearer ' + access,
            'Content-Type': 'application/json'
        },
    })
    .then(response =>  response.json().then(data => ({status: response.status, body: data})))
    .then(data => {
        console.log(data.status);
        if (data.status != 200){
            load_login();
        }
        else{
            const refresh = window.localStorage.getItem('refresh');
            load_home(access, refresh);
        }
    })
}

function login(){
    fetch("/api/token", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": document.getElementById("username_field").value,
            "password": document.getElementById("password_field").value,
        })
        
    })
    .then(response =>  response.json().then(data => ({status: response.status, body: data})))
    .then(data => {
        const inputs = document.getElementsByClassName('is-invalid');
        while(inputs.length > 0){
            inputs[0].classList.remove('is-invalid');
        }
        if (data.status == 200){
            window.localStorage.setItem('refresh', data.body.refresh);
            window.localStorage.setItem('access', data.body.access);
            location.reload();
        }
        else if (data.status == 400){
            for (var key in data.body) {
                var div = document.getElementById(key);
                div.querySelector("#"+key+"_field").classList.add('is-invalid');
            }
        }
        else if (data.status == 401){
            const message = document.getElementById('message');
            message.innerHTML = data.body.detail;
            message.classList.add('text-danger');
        }
    })
}

//includes fetch from API and where to load
function get_questions(whereID, access, refresh){
    fetch("/ask/api/question/", {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + access,
            'Content-Type': 'application/json'
        },      
    })
    .then(response =>  response.json().then(data => ({status: response.status, body: data})))
    .then(data => {
        if (data.status == 401){
            get_new_token(refresh);
        }
        else if (data.status == 200){
            for(var i=0; i<data.body.length; i++){
                load_div(question_box_div(data.body[i]), '#questions_col');
            }
        }
    })
}

function get_profile(where, access, refresh){
    fetch("/ask/api/self", {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + access,
            'Content-Type': 'application/json'
        },      
    })
    .then(response =>  response.json().then(data => ({status: response.status, body: data})))
    .then(data => {
        if (data.status == 401){
            get_new_token(refresh);
        }
        else if (data.status == 200){
            load_div(profile_div(data.body), where)
        }
    })
}

function get_new_token(refresh){
    fetch("/api/token/refresh", {
        method: "POST",
        body: JSON.stringify({
            "refresh": refresh
        }),
        headers: {
            'Content-Type': 'application/json'
        },      
    })
    .then(response =>  response.json().then(data => ({status: response.status, body: data})))
    .then(data => {
        if (data.status == 200){
            window.localStorage.setItem('access', data.body.access);
            location.reload();
        }
    })
}



{/* <blockquote class="blockquote">
  <p class="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
  <footer class="blockquote-footer">Someone famous in <cite title="Source Title">Source Title</cite></footer>
</blockquote> */}


{/* <div class="card text-white bg-success mb-2">
  <div class="card-header">Header</div>
  <div class="card-body">
    <h4 class="card-title">Success card title</h4>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  </div>
</div> */}

