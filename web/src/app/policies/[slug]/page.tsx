'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, FileText, Lock, Calendar } from 'lucide-react';

interface PolicyData {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
}

export default function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = React.use(params);
  const [data, setData] = useState<PolicyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/cms/policies/${resolvedParams.slug}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Document introuvable');
        return res.json();
      })
      .then((resData) => {
        setData(resData);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] text-slate-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-slate-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] text-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white border-2 border-slate-900 rounded-3xl p-8 max-w-md w-full shadow-brutal space-y-4">
          <Shield className="w-16 h-16 text-rose-500 mx-auto" />
          <h1 className="text-2xl font-black">Document introuvable</h1>
          <p className="text-slate-600 text-xs font-medium">Le document demandé n'existe pas ou n'est pas encore publié.</p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border-2 border-slate-900 shadow-brutal-xs text-xs transition"
          >
            <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-slate-900 flex flex-col">
      {/* Header */}
      <header className="border-b-2 border-slate-900 bg-white sticky top-0 z-40 shadow-brutal-xs">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-900 hover:text-blue-600 text-xs font-black transition"
          >
            <ArrowLeft className="w-4 h-4" /> Retour à WoxxApp
          </Link>
          <div className="flex items-center gap-2 text-xs font-black text-slate-900 bg-amber-200 px-3 py-1 rounded-lg border border-slate-900">
            <Shield className="w-3.5 h-3.5" />
            <span>Conformité Légale & RGPD</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12">
        <div className="bg-white border-2 border-slate-900 rounded-3xl p-8 md:p-12 shadow-brutal space-y-6">
          <div className="flex items-center gap-2 text-blue-600">
            <FileText className="w-5 h-5" />
            <span className="text-xs uppercase tracking-wider font-black">Document Contractuel Officiel</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tight">
            {data.title}
          </h1>

          <div className="flex items-center gap-2 text-xs text-slate-500 pb-4 border-b-2 border-slate-100 font-bold">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Dernière mise à jour : {new Date(data.updatedAt).toLocaleDateString('fr-FR')}</span>
          </div>

          <div className="prose max-w-none text-slate-800 leading-relaxed font-medium whitespace-pre-line text-sm md:text-base">
            {data.content}
          </div>

          <div className="mt-12 pt-8 border-t-2 border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-600 font-bold">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Hébergé en Union Européenne sur Cluster K8s certifié</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-black text-slate-900">
              <Link href="/policies/cgu" className="hover:text-blue-600">CGU</Link>
              <Link href="/policies/cgv" className="hover:text-blue-600">CGV</Link>
              <Link href="/policies/legal" className="hover:text-blue-600">Mentions Légales</Link>
              <Link href="/policies/gdpr" className="hover:text-blue-600">RGPD</Link>
              <Link href="/policies/cookies" className="hover:text-blue-600">Cookies</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
