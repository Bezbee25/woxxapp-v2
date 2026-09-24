'use client';

import React, { useState } from 'react';
import { Users, UserPlus, Store, FileText, PlusCircle, RefreshCw, Mail, ExternalLink, ShieldCheck } from 'lucide-react';

interface SalesRepClientsTabProps {
  clients: any[];
  loading: boolean;
  onRefresh: () => void;
  onOpenCreateClient: () => void;
  onOpenCreateQuote: (clientId?: string) => void;
}

export function SalesRepClientsTab({
  clients,
  loading,
  onRefresh,
  onOpenCreateClient,
  onOpenCreateQuote,
}: SalesRepClientsTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-brutal flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" /> Mon Portefeuille Clients ({clients.length})
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Commerçants et entreprises assignés à votre gestion commerciale.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCreateClient}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-400 text-slate-950 rounded-xl text-xs font-black border-2 border-slate-900 shadow-brutal-xs hover:shadow-brutal transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> Nouveau Client
          </button>
          <button
            onClick={onRefresh}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl border-2 border-slate-900 shadow-brutal-xs transition"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading && clients.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border-2 border-slate-900 shadow-brutal flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-xs font-black text-slate-800">Chargement de votre portefeuille clients...</p>
        </div>
      ) : clients.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border-2 border-slate-900 shadow-brutal text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-blue-100 border-2 border-slate-900 flex items-center justify-center mx-auto text-3xl">
            👥
          </div>
          <h3 className="text-xl font-black text-slate-900">Aucun client dans votre portefeuille</h3>
          <p className="text-xs text-slate-600 font-medium max-w-md mx-auto">
            Inscrivez vos premiers commerçants ou demandez à l'administrateur de vous assigner des comptes.
          </p>
          <button
            onClick={onOpenCreateClient}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-400 text-slate-950 rounded-xl text-xs font-black border-2 border-slate-900 shadow-brutal transition"
          >
            <UserPlus className="w-4 h-4" /> Ajouter mon premier client
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => {
            const tenants = client.tenants || [];
            const quotes = client.quotes || [];

            return (
              <div
                key={client.id}
                className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-brutal hover:shadow-brutal-lg transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-400 border-2 border-slate-900 shadow-brutal-xs flex items-center justify-center font-black text-base text-slate-950">
                      {(client.fullName || client.email).charAt(0).toUpperCase()}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
                      Client
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-950 leading-tight">
                    {client.fullName || 'Commerçant'}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mb-4">{client.email}</p>

                  {/* BOUTIQUES DU CLIENT */}
                  <div className="mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-black uppercase text-slate-500 block">
                      Boutique(s) ({tenants.length})
                    </span>
                    {tenants.length === 0 ? (
                      <p className="text-[11px] text-slate-400 font-medium italic">Pas encore de boutique</p>
                    ) : (
                      tenants.map((t: any) => (
                        <div key={t.id} className="flex items-center justify-between text-xs font-bold text-slate-900">
                          <span className="truncate">{t.commerceName}</span>
                          <a
                            href={`https://${t.subdomain}.woxxapp.de`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-mono text-[10px] flex items-center gap-1"
                          >
                            <span>{t.subdomain}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ))
                    )}
                  </div>

                  {/* DEVIS DU CLIENT */}
                  <div className="text-xs text-slate-600 font-bold mb-4">
                    <span>{quotes.length} devis établi{quotes.length > 1 ? 's' : ''}</span>
                  </div>
                </div>

                <div className="pt-3 border-t-2 border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenCreateQuote(client.id)}
                    className="w-full px-3 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl border-2 border-slate-900 shadow-brutal-xs hover:shadow-brutal transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Créer un Devis</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
