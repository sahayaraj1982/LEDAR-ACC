function getBalance(u){
    return (u.transactions||[]).reduce(
        (a,t)=>a+Number(t.credit||0)-Number(t.debit||0),
        0
    );
}

function isRed(u){
    if(!u.transactions?.length) return false;

    let td=localDate();

    return u.transactions.some(t=>{
        let d=String(t.date||"").split("T")[0];
        let c=String(t.credit??"").trim();
        let db=String(t.debit??"").trim();

        return d && d<=td && !c && !db;
    });
}

function getTenPercent(u){
    if(!isRed(u)) return 0;

    return (u.transactions||[]).reduce(
        (s,t)=>s+Math.max(0,Number(t.debit||0))*0.10,
        0
    );
}

function getLeaderTenPercent(u){
    return (u.transactions||[]).reduce(
        (s,t)=>s+Math.max(0,Number(t.debit||0))*0.10,
        0
    );
}

function getDebitInDateRange(u,s,e){
    return (u.transactions||[]).reduce((sum,t)=>{
        let d=String(t.date||"").split("T")[0];
        let v=Number(t.debit||0);

        return d>=s && d<=e && v>0
            ? sum+v
            : sum;
    },0);
}

function getCreditInDateRange(u,s,e){
    return (u.transactions||[]).reduce((sum,t)=>{
        let d=String(t.date||"").split("T")[0];
        let v=Number(t.credit||0);

        return d>=s && d<=e && v>0
            ? sum+v
            : sum;
    },0);
}

function localDate(){
    let d=new Date();
    let o=d.getTimezoneOffset();

    return new Date(
        d.getTime()-o*60000
    ).toISOString().split("T")[0];
}

function formatDate(d){
    if(!d) return "";

    let x=new Date(d);

    if(isNaN(x))
        return String(d);

    return `${x.getDate()}-${x.getMonth()+1}-${String(x.getFullYear()).slice(2)}`;
}
