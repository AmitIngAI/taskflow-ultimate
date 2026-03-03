import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const themePresets = {
  light: {
    name: 'Light',
    colors: {
      primary: '#6366f1',
      background: '#ffffff',
      surface: '#f3f4f6',
      text: '#111827',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
    },
  },
  dark: {
    name: 'Dark',
    colors: {
      primary: '#6366f1',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155',
    },
  },
  highContrast: {
    name: 'High Contrast',
    colors: {
      primary: '#000000',
      background: '#ffffff',
      surface: '#f9f9f9',
      text: '#000000',
      textSecondary: '#333333',
      border: '#000000',
    },
  },
  solarized: {
    name: 'Solarized',
    colors: {
      primary: '#268bd2',
      background: '#fdf6e3',
      surface: '#eee8d5',
      text: '#657b83',
      textSecondary: '#93a1a1',
      border: '#93a1a1',
    },
  },
  solarizedDark: {
    name: 'Solarized Dark',
    colors: {
      primary: '#268bd2',
      background: '#002b36',
      surface: '#073642',
      text: '#839496',
      textSecondary: '#586e75',
      border: '#586e75',
    },
  },
  nord: {
    name: 'Nord',
    colors: {
      primary: '#88c0d0',
      background: '#2e3440',
      surface: '#3b4252',
      text: '#eceff4',
      textSecondary: '#d8dee9',
      border: '#4c566a',
    },
  },
  dracula: {
    name: 'Dracula',
    colors: {
      primary: '#bd93f9',
      background: '#282a36',
      surface: '#44475a',
      text: '#f8f8f2',
      textSecondary: '#6272a4',
      border: '#6272a4',
    },
  },
};

export const useThemeStore = create(
  persist(
    (set, get) => ({
      // Current theme
      currentTheme: 'light',
      mode: 'light', // light, dark, auto
      accentColor: '#6366f1',
      customThemes: {},

      // Theme preset
      themePresets,

      // Actions
      setTheme: (themeName) => {
        const theme = get().themePresets[themeName] || get().customThemes[themeName];
        if (theme) {
          set({ currentTheme: themeName });
          applyTheme(theme);
        }
      },

      setMode: (mode) => {
        set({ mode });
        if (mode === 'auto') {
          const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          get().setTheme(isDark ? 'dark' : 'light');
        } else {
          get().setTheme(mode);
        }
      },

      setAccentColor: (color) => {
        set({ accentColor: color });
        const currentThemeData = get().getCurrentThemeData();
        applyTheme({
          ...currentThemeData,
          colors: {
            ...currentThemeData.colors,
            primary: color,
          },
        });
      },

      createCustomTheme: (name, colors) => {
        const { customThemes } = get();
        set({
          customThemes: {
            ...customThemes,
            [name]: { name, colors },
          },
        });
      },

      deleteCustomTheme: (name) => {
        const { customThemes, currentTheme } = get();
        const { [name]: deleted, ...rest } = customThemes;
        set({ customThemes: rest });
        
        if (currentTheme === name) {
          get().setTheme('light');
        }
      },

      getCurrentThemeData: () => {
        const { currentTheme, themePresets, customThemes } = get();
        return themePresets[currentTheme] || customThemes[currentTheme];
      },

      exportTheme: (themeName) => {
        const { themePresets, customThemes } = get();
        const theme = themePresets[themeName] || customThemes[themeName];
        return JSON.stringify(theme, null, 2);
      },

      importTheme: (themeJson) => {
        try {
          const theme = JSON.parse(themeJson);
          get().createCustomTheme(theme.name, theme.colors);
          return true;
        } catch (error) {
          console.error('Invalid theme JSON:', error);
          return false;
        }
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);

// Apply theme to document
const applyTheme = (theme) => {
  const root = document.documentElement;
  
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });

  // Update Tailwind dark class
  if (theme.name.toLowerCase().includes('dark')) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

// Auto theme listener
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    const store = useThemeStore.getState();
    if (store.mode === 'auto') {
      store.setTheme(e.matches ? 'dark' : 'light');
    }
  });
}