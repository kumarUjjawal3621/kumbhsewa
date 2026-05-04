import { forwardRef } from 'react';

interface CertificateData {
  name: string;
  category: {
    id: string;
    titleEn: string;
    titleMr: string;
    titleHi: string;
    statementEn: string;
    statementMr: string;
    statementHi: string;
  };
  date: string;
  time: string;
}

const Certificate = forwardRef<HTMLDivElement, { data: CertificateData }>(
  ({ data }, ref) => {
    return (
      <div
        ref={ref}
        className="bg-white border-4 border-double border-amber-400 p-6 md:p-10 relative"
        style={{
          background: 'linear-gradient(135deg, #fffbeb 0%, #ffffff 30%, #fffbeb 70%, #ffffff 100%)',
          minHeight: '500px',
        }}
      >
        {/* Decorative corners */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-500" />
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-500" />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-500" />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-500" />

        <div className="text-center">
          {/* Header */}
          <div className="mb-1">
            <p className="text-amber-600 text-xs tracking-[0.3em] uppercase font-semibold">Kumbh Parv</p>
          </div>
          <div className="mb-6">
            <p className="text-amber-800 text-xs tracking-[0.3em] uppercase font-semibold">Nashik 2026</p>
          </div>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-16 bg-amber-300" />
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <div className="h-px w-16 bg-amber-300" />
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-amber-900 tracking-wide mb-8">
            CERTIFICATE OF COMMITMENT
          </h1>

          {/* Body */}
          <p className="text-amber-700 text-sm mb-2">This is to certify that</p>
          <p className="text-2xl md:text-3xl font-bold text-amber-900 mb-2 py-2 border-b-2 border-dashed border-amber-200 inline-block px-8 min-w-[200px]">
            {data.name}
          </p>
          <p className="text-amber-700 text-sm mt-4 mb-2">has solemnly taken the pledge for</p>
          <p className="text-xl md:text-2xl font-bold text-amber-800 mb-6">
            {data.category.titleEn}
          </p>

          {/* Pledge Statement */}
          <div className="max-w-lg mx-auto mb-8">
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
              <p className="text-amber-700 text-sm italic leading-relaxed">
                "{data.category.statementEn}"
              </p>
            </div>
          </div>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-24 bg-amber-300" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <div className="h-px w-24 bg-amber-300" />
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between max-w-md mx-auto gap-4">
            <div className="text-left">
              <p className="text-amber-600 text-xs">Date: {data.date}</p>
              <p className="text-amber-600 text-xs">Time: {data.time}</p>
            </div>
            <div className="text-right">
              <div className="w-32 border-b border-amber-400 mb-1" />
              <p className="text-amber-800 text-xs font-semibold">Authorized Signature</p>
              <p className="text-amber-600 text-xs">Kumbh Commission</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Certificate.displayName = 'Certificate';
export default Certificate;
