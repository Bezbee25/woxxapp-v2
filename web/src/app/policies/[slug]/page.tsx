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
      <div className="min-h-screen bg-[#07090E] text-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#07090E] text-white flex flex-col items-center justify-center p-6 text-center">
        <Shield className="w-16 h-16 text-rose-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Document introuvable</h1>
        <p className="text-slate-400 mb-6">Le document demandé n'existe pas ou n'est pas encore publié.</p>
        <Link
          href="/"
          className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl font-semibold border border-slate-700 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-[#0B0F19]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 text-sm font-medium transition"
          >
            <ArrowLeft className="w-4 h-4" /> Retour à WoxxApp
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Conformité Légale & RGPD</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12">
        <div className="bg-[#0D121F] border border-slate-800 rounded-2xl p-8 md:p-12 shadow-xl">
          <div className="flex items-center gap-3 text-cyan-400 mb-3">
            <FileText className="w-6 h-6" />
            <span className="text-xs uppercase tracking-wider font-bold">Document Officiel</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
            {data.title}
          </h1>

          <div className="flex items-center gap-2 text-xs text-slate-400 pb-6 mb-8 border-b border-slate-800">
            <Calendar className="w-4 h-4" />
            <span>Dernière mise à jour : {new Date(data.updatedAt).toLocaleDateString('fr-FR')}</span>
          </div>

          <div className="space-y-6 text-slate-300 leading-relaxed font-normal whitespace-pre-line text-sm md:text-base">
            {data.content}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Hébergé en Union Européenne sur Cluster K8s certifié</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <Link href="/policies/cgu" className="hover:text-cyan-400">CGU</Link>
              <Link href="/policies/cgv" className="hover:text-cyan-400">CGV</Link>
              <Link href="/policies/legal" className="hover:text-cyan-400">Mentions Légales</Link>
              <Link href="/policies/gdpr" className="hover:text-cyan-400">RGPD</Link>
              <Link href="/policies/cookies" className="hover:text-cyan-400">Cookies</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
