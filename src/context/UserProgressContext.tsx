import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

type LessonProgress = {
  lessonId: string;
  completed: boolean;
  pointsEarned: number;
};

interface UserProgressContextProps {
  points: number;
  completedLessons: Set<string>;
  addLessonProgress: (lessonId: string, points: number) => void;
}

const UserProgressContext = createContext<UserProgressContextProps | undefined>(undefined);

export const UserProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [points, setPoints] = useState<number>(0);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('gv40_user_progress');
      if (stored) {
        const data = JSON.parse(stored);
        setPoints(data.points ?? 0);
        setCompletedLessons(new Set(data.completedLessons ?? []));
      }
    } catch {}
  }, []);

  // Persist to localStorage whenever it changes
  useEffect(() => {
    const data = {
      points,
      completedLessons: Array.from(completedLessons),
    };
    try {
      localStorage.setItem('gv40_user_progress', JSON.stringify(data));
    } catch {}
  }, [points, completedLessons]);

  // Optional: sync with Firebase when a user is logged in
  useEffect(() => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;
    const docRef = doc(db, 'userProgress', uid);
    getDoc(docRef).then(snapshot => {
      if (snapshot.exists()) {
        const remote = snapshot.data() as { points: number; completedLessons: string[] };
        setPoints(remote.points ?? 0);
        setCompletedLessons(new Set(remote.completedLessons ?? []));
      }
    });
  }, []);

  const addLessonProgress = (lessonId: string, earned: number) => {
    setPoints(prev => prev + earned);
    setCompletedLessons(prev => new Set(prev).add(lessonId));
    // Sync to Firebase if logged in
    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      const docRef = doc(db, 'userProgress', uid);
      setDoc(docRef, {
        points: points + earned,
        completedLessons: Array.from(completedLessons).concat(lessonId),
      }, { merge: true });
    }
  };

  return (
    <UserProgressContext.Provider value={{ points, completedLessons, addLessonProgress }}>
      {children}
    </UserProgressContext.Provider>
  );
};

export const useUserProgress = (): UserProgressContextProps => {
  const ctx = useContext(UserProgressContext);
  if (!ctx) throw new Error('useUserProgress must be used within UserProgressProvider');
  return ctx;
};
