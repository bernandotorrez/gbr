import React, { useState, useId } from 'react';
import { Calculator, CheckCircle2, PhoneCall, HelpCircle } from 'lucide-react';

interface KprCalculatorProps {
  hargaRumah: number;
  tipeNama: string;
}

export default function KprCalculator({ hargaRumah, tipeNama }: KprCalculatorProps) {
  const [dpPercent, setDpPercent] = useState<number>(0);
  const [tenorTahun, setTenorTahun] = useState<number>(20);
  const [bungaPercent, setBungaPercent] = useState<number>(5.5);

  const dpNominalInputId = useId();
  const tenorInputId = useId();
  const bungaInputId = useId();

  const dpNominal = (hargaRumah * dpPercent) / 100;
  const pokokPinjaman = Math.max(0, hargaRumah - dpNominal);

  // Perhitungan Cicilan KPR Annuitas: P * (r / (1 - (1 + r)^-n))
  const bulan = tenorTahun * 12;
  const bungaBulanan = (bungaPercent / 100) / 12;
  
  const cicilanBulanan = bulan > 0 && bungaBulanan > 0
    ? Math.round((pokokPinjaman * bungaBulanan) / (1 - Math.pow(1 + bungaBulanan, -bulan)))
    : 0;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const waText = encodeURIComponent(
    `Halo Tim Marketing Grand Bedahan Residence, saya ingin konsultasi simulasi KPR untuk ${tipeNama} (Harga: ${formatRupiah(hargaRumah)}, DP: ${dpPercent}%, Tenor: ${tenorTahun} Tahun, Estimasi Cicilan: ${formatRupiah(cicilanBulanan)}/bln). Boleh bantu proses pengajuan KPR & info bank rekanan?`
  );
  const waUrl = `https://wa.me/6281215776218?text=${waText}`;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0E3B2E] border border-emerald-100 flex items-center justify-center shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#17201C] font-serif">Simulasi Cicilan KPR Bank</h2>
            <p className="text-xs sm:text-sm text-[#595959]">Hitung estimasi angsuran bulanan sesuai kemampuan finansial Anda</p>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#0E3B2E] text-xs font-bold self-start sm:self-auto border border-emerald-200/60">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#047857]" />
          <span>Promo DP 0% Tersedia</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Controls Column */}
        <div className="space-y-5">
          {/* Uang Muka (DP) */}
          <div>
            <div className="flex justify-between items-center text-sm font-semibold text-[#17201C] mb-2">
              <label htmlFor={dpNominalInputId} className="cursor-pointer">Uang Muka / DP ({dpPercent}%)</label>
              <span className="text-[#0E3B2E] font-bold">{formatRupiah(dpNominal)}</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[0, 5, 10, 20].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setDpPercent(val)}
                  className={`py-2 text-xs sm:text-sm font-bold rounded-xl border transition-all cursor-pointer ${
                    dpPercent === val
                      ? 'bg-[#0E3B2E] text-white border-[#0E3B2E] shadow-sm'
                      : 'bg-gray-50 text-[#4A5568] border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {val === 0 ? 'DP 0%' : `${val}%`}
                </button>
              ))}
            </div>
            <input
              id={dpNominalInputId}
              type="range"
              min="0"
              max="50"
              step="5"
              value={dpPercent}
              onChange={(e) => setDpPercent(Number(e.target.value))}
              className="w-full mt-3 accent-[#0E3B2E] cursor-pointer"
              aria-label="Persentase Uang Muka"
            />
          </div>

          {/* Jangka Waktu (Tenor) */}
          <div>
            <div className="flex justify-between items-center text-sm font-semibold text-[#17201C] mb-2">
              <label htmlFor={tenorInputId} className="cursor-pointer">Jangka Waktu (Tenor)</label>
              <span className="text-[#0E3B2E] font-bold">{tenorTahun} Tahun ({bulan} Bulan)</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[10, 15, 20, 25].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setTenorTahun(val)}
                  className={`py-2 text-xs sm:text-sm font-bold rounded-xl border transition-all cursor-pointer ${
                    tenorTahun === val
                      ? 'bg-[#0E3B2E] text-white border-[#0E3B2E] shadow-sm'
                      : 'bg-gray-50 text-[#4A5568] border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {val} Thn
                </button>
              ))}
            </div>
            <input
              id={tenorInputId}
              type="range"
              min="5"
              max="30"
              step="5"
              value={tenorTahun}
              onChange={(e) => setTenorTahun(Number(e.target.value))}
              className="w-full mt-3 accent-[#0E3B2E] cursor-pointer"
              aria-label="Jangka Waktu Tenor dalam Tahun"
            />
          </div>

          {/* Suku Bunga Est */}
          <div>
            <div className="flex justify-between items-center text-sm font-semibold text-[#17201C] mb-2">
              <label htmlFor={bungaInputId} className="cursor-pointer">Estimasi Suku Bunga</label>
              <span className="text-[#0E3B2E] font-bold">{bungaPercent}% / tahun (Fixed)</span>
            </div>
            <input
              id={bungaInputId}
              type="range"
              min="3.5"
              max="10.0"
              step="0.25"
              value={bungaPercent}
              onChange={(e) => setBungaPercent(Number(e.target.value))}
              className="w-full accent-[#0E3B2E] cursor-pointer"
              aria-label="Estimasi Suku Bunga per Tahun"
            />
            <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
              <HelpCircle className="w-3 h-3" />
              Suku bunga promo bank rekanan (BSI, BTN, Mandiri, BCA, BRI)
            </p>
          </div>
        </div>

        {/* Result Card Column */}
        <div className="bg-gradient-to-br from-[#07241C] to-[#0E3B2E] text-white rounded-2xl p-6 sm:p-7 shadow-lg flex flex-col justify-between space-y-5">
          <div>
            <p className="text-xs uppercase tracking-wider text-emerald-200/90 font-bold">Estimasi Angsuran Bulanan</p>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#E5C695] mt-1.5 font-sans">
              {formatRupiah(cicilanBulanan)}
              <span className="text-xs sm:text-sm font-normal text-emerald-100/80 block sm:inline sm:ml-1">/ bulan</span>
            </div>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-white/15 text-xs sm:text-sm text-emerald-50/90">
            <div className="flex justify-between">
              <span className="text-emerald-200/70">Harga Properti:</span>
              <span className="font-bold text-white">{formatRupiah(hargaRumah)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-200/70">Uang Muka (DP):</span>
              <span className="font-bold text-white">{formatRupiah(dpNominal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-200/70">Plafon Pinjaman KPR:</span>
              <span className="font-bold text-[#E5C695]">{formatRupiah(pokokPinjaman)}</span>
            </div>
          </div>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(
                  new CustomEvent('gbr:analytics', {
                    detail: {
                      eventType: 'kpr_simulasi',
                      data: {
                        tipe_rumah: tipeNama,
                        harga: hargaRumah,
                        dp_persen: dpPercent,
                        tenor_tahun: tenorTahun,
                        estimasi_cicilan: cicilanBulanan
                      }
                    }
                  })
                );
              }
            }}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm sm:text-base text-[#07241C] bg-[#E5C695] hover:bg-[#edd8b6] transition-all shadow-md hover:shadow-lg mt-2 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-[#07241C]" />
            <span>Ajukan KPR &amp; Konsultasi</span>
          </a>
        </div>
      </div>
    </div>
  );
}
