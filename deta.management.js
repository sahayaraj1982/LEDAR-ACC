function saveDataLocally(){
    ensureLeaderMembership();

    localStorage.setItem(
        "financeUsersData",
        JSON.stringify(users)
    );

    saveLeaders();
}

function exportData(){

    let a=document.createElement("a");

    a.href=
        "data:text/json;charset=utf-8,"+
        encodeURIComponent(
            JSON.stringify({
                users,
                leaders
            })
        );

    a.download="Finance_Backup_2026.json";

    a.click();
}

function importData(e){

    let f=e.target.files[0];

    if(!f) return;

    let r=new FileReader();

    r.onload=async x=>{

        try{

            let d=JSON.parse(x.target.result);

            if(Array.isArray(d)){

                users=d;

            }else{

                users=
                    Array.isArray(d.users)
                    ? d.users
                    : [];

                leaders=
                    Array.isArray(d.leaders)
                    ? d.leaders
                    : leaders;
            }

            ensureLeaderMembership();

            renderUsers();

            refreshLeaderDashboard();

            await saveToCloudOnly();

        }catch(err){

            alert("Invalid backup file");
        }
    };

    r.readAsText(f);
}

function allDeleteWithExport(){

    if(!users.length)
        return alert(
            "நீக்குவதற்கு டேட்டா எதுவும் இல்லை!"
        );

    if(
        confirm(
            "அனைத்து டேட்டாவும் நிரந்தரமாக நீக்கப்படும். "+
            "முதலில் பேக்கப் எடுக்கப்படும். தொடரலாமா?"
        )
    ){

        exportData();

        setTimeout(async()=>{

            users=[];
            leaders=[];

            saveDataLocally();

            await saveToCloudOnly();

            renderUsers();

            refreshLeaderDashboard();

            closeSettingsPopup();

            alert(
                "அனைத்து டேட்டாக்களும் நீக்கப்பட்டது!"
            );

        },500);
    }
}
