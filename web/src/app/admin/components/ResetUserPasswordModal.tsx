'use client';

import React, { useState } from 'react';
import { X, KeyRound, RefreshCw, Copy, Check, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface ResetUserPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: {
    id: string;
    email: string;
    fullName?: string;
  } | null;
}

export function ResetUserPasswordModal({
  isOpen,
  onClose,
  onSuccess,
  user,
}: ResetUserPasswordModalProps) {
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !user) return null;

  const generateRandomPassword = () => {
    const chars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*';
    let pwd = '';
    for (let i = 0; i < 12; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(pwd);
    setShowPassword(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(newPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      alert('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    setLoading(true);
    try {
      await apiRequest(`/admin/users/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ password: newPassword }),
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setNewPassword('');
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la réinitialisation du mot de passe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white border-2 border-slate-900 rounded-3xl shadow-brutal-lg p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-xl border-2 border-slate-900 bg-slate-100 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center transition-colors shadow-brutal-xs"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 border-2 border-slate-900 shadow-brutal-xs flex items-center justify-center text-2xl font-black">
            🔑
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-950">Réinitialiser le mot de passe</h2>
            <p className="text-xs text-slate-500 font-bold truncate max-w-[240px]">
              {user.fullName || user.email}
            </p>
          </div>
        </div>

        {success ? (
          <div className="bg-emerald-50 border-2 border-emerald-900 p-6 rounded-2xl text-center space-y-2 shadow-brutal-xs">
            <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto" />
            <p className="text-sm font-black text-emerald-950">Mot de passe réinitialisé !</p>
            <p className="text-xs text-emerald-700">L'utilisateur peut désormais se connecter avec ce mot de passe.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-extrabold uppercase text-slate-600">
                  Nouveau mot de passe
                </label>
                <button
                  type="button"
                  onClick={generateRandomPassword}
                  className="text-[10px] font-black text-purple-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Générer fort
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 caractères"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl font-mono text-xs font-bold text-slate-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition pr-20"
                />
                <div className="absolute right-2 top-2 flex items-center gap-1">
                  {newPassword && (
                    <button
                      type="button"
                      onClick={handleCopy}
                      title="Copier le mot de passe"
                      className="p-1 rounded text-slate-400 hover:text-slate-700"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 rounded text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading || !newPassword}
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 border-2 border-slate-900 rounded-xl font-black text-xs shadow-brutal-xs hover:shadow-brutal transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                <span>Enregistrer</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
