import { useState } from 'react';
import { Folder, FolderOpen, File, FileCode, FileJson, FileText, Image, ChevronRight, ChevronDown, Check, Copy, ExternalLink, Download, Monitor, Smartphone, Code2, Database, Package, Zap, Terminal, Lightbulb, AlertCircle } from 'lucide-react';

interface TreeNode {
  name: string;
  type: 'file' | 'folder';
  description?: string;
  laravelEquivalent?: string;
  content?: string;
  children?: TreeNode[];
  icon?: string;
}

const projectStructure: TreeNode = {
  name: 'rms-frontend',
  type: 'folder',
  description: 'Root project (seperti folder Laravel project Anda)',
  children: [
    {
      name: 'node_modules/',
      type: 'folder',
      description: '🚫 Jangan di-copy! Berisi semua package yang di-install',
      laravelEquivalent: 'Mirip vendor/ di Laravel',
    },
    {
      name: 'public/',
      type: 'folder',
      description: 'File statis yang bisa diakses langsung (favicon, gambar)',
      laravelEquivalent: 'Sama dengan public/ di Laravel',
    },
    {
      name: 'src/',
      type: 'folder',
      description: '⭐ FOLDER UTAMA - Semua kode aplikasi ada di sini',
      laravelEquivalent: 'Mirip resources/ + app/ di Laravel',
      children: [
        {
          name: 'components/',
          type: 'folder',
          description: 'Komponen UI yang bisa dipakai ulang (reusable)',
          laravelEquivalent: 'Mirip resources/views/components/ di Laravel',
          children: [
            {
              name: 'Layout.tsx',
              type: 'file',
              description: 'Template utama: sidebar, header, navigasi',
              laravelEquivalent: 'Mirip layouts/app.blade.php',
              icon: '📐',
            },
          ],
        },
        {
          name: 'pages/',
          type: 'folder',
          description: 'Halaman-halaman aplikasi (satu file = satu halaman)',
          laravelEquivalent: 'Mirip resources/views/ atau app/Http/Controllers',
          children: [
            { name: 'Dashboard.tsx', type: 'file', description: 'Halaman dashboard utama', icon: '📊' },
            { name: 'POS.tsx', type: 'file', description: 'Point of Sale - kasir', icon: '💳' },
            { name: 'Tables.tsx', type: 'file', description: 'Manajemen meja restoran', icon: '🪑' },
            { name: 'Reservations.tsx', type: 'file', description: 'Reservasi pelanggan', icon: '📅' },
            { name: 'Kitchen.tsx', type: 'file', description: 'Kitchen Display System', icon: '🍳' },
            { name: 'Menu.tsx', type: 'file', description: 'Master menu & resep', icon: '📋' },
            { name: 'Inventory.tsx', type: 'file', description: 'Stok bahan baku', icon: '📦' },
            { name: 'Purchasing.tsx', type: 'file', description: 'Pembelian & supplier', icon: '🚚' },
            { name: 'Reports.tsx', type: 'file', description: 'Laporan & grafik', icon: '📈' },
            { name: 'Employees.tsx', type: 'file', description: 'Data karyawan & shift', icon: '👥' },
            { name: 'Settings.tsx', type: 'file', description: 'Pengaturan aplikasi', icon: '⚙️' },
          ],
        },
        {
          name: 'App.tsx',
          type: 'file',
          description: 'File utama - router/navigasi antar halaman',
          laravelEquivalent: 'Mirip routes/web.php + layouts',
          icon: '🎯',
        },
        {
          name: 'main.tsx',
          type: 'file',
          description: 'Entry point - pertama kali dijalankan browser',
          laravelEquivalent: 'Mirip public/index.php',
          icon: '🚀',
        },
        {
          name: 'store.tsx',
          type: 'file',
          description: 'State management & data (mock data)',
          laravelEquivalent: 'Mirip Models + Controllers + Database',
          icon: '💾',
        },
        {
          name: 'index.css',
          type: 'file',
          description: 'Global CSS + konfigurasi Tailwind',
          laravelEquivalent: 'Mirapp resources/css/app.css',
          icon: '🎨',
        },
      ],
    },
    {
      name: 'index.html',
      type: 'file',
      description: 'HTML utama - container untuk React app',
      laravelEquivalent: 'Mirip resources/views/welcome.blade.php',
      icon: '🌐',
    },
    {
      name: 'package.json',
      type: 'file',
      description: 'Daftar dependencies & scripts (npm install)',
      laravelEquivalent: 'Mirip composer.json',
      icon: '📦',
    },
    {
      name: 'package-lock.json',
      type: 'file',
      description: 'Lock file versi package (auto-generated)',
      laravelEquivalent: 'Mirip composer.lock',
      icon: '🔒',
    },
    {
      name: 'tsconfig.json',
      type: 'file',
      description: 'Konfigurasi TypeScript',
      laravelEquivalent: 'Tidak ada padanan langsung',
      icon: '🔧',
    },
    {
      name: 'vite.config.js',
      type: 'file',
      description: 'Konfigurasi Vite (build tool)',
      laravelEquivalent: 'Mirip webpack.mix.js / vite.config.js di Laravel',
      icon: '⚡',
    },
  ],
};

