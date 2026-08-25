import React, { useState, useRef } from 'react';
import { renderMarkdownAndHtml } from '../../lib/markdown';
import {
  Heading2,
  Heading3,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  Eye,
  Edit3,
  FileText,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

interface RichArticleEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichArticleEditor({
  value,
  onChange,
  placeholder = 'Tulis konten artikel Anda di sini... (Mendukung Markdown & HTML)',
  minHeight = '320px'
}: RichArticleEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [showHelper, setShowHelper] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormatting = (prefix: string, suffix: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = textarea.value;
    const selectedText = currentVal.substring(start, end) || defaultText;

    const before = currentVal.substring(0, start);
    const after = currentVal.substring(end);

    const newVal = `${before}${prefix}${selectedText}${suffix}${after}`;
    onChange(newVal);

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 10);
  };

  const insertLink = () => {
    const url = prompt('Masukkan URL Link (contoh: https://grandbedahanresidence.com):');
    if (url) {
      insertFormatting('[', `](${url})`, 'Teks Link');
    }
  };

  const insertImage = () => {
    const url = prompt('Masukkan URL Gambar:');
    if (url) {
      const alt = prompt('Masukkan Keterangan/Alt Gambar:', 'Foto ilustrasi artikel') || 'Foto ilustrasi';
      insertFormatting(`\n![${alt}](${url})\n`, '');
    }
  };

  const insertTemplate = () => {
    const template = `## 1. Pendahuluan
Tuliskan pengantar artikel yang menarik perhatian pembaca di sini. Jelaskan pentingnya topik ini bagi calon pemilik rumah.

## 2. Keuntungan Utama
Berikut adalah beberapa poin penting yang perlu Anda perhatikan:
- **Lokasi Strategis:** Dekat dengan akses transportasi dan fasilitas publik.
- **Nilai Investasi Tinggi:** Pertumbuhan harga properti di kawasan Sawangan Depok sangat potensial.
- **Lingkungan Asri:** Udara bersih dan suasana tenang untuk keluarga.

> "Memilih rumah bukan sekadar membeli bangunan, melainkan memilih kualitas hidup untuk masa depan keluarga Anda."

## 3. Kesimpulan & Rekomendasi
Rangkum pesan utama artikel ini dan berikan saran terbaik untuk pembaca yang sedang mencari hunian impian di Grand Bedahan Residence.`;

    if (value.trim() && !confirm('Ganti konten saat ini dengan template contoh?')) {
      return;
    }
    onChange(template);
  };

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-xs focus-within:ring-2 focus-within:ring-[#0E3B2E] transition-all">
      {/* Header Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex flex-wrap items-center justify-between gap-2">
        
        {/* Left Formatting Buttons */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => insertFormatting('\n## ', '\n', 'Sub Judul H2')}
            className="p-1.5 hover:bg-white rounded-lg text-gray-700 hover:text-[#0E3B2E] transition-all cursor-pointer"
            title="Heading 2 (## Judul)"
          >
            <Heading2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => insertFormatting('\n### ', '\n', 'Sub Judul H3')}
            className="p-1.5 hover:bg-white rounded-lg text-gray-700 hover:text-[#0E3B2E] transition-all cursor-pointer"
            title="Heading 3 (### Judul)"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-gray-300 mx-1"></div>

          <button
            type="button"
            onClick={() => insertFormatting('**', '**', 'teks tebal')}
            className="p-1.5 hover:bg-white rounded-lg text-gray-700 hover:text-[#0E3B2E] transition-all cursor-pointer"
            title="Teks Tebal (**bold**)"
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => insertFormatting('*', '*', 'teks miring')}
            className="p-1.5 hover:bg-white rounded-lg text-gray-700 hover:text-[#0E3B2E] transition-all cursor-pointer"
            title="Teks Miring (*italic*)"
          >
            <Italic className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => insertFormatting('<u>', '</u>', 'teks bergaris bawah')}
            className="p-1.5 hover:bg-white rounded-lg text-gray-700 hover:text-[#0E3B2E] transition-all cursor-pointer"
            title="Underline (<u>teks</u>)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-gray-300 mx-1"></div>

          <button
            type="button"
            onClick={() => insertFormatting('\n- ', '', 'Poin daftar')}
            className="p-1.5 hover:bg-white rounded-lg text-gray-700 hover:text-[#0E3B2E] transition-all cursor-pointer"
            title="Bullet List (- Poin)"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => insertFormatting('\n1. ', '', 'Poin bernomor')}
            className="p-1.5 hover:bg-white rounded-lg text-gray-700 hover:text-[#0E3B2E] transition-all cursor-pointer"
            title="Numbered List (1. Poin)"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => insertFormatting('\n> ', '\n', 'Kutipan inspiratif')}
            className="p-1.5 hover:bg-white rounded-lg text-gray-700 hover:text-[#0E3B2E] transition-all cursor-pointer"
            title="Blockquote (> Kutipan)"
          >
            <Quote className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-gray-300 mx-1"></div>

          <button
            type="button"
            onClick={insertLink}
            className="p-1.5 hover:bg-white rounded-lg text-gray-700 hover:text-[#0E3B2E] transition-all cursor-pointer"
            title="Sisipkan Link [Teks](URL)"
          >
            <LinkIcon className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={insertImage}
            className="p-1.5 hover:bg-white rounded-lg text-gray-700 hover:text-[#0E3B2E] transition-all cursor-pointer"
            title="Sisipkan Gambar ![Alt](URL)"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => insertFormatting('\n---\n')}
            className="p-1.5 hover:bg-white rounded-lg text-gray-700 hover:text-[#0E3B2E] transition-all cursor-pointer"
            title="Garis Pembatas (---)"
          >
            <Minus className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={insertTemplate}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-[#0E3B2E] border border-emerald-200 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-all cursor-pointer ml-1"
            title="Isi contoh struktur artikel"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Gunakan Template</span>
          </button>
        </div>

        {/* Right Tab Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-200/80 p-0.5 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeTab === 'edit'
                  ? 'bg-white text-[#0E3B2E] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Tulis</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-white text-[#0E3B2E] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Pratinjau</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowHelper(!showHelper)}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 cursor-pointer"
            title="Panduan Format Markdown"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Helper Guide Drawer */}
      {showHelper && (
        <div className="p-4 bg-emerald-50/70 border-b border-emerald-100 text-xs text-[#0B2E24] space-y-1.5">
          <p className="font-bold flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Tips Format Markdown &amp; HTML:</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 font-mono text-[11px]">
            <div><span className="text-[#0E3B2E] font-bold">## Judul</span> = Heading 2</div>
            <div><span className="text-[#0E3B2E] font-bold">**Teks**</span> = <strong>Tebal</strong></div>
            <div><span className="text-[#0E3B2E] font-bold">*Teks*</span> = <em>Miring</em></div>
            <div><span className="text-[#0E3B2E] font-bold">- Poin</span> = Bullet List</div>
            <div><span className="text-[#0E3B2E] font-bold">&gt; Kutipan</span> = Blockquote</div>
            <div><span className="text-[#0E3B2E] font-bold">[Teks](url)</span> = Link</div>
            <div><span className="text-[#0E3B2E] font-bold">![Alt](url)</span> = Gambar</div>
            <div><span className="text-[#0E3B2E] font-bold">&lt;p&gt;,&lt;h2&gt;</span> = Tag HTML</div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="relative">
        {activeTab === 'edit' ? (
          <textarea
            ref={textareaRef}
            required
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{ minHeight }}
            className="w-full p-4 text-sm leading-relaxed text-gray-800 outline-none resize-y font-sans"
          />
        ) : (
          <div
            style={{ minHeight }}
            className="p-6 bg-[#FAF9F6] overflow-y-auto prose prose-emerald max-w-none text-sm leading-relaxed"
          >
            {value.trim() ? (
              <div dangerouslySetInnerHTML={{ __html: renderMarkdownAndHtml(value) }} />
            ) : (
              <p className="text-gray-400 italic">Belum ada konten untuk dipratinjau.</p>
            )}
          </div>
        )}
      </div>

      {/* Footer Stats Bar */}
      <div className="bg-gray-50 border-t border-gray-100 px-4 py-2 flex items-center justify-between text-[11px] text-gray-500 font-mono">
        <div className="flex items-center gap-4">
          <span>{wordCount} Kata</span>
          <span>{charCount} Karakter</span>
        </div>
        <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
          Markdown + HTML Didukung
        </span>
      </div>
    </div>
  );
}
