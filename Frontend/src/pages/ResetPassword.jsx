import { useContext, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { ResetPasswordIcon1, ResetPasswordIcon2, ResetPasswordIcon3, ResetPasswordIcon4, ResetPasswordIcon5, ResetPasswordIcon6 } from '../assets/assets';

/* Eye toggle icon */
const EyeBtn = ({ show, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="absolute right-3 top-1/2 -translate-y-1/2
      text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
      transition-colors p-0.5"
  >
    {show ? (
      <ResetPasswordIcon1 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
    ) : (
      <ResetPasswordIcon2 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
    )}
  </button>
);

const inputCls = `w-full bg-gray-50 dark:bg-gray-950
  text-sm px-4 py-3 pr-10 rounded-xl
  text-gray-900 dark:text-gray-100
  placeholder:text-gray-400 dark:placeholder:text-gray-600
  outline-none transition-all duration-150`;

const ResetPassword = () => {
  const { backendUrl, navigate } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [pw, setPw] = useState({ next: '', confirm: '' });
  const [show, setShow] = useState({ next: false, confirm: false });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  /* password strength */
  const strength = useMemo(() => {
    const v = pw.next || '';
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[a-z]/.test(v)) score++;
    if (/\d/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    const label = score <= 2 ? 'Weak' : score === 3 ? 'Fair' : score === 4 ? 'Good' : 'Strong';
    const color =
      score <= 2
        ? 'bg-red-400'
        : score === 3
          ? 'bg-amber-400'
          : score === 4
            ? 'bg-blue-500'
            : 'bg-emerald-500';
    const textColor =
      score <= 2
        ? 'text-red-500'
        : score === 3
          ? 'text-amber-500'
          : score === 4
            ? 'text-blue-500'
            : 'text-emerald-500';
    return { score, label, color, textColor };
  }, [pw.next]);

  /* match indicator */
  const matchState = pw.confirm ? (pw.next === pw.confirm ? 'match' : 'mismatch') : 'idle';

  const submit = async (e) => {
    e.preventDefault();
    if (!token || !email) return toast.error('Invalid reset link.');
    if (pw.next.length < 8) return toast.error('Password must be at least 8 characters.');
    if (pw.next !== pw.confirm) return toast.error('Passwords do not match.');
    if (!backendUrl) return toast.error('Backend URL is not configured.');

    try {
      setSaving(true);
      const apiBase = backendUrl.replace(/\/+$/, '');
      const { data } = await axios.post(`${apiBase}/api/user/reset-password`, {
        token,
        email,
        newPassword: pw.next,
      });
      if (data.success) {
        toast.success('Password reset. Please login.');
        setDone(true);
      } else {
        toast.error(data.message || 'Unable to reset password.');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to reset password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border-t border-gray-100 dark:border-gray-800 pt-12 pb-16 px-1 sm:px-0">
      <div className="text-2xl mb-10">
        <Title text1={'RESET'} text2={'PASSWORD'} />
      </div>

      <div className="max-w-md space-y-4">
        {/* Main card */}
        <div
          className="bg-white dark:bg-gray-900
          border border-gray-100 dark:border-gray-800
          rounded-2xl p-6 sm:p-7 shadow-sm"
        >
          {/* Success state */}
          {done ? (
            <div className="flex flex-col items-center text-center py-4 gap-4">
              <div
                className="w-14 h-14 rounded-2xl
                bg-emerald-50 dark:bg-emerald-900/20
                flex items-center justify-center"
              >
                <ResetPasswordIcon3
                  className="w-7 h-7 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                 />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Password updated
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 leading-relaxed">
                  Your password has been reset successfully.
                  <br />
                  You can now log in with your new password.
                </p>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="flex items-center justify-center gap-2
                  bg-gray-900 text-white dark:bg-white dark:text-gray-900
                  text-xs tracking-[0.18em] uppercase font-medium
                  w-full py-3.5 rounded-xl
                  hover:opacity-90 active:scale-[0.99]
                  transition-all duration-150"
              >
                Go to Login
              </button>
            </div>
          ) : (
            /* Form state */
            <>
              {/* Icon + heading */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-xl
                  bg-gray-100 dark:bg-gray-800
                  flex items-center justify-center flex-shrink-0"
                >
                  <ResetPasswordIcon4
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                   />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">
                    Choose a new password
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    Resetting for{' '}
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {email || 'unknown'}
                    </span>
                  </p>
                </div>
              </div>

              {/* Invalid link warning */}
              {(!token || !email) && (
                <div
                  className="mb-4 px-4 py-3 rounded-xl
                  bg-red-50 dark:bg-red-900/10
                  border border-red-200 dark:border-red-800/40
                  text-xs text-red-600 dark:text-red-400"
                >
                  This reset link is invalid or has expired. Please request a new one.
                </div>
              )}

              <form onSubmit={submit} className="flex flex-col gap-4">
                {/* New password */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-[10px] tracking-[0.2em] uppercase font-semibold
                    text-gray-400 dark:text-gray-500"
                  >
                    New Password
                  </label>
                  <div
                    className={`relative rounded-xl ring-1 transition-all duration-150
                    ring-gray-200 dark:ring-gray-700
                    focus-within:ring-2 focus-within:ring-gray-900 dark:focus-within:ring-white`}
                  >
                    <input
                      type={show.next ? 'text' : 'password'}
                      value={pw.next}
                      onChange={(e) => setPw((s) => ({ ...s, next: e.target.value }))}
                      placeholder="••••••••"
                      className={inputCls}
                    />
                    <EyeBtn
                      show={show.next}
                      onToggle={() => setShow((s) => ({ ...s, next: !s.next }))}
                    />
                  </div>
                </div>

                {/* Strength meter — only while typing */}
                {pw.next && (
                  <div className="space-y-2 -mt-1">
                    <div className="flex justify-between items-center">
                      <span
                        className="text-[10px] tracking-widest uppercase font-semibold
                        text-gray-400 dark:text-gray-500"
                      >
                        Strength
                      </span>
                      <span
                        className={`text-[10px] font-bold tracking-wide uppercase ${strength.textColor}`}
                      >
                        {strength.label}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${strength.color}`}
                        style={{ width: `${(strength.score / 5) * 100}%` }}
                      />
                    </div>
                    {/* Criteria chips */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {[
                        { test: pw.next.length >= 8, label: '8+ chars' },
                        { test: /[A-Z]/.test(pw.next), label: 'Uppercase' },
                        { test: /\d/.test(pw.next), label: 'Number' },
                        { test: /[^A-Za-z0-9]/.test(pw.next), label: 'Symbol' },
                      ].map(({ test, label }) => (
                        <span
                          key={label}
                          className={`text-[10px] transition-colors duration-200
                            ${
                              test
                                ? 'text-emerald-500 dark:text-emerald-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                        >
                          {test ? '✓' : '○'} {label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Confirm password */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-[10px] tracking-[0.2em] uppercase font-semibold
                    text-gray-400 dark:text-gray-500"
                  >
                    Confirm Password
                  </label>
                  <div
                    className={`relative rounded-xl ring-1 transition-all duration-150
                    ${
                      matchState === 'mismatch'
                        ? 'ring-red-400 dark:ring-red-500'
                        : matchState === 'match'
                          ? 'ring-emerald-400 dark:ring-emerald-500'
                          : 'ring-gray-200 dark:ring-gray-700'
                    }
                    focus-within:ring-2`}
                  >
                    <input
                      type={show.confirm ? 'text' : 'password'}
                      value={pw.confirm}
                      onChange={(e) => setPw((s) => ({ ...s, confirm: e.target.value }))}
                      placeholder="••••••••"
                      className={inputCls}
                    />
                    <EyeBtn
                      show={show.confirm}
                      onToggle={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
                    />
                  </div>
                  {/* Inline match feedback */}
                  {matchState === 'mismatch' && (
                    <p className="text-[11px] text-red-500 dark:text-red-400 mt-0.5">
                      Passwords don't match
                    </p>
                  )}
                  {matchState === 'match' && (
                    <p className="text-[11px] text-emerald-500 dark:text-emerald-400 mt-0.5">
                      ✓ Passwords match
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={saving || matchState === 'mismatch'}
                  className="w-full flex items-center justify-center gap-2
                    bg-gray-900 text-white dark:bg-white dark:text-gray-900
                    text-xs tracking-[0.18em] uppercase font-medium
                    py-3.5 rounded-xl mt-1
                    hover:opacity-90 active:scale-[0.99]
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-150"
                >
                  {saving ? (
                    <>
                      <ResetPasswordIcon5 className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24" />
                      Saving...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Back to login */}
        {!done && (
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-1.5 text-xs
              text-gray-400 dark:text-gray-500
              hover:text-gray-900 dark:hover:text-white
              transition-colors duration-150"
          >
            <ResetPasswordIcon6 className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
            Back to login
          </button>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
