import { create } from 'zustand';

interface QuestState {
  visitedLocations: Record<string, boolean>;
  visitLocation: (id: string) => void;
  isAllCompleted: () => boolean;
}

interface AppState {
  activeLocationId: string | null;
  hoveredLocationId: string | null;
  soundOn: boolean;
  dayTime: string;
  minimapOpen: boolean;
  menuOpen: boolean;
  playerPos: [number, number, number];
  playerTarget: [number, number, number] | null;
  
  // Actions
  setActiveLocationId: (id: string | null) => void;
  setHoveredLocationId: (id: string | null) => void;
  toggleSound: () => void;
  setDayTime: (time: string) => void;
  toggleMinimap: (open?: boolean) => void;
  toggleMenu: (open?: boolean) => void;
  setPlayerPos: (pos: [number, number, number]) => void;
  setPlayerTarget: (target: [number, number, number] | null) => void;
  
  // Quest state
  quests: QuestState;
}

const locationIds = [
  'city-center',
  'ai-lab',
  'project-avenue',
  'developer-hq',
  'cpi-campus',
  'tech-cluder',
  'github-center',
  'city-exit'
];

export const useStore = create<AppState>((set, get) => ({
  activeLocationId: null,
  hoveredLocationId: null,
  soundOn: false,
  dayTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  minimapOpen: false,
  menuOpen: false,
  playerPos: [0, 0, 4], // start near City Center
  playerTarget: null,

  setActiveLocationId: (id) => {
    set({ activeLocationId: id });
    if (id) {
      get().quests.visitLocation(id);
    }
  },
  
  setHoveredLocationId: (id) => set({ hoveredLocationId: id }),
  toggleSound: () => set((state) => ({ soundOn: !state.soundOn })),
  setDayTime: (time) => set({ dayTime: time }),
  toggleMinimap: (open) => set((state) => ({ minimapOpen: open !== undefined ? open : !state.minimapOpen })),
  toggleMenu: (open) => set((state) => ({ menuOpen: open !== undefined ? open : !state.menuOpen })),
  setPlayerPos: (pos) => set({ playerPos: pos }),
  setPlayerTarget: (target) => set({ playerTarget: target }),

  quests: {
    visitedLocations: locationIds.reduce((acc, id) => ({ ...acc, [id]: false }), {}),
    visitLocation: (id) => {
      set((state) => ({
        quests: {
          ...state.quests,
          visitedLocations: {
            ...state.quests.visitedLocations,
            [id]: true
          }
        }
      }));
    },
    isAllCompleted: () => {
      const visited = get().quests.visitedLocations;
      return Object.values(visited).every((val) => val);
    }
  }
}));
