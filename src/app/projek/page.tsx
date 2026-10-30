import ProjectGrid from "@/components/ProjectGrid";

export default function ProjekPage() {
  return (
    <main className="min-h-screen pt-28 pb-24">
      <ProjectGrid
        pageSize={12}
        showViewAll={false}
        title="Semua Proyek"
        subtitle="Koleksi lengkap proyek yang saya kerjakan — dari ide awal hingga rilis final."
      />
    </main>
  );
}
