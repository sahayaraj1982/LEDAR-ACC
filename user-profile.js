function openUser(i,fromLeader=false){
    currentUser=i;
    returnToLeaderDetail=!!fromLeader;

    document.getElementById("mainScreen")
        .classList.add("hidden");

    document.getElementById("leaderScreen")
        .classList.add("hidden");

    document.getElementById("leaderDetailScreen")
        .classList.add("hidden");

    document.getElementById("userScreen")
        .classList.remove("hidden");

    renderTransactions();
}

function goBack(){
    document.getElementById("userScreen")
        .classList.add("hidden");

    if(returnToLeaderDetail){
        returnToLeaderDetail=false;

        document.getElementById("leaderDetailScreen")
            .classList.remove("hidden");

        renderLeaderDetail();
    }
    else{
        document.getElementById("mainScreen")
            .classList.remove("hidden");

        renderUsers();
    }
}

function openEntryForm(){
    document.getElementById("tDate").value=localDate();
    document.getElementById("tDesc").value="";
    document.getElementById("tCredit").value="";
    document.getElementById("tDebit").value="";

    editIndex=null;

    document.getElementById("entryPopup")
        .style.display="flex";
}

function closeEntryForm(){
    document.getElementById("entryPopup")
        .style.display="none";

    editIndex=null;
}

async function saveTransaction(){

    let d=document.getElementById("tDate").value;

    if(!d)
        return alert("Date is required!");

    let tx={
        date:d,
        desc:document.getElementById("tDesc").value,
        credit:document.getElementById("tCredit").value,
        debit:document.getElementById("tDebit").value
    };

    if(editIndex===null)
        users[currentUser].transactions.push(tx);
    else
        users[currentUser].transactions[editIndex]=tx;

    closeEntryForm();

    renderTransactions();

    await saveToCloudOnly();

    if(returnToLeaderDetail)
        renderLeaderDetail();
}

function renderTransactions(){

    let u=users[currentUser];

    u.transactions=u.transactions||[];

    u.transactions.sort(
        (a,b)=>new Date(a.date)-new Date(b.date)
    );

    document.getElementById("profName").innerText=
        u.name;

    document.getElementById("profMobile").innerText=
        u.mobile||"No Mobile";

    document.getElementById("profLeader").innerText=
        "👑 "+getLeaderName(u);

    document.getElementById("profBalance").innerText=
        "Bal: ₹"+getBalance(u).toLocaleString();

    let body=
        document.getElementById("transactionTable");

    body.innerHTML="";

    let bal=0;
    let arr=[];

    u.transactions.forEach((t,i)=>{

        let note=
            !String(t.credit??"").trim() &&
            !String(t.debit??"").trim();

        if(!note)
            bal+=Number(t.credit||0)-
                 Number(t.debit||0);

        arr.push({
            ...t,
            cumulative:note?"":bal,
            actualIdx:i
        });
    });

    arr.reverse().forEach(t=>{

        let r=document.createElement("tr");

        r.className=
            String(t.credit??"").trim()
            ?"credit-row"
            :String(t.debit??"").trim()
            ?"debit-row"
            :"pending-row";

        r.innerHTML=`
            <td>${formatDate(t.date)}</td>
            <td>${esc(t.desc||"")}</td>
            <td>${t.credit||""}</td>
            <td>${t.debit||""}</td>
            <td>
                <b>
                    ${
                        t.cumulative!=="" 
                        ? "₹ "+Number(t.cumulative).toLocaleString()
                        : ""
                    }
                </b>
            </td>
        `;

        setupLongPress(
            r,
            ()=>openTxActionPopup(t.actualIdx)
        );

        body.appendChild(r);
    });
}

function setupLongPress(el,cb){

    let tm;

    const st=()=>{
        tm=setTimeout(cb,800);
    };

    const cl=()=>{
        clearTimeout(tm);
    };

    el.addEventListener("mousedown",st);

    el.addEventListener(
        "touchstart",
        st,
        {passive:true}
    );

    [
        "click",
        "mouseout",
        "touchend",
        "touchcancel"
    ].forEach(x=>{
        el.addEventListener(x,cl);
    });
}
