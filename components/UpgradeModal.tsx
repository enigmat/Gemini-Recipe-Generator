import React, { useState, useEffect } from 'react';
import XIcon from './icons/XIcon';
import CrownIcon from './icons/CrownIcon';
import CheckIcon from './icons/CheckIcon';
import Spinner from './Spinner';
import CheckCircleIcon from './icons/CheckCircleIcon';
import { User } from '../types';
import PreferenceSelector from './PreferenceSelector';

// This is a test publishable key. In a real application, this would come from an environment variable.
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51HPvU92eZvYClndf5O6c6jHhTf8bL7t7xWJ2a3bJ2xV9X2a3bJ2xV9X2a3bJ2xV9X2a3bJ2xV9X2a3bJ2xV9X003bJ2xV9X';

declare var Stripe: any; // Use the global Stripe object from the script tag

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (preferences: string[]) => void;
  currentUser: User | null;
  onLoginRequest: () => void;
}

type ModalStep = 'payment' | 'preferences' | 'success';

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onUpgrade, currentUser, onLoginRequest }) => {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<ModalStep>('payment');
  const [preferences, setPreferences] = useState<string[]>([]);

  const [stripe, setStripe] = useState<any>(null);
  const [cardElement, setCardElement] = useState<any>(null);

  // Initialize Stripe and the CardElement
  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens/reopens
      setError(null);
      setIsProcessing(false);
      setStep('payment');
      setPreferences([]);

      if (!stripe) {
        const stripeInstance = Stripe(STRIPE_PUBLISHABLE_KEY);
        setStripe(stripeInstance);
        
        const elements = stripeInstance.elements();
        const card = elements.create('card', {
            style: {
                base: {
                    iconColor: '#64748b',
                    color: '#1e293b',
                    fontWeight: '500',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '16px',
                    fontSmoothing: 'antialiased',
                    '::placeholder': { color: '#94a3b8' },
                },
                invalid: {
                    iconColor: '#ef4444',
                    color: '#ef4444',
                },
            },
        });
        setCardElement(card);
      }

      if (cardElement && step === 'payment') {
        // Use a timeout to ensure the DOM element is ready for mounting
        setTimeout(() => {
          const cardElementDiv = document.getElementById('card-element');
          if (cardElementDiv && !cardElementDiv.childElementCount) {
             cardElement.mount('#card-element');
             cardElement.on('change', (event: any) => {
                if (event.error) {
                    setError(event.error.message);
                } else {
                    setError(null);
                }
             });
          }
        }, 0);
      }
    }
  }, [isOpen, stripe, cardElement, step]);

  if (!isOpen) return null;

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
        onLoginRequest();
        return;
    }

    if (!stripe || !cardElement) {
      return;
    }
    
    setIsProcessing(true);
    
    const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });
    
    if (paymentMethodError) {
      setError(paymentMethodError.message);
      setIsProcessing(false);
      return;
    }

    // Since we have no backend to create a PaymentIntent and confirm the payment,
    // we'll simulate success and move to the next step.
    setTimeout(() => {
      setIsProcessing(false);
      setStep('preferences');
      cardElement.clear(); // Clear card details
    }, 1500);
  };

  const handleCompleteSignup = () => {
    onUpgrade(preferences);
    setStep('success');
    
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  const renderPaymentStep = () => (
    <>
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-amber-100 mb-4">
          <CrownIcon className="h-8 w-8 text-amber-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Go Premium!</h2>
        <p className="text-slate-600 mt-2 text-sm">Unlock exclusive recipes, classes, and an ad-free experience.</p>
      </div>

      <ul className="space-y-2 my-6 text-sm">
        <li className="flex items-start"><CheckIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" /><span className="text-slate-700">Personalized recipe recommendations</span></li>
        <li className="flex items-start"><CheckIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" /><span className="text-slate-700">Advanced cooking classes</span></li>
        <li className="flex items-start"><CheckIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" /><span className="text-slate-700">Ad-free browsing</span></li>
        <li className="flex items-start"><CheckIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" /><span className="text-slate-700">Ask a professional chef</span></li>
      </ul>

      <form onSubmit={handlePaymentSubmit} className="mt-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Card details</label>
            <div id="card-element" className="p-3 border border-slate-300 rounded-md shadow-sm bg-white">
              {/* Stripe's CardElement will be mounted here */}
            </div>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
        <div className="mt-6">
          <button
            type="submit"
            disabled={isProcessing || !stripe}
            className="w-full flex justify-center items-center px-4 py-3 bg-amber-500 border border-transparent rounded-lg shadow-sm text-base font-bold text-slate-900 hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-amber-300"
          >
            {isProcessing ? <Spinner /> : 'Pay $4.99/month'}
          </button>
        </div>
        <p className="text-center text-xs text-slate-400 mt-4">Secure payments powered by Stripe</p>
      </form>
    </>
  );
  
  const renderPreferencesStep = () => (
    <div className="animate-fade-in">
      <PreferenceSelector selectedPreferences={preferences} onChange={setPreferences} limit={3} />
       <button
          onClick={handleCompleteSignup}
          disabled={preferences.length === 0}
          className="w-full mt-4 flex justify-center items-center px-4 py-3 bg-teal-500 border border-transparent rounded-lg shadow-sm text-base font-bold text-white hover:bg-teal-600 transition-colors disabled:bg-teal-300"
        >
          Complete Signup
        </button>
    </div>
  );

  const renderSuccessView = () => (
    <div className="text-center animate-fade-in">
        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto" />
        <h3 className="text-2xl font-bold text-slate-800 mt-4">Welcome to Premium!</h3>
        <p className="text-slate-600 mt-2">You now have access to all exclusive features and personalized recommendations.</p>
    </div>
  );

  const renderContent = () => {
    switch(step) {
      case 'preferences': return renderPreferencesStep();
      case 'success': return renderSuccessView();
      case 'payment':
      default:
        return renderPaymentStep();
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-11/12 md:max-w-md p-8 relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 z-10 transition-colors" aria-label="Close modal">
          <XIcon className="w-6 h-6" />
        </button>
        
        {renderContent()}
      </div>
    </div>
  );
};

export default UpgradeModal;