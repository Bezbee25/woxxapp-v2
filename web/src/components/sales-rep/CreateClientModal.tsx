'use client';

import React, { useState } from 'react';
import { X, UserPlus, Mail, User, Lock, Store, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface CreateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateClientModal({ isOpen, onClose, onSuccess }: CreateClientModalProps) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [commerceName, setCommerceName] = useState('');
  const [subdomain, setSubdomain] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await apiRequest('/sales-rep/clients', {
        method: 'POST',
        body: JSON.stringify({
          email,
          fullName,
          password: password || undefined,
          commerceName: commerceName || undefined,
          subdomain: subdomain || undefined,
        }),
      });

      onSuccess();
      onClose();
      setEmail('');
      setFullName('');
      setPassword('');
      setCommerceName('');
      setSubdomain('');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du client');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white border-2 border-slate-900 rounded-3xl shadow-brutal-lg p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-xl border-2 border-slate-900 bg-slate-100 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center transition-colors shadow-brutal-xs"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-400 border-2 border-slate-900 shadow-brutal-xs flex items-center justify-center text-2xl font-black">
            👤
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-950">Ajouter un Nouveau Client</h2>
            <p className="text-xs text-slate-500 font-bold">
              Inscrivez un commerçant et rattachez-le directement à votre portefeuille commercial.
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border-2 border-rose-600 text-rose-800 text-xs font-bold mb-4 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-900 mb-1">Nom ou Raison Sociale *</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Ex: Jean Martin / Garage Martin"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:shadow-brutal-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-900 mb-1">Adresse Email *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="client@commerce.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:shadow-brutal-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-900 mb-1">Mot de Passe Initial</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="Laisser vide pour générer un mot de passe par défaut"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:shadow-brutal-xs"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-black text-slate-900 mb-1">Nom de Boutique</label>
              <input
                type="text"
                placeholder="Ex: Garage Martin"
                value={commerceName}
                onChange={(e) => {
                  setCommerceName(e.target.value);
                  setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                }}
                className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 mb-1">Sous-domaine</label>
              <input
                type="text"
                placeholder="garage-martin"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-3 border-t-2 border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border-2 border-slate-900 text-xs font-black bg-white hover:bg-slate-100 text-slate-800 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl border-2 border-slate-900 bg-blue-500 hover:bg-blue-400 text-slate-950 text-xs font-black shadow-brutal hover:shadow-brutal-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <span>Enregistrer le client</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
