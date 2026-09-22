'use client'

import { useState, useEffect } from 'react'

interface UserOption {
  id: string
  name: string | null
  email: string
  role: string
}

interface ManageCredentialsModalProps {
  isOpen: boolean
  onClose: () => void
  tenant: {
    id: string
    name: string
    slug: string
    domain?: string
    assignedSalesRepId?: string | null
  } | null
  onSuccess: () => void
}

export function ManageCredentialsModal({
  isOpen,
  onClose,
  tenant,
  onSuccess,
}: ManageCredentialsModalProps) {
  const [adminPassword, setAdminPassword] = useState('')
  const [managerPassword, setManagerPassword] = useState('')
  const [resetAdminTotp, setResetAdminTotp] = useState(false)
  const [resetManagerTotp, setResetManagerTotp] = useState(false)
  const [assignedSalesRepId, setAssignedSalesRepId] = useState<string>('')
  const [salesReps, setSalesReps] = useState<UserOption[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchingReps, setFetchingReps] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Charger la liste des chargés d'affaires et admins
  useEffect(() => {
    if (isOpen && tenant) {
      setAdminPassword('')
      setManagerPassword('')
      setResetAdminTotp(false)
      setResetManagerTotp(false)
      setAssignedSalesRepId(tenant.assignedSalesRepId || '')
      setError(null)
      setSuccessMsg(null)

      setFetchingReps(true)
      fetch('/api/admin/users?role=CHARGE_DAFFAIRE')
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          if (Array.isArray(data)) {
            setSalesReps(data)
          }
        })
        .catch(() => {})
        .finally(() => setFetchingReps(false))
    }
  }, [isOpen, tenant])

  if (!isOpen || !tenant) return null

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*'
    let pwd = ''
    for (let i = 0; i < 14; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return pwd
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)
    setLoading(true)

    try {
      const payload: Record<string, any> = {
        assignedSalesRepId: assignedSalesRepId || null,
        resetAdminTotp,
        resetManagerTotp,
      }

      if (adminPassword.trim()) {
        payload.adminPassword = adminPassword.trim()
      }
      if (managerPassword.trim()) {
        payload.managerPassword = managerPassword.trim()
      }

      const res = await fetch(`/api/admin/tenants/${tenant.id}/credentials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la mise à jour des accès')
      }

      setSuccessMsg('Identifiants et affectations mis à jour avec succès.')
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 1200)
    } catch (err: any) {
      setError(err.message || 'Une erreur inattendue est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-lg rounded-xl border border-gray-700 bg-gray-900 p-6 shadow-2xl text-white">
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔐</span>
            <div>
              <h3 className="text-lg font-bold">Gestion des Accès & Identifiants</h3>
              <p className="text-xs text-gray-400">
                Site : <span className="text-indigo-400 font-medium">{tenant.name}</span> ({tenant.slug})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-900/30 border border-red-500/50 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mt-4 rounded-lg bg-green-900/30 border border-green-500/50 p-3 text-sm text-green-300">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Mot de passe Administrateur */}
          <div className="rounded-lg border border-gray-800 bg-gray-800/40 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Mot de passe Administrateur (admin)
              </label>
              <button
                type="button"
                onClick={() => setAdminPassword(generatePassword())}
                className="text-xs text-indigo-400 hover:text-indigo-300 underline"
              >
                Générer
              </button>
            </div>
            <input
              type="text"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Laisser vide pour ne pas modifier"
              className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
            />
            <label className="flex items-center gap-2 text-xs text-gray-400 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={resetAdminTotp}
                onChange={(e) => setResetAdminTotp(e.target.checked)}
                className="rounded border-gray-700 bg-gray-900 text-indigo-600 focus:ring-indigo-500"
              />
              Réinitialiser le 2FA / TOTP de l'administrateur
            </label>
          </div>

          {/* Mot de passe Gérant */}
          <div className="rounded-lg border border-gray-800 bg-gray-800/40 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Mot de passe Gérant (gerant)
              </label>
              <button
                type="button"
                onClick={() => setManagerPassword(generatePassword())}
                className="text-xs text-indigo-400 hover:text-indigo-300 underline"
              >
                Générer
              </button>
            </div>
            <input
              type="text"
              value={managerPassword}
              onChange={(e) => setManagerPassword(e.target.value)}
              placeholder="Laisser vide pour ne pas modifier"
              className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
            />
            <label className="flex items-center gap-2 text-xs text-gray-400 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={resetManagerTotp}
                onChange={(e) => setResetManagerTotp(e.target.checked)}
                className="rounded border-gray-700 bg-gray-900 text-indigo-600 focus:ring-indigo-500"
              />
              Réinitialiser le 2FA / TOTP du gérant
            </label>
          </div>

          {/* Affectation Chargé d'affaires */}
          <div className="rounded-lg border border-gray-800 bg-gray-800/40 p-3 space-y-2">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Chargé d'Affaires Associé
            </label>
            <p className="text-xs text-gray-400">
              Le chargé d'affaires aura accès au backoffice en tant que gérant délégué via SSO.
            </p>
            <select
              value={assignedSalesRepId}
              onChange={(e) => setAssignedSalesRepId(e.target.value)}
              disabled={fetchingReps}
              className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="">-- Aucun chargé d'affaires --</option>
              {salesReps.map((rep) => (
                <option key={rep.id} value={rep.id}>
                  {rep.name || rep.email} ({rep.email})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Mise à jour...
                </>
              ) : (
                'Enregistrer les accès'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
