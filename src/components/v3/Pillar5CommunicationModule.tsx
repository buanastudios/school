import React, { useState } from 'react';
import { useV3App } from '../../context/V3AppContext';
import {
  Send,
  Plus,
  Lock,
} from 'lucide-react';
import type { NoticeBoardItem } from '../../types/v3';

export const Pillar5CommunicationModule: React.FC = () => {
  const {
    notices,
    addNotice,
    directMessages,
    sendDirectMessage,
    terminology,
    activeCampus,
    activeRole,
  } = useV3App();

  const [activeSubTab, setActiveSubTab] = useState<'notices' | 'chat'>('notices');

  // Notice Form State
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [targetAudience, setTargetAudience] = useState<NoticeBoardItem['targetAudience']>('ALL');
  const [noticePriority, setNoticePriority] = useState<NoticeBoardItem['priority']>('NORMAL');
  const [channelInApp, setChannelInApp] = useState(true);
  const [channelEmail, setChannelEmail] = useState(true);
  const [channelSms, setChannelSms] = useState(false);

  // Chat State
  const [selectedThreadId, setSelectedThreadId] = useState<string>('th_syauqi_syamsul');
  const [chatInput, setChatInput] = useState('');

  const currentThreadMessages = directMessages.filter((m) => m.threadId === selectedThreadId);

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;

    const channels: ('IN_APP' | 'EMAIL' | 'SMS_WA')[] = [];
    if (channelInApp) channels.push('IN_APP');
    if (channelEmail) channels.push('EMAIL');
    if (channelSms) channels.push('SMS_WA');

    addNotice({
      campusId: activeCampus.id,
      title: noticeTitle,
      content: noticeContent,
      authorName: 'Humas & Komunikasi Kampus',
      authorRole: 'Sekretariat Pimpinan',
      targetAudience,
      priority: noticePriority,
      channels,
    });

    setNoticeTitle('');
    setNoticeContent('');
    setIsNoticeModalOpen(false);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    sendDirectMessage({
      threadId: selectedThreadId,
      senderId: 'usr_active',
      senderName: activeRole === 'teacher' ? 'Syamsul Bahri, S.Pd.I., Gr.' : 'Wali Murid Terdaftar',
      senderRole: activeRole,
      recipientId: 'usr_target',
      recipientName: activeRole === 'teacher' ? 'Ir. H. Ridwan Kamil, M.T.' : 'Syamsul Bahri, S.Pd.I., Gr.',
      recipientRole: activeRole === 'teacher' ? 'parent' : 'teacher',
      content: chatInput.trim(),
      relatedStudentName: 'Ahmad Syauqi Ramadhan',
    });

    setChatInput('');
  };

  return (
    <div className="space-y-5">
      {/* Module Title Banner */}
      <div className="bg-gradient-to-r from-cyan-700 via-blue-700 to-indigo-900 rounded-2xl p-5 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-white/20 text-white">
              Pillar 5: Communication
            </span>
            <span className="text-xs text-cyan-200">• {activeCampus.name}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
            Communication & Collaboration Engine
          </h2>
          <p className="text-xs text-cyan-100 mt-1 max-w-2xl leading-relaxed">
            Papan pengumuman omni-channel (Web Portal, Notifikasi Email, SMS/WhatsApp Gateway) serta saluran percakapan aman dan termonitor antar dewan {terminology.labelTeacher.toLowerCase()} dan orang tua murid.
          </p>
        </div>

        {/* Sub-Tabs Switcher */}
        <div className="flex items-center gap-1.5 bg-black/20 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('notices')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'notices' ? 'bg-white text-cyan-950 shadow-xs' : 'text-white/80 hover:text-white'
            }`}
          >
            Papan Pengumuman ({notices.length})
          </button>
          <button
            onClick={() => setActiveSubTab('chat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'chat' ? 'bg-white text-cyan-950 shadow-xs' : 'text-white/80 hover:text-white'
            }`}
          >
            Pesan Langsung Termonitor
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SUB-TAB 1: OMNICHANNEL NOTICE BOARD */}
      {/* ======================================================== */}
      {activeSubTab === 'notices' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                Papan Pengumuman Resmi & Notifikasi Multi-Kanal
              </h3>
              <p className="text-xs text-slate-500">
                Setiap maklumat dapat disebarkan simultan ke portal siswa, email terdaftar, dan SMS/WhatsApp gateway sekolah.
              </p>
            </div>
            <button
              onClick={() => setIsNoticeModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Publikasikan Maklumat</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notices.map((n) => (
              <div
                key={n.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      Target: {n.targetAudience}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        n.priority === 'HIGH' || n.priority === 'EMERGENCY'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      Prioritas: {n.priority}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm text-slate-900">{n.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.content}</p>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Oleh: <strong>{n.authorName}</strong></span>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600">
                    <span>Kanal:</span>
                    {n.channels.map((ch) => (
                      <span key={ch} className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-mono">
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 2: MONITORED INTERNAL MESSAGING */}
      {/* ======================================================== */}
      {activeSubTab === 'chat' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
          {/* Thread List Sidebar */}
          <div className="md:col-span-4 border-r border-slate-200 bg-slate-50/60 p-3 space-y-2">
            <div className="px-2 py-1 flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Percakapan Terpantau</span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <Lock className="w-2.5 h-2.5" /> Aman / FERPA
              </span>
            </div>

            <button
              onClick={() => setSelectedThreadId('th_syauqi_syamsul')}
              className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                selectedThreadId === 'th_syauqi_syamsul'
                  ? 'border-blue-600 bg-white shadow-xs font-bold text-blue-900'
                  : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-extrabold truncate">Ir. H. Ridwan Kamil</p>
                <span className="text-[10px] text-slate-400">15:10</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Siswa: Ahmad Syauqi Ramadhan (6-A)</p>
              <p className="text-[10px] text-slate-400 truncate mt-1">"Alhamdulillah kami sangat bersyukur..."</p>
            </button>

            <button
              onClick={() => setSelectedThreadId('th_fatimah_syamsul')}
              className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                selectedThreadId === 'th_fatimah_syamsul'
                  ? 'border-blue-600 bg-white shadow-xs font-bold text-blue-900'
                  : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-extrabold truncate">Drs. H. Mulyadi</p>
                <span className="text-[10px] text-rose-600 font-black">Baru</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Siswa: Siti Fatimah Az-Zahra (6-A)</p>
              <p className="text-[10px] text-slate-400 truncate mt-1">"Pak Syamsul, mohon izin konfirmasi tagihan..."</p>
            </button>
          </div>

          {/* Chat Messages View */}
          <div className="md:col-span-8 flex flex-col justify-between bg-white">
            {/* Chat Header */}
            <div className="p-3.5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">
                  {selectedThreadId === 'th_syauqi_syamsul' ? 'Ir. H. Ridwan Kamil (Wali Syauqi)' : 'Drs. H. Mulyadi (Wali Fatimah)'}
                </h4>
                <p className="text-[11px] text-slate-500">Saluran Konsultasi Edukatif Wali Kelas ↔ Wali Murid Resmi</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-blue-100 text-blue-800">
                Thread: {selectedThreadId}
              </span>
            </div>

            {/* Messages Body */}
            <div className="p-4 space-y-3 overflow-y-auto max-h-[380px]">
              {currentThreadMessages.map((msg) => {
                const isMe = msg.senderRole === activeRole || msg.senderRole === 'teacher';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`p-3 rounded-2xl max-w-md text-xs leading-relaxed ${
                        isMe ? 'bg-blue-600 text-white rounded-br-none shadow-xs' : 'bg-slate-100 text-slate-800 rounded-bl-none'
                      }`}
                    >
                      <p className={`text-[10px] font-bold mb-1 ${isMe ? 'text-blue-100' : 'text-slate-500'}`}>
                        {msg.senderName} ({msg.senderRole})
                      </p>
                      <p>{msg.content}</p>
                    </div>
                    <span className="text-[9px] text-slate-400 mt-0.5 font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Chat Send Input Form */}
            <form onSubmit={handleSendChat} className="p-3 border-t border-slate-200 bg-slate-50 flex items-center gap-2">
              <input
                type="text"
                placeholder="Tulis pesan akademik atau klarifikasi orang tua..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
                title="Kirim pesan"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Notice */}
      {isNoticeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-200 p-5 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900">Publikasikan Pengumuman Omni-Channel Baru</h3>
            <form onSubmit={handlePostNotice} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Judul Maklumat</label>
                <input
                  type="text"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="Contoh: Jadwal Libur Awal Ramadhan 1448H..."
                  className="w-full p-2 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Isi Pesan Pengumuman</label>
                <textarea
                  rows={3}
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  className="w-full p-2 border rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Target Audiens</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as NoticeBoardItem['targetAudience'])}
                    className="w-full p-2 border rounded-xl font-medium"
                  >
                    <option value="ALL">Seluruh Civitas (ALL)</option>
                    <option value="TEACHERS">Dewan Guru Saja</option>
                    <option value="PARENTS">Orang Tua / Wali Saja</option>
                    <option value="STUDENTS">Siswa Saja</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Prioritas</label>
                  <select
                    value={noticePriority}
                    onChange={(e) => setNoticePriority(e.target.value as NoticeBoardItem['priority'])}
                    className="w-full p-2 border rounded-xl font-medium"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">Tinggi (Penting)</option>
                    <option value="EMERGENCY">Darurat (Emergency)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="block font-semibold">Saluran Distribusi Simultan:</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={channelInApp} onChange={(e) => setChannelInApp(e.target.checked)} />
                    <span>In-App Web</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={channelEmail} onChange={(e) => setChannelEmail(e.target.checked)} />
                    <span>Email Blast</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={channelSms} onChange={(e) => setChannelSms(e.target.checked)} />
                    <span>SMS / WhatsApp</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNoticeModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border text-slate-600 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-blue-600 text-white font-bold"
                >
                  Siarkan Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
