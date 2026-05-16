import { Alert } from 'react-native';

const originalAlert = Alert.alert;

if (typeof document !== 'undefined') {
  document.documentElement.style.height = '100%';
  document.documentElement.style.overflowX = 'hidden';
  document.body.style.minHeight = '100vh';
  document.body.style.overflowX = 'hidden';
  document.body.style.overflowY = 'auto';
  document.body.style.margin = '0';

  const root = document.getElementById('root');
  if (root) {
    root.style.minHeight = '100vh';
    root.style.overflowX = 'hidden';
  }
}

Alert.alert = (title, message, buttons, options) => {
  if (typeof window === 'undefined') {
    return originalAlert(title, message, buttons, options);
  }

  const text = [title, message].filter(Boolean).join('\n\n');

  if (!buttons || buttons.length === 0) {
    window.alert(text);
    return;
  }

  const cancelButton = buttons.find((button) => button?.style === 'cancel');
  const destructiveButton = buttons.find((button) => button?.style === 'destructive');
  const primaryButton = buttons[buttons.length - 1] || buttons[0];

  const confirmed = window.confirm(text);
  const chosen = confirmed
    ? destructiveButton || primaryButton
    : cancelButton || buttons[0];

  if (chosen && typeof chosen.onPress === 'function') {
    chosen.onPress();
  }
};

export { default } from './App.js';
