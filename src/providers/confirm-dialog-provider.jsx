import React, { useCallback, useEffect, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/Components/UI/alert-dialog'
import { setConfirmHandler } from '@/utils/confirmDialog'

const defaultState = {
  open: false,
  title: '',
  description: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  variant: 'default',
}

export function ConfirmDialogProvider({ children }) {
  const [state, setState] = useState(defaultState)
  const [resolver, setResolver] = useState(null)

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      setResolver(() => resolve)
      setState({
        open: true,
        title: options.title || 'Are you sure?',
        description: options.description || options.message || options.text || '',
        confirmText: options.confirmText || options.confirmButtonText || 'Confirm',
        cancelText: options.cancelText || options.cancelButtonText || 'Cancel',
        variant: options.variant || (options.confirmButtonColor?.includes('destructive') ? 'destructive' : 'default'),
      })
    })
  }, [])

  useEffect(() => {
    setConfirmHandler(confirm)
    return () => setConfirmHandler(null)
  }, [confirm])

  const closeWith = (value) => {
    resolver?.(value)
    setResolver(null)
    setState((prev) => ({ ...prev, open: false }))
  }

  return (
    <>
      {children}
      <AlertDialog
        open={state.open}
        onOpenChange={(open) => {
          if (!open) closeWith(false)
        }}
      >
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>{state.title}</AlertDialogTitle>
            {state.description ? (
              <AlertDialogDescription>{state.description}</AlertDialogDescription>
            ) : null}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => closeWith(false)}>{state.cancelText}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => closeWith(true)}
              className={
                state.variant === 'destructive'
                  ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                  : undefined
              }
            >
              {state.confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
