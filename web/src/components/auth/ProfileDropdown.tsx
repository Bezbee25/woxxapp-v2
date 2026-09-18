'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';
import { User, LogOut, Shield, Briefcase, Store, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export function ProfileDropdown() {
  const { user, loading, openAuthModal, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermeture automatique au clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-xl bg-slate-100 border-2 border-slate-900 animate-pulse" />
    );
  }

  // Utilisateur non connecté : bouton ouvrant la dialogbox de connexion/inscription
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => openAuthModal('login')}
          className="inline-flex items-center gap-2 text-xs font-black text-slate-900 hover:text-blue-600 px-3.5 py-2 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-100 shadow-brutal-xs hover:shadow-brutal hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <User className="w-4 h-4 text-slate-700" />
          <span className="hidden sm:inline">Connexion</span>
        </button>

        <button
          type="button"
          onClick={() => openAuthModal('register')}
          className="hidden md:inline-flex items-center text-xs font-black bg-amber-400 hover:bg-amber-300 text-slate-950 px-3.5 py-2 rounded-xl border-2 border-slate-900 shadow-brutal-xs hover:shadow-brutal hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <span>Créer un compte</span>
        </button>
      </div>
    );
  }

  // Rôle et badge
  const roleConfig = {
    admin: {
      label: 'Administrateur',
      bgColor: 'bg-purple-100 text-purple-900 border-purple-900',
      icon: Shield,
    },
    charge_daffaire: {
      label: "Chargé d'affaires",
      bgColor: 'bg-blue-100 text-blue-900 border-blue-900',
      icon: Briefcase,
    },
    client: {
      label: 'Client',
      bgColor: 'bg-emerald-100 text-emerald-900 border-emerald-900',
      icon: Store,
    },
  }[user.role] || {
    label: 'Utilisateur',
    bgColor: 'bg-slate-100 text-slate-900 border-slate-900',
    icon: User,
  };

  const RoleIcon = roleConfig.icon;
  const initials = (user.full_name || user.email)
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton Avatar Profil */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 bg-white hover:bg-slate-100 border-2 border-slate-900 rounded-2xl shadow-brutal-xs hover:shadow-brutal transition-all cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="w-9 h-9 rounded-xl bg-amber-400 border-2 border-slate-900 flex items-center justify-center font-black text-xs text-slate-950">
          {initials || <User className="w-4 h-4" />}
        </div>
        <div className="hidden sm:block text-left pr-1.5">
          <div className="text-[11px] font-black text-slate-900 leading-none truncate max-w-[120px]">
            {user.full_name || user.email.split('@')[0]}
          </div>
          <div className="text-[9px] font-extrabold text-slate-500 uppercase mt-0.5">
            {roleConfig.label}
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-700 mr-1" />
      </button>

      {/* Menu Déroulant */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border-2 border-slate-900 rounded-2xl shadow-brutal-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Entête utilisateur */}
          <div className="px-4 py-3 border-b-2 border-slate-100">
            <p className="text-xs font-black text-slate-900 truncate">
              {user.full_name || 'Utilisateur'}
            </p>
            <p className="text-[11px] text-slate-500 truncate mb-2">
              {user.email}
            </p>
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${roleConfig.bgColor}`}>
              <RoleIcon className="w-3 h-3" />
              <span>{roleConfig.label}</span>
            </span>
          </div>

          {/* Liens d'accès selon le rôle */}
          <div className="p-2 space-y-1">
            {(user.role === 'admin' || user.role === 'charge_daffaire') && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-black text-slate-900 hover:bg-amber-100 transition-colors"
              >
                <Shield className="w-4 h-4 text-purple-700" />
                <span>Panneau d'Administration</span>
              </Link>
            )}

            {user.role === 'client' && (
              <Link
                href="#showroom"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-black text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <Store className="w-4 h-4 text-emerald-600" />
                <span>Mes Boutiques & Démos</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-black text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Se déconnecter</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
