'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Image as ImageIcon,
  Building,
  Phone,
  MessageSquare,
  Calendar,
  Save,
  Check,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Upload,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface SalesRepProfile {
  id: string;
  email: string;
  fullName: string | null;
  companyName: string | null;
  avatarUrl: string | null;
  phoneNumber: string | null;
  whatsappNumber: string | null;
  calendlyUrl: string | null;
  bio: string | null;
}

export function SalesRepProfileTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [form, setForm] = useState<SalesRepProfile>({
    id: '',
    email: '',
    fullName: '',
    companyName: '',
    avatarUrl: '',
    phoneNumber: '',
    whatsappNumber: '',
    calendlyUrl: '',
    bio: '',
  });

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<SalesRepProfile>('/sales-rep/profile');
      if (data) {
        setForm({
          id: data.id || '',
          email: data.email || '',
          fullName: data.fullName || '',
          companyName: data.companyName || '',
          avatarUrl: data.avatarUrl || '',
          phoneNumber: data.phoneNumber || '',
          whatsappNumber: data.whatsappNumber || '',
          calendlyUrl: data.calendlyUrl || '',
          bio: data.bio || '',
        });
      }
    } catch (err: any) {
      console.error('Erreur chargement profil commercial:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('L’image est trop volumineuse (maximum 2 Mo).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, avatarUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');

    try {
      const res = await apiRequest<any>('/sales-rep/profile', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      setSuccessMessage(res.message || 'Profil mis à jour avec succès !');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la sauvegarde du profil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border-2 border-slate-900 rounded-3xl p-12 text-center shadow-brutal">
        <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-3" />
        <p className="text-xs font-black text-slate-700">Chargement de votre profil commercial...</p>
      </div>
    );
  }

  const cleanWhatsapp = form.whatsappNumber?.replace(/[^0-9]/g, '');

  return (
    <div className="space-y-6 max-w-5xl">
      {/* BANNIÈRE D'EN-TÊTE */}
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-brutal flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-950 flex items-center gap-2.5">
            <User className="w-6 h-6 text-purple-600" /> Profil & Identité Commerciale
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Personnalisez votre logo, votre agence et vos canaux de contact direct pour vos clients.
          </p>
        </div>

        {successMessage && (
          <div className="px-4 py-2 bg-emerald-50 border-2 border-emerald-900 rounded-xl text-xs font-black text-emerald-900 flex items-center gap-2 shadow-brutal-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* COLONNE GAUCHE & MILIEU : FORMULAIRE */}
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-6">
          {/* SECTION LOGO & VISUEL */}
          <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-brutal space-y-4">
            <h3 className="text-sm font-black text-slate-950 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-purple-600" /> Logo ou Photo Commerciale
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              Ce visuel apparaîtra sur les devis interactifs et l'espace client dédié.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-5 pt-2">
              <div className="w-24 h-24 rounded-2xl bg-amber-100 border-2 border-slate-900 shadow-brutal-xs overflow-hidden flex items-center justify-center shrink-0 relative group">
                {form.avatarUrl ? (
                  <img
                    src={form.avatarUrl}
                    alt="Logo Chargé d'Affaires"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-3xl font-black text-amber-900">
                    {(form.fullName || form.email || 'CA').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="space-y-2 flex-1 w-full">
                <label className="block text-[11px] font-extrabold uppercase text-slate-600">
                  Téléverser un logo / photo
                </label>
                <div className="flex items-center gap-3">
                  <label className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-950 border-2 border-slate-900 rounded-xl text-xs font-black shadow-brutal-xs flex items-center gap-2 cursor-pointer transition">
                    <Upload className="w-4 h-4" />
                    <span>Choisir une image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {form.avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, avatarUrl: '' })}
                      className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-900 border-2 border-slate-900 rounded-xl text-xs font-bold transition"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Ou collez l'URL d'une image (https://...)"
                  value={form.avatarUrl?.startsWith('data:') ? '' : form.avatarUrl || ''}
                  onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-medium text-slate-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition mt-1"
                />
              </div>
            </div>
          </div>

          {/* SECTION IDENTITÉ & CANAUX DIRECTS */}
          <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-brutal space-y-4">
            <h3 className="text-sm font-black text-slate-950 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" /> Identité & Coordonnées de Contact
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
                  Nom Complet
                </label>
                <input
                  type="text"
                  placeholder="Ex: Jean Dupont"
                  value={form.fullName || ''}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
                  Nom de l'Agence / Raison Sociale
                </label>
                <input
                  type="text"
                  placeholder="Ex: Studio Digital Ouest"
                  value={form.companyName || ''}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
                  Téléphone Direct
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="06 12 34 56 78"
                    value={form.phoneNumber || ''}
                    onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition pl-9"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
                  WhatsApp Commercial (Direct)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="+33612345678"
                    value={form.whatsappNumber || ''}
                    onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition pl-9"
                  />
                  <MessageSquare className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
                  Lien de Prise de RDV (Calendly, Google Meet, Cal.com)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://calendly.com/mon-agence/echange-30min"
                    value={form.calendlyUrl || ''}
                    onChange={(e) => setForm({ ...form, calendlyUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition pl-9"
                  />
                  <Calendar className="w-4 h-4 text-blue-500 absolute left-3 top-3" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
                  Message d'Accueil / Bio pour vos Clients
                </label>
                <textarea
                  rows={3}
                  placeholder="Conseiller e-commerce dédié à la réussite de votre projet Woxx. Disponible 6j/7 pour vous accompagner."
                  value={form.bio || ''}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-medium text-slate-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 border-2 border-slate-900 rounded-2xl font-black text-xs shadow-brutal-xs hover:shadow-brutal transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Enregistrement...' : 'Enregistrer mon profil'}</span>
            </button>
          </div>
        </form>

        {/* COLONNE DROITE : APERÇU EN DIRECT (CE QUE VOIT LE CLIENT) */}
        <div className="space-y-4">
          <div className="bg-amber-50 border-2 border-slate-900 rounded-3xl p-6 shadow-brutal space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-900 tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Aperçu Vue Client</span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium">
              Voici exactement la carte de contact présentée à vos clients sur leurs devis et leur espace commercial :
            </p>

            {/* CARTE VIRTUELLE CLIENT */}
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-brutal-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-200 border-2 border-slate-900 shadow-brutal-xs overflow-hidden flex items-center justify-center shrink-0">
                  {form.avatarUrl ? (
                    <img
                      src={form.avatarUrl}
                      alt={form.fullName || 'Commercial'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-black text-slate-900">
                      {(form.fullName || 'CA').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-black text-slate-950 truncate">
                    {form.fullName || 'Votre Conseiller Dédié'}
                  </h4>
                  <p className="text-[11px] text-purple-700 font-bold truncate">
                    {form.companyName || 'Chargé d’affaires Woxx'}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium truncate">{form.email}</p>
                </div>
              </div>

              {form.bio && (
                <p className="text-xs text-slate-700 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  "{form.bio}"
                </p>
              )}

              {/* BOUTONS D'ACTION DIRECTS */}
              <div className="space-y-2 pt-1">
                {form.phoneNumber && (
                  <a
                    href={`tel:${form.phoneNumber}`}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 font-black text-xs rounded-xl border-2 border-slate-900 shadow-brutal-xs transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Appeler ({form.phoneNumber})</span>
                  </a>
                )}

                {cleanWhatsapp && (
                  <a
                    href={`https://wa.me/${cleanWhatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-black text-xs rounded-xl border-2 border-slate-900 shadow-brutal-xs transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp Direct</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                )}

                {form.calendlyUrl && (
                  <a
                    href={form.calendlyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 font-black text-xs rounded-xl border-2 border-slate-900 shadow-brutal-xs transition"
                  >
                    <Calendar className="w-3.5 h-3.5 text-purple-600" />
                    <span>Prendre RDV en Visio</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
