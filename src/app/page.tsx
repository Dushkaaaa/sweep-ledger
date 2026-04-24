import { EmployeesSection } from "./_components/employees-section";
import { SiteFooter } from "./_components/site-footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#d8efff_0%,_#f4f9ff_45%,_#ffffff_100%)]">
      <EmployeesSection />
      <SiteFooter />
    </main>
  );
}
