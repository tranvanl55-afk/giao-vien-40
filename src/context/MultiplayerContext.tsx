// src/context/MultiplayerContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { doc, setDoc, getDoc, updateDoc, collection, addDoc, onSnapshot, query, where, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

type Player = {
  uid: string;
  displayName: string;
  team: 'red' | 'blue';
};

type GameState = {
  phase: 'countdown' | 'answering' | 'reveal' | 'result';
  scores: number[]; // [redScore, blueScore]
  qIdx: number;
  teamAnswers: (number | null)[]; // per team answer index or null
  winner: number | null; // team index
  timeLeft: number;
  players?: { uid: string; displayName: string; team: string }[];
};

interface MultiplayerContextProps {
  roomId: string | null;
  isHost: boolean;
  player: Player | null;
  gameState: GameState | null;
  createRoom: (questions: any[]) => Promise<string>;
  joinRoom: (roomId: string) => Promise<void>;
  startGame: () => Promise<void>;
  submitAnswer: (teamIdx: number, answerIdx: number) => Promise<void>;
  leaveRoom: () => Promise<void>;
}

const MultiplayerContext = createContext<MultiplayerContextProps | undefined>(undefined);

export const useMultiplayer = () => {
  const ctx = useContext(MultiplayerContext);
  if (!ctx) throw new Error('useMultiplayer must be used within MultiplayerProvider');
  return ctx;
};

export const MultiplayerProvider = ({ children }: { children: ReactNode }) => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [player, setPlayer] = useState<Player | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);

  // Track auth user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setPlayer({ uid: u.uid, displayName: u.email || 'Player', team: 'red' }); // team will be assigned later
      } else {
        setPlayer(null);
      }
    });
    return unsubscribe;
  }, []);

  // Listen to room state updates
  useEffect(() => {
    if (!roomId) return;
    const stateRef = collection(db, `rooms/${roomId}/state`);
    const unsub = onSnapshot(stateRef, (snap) => {
      // Expect a single document named 'game'
      const docSnap = snap.docs.find(d => d.id === 'game');
      if (docSnap) setGameState(docSnap.data() as GameState);
    });
    return unsub;
  }, [roomId]);

  const createRoom = async (questions: any[]): Promise<string> => {
    if (!player) throw new Error('User not authenticated');
    // Create room document
    const roomRef = await addDoc(collection(db, 'rooms'), {
      hostUid: player.uid,
      createdAt: serverTimestamp(),
      questions,
    });
    // Initialize state subcollection
    await setDoc(doc(db, `rooms/${roomRef.id}/state`, 'game'), {
      phase: 'countdown',
      scores: [0, 0],
      qIdx: 0,
      teamAnswers: [null, null],
      winner: null,
      timeLeft: 20,
      hostUid: player.uid,
      players: [],
    });
    setRoomId(roomRef.id);
    setIsHost(true);
    // Add host as first player
    await setDoc(doc(db, `rooms/${roomRef.id}/players/${player.uid}`), {
      uid: player.uid,
      displayName: player.displayName,
      team: 'red',
    });
    return roomRef.id;
  };

  const joinRoom = async (rid: string) => {
    if (!player) throw new Error('User not authenticated');
    const roomDoc = await getDoc(doc(db, `rooms/${rid}`));
    if (!roomDoc.exists()) throw new Error('Room not found');
    // Determine team based on current players count
    const playersSnap = await getDoc(doc(db, `rooms/${rid}/players/${player.uid}`));
    const roomPlayersCol = collection(db, `rooms/${rid}/players`);
    const allPlayersSnap = await getDoc(doc(db, `rooms/${rid}`)); // just to ensure room exists
    // Assign team: red if less than 2 players, else blue (simple demo)
    const assignedTeam = 'blue';
    await setDoc(doc(db, `rooms/${rid}/players/${player.uid}`), {
      uid: player.uid,
      displayName: player.displayName,
      team: assignedTeam,
    });
    setRoomId(rid);
    setIsHost(false);
    setPlayer(prev => prev ? { ...prev, team: assignedTeam as any } : null);
  };

  const startGame = async () => {
    if (!roomId) return;
    const gameRef = doc(db, `rooms/${roomId}/state`, 'game');
    await updateDoc(gameRef, { phase: 'answering', timeLeft: 20 });
  };

  const submitAnswer = async (teamIdx: number, answerIdx: number) => {
    if (!roomId) return;
    const gameRef = doc(db, `rooms/${roomId}/state`, 'game');
    const snap = await getDoc(gameRef);
    const current = snap.data() as GameState;
    const newAnswers = [...current.teamAnswers];
    newAnswers[teamIdx] = answerIdx;
    await updateDoc(gameRef, { teamAnswers: newAnswers });
  };

  const leaveRoom = async () => {
    if (!roomId || !player) return;
    const playerRef = doc(db, `rooms/${roomId}/players/${player.uid}`);
    await setDoc(playerRef, {}); // optional delete
    setRoomId(null);
    setIsHost(false);
    setGameState(null);
  };

  const value: MultiplayerContextProps = {
    roomId,
    isHost,
    player,
    gameState,
    createRoom,
    joinRoom,
    startGame,
    submitAnswer,
    leaveRoom,
  };

  return <MultiplayerContext.Provider value={value}>{children}</MultiplayerContext.Provider>;
};
