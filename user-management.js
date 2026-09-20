function leaderOptions(selected){
    ensureLeaderMembership();

    return `
        <option value="" ${!selected?"selected":""}>
            Unassigned
        </option>
        ${
            leaders.map(l=>`
                <option value="${esc(l.id)}"
                    ${l.id===selected?"selected":""}>
                    ${esc(l.name)}
                </option>
            `).join("")
        }
    `;
}

function openUserForm(i=null){

    editIndex=i;

    document.getElementById("userFormTitle").innerText=
        i===null ? "Add User" : "Edit User";

    document.getElementById("uName").value=
        i===null ? "" : (users[i]?.name||"");

    document.getElementById("uMobile").value=
        i===null ? "" : (users[i]?.mobile||"");

    document.getElementById("uLeader").innerHTML=
        leaderOptions(
            i===null
                ? (leaders[0]?.id||"")
                : (users[i]?.leaderId||"")
        );

    document.getElementById("userFormPopup")
        .style.display="flex";
}

function closeUserForm(){

    document.getElementById("userFormPopup")
        .style.display="none";

    editIndex=null;
}

async function saveUserForm(){

    let n=document.getElementById("uName")
        .value.trim();

    let m=document.getElementById("uMobile")
        .value.trim();

    let lid=document.getElementById("uLeader")
        .value;

    if(!n)
        return alert("User name is required!");

    if(editIndex===null){

        users.push({
            id:"user_"+Date.now()+"_"+
               Math.random()
               .toString(36)
               .slice(2,8),

            name:n,
            mobile:m,
            leaderId:lid,
            transactions:[]
        });

    }else{

        users[editIndex].name=n;
        users[editIndex].mobile=m;
        users[editIndex].leaderId=lid;
    }

    closeUserForm();

    renderUsers();

    refreshLeaderDashboard();

    await saveToCloudOnly();
}

function addUser(){
    openUserForm();
}

function editUser(i){

    closeActionPopup();

    openUserForm(i);
}

async function deleteUser(i){

    if(
        confirm(
            "இந்த யூசரை ஆப்பிலிருந்து நிரந்தரமாக நீக்கவா?"
        )
    ){

        users.splice(i,1);

        closeActionPopup();

        renderUsers();

        refreshLeaderDashboard();

        await saveToCloudOnly();
    }
}
