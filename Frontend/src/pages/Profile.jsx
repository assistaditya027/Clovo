import { useContext, useEffect, useMemo, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { ProfileIcon1, ProfileIcon2, ProfileIcon3, ProfileIcon4, ProfileIcon5, ProfileIcon6, ProfileIcon7, ProfileIcon8 } from '../assets/assets';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Primitives
const Card = ({ children, className = '' }) => (
  <div
    className={`bg-white dark:bg-gray-900
    border border-gray-100 dark:border-gray-800
    rounded-2xl p-6 sm:p-7
    shadow-sm hover:shadow-md dark:hover:shadow-black/30
    transition-shadow duration-300 ${className}`}
  >
    {children}
  </div>
);

const SectionLabel = ({ icon, text }) => (
  <div className="flex items-center gap-2 mb-4">
    <span className="text-gray-400 dark:text-gray-500 flex-shrink-0">{icon}</span>
    <span
      className="text-[10px] tracking-[0.22em] uppercase font-semibold
      text-gray-400 dark:text-gray-500"
    >
      {text}
    </span>
  </div>
);

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label
      className="text-[10px] tracking-[0.2em] uppercase font-semibold
      text-gray-400 dark:text-gray-500"
    >
      {label}
    </label>
    {children}
  </div>
);

const inputCls = `w-full border border-gray-200 dark:border-gray-700
  bg-gray-50 dark:bg-gray-950 rounded-xl
  text-sm px-4 py-3 text-gray-900 dark:text-gray-100
  placeholder:text-gray-400 dark:placeholder:text-gray-600
  outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white
  focus:border-transparent transition-all duration-150`;

