/**
 * Client d'intégration interne WoxxAPP -> Woxx Store Manager (API Pivot & K8s).
 * Authentification inter-services par Bearer Token / X-Internal-Key.
 */

export interface ProvisionPayload {
  storeId: string;
  subdomain: string;
  storeKey: string;
  storeName: string;
  modules: string[];
  customDomain?: string;
  image?: string;
}

export interface ProvisionResult {
  success: boolean;
  message?: string;
  data?: {
    status: string;
    store_id: string;
    namespace: string;
    subdomain: string;
    fqdn: string;
    custom_domain?: string;
    ingress_url: string;
  };
  error?: string;
}

export interface K8sStoreStatus {
  store_id: string;
  subdomain: string;
  k8s_status: {
    ready: boolean;
    status: string;
    pod_name: string | null;
    node_name: string | null;
    restarts: number;
    ip: string | null;
    image?: string;
    pvc_info?: Array<{ name: string; size: string; phase: string }>;
  };
}

export class StoreManagerClient {
  private static apiUrl = process.env.STORE_MANAGER_INTERNAL_URL || 'http://store-manager.store-system.svc.cluster.local:8000';
  private static internalApiKey = process.env.STORE_MANAGER_INTERNAL_KEY || 'woxx-internal-cluster-key-2026';

  private static getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.internalApiKey}`,
      'X-Internal-Key': this.internalApiKey,
    };
  }

  /**
   * Déclenche le provisionnement K8s d'une boutique (Deployment, Ingress *.woxxapp.de, DB).
   */
  public static async provisionStore(payload: ProvisionPayload): Promise<ProvisionResult> {
    try {
      const res = await fetch(`${this.apiUrl}/api/v1/stores/provision`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          store_id: payload.storeId,
          subdomain: payload.subdomain,
          store_key: payload.storeKey,
          store_name: payload.storeName,
          modules: payload.modules,
          custom_domain: payload.customDomain,
          image: payload.image,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          error: data.detail || 'Erreur lors du provisioning K8s',
        };
      }

      return data;
    } catch (err: any) {
      console.error('[StoreManagerClient] Erreur provisionStore:', err);
      return {
        success: false,
        error: err.message || 'Impossible de joindre le service de provisioning',
      };
    }
  }

  /**
   * Met à jour la liste des modules actifs pour un store.
   */
  public static async updateModules(storeId: string, modules: string[]): Promise<boolean> {
    try {
      const res = await fetch(`${this.apiUrl}/api/v1/stores/${encodeURIComponent(storeId)}/modules`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ modules }),
      });

      return res.ok;
    } catch (err) {
      console.error('[StoreManagerClient] Erreur updateModules:', err);
      return false;
    }
  }

  /**
   * Récupère l'état d'exécution réel du Pod K8s et du stockage.
   */
  public static async getStoreStatus(storeId: string): Promise<K8sStoreStatus | null> {
    try {
      const res = await fetch(`${this.apiUrl}/api/v1/stores/${encodeURIComponent(storeId)}/status`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.error('[StoreManagerClient] Erreur getStoreStatus:', err);
      return null;
    }
  }

  /**
   * Génère un jeton temporaire d'impersonation SSO (valable 60s, usage unique).
   */
  public static async generateSsoToken(
    storeId: string,
    role: 'ADMIN' | 'MANAGER' = 'ADMIN',
    operatorEmail = 'admin@woxx.local',
    targetEmail?: string
  ): Promise<{ token: string; local_sso_url: string; cloud_sso_url: string } | null> {
    try {
      const res = await fetch(`${this.apiUrl}/api/v1/stores/${encodeURIComponent(storeId)}/sso-token`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          role,
          operator: operatorEmail,
          target_email: targetEmail,
        }),
      });

      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.error('[StoreManagerClient] Erreur generateSsoToken:', err);
      return null;
    }
  }

  /**
   * Met à jour les mots de passe Admin / Gérant ou réinitialise le MFA d'une boutique.
   */
  public static async updateStoreCredentials(
    storeId: string,
    payload: {
      adminEmail?: string;
      adminPassword?: string;
      managerEmail?: string;
      managerPassword?: string;
      resetTotp?: boolean;
    }
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch(`${this.apiUrl}/api/v1/stores/${encodeURIComponent(storeId)}/credentials`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      return {
        success: Boolean(data.success),
        message: data.message || 'Identifiants transmis',
        error: data.error || data.detail,
      };
    } catch (err: any) {
      console.error('[StoreManagerClient] Erreur updateStoreCredentials:', err);
      return {
        success: false,
        error: err.message || 'Impossible de joindre le Store Manager',
      };
    }
  }

  /**
   * Synchronise le catalogue de tarification des modules avec le Store Manager.
   */
  public static async syncPricingCatalog(catalog: any[]): Promise<boolean> {
    try {
      const res = await fetch(`${this.apiUrl}/api/v1/pricing/sync`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ catalog }),
      });
      return res.ok;
    } catch (err) {
      console.error('[StoreManagerClient] Erreur syncPricingCatalog:', err);
      return false;
    }
  }
}


