
import React, { useEffect } from 'react';
import { CheckCircle2Icon, AlertTriangleIcon, XIcon } from './Icons';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onDismiss: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-green-50 dark:bg-green-900/50' : 'bg-red-50 dark:bg-red-900/50';
  const borderColor = isSuccess ? 'border-green-300 dark:border-green-600' : 'border-red-300 dark:border-red-600';
  const iconColor = isSuccess ? 'text-green-500' : 'text-red-500';
  const textColor = isSuccess ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200';

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm w-full animate-fadeIn">
      <div className={`rounded-lg shadow-lg border ${bgColor} ${borderColor} p-4 flex items-start`}>
        <div className={`flex-shrink-0 ${iconColor}`}>
          {isSuccess ? <CheckCircle2Icon className="h-6 w-6" /> : <AlertTriangleIcon className="h-6 w-6" />}
        </div>
        <div className="ml-3">
          <p className={`font-semibold ${textColor}`}>{isSuccess ? 'Success' : 'Error'}</p>
          <p className={`text-sm ${textColor}`}>{message}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={onDismiss}
              className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isSuccess
                  ? 'bg-green-50 text-green-500 hover:bg-green-100 focus:ring-offset-green-50 focus:ring-green-600 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900'
                  : 'bg-red-50 text-red-500 hover:bg-red-100 focus:ring-offset-red-50 focus:ring-red-600 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900'
              }`}
            >
              <span className="sr-only">Dismiss</span>
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
