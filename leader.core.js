function ensureLeaderMembership(){

    if(!Array.isArray(leaders))
        leaders=[];

    leaders=leaders
        .map((l,i)=>({
            id:l.id ||
               ("leader_"+Date.now()+"_"+i),

            name:String(l.name||"").trim()
        }))
        .filter(l=>
            l.name &&
            l.name.toLowerCase()!=="company"
        );

    users.forEach((u,i)=>{

        if(!Array.isArray(u.transactions))
            u.transactions=[];

        if(!u.id){

            u.id=
                "user_"+Date.now()+"_"+i+"_"+

                Math.random()
                    .toString(36)
                    .slice(2,7);
        }

        if(
            !u.leaderId ||
            !leaders.some(
                l=>l.id===u.leaderId
            )
        ){

            u.leaderId="";
        }
    });

    localStorage.setItem(
        "financeLeadersData",
        JSON.stringify(leaders)
    );

    localStorage.setItem(
        "financeUsersData",
        JSON.stringify(users)
    );
}

function getLeaderName(u){

    let l=leaders.find(
        x=>x.id===u.leaderId
    );

    return l ? l.name : "Unassigned";
}

function saveLeaders(){

    localStorage.setItem(
        "financeLeadersData",
        JSON.stringify(leaders)
    );
}

function leaderUsers(lid){

    return users.filter(
        u=>u.leaderId===lid
    );
}

function leaderBalance(lid){

    return leaderUsers(lid).reduce(
        (s,u)=>s+getBalance(u),
        0
    );
}

function leaderHasRed(lid){

    return leaderUsers(lid).some(
        isRed
    );
}

function leaderDebit(lid,s,e){

    return leaderUsers(lid).reduce(
        (sum,u)=>
            sum+getDebitInDateRange(u,s,e),
        0
    );
}

function leaderCredit(lid,s,e){

    return leaderUsers(lid).reduce(
        (sum,u)=>
            sum+getCreditInDateRange(u,s,e),
        0
    );
}

function leaderAllDebit(lid){

    return leaderUsers(lid).reduce(
        (sum,u)=>
            sum+
            (u.transactions||[]).reduce(
                (a,t)=>
                    a+
                    Math.max(
                        0,
                        Number(t.debit||0)
                    ),
                0
            ),
        0
    );
}

function leaderAllCredit(lid){

    return leaderUsers(lid).reduce(
        (sum,u)=>
            sum+
            (u.transactions||[]).reduce(
                (a,t)=>
                    a+
                    Math.max(
                        0,
                        Number(t.credit||0)
                    ),
                0
            ),
        0
    );
}
