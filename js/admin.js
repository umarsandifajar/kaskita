const API = "https://script.google.com/macros/s/AKfycbwxFyfYQXmeM1_bOWGZkHKqwLLUv57qZdGEpetG85MzdI9C43rN_vwpm_POxqQH5YiOHQ/exec";

let ADMIN_PIN = "";

function rupiah(angka){
    return new Intl.NumberFormat("id-ID",{
        style:"currency",
        currency:"IDR",
        maximumFractionDigits:0
    }).format(angka);
}

// ======================
// LOGIN
// ======================

document.getElementById("btnLogin").addEventListener("click",login);

async function login(){

    const pin=document.getElementById("pin").value;

    if(pin==""){
        alert("Masukkan PIN.");
        return;
    }

    const res=await fetch(API,{
        method:"POST",
        body:JSON.stringify({
            action:"login",
            pin:pin
        })
    });

    const data=await res.json();

    if(data.success){

        ADMIN_PIN=pin;

        document.getElementById("loginBox").classList.add("hidden");
        document.getElementById("dashboard").classList.remove("hidden");

        loadDashboard();

    }else{

        document.getElementById("loginMessage").classList.remove("hidden");
        document.getElementById("loginMessage").innerHTML="PIN salah.";

    }

}

// ======================
// LOAD DASHBOARD
// ======================

async function loadDashboard(){

    const res=await fetch(API);

    const data=await res.json();

    document.getElementById("saldo").innerHTML=rupiah(data.saldo);

}

// ======================
// TAMBAH PEMASUKAN
// ======================

document.getElementById("btnMasuk").addEventListener("click",async()=>{

    const nama=document.getElementById("nama").value;
    const nominal=document.getElementById("nominalMasuk").value;
    const keterangan=document.getElementById("ketMasuk").value;

    if(nama==""||nominal==""){

        alert("Data belum lengkap.");

        return;

    }

    const tanggal=new Date().toISOString().substring(0,10);

    const res=await fetch(API,{

        method:"POST",

        body:JSON.stringify({

            action:"tambahMasuk",

            pin:ADMIN_PIN,

            tanggal:tanggal,

            nama:nama,

            nominal:nominal,

            keterangan:keterangan

        })

    });

    const data=await res.json();

    if(data.success){

        alert("Pemasukan berhasil disimpan.");

        document.getElementById("nama").value="";
        document.getElementById("nominalMasuk").value="";
        document.getElementById("ketMasuk").value="";

        loadDashboard();

    }else{

        alert(data.message);

    }

});

// ======================
// TAMBAH PENGELUARAN
// ======================

document.getElementById("btnKeluar").addEventListener("click",async()=>{

    const keperluan=document.getElementById("keperluan").value;
    const nominal=document.getElementById("nominalKeluar").value;

    if(keperluan==""||nominal==""){

        alert("Data belum lengkap.");

        return;

    }

    const tanggal=new Date().toISOString().substring(0,10);

    const res=await fetch(API,{

        method:"POST",

        body:JSON.stringify({

            action:"tambahKeluar",

            pin:ADMIN_PIN,

            tanggal:tanggal,

            nominal:nominal,

            keperluan:keperluan

        })

    });

    const data=await res.json();

    if(data.success){

        alert("Pengeluaran berhasil disimpan.");

        document.getElementById("keperluan").value="";
        document.getElementById("nominalKeluar").value="";

        loadDashboard();

    }else{

        alert(data.message);

    }

});