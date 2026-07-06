import type { Dictionary, LanguageCode } from "../../_i18n/translations";
import { EmployeeDetailsModal } from "../employee-details-modal";
import { EmployeesHero } from "../employees-hero";
import type { CabinetCopy, CabinetSection } from "../employees-section-copy";
import { NewEmployeeModal } from "../new-employee-modal";
import { SettingsPanel } from "../settings-panel";
import { CabinetMenu, EmployeesPanel, ReportPanel } from "../workspace-panels";
import type { useEmployeesWorkspace } from "./use-employees-workspace";

type Workspace = ReturnType<typeof useEmployeesWorkspace>;

type WorkspaceContentProps = {
  workspace: Workspace;
};

export function WorkspaceContent({ workspace }: WorkspaceContentProps) {
  const {
    activeSection,
    companyLogoDataUrl,
    companyName,
    copy,
    employees,
    errorMessage,
    isCreatingEmployee,
    isSaving,
    language,
    selectedEmployee,
    summaryStats,
    t,
    actions,
  } = workspace;

  return (
    <>
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <EmployeesHero
          companyName={companyName}
          companyLogoDataUrl={companyLogoDataUrl}
          employeesCount={summaryStats.employeesCount}
          currentWeekPending={summaryStats.currentWeekPending}
          currentWeekHours={summaryStats.currentWeekHours}
          currentMonthHours={summaryStats.currentMonthHours}
          currentMonthPending={summaryStats.currentMonthPending}
        />

        <WorkspaceActivePanel
          activeSection={activeSection}
          copy={copy}
          employees={employees}
          errorMessage={errorMessage}
          isSaving={isSaving}
          companyLogoDataUrl={companyLogoDataUrl}
          language={language}
          stats={summaryStats}
          t={t}
          onBack={() => actions.setActiveSection("home")}
          onChangePassword={actions.changePassword}
          onCloseWeek={actions.closeWeek}
          onCreateEmployee={() => actions.setIsCreatingEmployee(true)}
          onDownloadMonthlyReport={actions.downloadMonthlyReport}
          onNavigate={actions.setActiveSection}
          onSaveLogo={actions.saveCompanyLogo}
          onSelectEmployee={actions.selectEmployee}
          onSignOut={actions.signOut}
        />
      </section>

      <EmployeeDetailsModal
        employee={selectedEmployee}
        onClose={() => actions.selectEmployee(null)}
        onDeleteEmployee={actions.deleteEmployee}
        onDayHoursChange={actions.updateDayHours}
        onAddAdvance={actions.addAdvance}
        onRemoveAdvance={actions.removeAdvance}
      />

      <NewEmployeeModal
        isOpen={isCreatingEmployee}
        onClose={() => actions.setIsCreatingEmployee(false)}
        onSubmit={actions.createEmployee}
      />
    </>
  );
}

function WorkspaceActivePanel({
  activeSection,
  copy,
  employees,
  errorMessage,
  isSaving,
  companyLogoDataUrl,
  language,
  stats,
  t,
  onBack,
  onChangePassword,
  onCloseWeek,
  onCreateEmployee,
  onDownloadMonthlyReport,
  onNavigate,
  onSaveLogo,
  onSelectEmployee,
  onSignOut,
}: {
  activeSection: CabinetSection;
  copy: CabinetCopy;
  employees: Workspace["employees"];
  errorMessage: string;
  isSaving: boolean;
  companyLogoDataUrl: string | null;
  language: LanguageCode;
  stats: Workspace["summaryStats"];
  t: Dictionary;
  onBack: () => void;
  onChangePassword: Workspace["actions"]["changePassword"];
  onCloseWeek: () => void;
  onCreateEmployee: () => void;
  onDownloadMonthlyReport: () => void;
  onNavigate: (section: CabinetSection) => void;
  onSaveLogo: Workspace["actions"]["saveCompanyLogo"];
  onSelectEmployee: (employeeId: string) => void;
  onSignOut: () => void;
}) {
  if (activeSection === "home") {
    return (
      <CabinetMenu
        copy={copy}
        isSaving={isSaving}
        stats={stats}
        onNavigate={onNavigate}
        onSignOut={onSignOut}
      />
    );
  }

  if (activeSection === "employees") {
    return (
      <EmployeesPanel
        t={t}
        copy={copy}
        employees={employees}
        errorMessage={errorMessage}
        isSaving={isSaving}
        onBack={onBack}
        onCloseWeek={onCloseWeek}
        onCreateEmployee={onCreateEmployee}
        onSelectEmployee={onSelectEmployee}
      />
    );
  }

  if (activeSection === "weekly-report") {
    return (
      <ReportPanel
        title={copy.weeklyTitle}
        description={copy.weeklyDescription}
        copy={copy}
        stats={[
          [copy.employeesCount, String(stats.employeesCount)],
          [copy.activeWeekHours, `${stats.currentWeekHours} ${t.common.hoursShort}`],
          [copy.pendingWeekPay, `${stats.currentWeekPending} ${t.common.currency}`],
        ]}
        onBack={onBack}
      />
    );
  }

  if (activeSection === "monthly-report") {
    return (
      <ReportPanel
        title={copy.monthlyTitle}
        description={copy.monthlyDescription}
        copy={copy}
        stats={[
          [copy.employeesCount, String(stats.employeesCount)],
          [copy.activeMonthHours, `${stats.currentMonthHours} ${t.common.hoursShort}`],
          [copy.pendingMonthPay, `${stats.currentMonthPending} ${t.common.currency}`],
        ]}
        actionLabel={copy.downloadMonthlyPdf}
        onAction={onDownloadMonthlyReport}
        onBack={onBack}
      />
    );
  }

  return (
    <SettingsPanel
      copy={copy}
      companyLogoDataUrl={companyLogoDataUrl}
      isSaving={isSaving}
      language={language}
      onBack={onBack}
      onChangePassword={onChangePassword}
      onSaveLogo={onSaveLogo}
    />
  );
}
