'use client';

import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';
import { SalesRepClientsTab } from '@/components/sales-rep/SalesRepClientsTab';
import { SalesRepQuotesTab } from '@/components/sales-rep/SalesRepQuotesTab';
import { CreateQuoteModal } from '@/components/sales-rep/CreateQuoteModal';
import { CreateClientModal } from '@/components/sales-rep/CreateClientModal';
import { QuotePaymentModal } from '@/components/sales-rep/QuotePaymentModal';
import { SalesRepTab } from '@/components/sales-rep/SalesRepSidebar';

export default function SalesRepDashboardPage() {
  const [activeTab, setActiveTab] = useState<SalesRepTab>('clients');
  const [clients, setClients] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modales
  const [isCreateClientOpen, setIsCreateClientOpen] = useState(false);
  const [isCreateQuoteOpen, setIsCreateQuoteOpen] = useState(false);
  const [preselectedClientId, setPreselectedClientId] = useState<string | undefined>();
  const [selectedQuoteForPayment, setSelectedQuoteForPayment] = useState<any | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [clientsData, quotesData] = await Promise.all([
        apiRequest<any[]>('/sales-rep/clients'),
        apiRequest<any[]>('/sales-rep/quotes'),
      ]);
      setClients(clientsData || []);
      setQuotes(quotesData || []);
    } catch (err) {
      console.error('Erreur chargement données chargé d’affaires:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const handleTabChange = (e: any) => {
      if (e.detail) {
        setActiveTab(e.detail);
      }
    };
    window.addEventListener('sales-rep-tab-change', handleTabChange);
    return () => window.removeEventListener('sales-rep-tab-change', handleTabChange);
  }, []);

  const handleOpenCreateQuote = (clientId?: string) => {
    setPreselectedClientId(clientId);
    setIsCreateQuoteOpen(true);
  };

  return (
    <div>
      {activeTab === 'clients' && (
        <SalesRepClientsTab
          clients={clients}
          loading={loading}
          onRefresh={fetchData}
          onOpenCreateClient={() => setIsCreateClientOpen(true)}
          onOpenCreateQuote={handleOpenCreateQuote}
        />
      )}

      {activeTab === 'quotes' && (
        <SalesRepQuotesTab
          quotes={quotes}
          loading={loading}
          onRefresh={fetchData}
          onOpenCreateQuote={() => handleOpenCreateQuote()}
          onOpenPaymentModal={(q) => setSelectedQuoteForPayment(q)}
        />
      )}

      {/* Modal Création Client */}
      <CreateClientModal
        isOpen={isCreateClientOpen}
        onClose={() => setIsCreateClientOpen(false)}
        onSuccess={fetchData}
      />

      {/* Modal Création Devis */}
      <CreateQuoteModal
        isOpen={isCreateQuoteOpen}
        onClose={() => {
          setIsCreateQuoteOpen(false);
          setPreselectedClientId(undefined);
        }}
        onSuccess={() => {
          fetchData();
          setActiveTab('quotes');
        }}
        clients={clients}
        preselectedClientId={preselectedClientId}
      />

      {/* Modal Paiement & Virement WoxxPay */}
      <QuotePaymentModal
        isOpen={!!selectedQuoteForPayment}
        quote={selectedQuoteForPayment}
        onClose={() => setSelectedQuoteForPayment(null)}
        onSuccess={fetchData}
      />
    </div>
  );
}