const ideExtensions = [
  { name: 'ES7+ React/Redux/React-Native snippets', desc: 'Snippets untuk React (ketik rfc → auto-generate komponen)', required: true },
  { name: 'Tailwind CSS IntelliSense', desc: 'Auto-complete class Tailwind', required: true },
  { name: 'TypeScript Vue Plugin (Volar)', desc: 'Support TypeScript + React', required: true },
  { name: 'Prettier - Code formatter', desc: 'Auto-format kode saat save', required: false },
  { name: 'ESLint', desc: 'Cek error & best practice', required: false },
  { name: 'Auto Rename Tag', desc: 'Rename tag HTML/JSX berpasangan', required: false },
  { name: 'Simple React Snippets', desc: 'Snippets tambahan untuk React', required: false },
];

const comparisons = [
  { laravel: 'composer.json', react: 'package.json', note: 'Daftar package/dependencies' },
  { laravel: 'composer install', react: 'npm install', note: 'Install semua dependencies' },
  { laravel: 'php artisan serve', react: 'npm run dev', note: 'Jalankan development server' },
  { laravel: 'resources/views/', react: 'src/pages/', note: 'Halaman-halaman aplikasi' },
  { laravel: 'app/Http/Controllers', react: 'src/pages/ + store.tsx', note: 'Logic & data handling' },
  { laravel: 'app/Models', react: 'store.tsx (interface)', note: 'Definisi struktur data' },
  { laravel: 'routes/web.php', react: 'App.tsx (React Router)', note: 'Definisi URL/route' },
  { laravel: 'public/', react: 'public/', note: 'File statis (gambar, favicon)' },
  { laravel: 'resources/css/', react: 'src/index.css', note: 'File CSS global' },
  { laravel: 'Blade @extends', react: 'Layout component', note: 'Template inheritance' },
  { laravel: 'Blade @include', react: 'Import component', note: 'Memasukkan komponen' },
  { laravel: 'Migration', react: 'Tidak ada (frontend only)', note: 'Database di backend' },
];

