function openTxActionPopup(i){
    document.getElementById("txActionPopup")
        .style.display="flex";

    document.getElementById("txEditBtn").onclick=()=>{
        closeTxActionPopup();
        editTransaction(i);
    };

    document.getElementById("txDeleteBtn").onclick=()=>{
        closeTxActionPopup();
        deleteTransaction(i);
    };
}

function closeTxActionPopup(){
    document.getElementById("txActionPopup")
        .style.display="none";
}

function editTransaction(i){

    let t=users[currentUser].transactions[i];

    document.getElementById("tDate").value=
        String(t.date).split("T")[0];

    document.getElementById("tDesc").value=
        t.desc||"";

    document.getElementById("tCredit").value=
        t.credit||"";

    document.getElementById("tDebit").value=
        t.debit||"";

    editIndex=i;

    document.getElementById("entryPopup")
        .style.display="flex";
}

async function deleteTransaction(i){

    if(confirm("இந்த எண்ட்ரியை நீக்கவா?")){

        users[currentUser].transactions
            .splice(i,1);

        renderTransactions();

        await saveToCloudOnly();

        if(returnToLeaderDetail)
            renderLeaderDetail();
    }
}
