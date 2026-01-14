const copyBtn = document.getElementById("copyBtn");
const num = document.getElementById("num");
const copyBtn1 = document.getElementById("copyBtn1");
const num1 = document.getElementById("num1");
const copyBtn2 = document.getElementById("copyBtn2");
const num2 = document.getElementById("num2");

copyBtn.addEventListener("click", () => {
    let val = num.value;
    navigator.clipboard.writeText(val).then(() => {
        alert("Contact Number Copied to Clipboard");
    })
    console.log(val);
    
})

copyBtn1.addEventListener("click", () => {
    let val = num.value;
    navigator.clipboard.writeText(val).then(() => {
        alert("Contact Number Copied to Clipboard");
    })
    console.log(val);
    
})

copyBtn2.addEventListener("click", () => {
    let val = num.value;
    navigator.clipboard.writeText(val).then(() => {
        alert("Contact Number Copied to Clipboard");
    })
    console.log(val);
    
})
