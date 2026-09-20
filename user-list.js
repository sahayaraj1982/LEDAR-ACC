function esc(x){
    return String(x??"").replace(
        /[&<>"']/g,
        m=>({
            "&":"&amp;",
            "<":"&lt;",
            ">":"&gt;",
            '"':"&quot;",
            "'":"&#39;"
        }[m])
    );
}

function jsq(x){
    return String(x??"")
        .replace(/\\/g,"\\\\")
        .replace(/'/g,"\\'");
}

function triggerActionMenu(e,i,n){
    e.stopPropagation();
    openActionPopup(n,i);
}

function openActionPopup(n,i){
    document.getElementById("popupTitle").innerText=n;

    document.getElementById("actionPopup")
        .style.display="flex";

    document.getElementById("editBtn").onclick=
        ()=>editUser(i);

    document.getElementById("deleteBtn").onclick=
        ()=>deleteUser(i);
}

function closeActionPopup(){
    document.getElementById("actionPopup")
        .style.display="none";
}
