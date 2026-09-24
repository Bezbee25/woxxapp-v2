'use client';

import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';
import { ClientStoresList, ClientTenant } from '@/components/dashboard/ClientStoresList';
import { ClientQuotesTab } from '@/components/dashboard/ClientQuotesTab';
import { CreateStoreModal } from '@/components/dashboard/CreateStoreModal';
import { ClientInvoicesTab } from '@/components/dashboard/ClientInvoicesTab';
import { ClientAccountTab } from '@/components/dashboard/ClientAccountTab';
import { ClientPaymentTab } from '@/components/dashboard/ClientPaymentTab';
import { ClientTab } from '@/components/dashboard/ClientSidebar';

export default function ClientDashboardPage() {
  const [activeTab, setActiveTab] = useState<ClientTab>('stores');
  const [tenants, setTenants] = useState<ClientTenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<ClientTenant[]>('/tenants');
      setTenants(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur chargement boutiques client:', err);
      setTenants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();

    const handleTabChange = (e: any) => {
      if (e.detail) {
        setActiveTab(e.detail);
      }
    };
    window.addEventListener('client-tab-change', handleTabChange);
    return () => window.removeEventListener('client-tab-change', handleTabChange);
  }, []);

  return (
    <div>
      {activeTab === 'stores' && (
        <ClientStoresList
          tenants={tenants}
          loading={loading}
          onRefresh={fetchTenants}
          onOpenCreate={() => setIsCreateOpen(true)}
        />
      )}

      {activeTab === 'payments' && <ClientPaymentTab />}

      {activeTab === 'quotes' && <ClientQuotesTab />}

      {activeTab === 'invoices' && <ClientInvoicesTab />}

      {activeTab === 'account' && <ClientAccountTab />}

      {/* Modal Création de boutique pour le client */}
      <CreateStoreModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={fetchTenants}
      />
    </div>
  );
}
