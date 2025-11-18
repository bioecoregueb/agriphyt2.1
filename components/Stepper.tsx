import React from 'react';
import { BeakerIcon, SprayCanIcon, StoreIcon, CheckCircle2Icon, CheckIcon } from './Icons';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

const stepIcons = [
  (props: any) => <BeakerIcon {...props} />,
  (props: any) => <SprayCanIcon {...props} />,
  (props: any) => <StoreIcon {...props} />,
  (props: any) => <CheckCircle2Icon {...props} />,
];

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full px-4 sm:px-8">
      <div className="flex items-center">
        {steps.map((label, index) => {
          const step = index + 1;
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;
          const IconComponent = stepIcons[index];

          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center text-center w-32">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isActive
                      ? 'bg-primary/10 border-primary'
                      : isCompleted
                      ? 'bg-primary border-primary'
                      : 'bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-500'
                  }`}
                >
                  {isCompleted ? (
                    <CheckIcon className="h-7 w-7 text-white" />
                  ) : (
                    <IconComponent
                      className={`h-6 w-6 ${
                        isActive ? 'text-primary' : 'text-gray-400'
                      }`}
                    />
                  )}
                </div>
                <p
                  className={`mt-2 text-xs font-semibold ${
                    isActive || isCompleted ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {label}
                </p>
              </div>
              {step < steps.length && (
                <div
                  className={`flex-auto border-t-2 transition-all duration-300 ${
                    isCompleted ? 'border-primary' : 'border-gray-300 dark:border-gray-600'
                  }`}
                ></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;