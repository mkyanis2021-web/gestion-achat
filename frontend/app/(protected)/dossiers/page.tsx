'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function DossiersPage() {
  const [dossiers, setDossiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dossiers')
      .then((res) => setDossiers(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-slate-500">Chargement des dossiers...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Liste des Dossiers d'achat</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-semibold text-slate-600 text-sm">Référence</th>
              <th className="p-4 font-semibold text-slate-600 text-sm">Équipement</th>
              <th className="p-4 font-semibold text-slate-600 text-sm">Fournisseur</th>
              <th className="p-4 font-semibold text-slate-600 text-sm">Statut</th>
              <th className="p-4 font-semibold text-slate-600 text-sm">Phase</th>
              <th className="p-4 font-semibold text-slate-600 text-sm">Criticité</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {dossiers.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50 transition">
                <td className="p-4 font-mono text-sm text-blue-600 font-medium">{d.reference}</td>
                <td className="p-4 text-sm text-slate-800">{d.equipement || '—'}</td>
                <td className="p-4 text-sm text-slate-800">{d.fournisseur?.nom || '—'}</td>
                <td className="p-4 text-sm">
                  <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                    {d.statut_saisi || '—'}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-600">{d.metrics?.phase || '—'}</td>
                <td className="p-4 text-sm">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                    d.metrics?.criticiteLabel === 'Critique' ? 'bg-red-100 text-red-700' :
                    d.metrics?.criticiteLabel === 'Terminé' ? 'bg-green-100 text-green-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {d.metrics?.criticiteLabel || '—'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}