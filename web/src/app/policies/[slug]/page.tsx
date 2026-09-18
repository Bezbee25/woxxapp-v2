import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Shield, FileText, Lock, Calendar } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { DEFAULT_LEGAL_POLICIES } from '@/lib/policies-data';

interface PolicyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PolicyPageProps) {
  const { slug } = await params;
  const cleanSlug = slug.toLowerCase().trim();
  const policy = DEFAULT_LEGAL_POLICIES[cleanSlug];
  return {
    title: policy ? `${policy.title} — WoxxApp` : 'Document Légal — WoxxApp',
    description: 'Document contractuel et juridique officiel de la plateforme WoxxApp V2.',
  };
}

export default async function PolicyPage({ params }: PolicyPageProps) {
  const { slug } = await params;
  const cleanSlug = slug.toLowerCase().trim();
  const defaultPolicy = DEFAULT_LEGAL_POLICIES[cleanSlug];

  let content = defaultPolicy?.content || '';
  let title = defaultPolicy?.title || 'Document Légal';
  let updatedAt = new Date().toISOString();

  try {
    const key = `policy_${cleanSlug}`;
    const setting = await prisma.systemSettings.findUnique({
      where: { key },
    });

    if (setting && setting.value && setting.value.length > 50) {
      content = setting.value;
      updatedAt = setting.updatedAt.toISOString();
    }
  } catch (err) {
    console.error('Erreur lecture systemSettings policy:', err);
  }

  if (!content) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b-2 border-slate-900 bg-white sticky top-0 z-40 shadow-brutal-xs">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-900 hover:text-blue-600 text-xs font-black transition"
          >
            <ArrowLeft className="w-4 h-4" /> Retour à WoxxApp
          </Link>
          <div className="flex items-center gap-2 text-xs font-black text-slate-900 bg-amber-300 px-3 py-1 rounded-xl border-2 border-slate-900 shadow-brutal-xs">
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
            {title}
          </h1>

          <div className="flex items-center gap-2 text-xs text-slate-500 pb-4 border-b-2 border-slate-100 font-bold">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Dernière mise à jour : {new Date(updatedAt).toLocaleDateString('fr-FR')}</span>
          </div>

          <div className="prose max-w-none text-slate-800 leading-relaxed font-medium whitespace-pre-line text-sm md:text-base">
            {content}
          </div>

          <div className="mt-12 pt-8 border-t-2 border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-600 font-bold">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Hébergé en Union Européenne sur Cluster K8s certifié</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-black text-slate-900">
              <Link href="/policies/cgu" className="hover:text-blue-600 underline decoration-2">CGU</Link>
              <Link href="/policies/cgv" className="hover:text-blue-600 underline decoration-2">CGV</Link>
              <Link href="/policies/legal" className="hover:text-blue-600 underline decoration-2">Mentions Légales</Link>
              <Link href="/policies/gdpr" className="hover:text-blue-600 underline decoration-2">RGPD</Link>
              <Link href="/policies/cookies" className="hover:text-blue-600 underline decoration-2">Cookies</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
