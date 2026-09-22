import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, AppUser, Order, LuandaZone, PayoutRequest, StorePaymentConfig } from '../types';

/**
 * Removes any undefined properties to prevent Firestore serialization errors
 */
function sanitizeForFirestore<T>(data: T): any {
  return JSON.parse(JSON.stringify(data));
}

// ==========================================
// 1. PRODUTOS (PRODUCTS)
// ==========================================

export function subscribeToProducts(onUpdate: (products: Product[]) => void) {
  try {
    const colRef = collection(db, 'products');
    return onSnapshot(
      colRef,
      (snapshot) => {
        const prods: Product[] = [];
        snapshot.forEach((doc) => {
          const d = doc.data();
          if (d && d.id) {
            prods.push(d as Product);
          }
        });
        onUpdate(prods);
      },
      (error) => {
        if (error.code === 'unavailable' || error.message?.includes('unavailable')) {
          return;
        }
        console.warn('[Firestore] Error subscribing to products:', error);
      }
    );
  } catch (err) {
    console.warn('[Firestore] Failed to attach products listener:', err);
    return () => {};
  }
}

export async function cloudSaveProduct(product: Product): Promise<boolean> {
  try {
    const docRef = doc(db, 'products', product.id);
    await setDoc(docRef, sanitizeForFirestore(product), { merge: true });
    return true;
  } catch (err) {
    console.error('[Firestore] Failed to save product:', err);
    return false;
  }
}

export async function cloudDeleteProduct(productId: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'products', productId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error('[Firestore] Failed to delete product:', err);
    return false;
  }
}

// ==========================================
// 2. UTILIZADORES / CONTAS (USERS)
// ==========================================

export function subscribeToUsers(onUpdate: (users: AppUser[]) => void) {
  try {
    const colRef = collection(db, 'users');
    return onSnapshot(
      colRef,
      (snapshot) => {
        const users: AppUser[] = [];
        snapshot.forEach((doc) => {
          const d = doc.data();
          if (d && d.id) {
            users.push(d as AppUser);
          }
        });
        onUpdate(users);
      },
      (error) => {
        if (error.code === 'unavailable' || error.message?.includes('unavailable')) return;
        console.warn('[Firestore] Error subscribing to users:', error);
      }
    );
  } catch (err) {
    console.warn('[Firestore] Failed to attach users listener:', err);
    return () => {};
  }
}

export async function cloudSaveUser(user: AppUser): Promise<boolean> {
  try {
    const docRef = doc(db, 'users', user.id);
    await setDoc(docRef, sanitizeForFirestore(user), { merge: true });
    return true;
  } catch (err) {
    console.error('[Firestore] Failed to save user:', err);
    return false;
  }
}

// ==========================================
// 3. ENCOMENDAS & AGENDAMENTOS (ORDERS)
// ==========================================

export function subscribeToOrders(onUpdate: (orders: Order[]) => void) {
  try {
    const colRef = collection(db, 'orders');
    return onSnapshot(
      colRef,
      (snapshot) => {
        const orders: Order[] = [];
        snapshot.forEach((doc) => {
          const d = doc.data();
          if (d && d.id) {
            orders.push(d as Order);
          }
        });
        // Ordenar do mais recente para o mais antigo
        orders.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        onUpdate(orders);
      },
      (error) => {
        if (error.code === 'unavailable' || error.message?.includes('unavailable')) return;
        console.warn('[Firestore] Error subscribing to orders:', error);
      }
    );
  } catch (err) {
    console.warn('[Firestore] Failed to attach orders listener:', err);
    return () => {};
  }
}

export async function cloudSaveOrder(order: Order): Promise<boolean> {
  try {
    const docRef = doc(db, 'orders', order.id);
    await setDoc(docRef, sanitizeForFirestore(order), { merge: true });
    return true;
  } catch (err) {
    console.error('[Firestore] Failed to save order:', err);
    return false;
  }
}

// ==========================================
// 4. ZONAS DE LUANDA (LUANDA ZONES)
// ==========================================

export function subscribeToZones(onUpdate: (zones: LuandaZone[]) => void) {
  try {
    const colRef = collection(db, 'zones');
    return onSnapshot(
      colRef,
      (snapshot) => {
        const zones: LuandaZone[] = [];
        snapshot.forEach((doc) => {
          const d = doc.data();
          if (d && d.id) {
            zones.push(d as LuandaZone);
          }
        });
        onUpdate(zones);
      },
      (error) => {
        if (error.code === 'unavailable' || error.message?.includes('unavailable')) return;
        console.warn('[Firestore] Error subscribing to zones:', error);
      }
    );
  } catch (err) {
    console.warn('[Firestore] Failed to attach zones listener:', err);
    return () => {};
  }
}

export async function cloudSaveZone(zone: LuandaZone): Promise<boolean> {
  try {
    const docRef = doc(db, 'zones', zone.id);
    await setDoc(docRef, sanitizeForFirestore(zone), { merge: true });
    return true;
  } catch (err) {
    console.error('[Firestore] Failed to save zone:', err);
    return false;
  }
}

export async function cloudDeleteZone(zoneId: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'zones', zoneId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error('[Firestore] Failed to delete zone:', err);
    return false;
  }
}

// ==========================================
// 5. SOLICITAÇÕES DE SAQUE (PAYOUT REQUESTS)
// ==========================================

