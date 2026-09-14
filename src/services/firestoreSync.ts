import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, AppUser, Order, LuandaZone, PayoutRequest } from '../types';

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

/**
 * Syncs any existing local data (from phone 1 or local storage) up to Firestore,
 * ensuring seamless migration and zero data loss between devices.
 */
export async function seedLocalDataToCloud(
  localProducts: Product[],
  localUsers: AppUser[],
  localOrders: Order[],
  localZones: LuandaZone[],
  localPayouts: PayoutRequest[]
) {
  try {
    // 1. Seed Products if Firestore is currently empty or has missing ones
    if (localProducts.length > 0) {
      try {
        const snap = await getDocs(collection(db, 'products'));
        const existingIds = new Set(snap.docs.map((d) => d.id));
        for (const p of localProducts) {
          if (!existingIds.has(p.id)) {
            await cloudSaveProduct(p);
          }
        }
      } catch (err: any) {
        if (err?.code !== 'unavailable') console.warn('[Firestore] Product seed sync note:', err?.message || err);
      }
    }

    // 2. Seed Users if missing
    if (localUsers.length > 0) {
      try {
        const snap = await getDocs(collection(db, 'users'));
        const existingIds = new Set(snap.docs.map((d) => d.id));
        for (const u of localUsers) {
          if (!existingIds.has(u.id)) {
            await cloudSaveUser(u);
          }
        }
      } catch (err: any) {
        if (err?.code !== 'unavailable') console.warn('[Firestore] Users seed sync note:', err?.message || err);
      }
    }

    // 3. Seed Orders if missing
    if (localOrders.length > 0) {
      try {
        const snap = await getDocs(collection(db, 'orders'));
        const existingIds = new Set(snap.docs.map((d) => d.id));
        for (const o of localOrders) {
          if (!existingIds.has(o.id)) {
            await cloudSaveOrder(o);
          }
        }
      } catch (err: any) {
        if (err?.code !== 'unavailable') console.warn('[Firestore] Orders seed sync note:', err?.message || err);
      }
    }

    // 4. Seed Zones if missing
    if (localZones.length > 0) {
      try {
        const snap = await getDocs(collection(db, 'zones'));
        const existingIds = new Set(snap.docs.map((d) => d.id));
        for (const z of localZones) {
          if (!existingIds.has(z.id)) {
            await cloudSaveZone(z);
          }
        }
      } catch (err: any) {
        if (err?.code !== 'unavailable') console.warn('[Firestore] Zones seed sync note:', err?.message || err);
      }
    }

    // 5. Seed Payouts if missing
    if (localPayouts.length > 0) {
      try {
        const snap = await getDocs(collection(db, 'payouts'));
        const existingIds = new Set(snap.docs.map((d) => d.id));
        for (const pay of localPayouts) {
          if (!existingIds.has(pay.id)) {
            await cloudSavePayout(pay);
          }
        }
      } catch (err: any) {
        if (err?.code !== 'unavailable') console.warn('[Firestore] Payouts seed sync note:', err?.message || err);
      }
    }
  } catch (err) {
    console.warn('[Firestore] Initial sync deferred to offline cache:', err);
  }
}
