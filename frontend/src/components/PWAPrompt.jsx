import { useState, useEffect } from 'react';
import { Download, X, Bell } from 'lucide-react';
import { Button } from './common';
import { usePWA } from '../hooks/usePWA';
import { motion, AnimatePresence } from 'framer-motion';

const PWAPrompt = () => {
  const { canInstall, installPWA, requestNotificationPermission } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (!isDismissed && canInstall) {
      setTimeout(() => setShowPrompt(true), 5000); // Show after 5 seconds
    }
  }, [canInstall]);

  const handleInstall = async () => {
    await installPWA();
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  const handleEnableNotifications = async () => {
    await requestNotificationPermission();
  };

  return (
    <AnimatePresence>
      {showPrompt && !dismissed && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-50"
        >
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-2xl border border-gray-200 dark:border-dark-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">T</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Install TaskFlow
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get the app experience
                  </p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="p-1 hover:bg-gray-100 dark:hover:bg-dark-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ul className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary-600 rounded-full" />
                Work offline
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary-600 rounded-full" />
                Faster loading
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary-600 rounded-full" />
                Push notifications
              </li>
            </ul>

            <div className="flex gap-2">
              <Button
                onClick={handleInstall}
                icon={Download}
                className="flex-1"
              >
                Install
              </Button>
              <Button
                onClick={handleEnableNotifications}
                variant="outline"
                icon={Bell}
              >
                Notify
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAPrompt;