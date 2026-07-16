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

    if (data.adminWa) {

        waBtn.href = `https://wa.me/${data.adminWa}`;
        waBtn.classList.remove("hidden");

    }

    // ===========================
    // INFORMASI REKENING
    // ===========================

    document.getElementById("bank").textContent =
        data.bank || "-";

    document.getElementById("rekening").textContent =
        data.rekening || "-";

    document.getElementById("atasNama").textContent =
        data.atasNama || "-";

    const btnCopy = document.getElementById("copyRekening");

    if (btnCopy) {

        btnCopy.onclick = () => {

            if (!data.rekening) return;

            navigator.clipboard.writeText(data.rekening.toString());

            btnCopy.innerHTML = "✅ Tersalin";

            setTimeout(() => {

                btnCopy.innerHTML = "📋 Salin";

            }, 2000);

        };

    }

    // ===========================
    // LAYANAN KELAS
    // ===========================

    const layanan = document.getElementById("layanan");

    if (layanan) {

        layanan.innerHTML = "";

        if (data.layanan && data.layanan.length > 0) {

            data.layanan.forEach(item => {

                layanan.innerHTML += `
                    <a
                        href="${item.url}"
                        target="_blank"
                        class="flex justify-between items-center p-4 rounded-xl border hover:bg-blue-50 transition mb-3">

                        <div>

                            <div class="font-semibold">
                                🔗 ${item.title}
                            </div>

                            <div class="text-sm text-gray-500">
                                Klik untuk membuka
                            </div>

                        </div>

                        <div class="text-blue-600 text-xl">
                            →
                        </div>

                    </a>
                `;

            });

        } else {

            layanan.innerHTML = `
                <div class="text-gray-400">
                    Belum ada layanan tersedia.
                </div>
            `;

        }

    }

    // ===========================
    // RINGKASAN
    // ===========================

    document.getElementById("jumlahTransaksi").textContent =
        `${data.jumlahTransaksi} Transaksi`;

    document.getElementById("update").textContent =
        data.lastUpdate || "-";

    // ===========================
    // TRANSAKSI
    // ===========================

    const transaksi = document.getElementById("transaksi");

    transaksi.innerHTML = "";

    if (data.transaksi && data.transaksi.length > 0) {

        // Jumlah transaksi yang ditampilkan di Dashboard
        const MAX_TRANSAKSI = 10;

        // Ambil hanya 10 transaksi terbaru
        const daftarTransaksi = data.transaksi.slice(0, MAX_TRANSAKSI);

        daftarTransaksi.forEach(item => {

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

    // ===========================
    // Tombol Lihat Semua
    // ===========================

        if (data.transaksi.length > MAX_TRANSAKSI) {

        transaksi.innerHTML += `

        <div class="text-center py-6">

            <p class="text-sm text-gray-500 mb-4">
                Menampilkan ${MAX_TRANSAKSI} dari ${data.transaksi.length} transaksi
            </p>

            <a
                href="laporan.html"
                class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition">

                📄 Lihat Seluruh Riwayat

            </a>

        </div>

        `;

        }

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