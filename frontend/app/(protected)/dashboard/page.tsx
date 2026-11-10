export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Tableau de bord</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">Dossiers suivis</p>
          <p className="text-3xl font-bold text-slate-800">3</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">Actions ouvertes</p>
          <p className="text-3xl font-bold text-slate-800">0</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">Criticité élevée</p>
          <p className="text-3xl font-bold text-slate-800">1</p>
        </div>
      </div>
    </div>
  );
}