const PrimaryBtn = ({ loading, label, loadingLabel, className = '', ...rest }) => (
  <button
    {...rest}
    disabled={loading || rest.disabled}
    className={`flex items-center justify-center gap-2
      bg-gray-900 text-white dark:bg-white dark:text-gray-900
      text-xs tracking-[0.18em] uppercase font-medium
      px-6 py-3 rounded-xl
      hover:opacity-90 active:scale-[0.98]
      disabled:opacity-40 disabled:cursor-not-allowed
      transition-all duration-150 ${className}`}
  >
    {loading && (
      <ProfileIcon1 className="w-3.5 h-3.5 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24" />
    )}
    {loading ? loadingLabel : label}
  </button>
);

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl ${className}`} />
);

const EyeBtn = ({ show, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="absolute right-3 top-1/2 -translate-y-1/2
      text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
      transition-colors p-0.5"
  >
    {show ? (
      <ProfileIcon2 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
    ) : (
      <ProfileIcon3 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
    )}
  </button>
);

// Main component
const Profile = () => {
  const { backendUrl, token, navigate } = useContext(ShopContext);

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [newsletterStatus, setNewsletterStatus] = useState('unsubscribed');
  const [stats, setStats] = useState({ orders: 0, spent: 0, lastOrder: null });

  const [info, setInfo] = useState({ name: '', email: '' });
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoChanged, setInfoChanged] = useState(false);

  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [savingPw, setSavingPw] = useState(false);
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });

  const [savingNews, setSavingNews] = useState(false);

  /* password strength */
  const pwStrength = useMemo(() => {
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

  /* initials avatar */
  const initials = useMemo(() => {
    const name = profile?.name || info.name || '';
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase();
  }, [profile, info.name]);

  /* load data */
  const loadProfile = useCallback(async () => {
    if (!backendUrl || !token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const base = backendUrl.replace(/\/+$/, '');
      const { data } = await axios.get(`${base}/api/user/me`, { headers: { token } });
      if (data.success) {
        setProfile(data.user);
        setNewsletterStatus(data.newsletterStatus || 'unsubscribed');
        setInfo({ name: data.user.name || '', email: data.user.email || '' });
      } else toast.error(data.message || 'Unable to load profile.');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Unable to load profile.');
    } finally {
      setLoading(false);
    }
  }, [backendUrl, token]);

  const loadOrderStats = useCallback(async () => {
    if (!backendUrl || !token) return;
    try {
      const base = backendUrl.replace(/\/+$/, '');
      const { data } = await axios.post(`${base}/api/order/userorders`, {}, { headers: { token } });
      if (data.success) {
        const orders = data.orders || [];
        const spent = orders.reduce((s, o) => s + (o.amount || 0), 0);
        const lastOrder = orders.reduce((latest, o) => {
          const d = new Date(o.date);
          return !latest || d > latest ? d : latest;
        }, null);
        setStats({ orders: orders.length, spent, lastOrder });
      }
    } catch {
      /* silent */
    }
  }, [backendUrl, token]);

  useEffect(() => {
    loadProfile();
    loadOrderStats();
  }, [loadProfile, loadOrderStats]);

  /* track unsaved changes */
  useEffect(() => {
    if (!profile) return;
    setInfoChanged(
      info.name.trim() !== (profile.name || '') || info.email.trim() !== (profile.email || ''),
    );
  }, [info, profile]);

  /* handlers */
  const handleSaveInfo = async (e) => {
    e.preventDefault();
    if (!info.name.trim()) return toast.error('Name is required.');
    if (!emailRegex.test(info.email.trim())) return toast.error('Enter a valid email.');
    if (!backendUrl) return toast.error('Backend URL is not configured.');
    try {
      setSavingInfo(true);
      const base = backendUrl.replace(/\/+$/, '');
      const { data } = await axios.patch(
        `${base}/api/user/me`,
        { name: info.name.trim(), email: info.email.trim() },
        { headers: { token } },
      );
      if (data.success) {
        toast.success('Profile updated.');
        setProfile((p) => ({ ...p, name: data.user.name, email: data.user.email }));
      } else toast.error(data.message || 'Unable to update profile.');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Unable to update profile.');
    } finally {
      setSavingInfo(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!pw.current || !pw.next || !pw.confirm) return toast.error('Fill all password fields.');
    if (pw.next.length < 8) return toast.error('Password must be at least 8 characters.');
    if (pw.next !== pw.confirm) return toast.error('Passwords do not match.');
    if (!backendUrl) return toast.error('Backend URL is not configured.');
    try {
      setSavingPw(true);
      const base = backendUrl.replace(/\/+$/, '');
      const { data } = await axios.post(
        `${base}/api/user/change-password`,
        { currentPassword: pw.current, newPassword: pw.next },
        { headers: { token } },
      );
      if (data.success) {
        toast.success('Password updated.');
        setPw({ current: '', next: '', confirm: '' });
      } else toast.error(data.message || 'Unable to update password.');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Unable to update password.');
    } finally {
      setSavingPw(false);
    }
  };

  const handleNewsletterToggle = async () => {
    if (!backendUrl) return toast.error('Backend URL is not configured.');
    const email = info.email.trim();
    if (!emailRegex.test(email)) return toast.error('Valid email required.');
    try {
      setSavingNews(true);
      const base = backendUrl.replace(/\/+$/, '');
      const endpoint =
        newsletterStatus === 'subscribed'
          ? '/api/newsletter/unsubscribe'
          : '/api/newsletter/subscribe';
      const { data } = await axios.post(`${base}${endpoint}`, { email });
      if (data.success) {
        const next = newsletterStatus === 'subscribed' ? 'unsubscribed' : 'subscribed';
        setNewsletterStatus(next);
        toast.success(data.message || (next === 'subscribed' ? 'Subscribed.' : 'Unsubscribed.'));
      } else toast.error(data.message || 'Unable to update preference.');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Unable to update preference.');
    } finally {
      setSavingNews(false);
    }
  };

  const fmtDate = (d) =>
    d
      ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      : '—';

  const fmtCurrency = (n) => (n ? `₹${n.toLocaleString('en-IN')}` : '—');

  // Render
  return (
    <div className="border-t border-gray-100 dark:border-gray-800 pt-12 pb-20 px-1 sm:px-0">
      <div className="text-2xl mb-10">
        <Title text1={'MY'} text2={'PROFILE'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[320px_1fr] gap-6">
        {/* LEFT COLUMN */}
        <div className="space-y-5">
          {/* Account summary */}
          <Card className="h-fit">
            <SectionLabel
              icon={
                <ProfileIcon4 className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
              }
              text="Account"
            />

            <div className="flex items-center gap-4">
              {loading ? (
                <>
                  <Skeleton className="w-14 h-14 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="w-14 h-14 rounded-2xl flex-shrink-0
                    bg-gradient-to-br from-gray-200 to-gray-300
                    dark:from-gray-700 dark:to-gray-600
                    flex items-center justify-center select-none
                    text-base font-bold tracking-wider
                    text-gray-700 dark:text-gray-100
                    ring-2 ring-white dark:ring-gray-900"
                  >
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-gray-900 dark:text-white truncate">
                      {profile?.name || 'Your Name'}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
                      {profile?.email || 'you@example.com'}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {loading ? (
                <>
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                </>
              ) : (
                [
                  { label: 'Orders', value: stats.orders || '0' },
                  { label: 'Spent', value: fmtCurrency(stats.spent) },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="text-center py-3.5
                      border border-gray-100 dark:border-gray-800 rounded-xl
                      hover:border-gray-300 dark:hover:border-gray-600
                      transition-colors duration-150"
                  >
                    <p className="text-lg font-semibold text-gray-900 dark:text-white leading-none">
                      {value}
                    </p>
                    <p
                      className="text-[10px] tracking-widest uppercase
                      text-gray-400 dark:text-gray-500 mt-1.5"
                    >
                      {label}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Dates */}
            <div className="mt-4 space-y-1.5">
              {loading ? (
                <Skeleton className="h-3 w-44" />
              ) : (
                <>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    <span className="font-medium text-gray-500 dark:text-gray-400">
                      Member since
                    </span>
                    {' · '}
                    {fmtDate(profile?.createdAt)}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    <span className="font-medium text-gray-500 dark:text-gray-400">Last order</span>
                    {' · '}
                    {fmtDate(stats.lastOrder)}
                  </p>
                </>
              )}
            </div>

            <button
              onClick={() => navigate('/orders')}
              className="mt-6 w-full flex items-center justify-center gap-2
                border border-gray-200 dark:border-gray-700 rounded-xl
                text-xs tracking-widest uppercase py-3
                text-gray-600 dark:text-gray-400
                hover:text-gray-900 dark:hover:text-white
                hover:border-gray-400 dark:hover:border-gray-500
                hover:bg-gray-50 dark:hover:bg-gray-800/50
                transition-all duration-150"
            >
              <ProfileIcon5 className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
              View Orders
            </button>
          </Card>

          {/* Newsletter toggle */}
          <Card>
            <SectionLabel
              icon={
                <ProfileIcon6 className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
              }
              text="Newsletter"
            />

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white leading-snug">
                  {newsletterStatus === 'subscribed' ? "You're subscribed" : 'Not subscribed'}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 leading-relaxed">
                  Promotions, launches & members-only deals.
                </p>
              </div>

              {/* Toggle pill */}
              <button
                onClick={handleNewsletterToggle}
                disabled={savingNews || loading}
                aria-label="Toggle newsletter"
                className={`relative flex-shrink-0 w-12 h-6 rounded-full
                  transition-colors duration-300
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${
                    newsletterStatus === 'subscribed'
                      ? 'bg-gray-900 dark:bg-white'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full
                  bg-white dark:bg-gray-900 shadow-sm
                  transition-transform duration-300
                  ${newsletterStatus === 'subscribed' ? 'translate-x-6' : 'translate-x-0'}`}
                />
              </button>
            </div>

            <p className="mt-3 text-[11px] text-gray-400 dark:text-gray-600">
              {newsletterStatus === 'subscribed'
                ? 'Toggle off to unsubscribe anytime.'
                : 'Toggle on to receive updates.'}
            </p>
          </Card>
        </div>

        {/* RIGHT COLUMN — forms */}
        <div className="space-y-6">
          {/* Personal info */}
          <Card>
            <SectionLabel
              icon={
                <ProfileIcon7 className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
              }
              text="Personal Information"
            />

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
                <Skeleton className="h-10 w-32 md:col-span-2 ml-auto" />
              </div>
            ) : (
              <form onSubmit={handleSaveInfo} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Full Name">
                  <input
                    value={info.name}
                    onChange={(e) => setInfo((s) => ({ ...s, name: e.target.value }))}
                    placeholder="Your name"
                    className={inputCls}
                  />
                </Field>

                <Field label="Email Address">
                  <input
                    type="email"
                    value={info.email}
                    onChange={(e) => setInfo((s) => ({ ...s, email: e.target.value }))}
                    placeholder="you@example.com"
                    className={inputCls}
                  />
                </Field>

                <div className="md:col-span-2 flex items-center justify-between gap-4">
                  {/* Unsaved indicator */}
                  {infoChanged ? (
                    <span className="flex items-center gap-1.5 text-xs text-amber-500 dark:text-amber-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                      Unsaved changes
                    </span>
                  ) : (
                    <span />
                  )}
                  <PrimaryBtn
                    type="submit"
                    loading={savingInfo}
                    label="Save Changes"
                    loadingLabel="Saving..."
                    disabled={!infoChanged}
                  />
                </div>
              </form>
            )}
          </Card>

          {/* Security */}
          <Card>
            <SectionLabel
              icon={
                <ProfileIcon8 className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
              }
              text="Security"
            />

            <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { key: 'current', label: 'Current Password' },
                { key: 'next', label: 'New Password' },
                { key: 'confirm', label: 'Confirm Password' },
              ].map(({ key, label }) => (
                <Field key={key} label={label}>
                  <div className="relative">
                    <input
                      type={showPw[key] ? 'text' : 'password'}
                      value={pw[key]}
                      onChange={(e) => setPw((s) => ({ ...s, [key]: e.target.value }))}
                      placeholder="••••••••"
                      className={`${inputCls} pr-10`}
                    />
                    <EyeBtn
                      show={showPw[key]}
                      onToggle={() => setShowPw((s) => ({ ...s, [key]: !s[key] }))}
                    />
                  </div>
                </Field>
              ))}

              {/* Strength meter — only while typing new password */}
              {pw.next && (
                <div className="md:col-span-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span
                      className="text-[10px] tracking-widest uppercase font-semibold
                      text-gray-400 dark:text-gray-500"
                    >
                      Strength
                    </span>
                    <span
                      className={`text-[10px] font-bold tracking-wide uppercase ${pwStrength.textColor}`}
                    >
                      {pwStrength.label}
                    </span>
                  </div>

                  {/* Bar */}
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${pwStrength.color}`}
                      style={{ width: `${(pwStrength.score / 5) * 100}%` }}
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

              <div className="md:col-span-3 flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-xs text-gray-400 dark:text-gray-500
                    hover:text-gray-900 dark:hover:text-white
                    underline underline-offset-2 transition-colors"
                >
                  Forgot password?
                </button>
                <PrimaryBtn
                  type="submit"
                  loading={savingPw}
                  label="Update Password"
                  loadingLabel="Updating..."
                  disabled={!pw.current || !pw.next || !pw.confirm}
                />
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
