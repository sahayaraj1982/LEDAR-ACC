const CLOUD_URL="https://script.google.com/macros/s/AKfycbyTiDbuO5bNJ_7X_sDROuOm8ohWcLDoSxoZfWO9namwoI2bJ6UQw5LaYqDVK7kovsj0/exec";

function showLoading(s){
    document.getElementById("loading").style.display=
        s ? "block" : "none";
}

async function saveToCloudOnly(){

    saveDataLocally();

    const led=document.getElementById("ledLight");

    if(
        !appConfig.showCloud ||
        !CLOUD_URL ||
        CLOUD_URL==="xxx"
    ){
        led.classList.remove("connected");
        return;
    }

    showLoading(true);

    try{

        await fetch(
            CLOUD_URL,
            {
                method:"POST",
                mode:"no-cors",
                headers:{
                    "Content-Type":
                        "application/x-www-form-urlencoded"
                },
                body:
                    "data="+
                    encodeURIComponent(
                        JSON.stringify({
                            users,
                            leaders
                        })
                    )
            }
        );

        led.classList.add("connected");

    }catch(e){

        led.classList.remove("connected");
    }

    showLoading(false);
}

async function fetchFromCloud(){

    const led=document.getElementById("ledLight");

    if(
        !appConfig.showCloud ||
        !CLOUD_URL ||
        CLOUD_URL==="xxx"
    ){

        led.classList.remove("connected");

        ensureLeaderMembership();

        renderUsers();

        return;
    }

    showLoading(true);

    try{

        let r=await fetch(CLOUD_URL);

        let d=await r.json();

        if(Array.isArray(d)){

            users=d;

        }else if(
            d &&
            Array.isArray(d.users)
        ){

            users=d.users;

            if(Array.isArray(d.leaders))
                leaders=d.leaders;
        }

        ensureLeaderMembership();

        renderUsers();

        led.classList.add("connected");

    }catch(e){

        led.classList.remove("connected");

        ensureLeaderMembership();

        renderUsers();
    }

    showLoading(false);
}
