import React, { useState } from 'react';
import { useV3App } from '../../context/V3AppContext';
import type { InvoiceRecord } from '../../types/v3';
import {
  Receipt,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const Pillar4FinanceModule: React.FC = () => {
  const {
    feeStructures,
    invoices,
    processInvoicePayment,
    expenses,
    payroll,
    disbursePayroll,
    activeCampus,
    terminology,
  } = useV3App();

  const [activeSubTab, setActiveSubTab] = useState<'invoices' | 'fees' | 'expenses' | 'payroll'>('invoices');
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);
  const [selectedGateway, setSelectedGateway] = useState<InvoiceRecord['paymentGatewayUsed']>('MIDTRANS_VA');
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  const totalInvoiced = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalPaid = invoices.filter((i) => i.paymentStatus === 'PAID').reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalOverdue = invoices.filter((i) => i.paymentStatus === 'OVERDUE').reduce((acc, inv) => acc + inv.totalAmount, 0);

  const handlePay = (invoiceId: string) => {
    processInvoicePayment(invoiceId, selectedGateway);
    setPaymentSuccessMsg(`Pembayaran tagihan senilai IDR ${selectedInvoice?.totalAmount.toLocaleString('id-ID')} berhasil diproses via [${selectedGateway}]!`);
    setSelectedInvoice(null);
    setTimeout(() => setPaymentSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-5">
      {/* Module Title Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-slate-900 rounded-2xl p-5 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-white/20 text-white">
              Pillar 4: Finance & Operations
            </span>
            <span className="text-xs text-amber-200">• {activeCampus.name}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
            Finance & Operational Accounting Engine
          </h2>
          <p className="text-xs text-amber-100 mt-1 max-w-2xl leading-relaxed">
            Struktur tarif biaya fleksibel, penerbitan faktur tagihan otomatis dengan kalkulasi denda keterlambatan, payment gateway multi-mata uang terintegrasi (Stripe, Midtrans VA, PayPal), serta pembukuan beban operasional & payroll dewan guru.
          </p>
        </div>

        {/* Sub-Tabs Switcher */}
        <div className="flex items-center gap-1.5 bg-black/20 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('invoices')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'invoices' ? 'bg-white text-amber-950 shadow-xs' : 'text-white/80 hover:text-white'
            }`}
          >
            Faktur & Gateway ({invoices.length})
          </button>
          <button
            onClick={() => setActiveSubTab('fees')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'fees' ? 'bg-white text-amber-950 shadow-xs' : 'text-white/80 hover:text-white'
            }`}
          >
            Struktur Tarif Biaya
          </button>
          <button
            onClick={() => setActiveSubTab('payroll')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'payroll' ? 'bg-white text-amber-950 shadow-xs' : 'text-white/80 hover:text-white'
            }`}
          >
            Penggajian / Payroll ({payroll.length})
          </button>
          <button
            onClick={() => setActiveSubTab('expenses')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'expenses' ? 'bg-white text-amber-950 shadow-xs' : 'text-white/80 hover:text-white'
            }`}
          >
            Pengeluaran Operasional
          </button>
        </div>
      </div>

      {/* Financial Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Total Tagihan Diterbitkan</span>
            <Receipt className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-black text-slate-900">IDR {totalInvoiced.toLocaleString('id-ID')}</p>
          <span className="text-[10px] text-blue-600 font-semibold">{invoices.length} Faktur Aktif</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Kas Masuk Terkonfirmasi (Paid)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-black text-emerald-700">IDR {totalPaid.toLocaleString('id-ID')}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Terselesaikan via Gateway</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Tertunggak (Overdue Penalty)</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-xl font-black text-rose-700">IDR {totalOverdue.toLocaleString('id-ID')}</p>
          <span className="text-[10px] text-rose-600 font-semibold">Otomatis Termasuk Denda 5%</span>
        </div>
      </div>

      {paymentSuccessMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{paymentSuccessMsg}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 1: INVOICES & PAYMENT GATEWAY INTEGRATION */}
      {/* ======================================================== */}
      {activeSubTab === 'invoices' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                Daftar Tagihan {terminology.labelStudent} & Pembayaran Online
              </h3>
              <p className="text-xs text-slate-500">
                Pilih tagihan untuk simulasi checkout pembayaran online via Stripe, Midtrans Virtual Account, atau PayPal.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Nomor Faktur</th>
                  <th className="py-2.5 px-3">{terminology.labelStudent} / Wali</th>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3">Jatuh Tempo</th>
                  <th className="py-2.5 px-3 text-right">Pokok</th>
                  <th className="py-2.5 px-3 text-right">Denda Keterlambatan</th>
                  <th className="py-2.5 px-3 text-right">Total Tagihan</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-center">Aksi Gateway</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-amber-50/20 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900">{inv.studentName}</p>
                      <p className="text-[10px] text-slate-500">Wali: {inv.guardianName}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {inv.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">{inv.dueDate}</td>
                    <td className="py-3 px-3 text-right font-mono">IDR {inv.baseAmount.toLocaleString('id-ID')}</td>
                    <td className="py-3 px-3 text-right font-mono text-rose-600 font-semibold">
                      {inv.lateFeePenalty > 0 ? `+IDR ${inv.lateFeePenalty.toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-black text-slate-900">
                      IDR {inv.totalAmount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                          inv.paymentStatus === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : inv.paymentStatus === 'OVERDUE'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {inv.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {inv.paymentStatus === 'PAID' ? (
                        <span className="text-[11px] text-emerald-700 font-semibold flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Lunas via {inv.paymentGatewayUsed}
                        </span>
                      ) : (
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors shadow-2xs"
                        >
                          Bayar Online
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 2: DYNAMIC FEE STRUCTURE */}
      {/* ======================================================== */}
      {activeSubTab === 'fees' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              Konfigurasi Komponen Biaya & Periode Pembayaran
            </h3>
            <p className="text-xs text-slate-500">
              Pengaturan skema SPP bulanan, uang gedung per semester, atau iuran laboratorium dengan tanggal jatuh tempo terpadu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {feeStructures.map((fee) => (
              <div
                key={fee.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    {fee.category}
                  </span>
                  <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border">
                    {fee.paymentPlan}
                  </span>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">{fee.name}</h4>
                  <p className="text-lg font-black text-emerald-700 mt-1">IDR {fee.amount.toLocaleString('id-ID')}</p>
                </div>
                <div className="text-[11px] text-slate-500 border-t border-slate-200 pt-2 space-y-1">
                  <p>Jatuh Tempo: Setiap Tanggal <strong>{fee.dueDayOfMonth}</strong></p>
                  <p>Berlaku untuk Kelas: <strong>Tingkat {fee.applicableGrades.join(', ')}</strong></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 3: PAYROLL & SALARY DISBURSEMENT */}
      {/* ======================================================== */}
      {activeSubTab === 'payroll' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                Penggajian Dewan {terminology.labelTeacher} & Tenaga Kependidikan
              </h3>
              <p className="text-xs text-slate-500">
                Perhitungan gaji pokok, insentif jam mengajar, dan pencairan langsung berbasis kehadiran presensi.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">
              Periode: Oktober 2026
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Nama Staf / {terminology.labelTeacher}</th>
                  <th className="py-2.5 px-3">Kontrak</th>
                  <th className="py-2.5 px-3 text-right">Gaji Pokok</th>
                  <th className="py-2.5 px-3 text-right">Insentif Jam Mengajar</th>
                  <th className="py-2.5 px-3 text-right">Gaji Bersih (Take Home)</th>
                  <th className="py-2.5 px-3 text-center">Status Pencairan</th>
                  <th className="py-2.5 px-3 text-center">Aksi Keuangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payroll.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{pay.staffName}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {pay.contractType}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono">IDR {pay.baseSalary.toLocaleString('id-ID')}</td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-600 font-semibold">
                      +IDR {pay.teachingHourIncentive.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-black text-slate-900">
                      IDR {pay.netSalary.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                          pay.status === 'DISBURSED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {pay.status === 'DISBURSED' ? 'Tercairkan' : 'Menunggu Approval'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {pay.status === 'DISBURSED' ? (
                        <span className="text-[10px] text-slate-400 font-mono">Tercairkan {pay.paymentDate}</span>
                      ) : (
                        <button
                          onClick={() => disbursePayroll(pay.id)}
                          className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                        >
                          Cairkan Gaji
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 4: OPERATIONAL EXPENSES */}
      {/* ======================================================== */}
      {activeSubTab === 'expenses' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              Buku Pengeluaran Operasional & Pembayaran Vendor
            </h3>
            <p className="text-xs text-slate-500">
              Pencatatan realisasi belanja utilitas, pengadaan laboratorium, dan perawatan sarana prasarana sekolah.
            </p>
          </div>

          <div className="space-y-3">
            {expenses.map((exp) => (
              <div
                key={exp.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                      {exp.category}
                    </span>
                    <strong className="text-slate-900">{exp.vendorName}</strong>
                    <span className="text-slate-400 font-mono text-[11px]">• {exp.date}</span>
                  </div>
                  <p className="text-slate-600 mt-1">{exp.description}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Disetujui: {exp.approvedBy} via {exp.paymentMethod}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-base font-black text-slate-900">
                    IDR {exp.amount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Gateway Checkout Modal Simulation */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden space-y-4 p-5">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Checkout Payment Gateway</h3>
                <p className="text-[11px] text-slate-500">No. Tagihan: {selectedInvoice.invoiceNumber}</p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border space-y-1 text-xs">
              <p className="text-slate-500">Nama Siswa: <strong className="text-slate-900">{selectedInvoice.studentName}</strong></p>
              <p className="text-slate-500">Keterangan: <strong className="text-slate-900">{selectedInvoice.description}</strong></p>
              <div className="pt-2 border-t mt-2 flex justify-between items-center text-sm font-black">
                <span>Total Bayar:</span>
                <span className="text-emerald-700 font-mono">IDR {selectedInvoice.totalAmount.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Gateway Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Pilih Saluran Pembayaran White-Label:</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'MIDTRANS_VA', name: 'Midtrans Virtual Account', desc: 'BCA, BNI, Mandiri, Permata' },
                  { id: 'STRIPE', name: 'Stripe Global Card', desc: 'Visa, Mastercard, Amex' },
                  { id: 'PAYPAL', name: 'PayPal International', desc: 'Multi-Currency Wallet' },
                  { id: 'BANK_TRANSFER_MANUAL', name: 'Transfer Giro BSI', desc: 'Verifikasi Otomatis' },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGateway(g.id as InvoiceRecord['paymentGatewayUsed'])}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedGateway === g.id
                        ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <p className="text-[11px] font-extrabold">{g.name}</p>
                    <p className="text-[9px] text-slate-500 mt-0.5">{g.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="px-3 py-2 rounded-xl text-xs font-bold border text-slate-600"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handlePay(selectedInvoice.id)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
              >
                Konfirmasi & Bayar Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
