import { useState, useCallback } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteConfirmationOptions {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

interface DeleteConfirmationState {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function useDeleteConfirmation() {
  const [state, setState] = useState<DeleteConfirmationState>({
    isOpen: false,
    title: 'Are you sure you want to delete this item?',
    description:
      'This action cannot be undone. This will permanently delete your item and remove your data from our servers.',
    confirmText: 'Continue',
    cancelText: 'Cancel',
    onConfirm: () => {},
    onCancel: () => {},
  });

  const confirm = useCallback(
    (options: DeleteConfirmationOptions = {}): Promise<boolean> => {
      return new Promise(resolve => {
        setState({
          isOpen: true,
          title: options.title || 'Are you sure you want to delete this item?',
          description:
            options.description ||
            'This action cannot be undone. This will permanently delete your item and remove your data from our servers.',
          confirmText: options.confirmText || 'Continue',
          cancelText: options.cancelText || 'Cancel',
          onConfirm: () => {
            setState(prev => ({ ...prev, isOpen: false }));
            resolve(true);
          },
          onCancel: () => {
            setState(prev => ({ ...prev, isOpen: false }));
            resolve(false);
          },
        });
      });
    },
    []
  );

  const alert = useCallback((title: string, message: string): Promise<void> => {
    return new Promise(resolve => {
      setState({
        isOpen: true,
        title,
        description: message,
        confirmText: 'OK',
        cancelText: '',
        onConfirm: () => {
          setState(prev => ({ ...prev, isOpen: false }));
          resolve();
        },
        onCancel: () => {
          setState(prev => ({ ...prev, isOpen: false }));
          resolve();
        },
      });
    });
  }, []);

  const DeleteConfirmationDialog = () => (
    <AlertDialog
      open={state.isOpen}
      onOpenChange={open => !open && state.onCancel()}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{state.title}</AlertDialogTitle>
          <AlertDialogDescription>{state.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {state.cancelText && (
            <AlertDialogCancel onClick={state.onCancel}>
              {state.cancelText}
            </AlertDialogCancel>
          )}
          <AlertDialogAction onClick={state.onConfirm}>
            {state.confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return {
    confirm,
    alert,
    DeleteConfirmationDialog,
  };
}
