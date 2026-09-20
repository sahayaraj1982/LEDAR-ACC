function renderUsers(){
    ensureLeaderMembership();

    let search=(document.getElementById("userSearch").value||"").toLowerCase().trim();
    let list=document.getElementById("userList");

    list.innerHTML="";

    let total=0,
        rc=0,
        ten=0,
        cr=0,
        db=0,
        crUsers=new Set(),
        dbUsers=new Set();

    let s=document.getElementById("filterStartDate").value;
    let e=document.getElementById("filterEndDate").value;

    users.forEach(u=>{
        total+=getBalance(u);

        if(isRed(u)){
            rc++;
            ten+=getTenPercent(u);
        }

        (u.transactions||[]).forEach(t=>{
            let d=String(t.date||"").split("T")[0];
            let cv=Number(t.credit||0);
            let dv=Number(t.debit||0);

            if(d>=s&&d<=e){
                if(cv>0){
                    cr+=cv;
                    crUsers.add(u.id);
                }

                if(dv>0){
                    db+=dv;
                    dbUsers.add(u.id);
                }
            }
        });
    });

    document.getElementById("totalUsers").innerText=users.length;

    document.getElementById("totalBalance").innerText=
        "₹ "+total.toLocaleString();

    document.getElementById("redUsersCount").innerText=rc;

    document.getElementById("tenPercentTotal").innerText=
        "₹ "+ten.toLocaleString();

    document.getElementById("dateTotalCredit").innerText=
        crUsers.size+" / ₹ "+cr.toLocaleString();

    document.getElementById("dateTotalDebit").innerText=
        dbUsers.size+" / ₹ "+db.toLocaleString();


    let f=users.filter(u=>
        (u.name||"").toLowerCase().includes(search) ||
        (u.mobile||"").toLowerCase().includes(search)
    );


    f.sort((a,b)=>{

        if(appConfig.showRedHighlight){

            let x=isRed(a);
            let y=isRed(b);

            if(x!==y)
                return y-x;
        }


        if(appConfig.showBlueHighlight &&
           appConfig.showDateFilter){

            let x=getDebitInDateRange(a,s,e);
            let y=getDebitInDateRange(b,s,e);

            let xb=x>0;
            let yb=y>0;

            if(xb!==yb)
                return yb-xb;

            if(xb)
                return x-y;
        }


        return Math.abs(getBalance(a))-
               Math.abs(getBalance(b));
    });


    f.forEach(u=>{

        let i=users.indexOf(u);

        let red=
            appConfig.showRedHighlight &&
            isRed(u);

        let da=
            getDebitInDateRange(u,s,e);

        let blue=
            appConfig.showBlueHighlight &&
            appConfig.showDateFilter &&
            da>0;


        let card=document.createElement("div");

        card.className=
            "user-card"+
            (red?" redbg":
             blue?" bluebg":"");


        card.onclick=()=>openUser(i);


        card.innerHTML=`
            <div class="row">
                <div>
                    <b>${esc(u.name)}</b><br>
                    <small>${esc(u.mobile||"")}</small>
                </div>

                <div style="font-weight:bold">
                    ₹ ${getBalance(u).toLocaleString()}
                </div>
            </div>

            <button
                class="menu-dot-btn"
                onclick="triggerActionMenu(
                    event,
                    ${i},
                    '${jsq(u.name)}'
                )">
                &#8942;
            </button>
        `;


        list.appendChild(card);
    });
}
