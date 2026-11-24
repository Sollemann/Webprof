import {useState} from 'react';
import {CheckCircle2, Lock, ShieldCheck, Unlock} from 'lucide-react';
import {INITIAL_AUDIT_LOGS, INITIAL_SECURITY_SETTINGS} from '../data/initialState';
import {SecuritySetting} from '../types/builder';

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function SecurityView() {
  const [settings, setSettings] = useState<SecuritySetting[]>(INITIAL_SECURITY_SETTINGS);
  const [plainPayload, setPlainPayload] = useState(
    '{"pelanggan":"Budi Santoso","nominal":4250000,"metode":"QRIS"}'
  );
  const [encryptedOutput, setEncryptedOutput] = useState<{
    ciphertext: string;
    iv: string;
    sha256: string;
  } | null>(null);
  const [decryptedText, setDecryptedText] = useState<string | null>(null);
  const [cryptoKeyRef, setCryptoKeyRef] = useState<CryptoKey | null>(null);
  const [auditFilter, setAuditFilter] = useState<'Semua' | 'Terverifikasi' | 'Diblokir'>('Semua');

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((item) => (item.id === id ? {...item, enabled: !item.enabled} : item))
    );
  };

  const handleEncrypt = async () => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plainPayload);
    const key = await window.crypto.subtle.generateKey(
      {name: 'AES-GCM', length: 256},
      true,
      ['encrypt', 'decrypt']
    );
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt(
      {name: 'AES-GCM', iv},
      key,
      data
    );
    const digest = await window.crypto.subtle.digest('SHA-256', data);

    setCryptoKeyRef(key);
    setEncryptedOutput({
      ciphertext: arrayBufferToBase64(encrypted),
      iv: arrayBufferToBase64(iv.buffer),
      sha256: arrayBufferToBase64(digest),
    });
    setDecryptedText(null);
  };

  const handleDecrypt = async () => {
    if (!cryptoKeyRef || !encryptedOutput) return;
    const ivBytes = base64ToUint8Array(encryptedOutput.iv);
    const cipherBytes = base64ToUint8Array(encryptedOutput.ciphertext);
    const decrypted = await window.crypto.subtle.decrypt(
      {name: 'AES-GCM', iv: ivBytes.buffer as ArrayBuffer},
      cryptoKeyRef,
      cipherBytes.buffer as ArrayBuffer
    );
    setDecryptedText(new TextDecoder().decode(decrypted));
  };

  const filteredLogs = INITIAL_AUDIT_LOGS.filter(
    (entry) => auditFilter === 'Semua' || entry.status === auditFilter
  );

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-4rem)] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <p className="text-xs font-medium text-blue-700">
            Arsitektur Keamanan Data Tingkat Tinggi
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 mt-1">
            Enkripsi End-to-End &amp; Perlindungan Infrastruktur
          </h1>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl">
            Setiap formulir kontak, data pelanggan, dan payload transaksi diamankan di sisi
            peramban dengan standar kriptografi AES-256-GCM sebelum melintasi jaringan TLS 1.3.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Interactive Web Crypto E2E Simulator */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-bold text-slate-900">
                  Uji Enkripsi End-to-End (AES-256-GCM)
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Dijalankan langsung menggunakan Web Crypto API di peramban Anda.
                </p>
              </div>
              <Lock className="w-5 h-5 text-blue-700 shrink-0" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Payload Data Pelanggan / Transaksi
              </label>
              <textarea
                rows={3}
                value={plainPayload}
                onChange={(e) => setPlainPayload(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleEncrypt}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                Enkripsi Payload Sekarang
              </button>
              {encryptedOutput && (
                <button
                  type="button"
                  onClick={handleDecrypt}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <Unlock className="w-4 h-4" />
                  Verifikasi Dekripsi
                </button>
              )}
            </div>

            {encryptedOutput && (
              <div className="p-4 rounded-lg bg-slate-900 text-slate-100 space-y-2.5 font-mono text-[11px] break-all">
                <div>
                  <span className="text-slate-400">Ciphertext (AES-256-GCM): </span>
                  <span>{encryptedOutput.ciphertext}</span>
                </div>
                <div>
                  <span className="text-slate-400">Initialization Vector (96-bit): </span>
                  <span>{encryptedOutput.iv}</span>
                </div>
                <div>
                  <span className="text-slate-400">SHA-256 Fingerprint: </span>
                  <span>{encryptedOutput.sha256}</span>
                </div>
              </div>
            )}

            {decryptedText && (
              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  Integritas Terverifikasi (Dekripsi Utuh)
                </div>
                <div className="font-mono text-[11px] break-all">{decryptedText}</div>
              </div>
            )}
          </div>

          {/* Security Controls */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5">
            <h2 className="font-display text-xl font-bold text-slate-900">
              Kebijakan Perlindungan Aktif
            </h2>
            <div className="divide-y divide-slate-200">
              {settings.map((item) => (
                <div key={item.id} className="py-4 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-slate-900">{item.label}</div>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                    <div className="text-[11px] font-mono text-slate-500">
                      Standar: {item.standard}
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={item.enabled}
                    onClick={() => toggleSetting(item.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border shrink-0 transition-colors ${
                      item.enabled
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-slate-100 border-slate-200 text-slate-600'
                    }`}
                  >
                    {item.enabled ? 'Aktif' : 'Nonaktif'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security Audit Log */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">
                Log Audit Keamanan &amp; Sertifikat
              </h2>
              <p className="text-xs text-slate-500">
                Catatan aktivitas rotasi kunci, sertifikat SSL, dan pemblokiran ancaman
              </p>
            </div>
            <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg">
              {(['Semua', 'Terverifikasi', 'Diblokir'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setAuditFilter(status)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                    auditFilter === status
                      ? 'bg-white text-slate-900'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                  <th className="py-3 px-6">Waktu</th>
                  <th className="py-3 px-6">Peristiwa Keamanan</th>
                  <th className="py-3 px-6">Aktor</th>
                  <th className="py-3 px-6">Alamat IP</th>
                  <th className="py-3 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-6 font-mono text-xs text-slate-500 tabular-nums">
                      {entry.timestamp}
                    </td>
                    <td className="py-3.5 px-6 text-slate-900 font-medium">{entry.event}</td>
                    <td className="py-3.5 px-6 text-xs text-slate-600">{entry.actor}</td>
                    <td className="py-3.5 px-6 font-mono text-xs text-slate-500">
                      {entry.ipMasked}
                    </td>
                    <td className="py-3.5 px-6 text-xs font-semibold">
                      <span
                        className={
                          entry.status === 'Terverifikasi' ? 'text-emerald-700' : 'text-red-700'
                        }
                      >
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
