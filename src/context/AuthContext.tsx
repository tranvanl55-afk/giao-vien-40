import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signOut, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
  browserPopupRedirectResolver,
  getAdditionalUserInfo,
  deleteUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, displayName: string, additionalData?: any) => Promise<void>;
  loginWithGoogle: (options: {
    allowNewUser: boolean;
    additionalData?: any;
    validate?: (email: string | null) => string | null;
  }) => Promise<void>;
  loginWithGoogleCredential: (idToken: string, options?: {
    additionalData?: any;
    validate?: (email: string | null) => string | null;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  enum OperationType {
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    LIST = 'list',
    GET = 'get',
    WRITE = 'write',
  }
  
  interface FirestoreErrorInfo {
    error: string;
    operationType: OperationType;
    path: string | null;
    authInfo: {
      userId?: string | null;
      email?: string | null;
      emailVerified?: boolean | null;
      isAnonymous?: boolean | null;
      tenantId?: string | null;
      providerInfo?: {
        providerId?: string | null;
        email?: string | null;
      }[];
    }
  }

  function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
        isAnonymous: auth.currentUser?.isAnonymous,
        tenantId: auth.currentUser?.tenantId,
        providerInfo: auth.currentUser?.providerData?.map(provider => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || []
      },
      operationType,
      path
    }
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  }

  useEffect(() => {
    // Set persistence to local
    setPersistence(auth, browserLocalPersistence).catch((err) => {
      console.error("Persistence error", err);
    });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
      
      if (user) {
         try {
           const userRef = doc(db, 'users', user.uid);
           const userSnap = await getDoc(userRef);
           if (!userSnap.exists()) {
             await setDoc(userRef, {
               uid: user.uid,
               displayName: user.displayName,
               email: user.email,
               photoURL: user.photoURL,
               lastLogin: serverTimestamp()
             });
           } else {
             await setDoc(userRef, {
               lastLogin: serverTimestamp()
             }, { merge: true });
           }
         } catch (e) {
           handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}`);
         }
      }
    });

    return unsubscribe;
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error("Login with email failed", error);
      throw error;
    }
  };

  const registerWithEmail = async (email: string, pass: string, displayName: string, additionalData?: any) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      
      // Update profile with display name
      await updateProfile(result.user, { displayName });
      
      // Store in Firestore
      const userRef = doc(db, 'users', result.user.uid);
      await setDoc(userRef, {
        uid: result.user.uid,
        displayName,
        email,
        photoURL: result.user.photoURL,
        lastLogin: serverTimestamp(),
        ...additionalData
      });
    } catch (error: any) {
      if (error.code && error.code.startsWith('auth/')) {
        console.error("Registration with email failed", error);
        throw error;
      }
      handleFirestoreError(error, OperationType.WRITE, `users`);
    }
  };

  /**
   * Đăng nhập bằng tài khoản Google (Gmail).
   * - allowNewUser=false: nếu là tài khoản Google mới (chưa đăng ký) thì xoá và báo lỗi 'auth/google-not-registered'.
   * - validate: kiểm tra bổ sung sau khi biết email (VD: yêu cầu Gemini API Key); trả về mã lỗi để huỷ đăng nhập.
   */
  const loginWithGoogle: AuthContextType['loginWithGoogle'] = async ({ allowNewUser, additionalData, validate }) => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    const result = await signInWithPopup(auth, provider, browserPopupRedirectResolver);
    const isNewUser = getAdditionalUserInfo(result)?.isNewUser ?? false;
    const userRef = doc(db, 'users', result.user.uid);

    const fail = async (code: string) => {
      if (isNewUser) {
        try { await deleteDoc(userRef); } catch { /* ignore */ }
        try { await deleteUser(result.user); } catch { await signOut(auth); }
      } else {
        await signOut(auth);
      }
      const err: any = new Error(code);
      err.code = code;
      throw err;
    };

    if (isNewUser && !allowNewUser) {
      await fail('auth/google-not-registered');
    }

    const validationError = validate?.(result.user.email) ?? null;
    if (validationError) {
      await fail(validationError);
    }

    if (isNewUser) {
      await setDoc(userRef, {
        uid: result.user.uid,
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        lastLogin: serverTimestamp(),
        ...additionalData
      }, { merge: true });
    }
  };

  /**
   * Đăng nhập trực tiếp bằng Google ID Token (Google Identity Services - GSI).
   * Không đi qua firebaseapp.com/__/auth/handler nên không bao giờ bị lỗi 'The requested action is invalid'.
   */
  const loginWithGoogleCredential: AuthContextType['loginWithGoogleCredential'] = async (idToken, options) => {
    const credential = GoogleAuthProvider.credential(idToken);
    const result = await signInWithCredential(auth, credential);
    const isNewUser = getAdditionalUserInfo(result)?.isNewUser ?? false;
    const userRef = doc(db, 'users', result.user.uid);

    const validationError = options?.validate?.(result.user.email) ?? null;
    if (validationError) {
      if (isNewUser) {
        try { await deleteDoc(userRef); } catch { /* ignore */ }
        try { await deleteUser(result.user); } catch { await signOut(auth); }
      } else {
        await signOut(auth);
      }
      const err: any = new Error(validationError);
      err.code = validationError;
      throw err;
    }

    if (isNewUser) {
      await setDoc(userRef, {
        uid: result.user.uid,
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        lastLogin: serverTimestamp(),
        role: 'Học sinh',
        provider: 'google',
        ...options?.additionalData
      }, { merge: true });
    } else {
      await setDoc(userRef, {
        lastLogin: serverTimestamp(),
      }, { merge: true });
    }
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ currentUser, loading, loginWithEmail, registerWithEmail, loginWithGoogle, loginWithGoogleCredential, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
