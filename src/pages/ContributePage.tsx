import { useState } from 'react';
import { contributionIntents } from '../data/contributionIntents';
import { submitContributor } from '../lib/firestore';
import { CheckCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

type Lang = 'en' | 'mr' | 'hi';

function getIntentText(intent: (typeof contributionIntents)[number], lang: Lang) {
  if (lang === 'mr') return intent.mr;
  if (lang === 'hi') return intent.hi;
  return intent.en;
}

export default function ContributePage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<Lang>('en');
  const [selectedIntents, setSelectedIntents] = useState<string[]>([]);

  const validateStep1 = () => {
    if (!fullName.trim()) return 'Full name is required';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Valid email is required';
    if (!whatsapp.trim() || !/^[6-9]\d{9}$/.test(whatsapp)) return 'Valid 10-digit Indian phone number required';
    if (!pinCode.trim() || !/^\d{6}$/.test(pinCode)) return 'Valid 6-digit PIN code required';
    return '';
  };

  const validateStep2 = () => {
    if (selectedIntents.length === 0) return 'Please select at least one contribution intent';
    return '';
  };

  const handleNext = () => {
    if (step === 1) {
      const err = validateStep1();
      if (err) { setError(err); return; }
    }
    if (step === 2) {
      const err = validateStep2();
      if (err) { setError(err); return; }
    }
    setError('');
    setStep(step + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      await submitContributor({
        fullName: fullName.trim(),
        email: email.trim(),
        whatsappNumber: whatsapp.trim(),
        pinCode: pinCode.trim(),
        preferredLanguage,
        intents: selectedIntents,
      });
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleIntent = (id: string) => {
    setSelectedIntents((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center py-8 px-4">
        <div className="max-w-md w-full text-center bg-white rounded-2xl border border-amber-100 shadow-sm p-8">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-amber-900 mb-3">Thank You!</h2>
          <p className="text-amber-700 mb-2 font-medium">
            Thank you for registering. Team Kumbh will contact you if your support is needed.
          </p>
          <p className="text-amber-600 text-sm mb-1">
            नोंदणीसाठी धन्यवाद. तुमच्या सहाय्याची गरज असल्यास कुंभ संघ तुमच्याशी संपर्क साधेल.
          </p>
          <p className="text-amber-600 text-sm mb-6">
            पंजीकरण के लिए धन्यवाद। आपके सहयोग की आवश्यकता होने पर कुंभ टीम आपसे संपर्क करेगी।
          </p>
          <a href="/" className="inline-flex items-center gap-2 text-amber-700 font-semibold hover:text-amber-900 transition-colors">
            <ChevronLeft size={16} /> Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-8 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">Become a Contributor</h1>
          <p className="text-amber-600">Register to serve during Kumbh Parv Nashik 2026</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  s < step
                    ? 'bg-amber-500 text-white'
                    : s === step
                    ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-400'
                    : 'bg-amber-50 text-amber-400'
                }`}
              >
                {s < step ? <CheckCircle size={16} /> : s}
              </div>
              {s < 3 && (
                <div className={`w-12 h-0.5 ${s < step ? 'bg-amber-400' : 'bg-amber-100'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6 md:p-8">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl mb-4 border border-red-100">
              {error}
            </div>
          )}

          {/* Step 1: Basic Details */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-amber-900 mb-1">Basic Details</h2>

              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-amber-800 mb-1.5">
                  Full Name / नाव / नाम
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

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-amber-800 mb-1.5">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-amber-900 placeholder:text-amber-300 transition-all"
                />
              </div>

              <div>
                <label htmlFor="whatsapp" className="block text-sm font-semibold text-amber-800 mb-1.5">
                  WhatsApp Number / व्हॉट्सअॅप क्रमांक / दूरभाष संख्या
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-amber-200 bg-amber-50 text-amber-600 text-sm font-medium">
                    +91
                  </span>
                  <input
                    id="whatsapp"
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9876543210"
                    className="w-full px-4 py-3 rounded-r-xl border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-amber-900 placeholder:text-amber-300 transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="pinCode" className="block text-sm font-semibold text-amber-800 mb-1.5">
                  PIN Code
                </label>
                <input
                  id="pinCode"
                  type="text"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="422001"
                  className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-amber-900 placeholder:text-amber-300 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-amber-800 mb-2">
                  Preferred Language
                </label>
                <div className="flex gap-3">
                  {[
                    { value: 'en' as Lang, label: 'English' },
                    { value: 'mr' as Lang, label: 'मराठी' },
                    { value: 'hi' as Lang, label: 'हिंदी' },
                  ].map((lang) => (
                    <label
                      key={lang.value}
                      className={`flex-1 text-center px-4 py-3 rounded-xl border cursor-pointer transition-all font-medium text-sm ${
                        preferredLanguage === lang.value
                          ? 'bg-amber-100 border-amber-400 text-amber-900 ring-2 ring-amber-200'
                          : 'bg-white border-amber-100 text-amber-700 hover:bg-amber-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="language"
                        value={lang.value}
                        checked={preferredLanguage === lang.value}
                        onChange={() => setPreferredLanguage(lang.value)}
                        className="sr-only"
                      />
                      {lang.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contribution Intent */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-amber-900 mb-1">
                Opportunities for Public Participation as a Citizen of Nashik
              </h2>
              <p className="text-amber-600 text-sm mb-2">
                Select all that apply. At least one is required.
              </p>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                {contributionIntents.map((intent) => (
                  <label
                    key={intent.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedIntents.includes(intent.id)
                        ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-200'
                        : 'bg-white border-amber-100 hover:bg-amber-50/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIntents.includes(intent.id)}
                      onChange={() => toggleIntent(intent.id)}
                      className="mt-1 w-5 h-5 rounded border-amber-300 text-amber-600 focus:ring-amber-400 flex-shrink-0"
                    />
                    <span className="text-sm text-amber-800 leading-relaxed">
                      {getIntentText(intent, preferredLanguage)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-amber-900 mb-1">Confirm Your Registration</h2>

              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-amber-600">Name</span>
                  <span className="text-amber-900 font-medium">{fullName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-amber-600">Email</span>
                  <span className="text-amber-900 font-medium">{email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-amber-600">WhatsApp</span>
                  <span className="text-amber-900 font-medium">+91 {whatsapp}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-amber-600">PIN Code</span>
                  <span className="text-amber-900 font-medium">{pinCode}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-amber-600">Language</span>
                  <span className="text-amber-900 font-medium">
                    {preferredLanguage === 'en' ? 'English' : preferredLanguage === 'mr' ? 'मराठी' : 'हिंदी'}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-amber-800 mb-2">Selected Intents ({selectedIntents.length})</p>
                <ul className="space-y-1">
                  {selectedIntents.map((id) => {
                    const intent = contributionIntents.find((i) => i.id === id);
                    if (!intent) return null;
                    return (
                      <li key={id} className="text-sm text-amber-700 flex items-start gap-2">
                        <span className="text-amber-400 mt-0.5">&#10003;</span>
                        {getIntentText(intent, preferredLanguage)}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <p className="text-green-800 text-sm font-medium mb-1">
                  Thank you for registering. Team Kumbh will contact you if your support is needed.
                </p>
                <p className="text-green-700 text-xs">
                  नोंदणीसाठी धन्यवाद. तुमच्या सहाय्याची गरज असल्यास कुंभ संघ तुमच्याशी संपर्क साधेल.
                </p>
                <p className="text-green-700 text-xs">
                  पंजीकरण के लिए धन्यवाद। आपके सहयोग की आवश्यकता होने पर कुंभ टीम आपसे संपर्क करेगी।
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-1 text-amber-700 font-semibold px-5 py-3 rounded-xl hover:bg-amber-50 transition-colors"
              >
                <ChevronLeft size={18} /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-amber-200 hover:shadow-xl transition-all"
              >
                Next <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-amber-200 hover:shadow-xl disabled:opacity-50 transition-all"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : null}
                {submitting ? 'Submitting...' : 'Submit Registration'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
