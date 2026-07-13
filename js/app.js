const API = "https://script.google.com/macros/s/AKfycbwxFyfYQXmeM1_bOWGZkHKqwLLUv57qZdGEpetG85MzdI9C43rN_vwpm_POxqQH5YiOHQ/exec";

const rupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);
};

fetch(API)
    .then(res => res.json())
    .then(data => {

        console.log(data);

        // ===========================
        // CARD SALDO
        // ===========================

        document.getElementById("saldo").textContent = rupiah(data.saldo);
        document.getElementById("masuk").textContent = rupiah(data.totalMasuk);
        document.getElementById("keluar").textContent = rupiah(data.totalKeluar);

        // ===========================
        // INFORMASI
        // ===========================

        document.getElementById("message").textContent =
            data.message || "Tidak ada informasi.";

        // ===========================
        // WHATSAPP BENDAHARA
        // ===========================

        const waBtn = document.getElementById("waBtn");

        if (waBtn && data.adminWa) {
            waBtn.href = `https://wa.me/${data.adminWa}`;
            waBtn.classList.remove("hidden");
        }

        // ===========================
        // RINGKASAN
        // ===========================

        document.getElementById("jumlahTransaksi").textContent =
            `${data.jumlahTransaksi || 0} Transaksi`;

        document.getElementById("update").textContent =
            data.lastUpdate || "-";

        // ===========================
        // TRANSAKSI
        // ===========================

        const transaksi = document.getElementById("transaksi");
        transaksi.innerHTML = "";

        if (data.transaksi && data.transaksi.length > 0) {

            data.transaksi.forEach(item => {

                transaksi.innerHTML += `
                    <div class="flex justify-between items-start py-4 border-b last:border-b-0">

                        <div>

                            <div class="font-semibold">
                                ${item.jenis === "masuk" ? "🟢" : "🔴"} ${item.nama}
                            </div>

                            <div class="text-sm text-gray-500">
                                ${item.keterangan || "-"}
                            </div>

                            <div class="text-xs text-gray-400 mt-1">
                                ${item.tanggal}
                            </div>

                        </div>

                        <div class="${item.jenis === "masuk" ? "text-green-600" : "text-red-600"} font-bold whitespace-nowrap">

                            ${item.jenis === "masuk" ? "+" : "-"}

                            ${rupiah(item.nominal)}

                        </div>

                    </div>
                `;

            });

        } else {

            transaksi.innerHTML = `
                <div class="text-center text-gray-400 py-8">
                    Belum ada transaksi.
                </div>
            `;

        }

    })
    .catch(err => {

        console.error(err);

        document.getElementById("transaksi").innerHTML = `
            <div class="text-center text-red-500 py-8">
                Gagal memuat data.
            </div>
        `;

    });