import { alpha, Dialog, DialogTitle, IconButton, Slide, styled } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import React from 'react'
import { TransitionProps } from '@mui/material/transitions'

export const DialogTransition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

export const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    background: '#131738',
    border: `1px solid ${alpha('#6C63FF', 0.15)}`,
    borderRadius: 24,
    backdropFilter: 'blur(20px)',
  },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(4),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(2),
    borderTop: `1px solid ${alpha('#6C63FF', 0.08)}`,
  },
  '& .MuiBackdrop-root': {
    backgroundColor: alpha('#0A0E27', 0.7),
    backdropFilter: 'blur(8px)',
  },
}))

export interface DialogTitleProps {
  children?: React.ReactNode
  onClose: () => void
}

export const BootstrapDialogTitle: React.FC<DialogTitleProps> = props => {
  const { children, onClose, ...other } = props

  return (
    <DialogTitle
      sx={{
        m: 0,
        mb: 2,
        p: 3,
        textAlign: 'center',
        color: '#E8E8F0',
        fontWeight: 700,
        borderBottom: `1px solid ${alpha('#6C63FF', 0.08)}`,
      }}
      {...other}
    >
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 12,
            top: 12,
            color: '#9B9BB4',
            borderRadius: '10px',
            '&:hover': {
              background: alpha('#FF4C6A', 0.1),
              color: '#FF4C6A',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}
