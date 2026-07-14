export function PrivacyPolicy() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-600">
          Privacy Policy
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          How Trackora handles your information
        </h1>
        <p className="text-base leading-7 text-slate-600">
          Trackora is a web platform for cleaning companies that helps manage
          employees, working hours, salary calculations, and professional
          reports. To provide this service, we collect and process the
          information needed to run the product securely, reliably, and in a way
          that supports daily operations.
        </p>
      </div>

      <div className="space-y-4 rounded-2xl bg-slate-50 p-5">
        <h2 className="text-xl font-semibold text-slate-900">
          Information we collect
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
          <li>
            Account details such as your name, email address, and authentication
            information.
          </li>
          <li>
            Business and operational data you enter, including employee
            profiles, attendance records, hours worked, wage information, and
            report content.
          </li>
          <li>
            Technical and usage data such as browser information, device
            details, IP address, activity logs, and cookie preferences.
          </li>
        </ul>
      </div>

      <div className="space-y-4 rounded-2xl bg-slate-50 p-5">
        <h2 className="text-xl font-semibold text-slate-900">How we use it</h2>
        <p className="text-sm leading-6 text-slate-600">
          We use your information to create and maintain your account, manage
          employee records, track working hours, calculate salaries, generate
          reports, support login and security, and improve the overall quality
          of the service. We do not sell personal data to third parties for
          marketing purposes.
        </p>
      </div>

      <div className="space-y-4 rounded-2xl bg-slate-50 p-5">
        <h2 className="text-xl font-semibold text-slate-900">
          Data storage, retention, and sharing
        </h2>
        <p className="text-sm leading-6 text-slate-600">
          Your data is stored in secure cloud infrastructure and is only shared
          with trusted service providers that help us operate the platform, such
          as authentication, hosting, and analytics services. We retain personal
          data only for as long as necessary to provide the service, fulfill
          legal obligations, and support the features offered in the MVP.
        </p>
      </div>

      <div className="space-y-4 rounded-2xl bg-slate-50 p-5">
        <h2 className="text-xl font-semibold text-slate-900">Your rights</h2>
        <p className="text-sm leading-6 text-slate-600">
          You may request access to the personal information we hold about you,
          ask for corrections, or request deletion where applicable. You can
          also manage your cookie preferences and control how your data is used
          in the product experience.
        </p>
      </div>

      <div className="space-y-4 rounded-2xl bg-slate-50 p-5">
        <h2 className="text-xl font-semibold text-slate-900">Security</h2>
        <p className="text-sm leading-6 text-slate-600">
          We take reasonable technical and organizational measures to protect
          your data from unauthorized access, loss, or misuse. However, no
          internet-based service can be guaranteed to be 100% secure, so users
          should also protect their account credentials.
        </p>
      </div>
    </div>
  );
}
