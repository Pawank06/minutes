import { create } from 'zustand';

export interface Session {
    id: string;
    organizationName: string;
    date: string;
    price: number;
    title?: string;
    description?: string;
    bookedTimes?: string;
    earnings?: number;
    time1?: string;
    time2?: string;
    time3?: string;
    image?: string;
    amount?: number;
    meetlink?: string;
}

interface SidebarStore {
    isOpen: boolean;
    isLargeScreen: boolean;
    selectedSession: Session | null;
    sessions: Session[];
    setIsOpen: (isOpen: boolean) => void;
    setIsLargeScreen: (isLargeScreen: boolean) => void;
    setSelectedSession: (session: Session | null) => void;
    setSessions: (sessions: Session[]) => void;
 
}

export const useSidebarStore = create<SidebarStore>((set) => ({
    isOpen: false,
    isLargeScreen: false,
    selectedSession: null,
    sessions: [],
    setIsOpen: (isOpen) => set({ isOpen }),
    setIsLargeScreen: (isLargeScreen) => set({ isLargeScreen }),
    setSelectedSession: (session) => set({ selectedSession: session }),
    setSessions: (sessions) => set({ sessions }),
}));