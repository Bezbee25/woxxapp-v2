'use client';

import React, { useState, useEffect } from 'react';
import { Store, X, Key, ShieldCheck, UserCheck, Shuffle, Sparkles, Check } from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { REAL_BOUTIQUE_MODULES } from './EditModulesModal';

interface SalesRep {
  id: string;
  email: string;
  fullName?: string;
}

interface CreateTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateTenantModal({ isOpen, onClose, onSuccess }: CreateTenantModalProps) {
  const [commerceName, setCommerceName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [managerPassword, setManagerPassword] = useState('');
  const [assignedSalesRepId, setAssignedSalesRepId] = useState('');
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const [selectedModules, setSelectedModules] = useState<string[]>(
    REAL_BOUTIQUE_MODULES.map((m) => m.code)
  );
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchSalesReps();
      generateRandomPasswords();
    }
  }, [isOpen]);

  const fetchSalesReps = async () => {
    try {
      const data = await apiRequest<SalesRep[]>('/admin/users?role=CHARGE_DAFFAIRE');
      setSalesReps(data || []);
    } catch {
      // Ignorer
    }
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*';
    let pwd = '';
    for (let i = 0; i < 14; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pwd;
  };

  const generateRandomPasswords = () => {
    setAdminPassword(generateRandomPassword());
    setManagerPassword(generateRandomPassword());
  };

  const toggleModule = (code: string) => {
    if (code === 'site_web') return;
    if (selectedModules.includes(code)) {
      setSelectedModules(selectedModules.filter((m) => m !== code));
    } else {
      setSelectedModules([...selectedModules, code]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commerceName || !subdomain || !email) {
      setError('Veuillez renseigner le nom, le sous-domaine et l’email.');
      return;
    }

    setCreating(true);
    setError(null);
    try {
      await apiRequest('/admin/tenants', {
        method: 'POST',
        body: JSON.stringify({
          commerceName,
          subdomain,
          email,
          fullName,
          adminPassword,
          managerPassword,
          assignedSalesRepId: assignedSalesRepId || undefined,
          modules: selectedModules,
        }),
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création de la boutique.');
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border-4 border-slate-950 shadow-brutal w-full max-w-2xl max-h-[90vh] flex flex-col my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-slate-900 bg-slate-50 rounded-t-[20px]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 border-2 border-slate-900 flex items-center justify-center text-white font-black shadow-brutal-xs">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-950">Créer un Site & Déployer la Boutique</h3>
              <p className="text-xs text-slate-600 font-medium">Provisioning Kubernetes avec configuration des accès</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 text-slate-700 rounded-xl transition border-2 border-transparent hover:border-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 border-2 border-red-500 rounded-xl text-xs font-bold">
              {error}
            </div>
          )}

          {/* Section 1 : Informations Boutique */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">1. Informations Générales</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nom du commerce *</label>
                <input
                  type="text"
                  value={commerceName}
                  onChange={(e) => {
                    setCommerceName(e.target.value);
                    if (!subdomain) {
                      setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30));
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-medium focus:outline-none focus:bg-white"
                  placeholder="Ex: Maison Charlie"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sous-domaine K8s *</label>
                <input
                  type="text"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-medium focus:outline-none focus:bg-white"
                  placeholder="Ex: charlie"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Commerçant (Gérant) *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-medium focus:outline-none focus:bg-white"
                  placeholder="gerant@charlie.fr"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nom du Commerçant</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-medium focus:outline-none focus:bg-white"
                  placeholder="Charlie Dupont"
                />
              </div>
            </div>
          </div>

          {/* Section 2 : Mots de Passe & Accès */}
          <div className="space-y-3 p-4 bg-amber-50/50 border-2 border-amber-300 rounded-2xl">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase text-amber-900 tracking-wider flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" /> 2. Mots de Passe & Sécurité
              </h4>
              <button
                type="button"
                onClick={generateRandomPasswords}
                className="text-[11px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 underline"
              >
                <Shuffle className="w-3 h-3" /> Régénérer aléatoirement
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Mot de passe Admin Boutique (Super-Admin)
                </label>
                <input
                  type="text"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border-2 border-slate-900 rounded-xl text-xs font-mono font-bold text-blue-700 focus:outline-none"
                  placeholder="AdminPassword2026!"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Mot de passe Gérant (Commerçant)
                </label>
                <input
                  type="text"
                  value={managerPassword}
                  onChange={(e) => setManagerPassword(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border-2 border-slate-900 rounded-xl text-xs font-mono font-bold text-emerald-700 focus:outline-none"
                  placeholder="ManagerPassword2026!"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3 : Affectation Chargé d'Affaires */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" /> 3. Chargé d'Affaires Assigné
            </h4>
            <select
              value={assignedSalesRepId}
              onChange={(e) => setAssignedSalesRepId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:bg-white"
            >
              <option value="">-- Aucun (Assignation libre) --</option>
              {salesReps.map((rep) => (
                <option key={rep.id} value={rep.id}>
                  {rep.fullName || rep.email} ({rep.email})
                </option>
              ))}
            </select>
          </div>

          {/* Section 4 : Modules Inclus */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> 4. Modules Inclus au Démarrage ({selectedModules.length}/9)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {REAL_BOUTIQUE_MODULES.map((mod) => {
                const isSelected = selectedModules.includes(mod.code);
                const isSiteWeb = mod.code === 'site_web';
                return (
                  <div
                    key={mod.code}
                    onClick={() => toggleModule(mod.code)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border-2 cursor-pointer transition ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-600 text-blue-950 font-bold'
                        : 'bg-slate-50 border-slate-300 text-slate-600 opacity-60'
                    } ${isSiteWeb ? 'cursor-not-allowed' : ''}`}
                  >
                    <span className="text-xs">{mod.label}</span>
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-400 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t-2 border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-800 transition shadow-brutal-xs"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={creating}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white border-2 border-slate-900 rounded-xl text-xs font-black transition shadow-brutal flex items-center gap-2 disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              {creating ? 'Déploiement en cours...' : 'Créer & Déployer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
