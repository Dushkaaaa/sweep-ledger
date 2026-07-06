import { EmployeesSection } from "./_components/employees-section";
import { SiteFooter } from "./_components/site-footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_18%_0%,_rgba(34,211,238,0.34)_0%,_rgba(224,247,255,0.74)_32%,_transparent_62%),linear-gradient(135deg,_#effcff_0%,_#dff7fb_42%,_#eef8ff_100%)]">
      <EmployeesSection />
      <SiteFooter />
    </main>
  );
}