export default function GuidePage() {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'src/pages', 'src/components']));
  const [activeTab, setActiveTab] = useState<'structure' | 'ide' | 'comparison' | 'setup'>('structure');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const toggleFolder = (path: string) => {
    const next = new Set(expandedFolders);
    if (next.has(path)) next.delete(path);
    else next.add(path);
    setExpandedFolders(next);
  };

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const renderTree = (node: TreeNode, path = '', depth = 0) => {
    const currentPath = path ? `${path}/${node.name}` : node.name;
    const isExpanded = expandedFolders.has(currentPath);

    if (node.type === 'folder') {
      return (
        <div key={currentPath} style={{ paddingLeft: `${depth * 20}px` }}>
          <button
            onClick={() => toggleFolder(currentPath)}
            className="flex items-center gap-2 w-full py-1.5 px-2 hover:bg-slate-100 rounded-lg text-left group"
          >
            {isExpanded ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
            {isExpanded ? <FolderOpen size={16} className="text-amber-500" /> : <Folder size={16} className="text-amber-500" />}
            <span className="font-mono text-sm font-semibold text-slate-800">{node.name}</span>
          </button>
          {isExpanded && node.children && (
            <div>
              {node.children.map(child => renderTree(child, currentPath, depth + 1))}
            </div>
          )}
          {node.description && (
            <div style={{ paddingLeft: '28px' }} className="pb-2">
              <p className="text-xs text-slate-500 italic">💡 {node.description}</p>
              {node.laravelEquivalent && (
                <p className="text-xs text-blue-600 mt-0.5">🔸 {node.laravelEquivalent}</p>
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <div key={currentPath} style={{ paddingLeft: `${depth * 20 + 28}px` }} className="py-1.5 px-2 hover:bg-slate-50 rounded-lg group">
        <div className="flex items-center gap-2">
          <FileCode size={14} className="text-blue-500" />
          <span className="font-mono text-sm text-slate-700">{node.name}</span>
          {node.icon && <span className="text-sm">{node.icon}</span>}
        </div>
        {node.description && (
          <div className="mt-1 ml-6">
            <p className="text-xs text-slate-500">→ {node.description}</p>
            {node.laravelEquivalent && (
              <p className="text-xs text-blue-600">🔸 {node.laravelEquivalent}</p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl">📚</div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Panduan RMS untuk Developer Laravel</h1>
              <p className="text-xs text-slate-500">Struktur folder, IDE, dan cara integrasi</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-green-700">React + Vite + TypeScript</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Intro Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white mb-8 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="text-5xl">👋</div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Halo Developer Laravel!</h2>
              <p className="text-blue-100 text-sm md:text-base leading-relaxed">
                Halaman ini akan membantu Anda memahami struktur project React/Vite yang baru saja dibuat.
                Kami akan menjelaskan setiap folder dan file dengan <strong>perbandingan ke Laravel</strong> agar mudah dipahami.
                React sebenarnya mirip dengan Laravel Blade — hanya beda syntax dan cara kerjanya.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
          {[
            { id: 'structure', label: 'Struktur Folder', icon: Folder },
            { id: 'ide', label: 'Rekomendasi IDE', icon: Monitor },
            { id: 'comparison', label: 'Laravel vs React', icon: Code2 },
            { id: 'setup', label: 'Cara Setup', icon: Terminal },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
                activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <tab.icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'structure' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Folder className="text-amber-500" size={20} /> Struktur Folder Project
                </h3>
                <span className="text-xs text-slate-500">Klik folder untuk expand</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 font-mono text-sm">
                {renderTree(projectStructure)}
              </div>
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-start gap-2">
                  <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <strong>Penting:</strong> Folder <code className="bg-amber-100 px-1 rounded">node_modules/</code> TIDAK perlu di-copy.
                    Folder ini otomatis dibuat saat Anda menjalankan <code className="bg-amber-100 px-1 rounded">npm install</code>.
                    Sama seperti <code className="bg-amber-100 px-1 rounded">vendor/</code> di Laravel yang di-generate dari <code className="bg-amber-100 px-1 rounded">composer install</code>.
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Lightbulb className="text-amber-500" size={18} /> File yang WAJIB di-copy
                </h4>
                <div className="space-y-2">
                  {[
                    { path: 'src/', color: 'bg-blue-100 text-blue-700' },
                    { path: 'index.html', color: 'bg-purple-100 text-purple-700' },
                    { path: 'package.json', color: 'bg-green-100 text-green-700' },
                    { path: 'vite.config.js', color: 'bg-amber-100 text-amber-700' },
                    { path: 'tsconfig.json', color: 'bg-pink-100 text-pink-700' },
                  ].map(item => (
                    <div key={item.path} className={`px-3 py-2 rounded-lg ${item.color} text-xs font-mono font-medium`}>
                      📄 {item.path}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <AlertCircle className="text-red-500" size={18} /> JANGAN di-copy
                </h4>
                <div className="space-y-2">
                  {[
                    { path: 'node_modules/', reason: 'Auto-generate dari npm install' },
                    { path: 'dist/', reason: 'Hasil build, auto-generate' },
                    { path: '.git/', reason: 'Folder git (jika ada)' },
                  ].map(item => (
                    <div key={item.path} className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-xs font-mono font-medium text-red-700">🚫 {item.path}</p>
                      <p className="text-[10px] text-red-600 mt-0.5">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ide' && (
          <div className="space-y-6">
            {/* VS Code Recommendation */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-start gap-4">
                <div className="text-6xl">💙</div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Visual Studio Code (VS Code)</h3>
                  <p className="text-blue-100 mb-3">
                    <strong>IDE yang paling direkomendasikan</strong> untuk React. Gratis, ringan, dan punya ekosistem ekstensi terbaik.
                    Sama seperti PhpStorm untuk Laravel, tapi gratis!
                  </p>
                  <a href="https://code.visualstudio.com" target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors">
                    <Download size={16} /> Download VS Code
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>

            {/* Alternative IDEs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'VS Code', emoji: '💙', recommended: true, desc: 'Pilihan utama. Gratis, ringan, ekosensi lengkap', price: 'Gratis' },
                { name: 'WebStorm', emoji: '🧠', recommended: false, desc: 'IDE premium dari JetBrains (pembuat PhpStorm)', price: 'Berbayar' },
                { name: 'Cursor', emoji: '🤖', recommended: false, desc: 'VS Code + AI built-in, cocok untuk coding cepat', price: 'Freemium' },
              ].map(ide => (
                <div key={ide.name} className={`bg-white rounded-2xl p-5 border-2 ${ide.recommended ? 'border-blue-500 shadow-lg' : 'border-slate-100'}`}>
                  {ide.recommended && (
                    <div className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded mb-2">⭐ RECOMMENDED</div>
                  )}
                  <div className="text-4xl mb-2">{ide.emoji}</div>
                  <h4 className="font-bold text-slate-800">{ide.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">{ide.desc}</p>
                  <p className="text-xs font-semibold text-green-600 mt-2">{ide.price}</p>
                </div>
              ))}
            </div>

            {/* Extensions */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Package size={20} className="text-blue-600" /> Ekstensi WAJIB untuk VS Code
              </h3>
              <div className="space-y-2">
                {ideExtensions.map(ext => (
                  <div key={ext.name} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    {ext.required ? (
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                        <Check size={14} className="text-white" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-white">○</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-800">{ext.name}</p>
                        {ext.required && <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded">WAJIB</span>}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{ext.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* VS Code Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">⚙️ Setting VS Code yang Direkomendasikan</h3>
              <p className="text-sm text-slate-600 mb-3">Buka Settings (Ctrl+,) lalu cari dan aktifkan:</p>
              <div className="space-y-2">
                {[
                  { setting: 'Editor: Format On Save', value: '✅ Centang', desc: 'Auto-format saat save file' },
                  { setting: 'Editor: Default Formatter', value: 'Prettier', desc: 'Gunakan Prettier untuk format' },
                  { setting: 'Editor: Tab Size', value: '2', desc: 'React pakai 2 spasi (bukan 4 seperti Laravel)' },
                  { setting: 'Emmet: Include In Languages', value: 'javascript, typescript-react', desc: 'Aktifkan Emmet di JSX' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{s.setting}</p>
                      <p className="text-xs text-slate-500">{s.desc}</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-mono font-bold rounded-lg">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'comparison' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">🔄 Perbandingan Laravel vs React</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-bold text-purple-700 bg-purple-50 rounded-tl-lg">🐘 Laravel</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-blue-700 bg-blue-50">⚛️ React</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-slate-700 bg-slate-50 rounded-tr-lg">📝 Penjelasan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisons.map((c, i) => (
                      <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono text-sm text-purple-700">{c.laravel}</td>
                        <td className="py-3 px-4 font-mono text-sm text-blue-700">{c.react}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{c.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Key Differences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white shadow-xl">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">🐘 Laravel (Backend)</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2"><Check size={16} className="mt-0.5" /> Server-side rendering</li>
                  <li className="flex items-start gap-2"><Check size={16} className="mt-0.5" /> Koneksi langsung ke database</li>
                  <li className="flex items-start gap-2"><Check size={16} className="mt-0.5" /> PHP sebagai bahasa</li>
                  <li className="flex items-start gap-2"><Check size={16} className="mt-0.5" /> Blade template untuk HTML</li>
                  <li className="flex items-start gap-2"><Check size={16} className="mt-0.5" /> Composer untuk package</li>
                  <li className="flex items-start gap-2"><Check size={16} className="mt-0.5" /> Satu file = satu halaman</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">⚛️ React (Frontend)</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2"><Check size={16} className="mt-0.5" /> Client-side rendering (di browser)</li>
                  <li className="flex items-start gap-2"><Check size={16} className="mt-0.5" /> Butuh API/backend terpisah</li>
                  <li className="flex items-start gap-2"><Check size={16} className="mt-0.5" /> JavaScript/TypeScript</li>
                  <li className="flex items-start gap-2"><Check size={16} className="mt-0.5" /> JSX (HTML di dalam JS)</li>
                  <li className="flex items-start gap-2"><Check size={16} className="mt-0.5" /> npm untuk package</li>
                  <li className="flex items-start gap-2"><Check size={16} className="mt-0.5" /> Komponen reusable</li>
                </ul>
              </div>
            </div>

            {/* Concept Mapping */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">🧠 Konsep yang Perlu Dipahami</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Komponen (Component)',
                    desc: 'Seperti @include di Blade. Fungsi yang return HTML. Bisa dipakai ulang.',
                    example: 'function Button() { return <button>Klik</button> }',
                  },
                  {
                    title: 'Props',
                    desc: 'Seperti parameter di @include("view", ["data" => $value]). Data dari parent ke child.',
                    example: '<Button label="Simpan" color="blue" />',
                  },
                  {
                    title: 'State (useState)',
                    desc: 'Data yang bisa berubah. Seperti $variable di controller, tapi di frontend.',
                    example: 'const [count, setCount] = useState(0)',
                  },
                  {
                    title: 'JSX',
                    desc: 'HTML di dalam JavaScript. Mirip Blade tapi syntax JavaScript.',
                    example: '<div className="text-red">{name}</div>',
                  },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-600 mb-2">{item.desc}</p>
                    <code className="block text-xs bg-slate-900 text-green-400 p-2 rounded font-mono">
                      {item.example}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'setup' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">🚀 Langkah-langkah Setup dari Nol</h3>
              <div className="space-y-4">
                {[
                  {
                    step: 1,
                    title: 'Install Node.js (wajib pertama)',
                    desc: 'Download dari nodejs.org (pilih versi LTS). Ini seperti install PHP di komputer Anda.',
                    cmd: 'node --version\nnpm --version',
                  },
                  {
                    step: 2,
                    title: 'Buat project React baru',
                    desc: 'Perintah ini seperti "laravel new nama-project". Akan membuat folder project baru.',
                    cmd: 'npm create vite@latest rms-app -- --template react-ts\ncd rms-app',
                  },
                  {
                    step: 3,
                    title: 'Install dependencies',
                    desc: 'Seperti "composer install". Akan download semua package yang dibutuhkan.',
                    cmd: 'npm install\nnpm install react-router-dom recharts lucide-react',
                  },
                  {
                    step: 4,
                    title: 'Install Tailwind CSS',
                    desc: 'Framework CSS seperti Bootstrap, tapi lebih modern.',
                    cmd: 'npm install -D tailwindcss @tailwindcss/vite',
                  },
                  {
                    step: 5,
                    title: 'Copy file dari project ini',
                    desc: 'Salin semua file dari folder src/, index.html, dan config files ke project Anda.',
                    cmd: '# Copy manual via file explorer, atau:\n# src/ → rms-app/src/\n# index.html → rms-app/index.html',
                  },
                  {
                    step: 6,
                    title: 'Jalankan development server',
                    desc: 'Seperti "php artisan serve". Server akan jalan di http://localhost:5173',
                    cmd: 'npm run dev',
                  },
                  {
                    step: 7,
                    title: 'Build untuk production',
                    desc: 'Seperti "php artisan optimize". Hasil ada di folder dist/',
                    cmd: 'npm run build',
                  },
                ].map(step => (
                  <div key={step.step} className="relative pl-12 pb-4 border-l-2 border-blue-200 last:border-l-0">
                    <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-lg">
                      {step.step}
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <h4 className="font-bold text-slate-800 mb-1">{step.title}</h4>
                      <p className="text-sm text-slate-600 mb-3">{step.desc}</p>
                      <div className="relative">
                        <pre className="bg-slate-900 text-green-400 p-3 rounded-lg text-xs font-mono overflow-x-auto">
                          {step.cmd}
                        </pre>
                        <button
                          onClick={() => copyCommand(step.cmd)}
                          className="absolute top-2 right-2 p-1.5 bg-slate-700 hover:bg-slate-600 rounded text-white transition-colors"
                        >
                          {copiedCmd === step.cmd ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Integration with Laravel */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
              <h3 className="text-xl font-bold mb-3">🔗 Integrasi dengan Laravel (Opsional)</h3>
              <p className="text-purple-100 text-sm mb-4">
                Jika ingin menggabungkan React ini dengan Laravel backend Anda, ada 2 cara:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                  <h4 className="font-bold mb-2">🅰️ Cara Mudah: Inertia.js</h4>
                  <p className="text-xs text-purple-100 mb-2">React jadi "Blade"-nya Laravel. Satu project, satu server.</p>
                  <code className="block text-xs bg-black/30 p-2 rounded font-mono">
                    composer require inertiajs/inertia-laravel<br />
                    npm install @inertiajs/react
                  </code>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                  <h4 className="font-bold mb-2">🅱️ Cara Pro: API Terpisah</h4>
                  <p className="text-xs text-purple-100 mb-2">React standalone, Laravel jadi API. Deploy terpisah.</p>
                  <code className="block text-xs bg-black/30 p-2 rounded font-mono">
                    Laravel → api.domain.com<br />
                    React → app.domain.com
                  </code>
                </div>
              </div>
            </div>

            {/* Common Commands */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">📝 Perintah yang Sering Dipakai</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { cmd: 'npm run dev', desc: 'Jalankan dev server (hot reload)' },
                  { cmd: 'npm run build', desc: 'Build untuk production' },
                  { cmd: 'npm install [package]', desc: 'Install package baru' },
                  { cmd: 'npm uninstall [package]', desc: 'Hapus package' },
                  { cmd: 'npm update', desc: 'Update semua package' },
                  { cmd: 'npm audit fix', desc: 'Fix security issues' },
                ].map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <code className="text-xs font-mono font-bold text-blue-700">{c.cmd}</code>
                    <span className="text-xs text-slate-500">{c.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>Dibuat untuk membantu developer Laravel belajar React 🚀</p>
          <p className="text-xs mt-1">Jika ada pertanyaan, silakan tanyakan!</p>
        </div>
      </div>
    </div>
  );
}
