'use client';

import React from 'react';
import { Lock } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export function LandingFooter() {
  const { openAuthModal } = useAuth();

  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t-2 border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Colonne 1 : Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏪</span>
              <span className="text-white font-black text-xl">WoxxApp V2</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 font-medium">
              Plateforme SaaS souveraine de création et hébergement de sites web pour commerçants et artisans. Infrastructure cloud Kubernetes haute disponibilité sans commission cachée.
            </p>
            <div className="pt-2">
              <button
                onClick={() => openAuthModal('register')}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-4 py-2 rounded-xl border border-slate-800 shadow-brutal-xs hover:shadow-brutal transition cursor-pointer"
              >
                Lancer mon commerce en ligne →
              </button>
            </div>
          </div>

          {/* Colonne 2 : Démos & Parcours */}
          <div>
            <h5 className="text-white font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <span>Démos & Showroom</span>
            </h5>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <a
                  href="https://zorea.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition flex items-center gap-1.5"
                >
                  <span>💍 Zorea Joaillerie (Client)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://demo-pizza.woxxapp.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition flex items-center gap-1.5"
                >
                  <span>🍕 Pizza Express (Click & Collect)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://demo-mode.woxxapp.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition flex items-center gap-1.5"
                >
                  <span>👗 Mode & Prêt-à-Porter</span>
                </a>
              </li>
              <li>
                <a href="#tarifs" className="hover:text-white transition">
                  📊 Simulateur de Prix & Formules
                </a>
              </li>
              <li>
                <a href="#etapes" className="hover:text-white transition">
                  🚀 Déploiement en 4 Étapes
                </a>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Accompagnement & Support */}
          <div>
            <h5 className="text-white font-black text-xs uppercase tracking-widest mb-4">
              Accompagnement & Services
            </h5>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <a
                  href="https://elise-et-moi.fr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 transition flex items-center gap-1.5"
                >
                  <span>💼 Élise & Moi (Office Manager)</span>
                </a>
              </li>
              <li>
                <a href="mailto:contact@woxxapp.de" className="hover:text-white transition">
                  ✉️ Demande de devis & sur mesure
                </a>
              </li>
              <li>
                <a href="mailto:support@woxxapp.de" className="hover:text-white transition">
                  🛠️ Support technique 7j/7
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition">
                  ❓ Centre d'aide & FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Sécurité & Légal */}
          <div>
            <h5 className="text-white font-black text-xs uppercase tracking-widest mb-4">
              Sécurité & Réglementation
            </h5>
            <ul className="space-y-2.5 text-xs font-medium">
              <li className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Hébergement K8s Hetzner (UE)
              </li>
              <li className="text-slate-400">
                💳 Paiements WoxxPay / PCI-DSS
              </li>
              <li className="pt-2 border-t border-slate-800 space-y-2">
                <div>
                  <a href="/policies/cgv" className="hover:text-amber-400 transition">
                    📄 Conditions Générales de Vente (CGV)
                  </a>
                </div>
                <div>
                  <a href="/policies/cgu" className="hover:text-amber-400 transition">
                    📜 Conditions d'Utilisation (CGU)
                  </a>
                </div>
                <div>
                  <a href="/policies/legal" className="hover:text-amber-400 transition">
                    🏛️ Mentions Légales
                  </a>
                </div>
                <div>
                  <a href="/policies/gdpr" className="hover:text-amber-400 transition">
                    🛡️ Protection des Données (RGPD)
                  </a>
                </div>
                <div>
                  <a href="/policies/cookies" className="hover:text-amber-400 transition">
                    🍪 Gestion des Cookies
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>© 2026 WoxxApp SAS. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <a href="/policies/legal" className="hover:text-slate-400 transition">
              Mentions Légales
            </a>
            <span>•</span>
            <a href="/policies/cgv" className="hover:text-slate-400 transition">
              CGV
            </a>
            <span>•</span>
            <a href="/policies/cgu" className="hover:text-slate-400 transition">
              CGU
            </a>
            <span>•</span>
            <a href="/policies/gdpr" className="hover:text-slate-400 transition">
              RGPD
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