export function subscribeToPayouts(onUpdate: (payouts: PayoutRequest[]) => void) {
  try {
    const colRef = collection(db, 'payouts');
    return onSnapshot(
      colRef,
      (snapshot) => {
        const payouts: PayoutRequest[] = [];
        snapshot.forEach((doc) => {
          const d = doc.data();
          if (d && d.id) {
            payouts.push(d as PayoutRequest);
          }
        });
        payouts.sort((a, b) => {
          const timeA = typeof a.requestedAt === 'number' ? a.requestedAt : (parseInt(a.id.replace(/\D/g, ''), 10) || 0);
          const timeB = typeof b.requestedAt === 'number' ? b.requestedAt : (parseInt(b.id.replace(/\D/g, ''), 10) || 0);
          return timeB - timeA;
        });
        onUpdate(payouts);
      },
      (error) => {
        if (error.code === 'unavailable' || error.message?.includes('unavailable')) return;
        console.warn('[Firestore] Error subscribing to payouts:', error);
      }
    );
  } catch (err) {
    console.warn('[Firestore] Failed to attach payouts listener:', err);
    return () => {};
  }
}

export async function cloudSavePayout(payout: PayoutRequest): Promise<boolean> {
  try {
    const docRef = doc(db, 'payouts', payout.id);
    await setDoc(docRef, sanitizeForFirestore(payout), { merge: true });
    return true;
  } catch (err) {
    console.error('[Firestore] Failed to save payout:', err);
    return false;
  }
}

// ==========================================
// 6. CONFIGURAÇÕES DE PAGAMENTO (PAYMENT CONFIG)
// ==========================================

export function subscribeToPaymentConfig(onUpdate: (config: StorePaymentConfig) => void) {
  try {
    const docRef = doc(db, 'settings', 'paymentConfig');
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data && (data.bankAccounts || data.expressAccounts)) {
            onUpdate(data as StorePaymentConfig);
          }
        }
      },
      (error) => {
        if (error.code === 'unavailable' || error.message?.includes('unavailable')) return;
        console.warn('[Firestore] Error subscribing to payment config:', error);
      }
    );
  } catch (err) {
    console.warn('[Firestore] Failed to attach payment config listener:', err);
    return () => {};
  }
}

export async function cloudSavePaymentConfig(config: StorePaymentConfig): Promise<boolean> {
  try {
    const docRef = doc(db, 'settings', 'paymentConfig');
    await setDoc(docRef, sanitizeForFirestore(config), { merge: true });
    return true;
  } catch (err) {
    console.error('[Firestore] Failed to save payment config:', err);
    return false;
  }
}

/**
 * Directly fetch fresh products from Firestore on demand (e.g. when connecting online)
 */
export async function fetchFreshProducts(): Promise<Product[] | null> {
  try {
    const colRef = collection(db, 'products');
    const snapshot = await getDocs(colRef);
    const prods: Product[] = [];
    snapshot.forEach((doc) => {
      const d = doc.data();
      if (d && d.id) {
        prods.push(d as Product);
      }
    });
    return prods;
  } catch (err) {
    console.warn('[Firestore] Error fetching fresh products:', err);
    return null;
  }
}

/**
 * Directly fetch fresh orders from Firestore on demand
 */
export async function fetchFreshOrders(): Promise<Order[] | null> {
  try {
    const colRef = collection(db, 'orders');
    const snapshot = await getDocs(colRef);
    const orders: Order[] = [];
    snapshot.forEach((doc) => {
      const d = doc.data();
      if (d && d.id) {
        orders.push(d as Order);
      }
    });
    orders.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    return orders;
  } catch (err) {
    console.warn('[Firestore] Error fetching fresh orders:', err);
    return null;
  }
}

/**
 * Directly fetch fresh users from Firestore on demand
 */
export async function fetchFreshUsers(): Promise<AppUser[] | null> {
  try {
    const colRef = collection(db, 'users');
    const snapshot = await getDocs(colRef);
    const users: AppUser[] = [];
    snapshot.forEach((doc) => {
      const d = doc.data();
      if (d && d.id) {
        users.push(d as AppUser);
      }
    });
    return users;
  } catch (err) {
    console.warn('[Firestore] Error fetching fresh users:', err);
    return null;
  }
}

const SEED_STORAGE_KEY = 'angolamarket_cloud_seeded_done_v2';

/**
 * Seeds initial catalog ONLY IF the database collection is empty.
 * Never overwrites existing stock numbers or existing orders.
 */
export function seedLocalDataToCloud(
  localProducts: Product[],
  localUsers: AppUser[],
  localOrders: Order[],
  localZones: LuandaZone[],
  localPayouts: PayoutRequest[]
) {
  if (typeof window !== 'undefined') {
    try {
      if (localStorage.getItem(SEED_STORAGE_KEY)) {
        return;
      }
    } catch {
      // ignore
    }
  }

  // Defer seeding slightly so Firestore has completed its initial handshake
  setTimeout(async () => {
    try {
      // Check products: only seed if products collection is completely empty
      const prodSnap = await getDocs(collection(db, 'products'));
      if (prodSnap.empty && localProducts?.length) {
        for (const p of localProducts) {
          await cloudSaveProduct(p);
        }
      }

      // Check users: only seed if users collection is empty
      const userSnap = await getDocs(collection(db, 'users'));
      if (userSnap.empty && localUsers?.length) {
        for (const u of localUsers) {
          await cloudSaveUser(u);
        }
      }

      // Check zones: only seed if zones collection is empty
      const zoneSnap = await getDocs(collection(db, 'zones'));
      if (zoneSnap.empty && localZones?.length) {
        for (const z of localZones) {
          await cloudSaveZone(z);
        }
      }

      // Mark seeded
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(SEED_STORAGE_KEY, 'true');
        } catch {
          // ignore
        }
      }
    } catch {
      // Ignore network errors
    }
  }, 4000);
}
