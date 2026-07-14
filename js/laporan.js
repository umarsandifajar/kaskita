console.log("laporan.js berhasil dimuat");
const API = "https://script.google.com/macros/s/AKfycbwxFyfYQXmeM1_bOWGZkHKqwLLUv57qZdGEpetG85MzdI9C43rN_vwpm_POxqQH5YiOHQ/exec";

const rupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);
};

// ===============================
// Tanggal Cetak
// ===============================

document.getElementById("tanggalCetak").textContent =
    new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

// ===============================
// Load Data
// ===============================

fetch(API)
.then(res => res.json())
.then(data => {

    console.log("DATA API:", data);
    
    // ===============================
    // Ringkasan
    // ===============================

    document.getElementById("totalMasuk").textContent =
        rupiah(data.totalMasuk);

    document.getElementById("totalKeluar").textContent =
        rupiah(data.totalKeluar);

    document.getElementById("saldo").textContent =
        rupiah(data.saldo);

    // ===============================
    // Detail Pemasukan
    // ===============================

    const tbodyPemasukan = document.getElementById("tbodyPemasukan");

    tbodyPemasukan.innerHTML = "";

    if (data.pemasukan && data.pemasukan.length > 0) {

        data.pemasukan.forEach((item, index) => {

            tbodyPemasukan.innerHTML += `
                <tr>

                    <td class="border p-2 text-center">
                        ${index + 1}
                    </td>

                    <td class="border p-2">
                        ${item.tanggal}
                    </td>

                    <td class="border p-2">
                        ${item.nama}
                    </td>

                    <td class="border p-2">
                        ${item.keterangan || "-"}
                    </td>

                    <td class="border p-2 text-right">
                        ${rupiah(item.nominal)}
                    </td>

                </tr>
            `;

        });

    } else {

        tbodyPemasukan.innerHTML = `
            <tr>

                <td colspan="5"
                    class="border p-4 text-center text-gray-500">

                    Tidak ada data pemasukan.

                </td>

            </tr>
        `;

    }

    // ===============================
    // Detail Pengeluaran
    // ===============================

    const tbodyPengeluaran =
        document.getElementById("tbodyPengeluaran");

    tbodyPengeluaran.innerHTML = "";

    if (data.pengeluaran && data.pengeluaran.length > 0) {

        data.pengeluaran.forEach((item, index) => {

            tbodyPengeluaran.innerHTML += `
                <tr>

                    <td class="border p-2 text-center">
                        ${index + 1}
                    </td>

                    <td class="border p-2">
                        ${item.tanggal}
                    </td>

                    <td class="border p-2">
                        ${item.keperluan}
                    </td>

                    <td class="border p-2 text-right">
                        ${rupiah(item.nominal)}
                    </td>

                </tr>
            `;

        });

    } else {

        tbodyPengeluaran.innerHTML = `
            <tr>

                <td colspan="4"
                    class="border p-4 text-center text-gray-500">

                    Tidak ada data pengeluaran.

                </td>

            </tr>
        `;

    }

})
.catch(err => {

    console.error(err);

    alert("Gagal mengambil data laporan.");

});