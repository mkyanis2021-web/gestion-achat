'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { fetchMe, logout, type AuthUser } from '@/lib/auth';

const NAV = [
  { href: '/dashboard', label: '📊 Tableau de bord' },
  { href: '/dossiers', label: '📁 Dossiers' },
];

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMe().then(setUser).catch(() => router.push('/login')).finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Chargement...</div>;

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-5 border-b border-slate-800">
          <h1 className="font-bold text-lg">📊 Gestion d'Achat</h1>
          <p className="text-xs text-slate-400 mt-1">Appro International</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}
              className={`block px-3 py-2 rounded-lg text-sm transition ${
                pathname === n.href ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800 text-sm">
          <p className="font-medium">{user?.prenom} {user?.nom}</p>
          <p className="text-xs text-slate-400">{user?.role_libelle}</p>
          <button onClick={logout} className="mt-3 w-full text-xs bg-slate-800 hover:bg-slate-700 py-2 rounded">
            Se déconnecter
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}