import { useState, useRef } from 'react';
import { pledgeCategories } from '../data/pledgeCategories';
import Certificate from '../components/Certificate';
import { incrementPledgeCount } from '../lib/firestore';

export default function PledgePage() {
  const [fullName, setFullName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);
  const [pledgeData, setPledgeData] = useState<{
    name: string;
    category: typeof pledgeCategories[number];
    date: string;
    time: string;
  } | null>(null);
  const certRef = useRef<HTMLDivElement>(null);

  const category = pledgeCategories.find((c) => c.id === selectedCategory);

  const handlePledge = async () => {
    if (!fullName.trim() || !selectedCategory) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    const timeStr = now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    setPledgeData({
      name: fullName.trim(),
      category: category!,
      date: dateStr,
      time: timeStr,
    });
    setShowCertificate(true);

    try {
      await incrementPledgeCount(selectedCategory);
    } catch {
      // Analytics are optional, don't block the user
    }
  };

  const handleReset = () => {
    setShowCertificate(false);
    setPledgeData(null);
    setFullName('');
    setSelectedCategory('');
  };

  if (showCertificate && pledgeData) {
    return (
      <div className="min-h-screen bg-amber-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Certificate ref={certRef} data={pledgeData} />
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <button
              onClick={() => {
                import('html2canvas').then(({ default: html2canvas }) => {
                  if (certRef.current) {
                    html2canvas(certRef.current, {
                      scale: 2,
                      backgroundColor: null,
                      useCORS: true,
                    }).then((canvas) => {
                      const link = document.createElement('a');
                      link.download = `kumbh-pledge-${pledgeData.category.id}.png`;
                      link.href = canvas.toDataURL('image/png');
                      link.click();
                    });
                  }
                });
              }}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Download as PNG
            </button>
            <button
              onClick={() => {
                import('html2canvas').then(({ default: html2canvas }) => {
                  import('jspdf').then(({ default: jsPDF }) => {
                    if (certRef.current) {
                      html2canvas(certRef.current, {
                        scale: 2,
                        backgroundColor: null,
                        useCORS: true,
                      }).then((canvas) => {
                        const imgData = canvas.toDataURL('image/png');
                        const pdf = new jsPDF('landscape', 'mm', 'a4');
                        const pdfWidth = pdf.internal.pageSize.getWidth();
                        const pdfHeight = pdf.internal.pageSize.getHeight();
                        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                        pdf.save(`kumbh-pledge-${pledgeData.category.id}.pdf`);
                      });
                    }
                  });
                });
              }}
              className="inline-flex items-center justify-center gap-2 bg-white text-amber-800 border-2 border-amber-300 px-6 py-3 rounded-xl font-semibold hover:bg-amber-50 transition-all"
            >
              Download as PDF
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 text-amber-600 px-6 py-3 rounded-xl font-semibold hover:bg-amber-100 transition-all"
            >
              Take Another Pledge
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-8 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">Take a Pledge</h1>
          <p className="text-amber-600">Commit to a cause for Kumbh Parv Nashik 2026</p>
        </div>

        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6 md:p-8">
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-amber-800 mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-amber-900 placeholder:text-amber-300 transition-all text-lg"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-amber-800 mb-3">
                Pledge Category
              </label>
              <div className="grid gap-2">
                {pledgeCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`text-left px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
                      selectedCategory === cat.id
                        ? 'bg-amber-100 border-amber-400 text-amber-900 ring-2 ring-amber-200'
                        : 'bg-white border-amber-100 text-amber-700 hover:bg-amber-50 hover:border-amber-200'
                    }`}
                  >
                    {cat.titleEn}
                    <span className="block text-xs text-amber-500 mt-0.5">{cat.titleMr} / {cat.titleHi}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            {category && fullName.trim() && (
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">Preview</p>
                <p className="text-amber-800 text-sm leading-relaxed">
                  <span className="font-semibold">{fullName.trim()}</span> has solemnly taken the pledge for{' '}
                  <span className="font-semibold">{category.titleEn}</span>
                </p>
                <p className="text-amber-600 text-xs mt-2 italic">"{category.statementEn}"</p>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handlePledge}
              disabled={!fullName.trim() || !selectedCategory}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-amber-200 hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all"
            >
              Take Pledge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
