export function CookiePolicy() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-600">
          Cookie Policy
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          How Trackora uses cookies and similar technologies
        </h1>
        <p className="text-base leading-7 text-slate-600">
          Cookies help us keep Trackora fast, secure, and easy to use. They let
          us remember your language choice, preserve your consent settings, and
          help us understand how visitors interact with the service so we can
          improve the experience over time.
        </p>
      </div>

      <div className="space-y-4 rounded-2xl bg-slate-50 p-5">
        <h2 className="text-xl font-semibold text-slate-900">
          Types of cookies we use
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
          <li>
            Essential cookies keep the application secure, support sign-in, and
            preserve basic functionality.
          </li>
          <li>
            Preference cookies remember your selected language, consent choices,
            and other interface preferences.
          </li>
          <li>
            Analytics cookies help us understand how the site is used so we can
            improve performance, navigation, and usability.
          </li>
        </ul>
      </div>

      <div className="space-y-4 rounded-2xl bg-slate-50 p-5">
        <h2 className="text-xl font-semibold text-slate-900">
          Why they matter
        </h2>
        <p className="text-sm leading-6 text-slate-600">
          Without cookies, some parts of the experience would be less
          convenient, such as keeping your session active or remembering your
          preferences. They also help us measure whether users can successfully
          complete actions such as signing in, creating records, or generating
          reports.
        </p>
      </div>

      <div className="space-y-4 rounded-2xl bg-slate-50 p-5">
        <h2 className="text-xl font-semibold text-slate-900">
          Managing your choices
        </h2>
        <p className="text-sm leading-6 text-slate-600">
          You can accept or decline non-essential cookies through the consent
          banner shown on the site. You can also reset your choices later from
          the footer settings control if you change your mind. Disabling some
          cookies may affect the convenience of the experience, but the core
          product should remain usable.
        </p>
      </div>
    </div>
  );
}
