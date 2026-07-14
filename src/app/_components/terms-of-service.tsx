export function TermsOfService() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-600">
          Terms of Service
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          The rules for using Trackora
        </h1>
        <p className="text-base leading-7 text-slate-600">
          Trackora is a service for cleaning companies to manage employees,
          track work, calculate wages, and generate reports. By using the
          platform, you agree to use it responsibly and keep your account
          information accurate, current, and appropriate for the purpose of the
          service.
        </p>
      </div>

      <div className="space-y-4 rounded-2xl bg-slate-50 p-5">
        <h2 className="text-xl font-semibold text-slate-900">
          Your responsibilities
        </h2>
        <p className="text-sm leading-6 text-slate-600">
          You are responsible for the accuracy of the data you enter, for
          protecting your account credentials, and for complying with all
          applicable laws, labor rules, and internal company policies when using
          the service.
        </p>
      </div>

      <div className="space-y-4 rounded-2xl bg-slate-50 p-5">
        <h2 className="text-xl font-semibold text-slate-900">Permitted use</h2>
        <p className="text-sm leading-6 text-slate-600">
          You may use Trackora to manage legitimate business operations related
          to staffing, attendance, payroll, and reporting. You may not use the
          service for unlawful activity, unauthorized data sharing, or any
          behavior that disrupts the platform or harms other users.
        </p>
      </div>

      <div className="space-y-4 rounded-2xl bg-slate-50 p-5">
        <h2 className="text-xl font-semibold text-slate-900">
          Service availability
        </h2>
        <p className="text-sm leading-6 text-slate-600">
          Trackora is provided as a web service and may be updated, improved, or
          temporarily unavailable from time to time. We reserve the right to
          modify features, introduce new functionality, or discontinue parts of
          the service when necessary to maintain performance, security, or
          product quality.
        </p>
      </div>

      <div className="space-y-4 rounded-2xl bg-slate-50 p-5">
        <h2 className="text-xl font-semibold text-slate-900">
          Account and data integrity
        </h2>
        <p className="text-sm leading-6 text-slate-600">
          The service is intended to support business administration and record
          keeping. Users should ensure that entries are complete and accurate,
          since reports and calculated values depend on the information provided
          through the platform.
        </p>
      </div>
    </div>
  );
}
