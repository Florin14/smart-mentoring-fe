import { createTheme, alpha } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6C63FF',
      light: '#9D97FF',
      dark: '#4A42D4',
    },
    secondary: {
      main: '#FF6B9D',
      light: '#FF9DC4',
      dark: '#D44A7A',
    },
    background: {
      default: '#0A0E27',
      paper: '#131738',
    },
    text: {
      primary: '#E8E8F0',
      secondary: '#9B9BB4',
    },
    success: {
      main: '#00D68F',
    },
    error: {
      main: '#FF4C6A',
    },
    warning: {
      main: '#FFAA00',
    },
    info: {
      main: '#00B8D4',
    },
    divider: alpha('#6C63FF', 0.12),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '0.95rem',
          boxShadow: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 8px 25px -8px rgba(108, 99, 255, 0.5)',
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #7B73FF 0%, #FF7DAD 100%)',
          },
        },
        outlined: {
          borderColor: alpha('#6C63FF', 0.5),
          '&:hover': {
            borderColor: '#6C63FF',
            backgroundColor: alpha('#6C63FF', 0.08),
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiFilledInput-root': {
            backgroundColor: alpha('#6C63FF', 0.06),
            borderRadius: 12,
            border: `1px solid ${alpha('#6C63FF', 0.15)}`,
            transition: 'all 0.3s ease',
            '&:before, &:after': {
              display: 'none',
            },
            '&:hover': {
              backgroundColor: alpha('#6C63FF', 0.1),
              borderColor: alpha('#6C63FF', 0.3),
            },
            '&.Mui-focused': {
              backgroundColor: alpha('#6C63FF', 0.1),
              borderColor: '#6C63FF',
              boxShadow: `0 0 0 3px ${alpha('#6C63FF', 0.15)}`,
            },
          },
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '& fieldset': {
              borderColor: alpha('#6C63FF', 0.2),
            },
            '&:hover fieldset': {
              borderColor: alpha('#6C63FF', 0.4),
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6C63FF',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: alpha('#131738', 0.8),
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha('#6C63FF', 0.1)}`,
          borderRadius: 20,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            border: `1px solid ${alpha('#6C63FF', 0.25)}`,
            boxShadow: `0 20px 40px -12px ${alpha('#6C63FF', 0.15)}`,
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.95rem',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          background: '#1A1F42',
          border: `1px solid ${alpha('#6C63FF', 0.15)}`,
          borderRadius: 12,
          backdropFilter: 'blur(20px)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: '#131738',
          border: `1px solid ${alpha('#6C63FF', 0.15)}`,
          borderRadius: 20,
          backdropFilter: 'blur(20px)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '2px 8px',
          transition: 'all 0.2s ease',
          '&.Mui-selected': {
            background: `linear-gradient(135deg, ${alpha('#6C63FF', 0.15)} 0%, ${alpha('#FF6B9D', 0.1)} 100%)`,
            borderLeft: '3px solid #6C63FF',
            '&:hover': {
              background: `linear-gradient(135deg, ${alpha('#6C63FF', 0.2)} 0%, ${alpha('#FF6B9D', 0.15)} 100%)`,
            },
          },
          '&:hover': {
            background: alpha('#6C63FF', 0.08),
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: '#1A1F42',
          border: `1px solid ${alpha('#6C63FF', 0.2)}`,
          borderRadius: 8,
          fontSize: '0.8rem',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: '#0A0E27',
          '&::-webkit-scrollbar': {
            width: 8,
          },
          '&::-webkit-scrollbar-track': {
            background: '#0A0E27',
          },
          '&::-webkit-scrollbar-thumb': {
            background: alpha('#6C63FF', 0.3),
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: alpha('#6C63FF', 0.5),
          },
        },
      },
    },
  },
})
