import React, { useState, useEffect } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
import { Pricing } from '../../../types/workshop';
import { Check, X } from 'lucide-react';

export const Step10_Pricing: React.FC = () => {
  const { workshopData, updateWorkshopData, setCurrentStep } = useWorkshopStore();
  
  // Initialize local state from workshopData or with defaults
  const [localPricing, setLocalPricing] = useState<Pricing>(() => ({
    strategy: workshopData.pricing?.strategy || '',
    justification: workshopData.pricing?.justification || ''
  }));
  
  // Track input errors
  const [errors, setErrors] = useState({
    strategy: false,
    justification: false
  });

  // Update local state when workshopData changes, but only on initial render
  useEffect(() => {
    if (workshopData.pricing) {
      setLocalPricing({
        strategy: workshopData.pricing.strategy || '',
        justification: workshopData.pricing.justification || ''
      });
    }
  }, []);  // Empty dependency array to run only on initial mount

  // Save data to store only when explicitly requested
  const handleSave = () => {
    // Validate inputs
    const newErrors = {
      strategy: !localPricing.strategy,
      justification: !localPricing.justification
    };
    
    setErrors(newErrors);
    
    // Only save if there are no errors
    if (!newErrors.strategy && !newErrors.justification) {
      updateWorkshopData({
        pricing: {
          strategy: localPricing.strategy,
          justification: localPricing.justification
        }
      });
      return true;
    }
    return false;
  };

  // Handle input changes
  const handleChange = (field: keyof Pricing, value: string) => {
    setLocalPricing((prev: Pricing) => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user types
    if (field === 'strategy' || field === 'justification') {
      setErrors(prev => ({
        ...prev,
        [field]: false
      }));
    }
  };

  // Navigation handlers
  const handleNext = () => {
    if (handleSave()) {
      setCurrentStep(11);
    }
  };

  const handleBack = () => {
    handleSave();
    setCurrentStep(9);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Step 10: Pricing Strategy</h1>
      
      <Card variant="outline" padding="lg" className="mb-6">
        <h2 className="text-xl font-bold mb-3">Pricing Strategy</h2>
        <p className="mb-4">
          Determine the <span className="highlight-yellow">optimal pricing strategy</span> for your offer 
          that maximizes value perception while remaining competitive.
        </p>
        
        <div className="mb-4">
          <label className="block font-medium mb-2">Your Pricing Strategy:</label>
          <textarea
            className={`w-full p-3 border rounded-md ${errors.strategy ? 'border-red-500' : 'border-gray-300'}`}
            rows={3}
            placeholder="e.g., Premium pricing with tiered packages, Free trial with subscription model..."
            value={localPricing.strategy}
            onChange={(e) => handleChange('strategy', e.target.value)}
          />
          {errors.strategy && (
            <p className="text-red-500 mt-1">Please enter your pricing strategy</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block font-medium mb-2">Justification:</label>
          <textarea
            className={`w-full p-3 border rounded-md ${errors.justification ? 'border-red-500' : 'border-gray-300'}`}
            rows={4}
            placeholder="Explain why this pricing strategy is appropriate for your offer and target audience..."
            value={localPricing.justification}
            onChange={(e) => handleChange('justification', e.target.value)}
          />
          {errors.justification && (
            <p className="text-red-500 mt-1">Please justify your pricing strategy</p>
          )}
        </div>
      </Card>
      
      <Card variant="muted" padding="lg" className="mb-6">
        <h3 className="text-lg font-bold mb-3">Tips for Effective Pricing</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            <span>Consider your costs, competitor pricing, and customer willingness to pay</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            <span>Test different price points with small segments before full launch</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            <span>Price based on the value your offer provides, not just on costs</span>
          </li>
          <li className="flex items-start">
            <X className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            <span>Avoid pricing too low out of fear; underpricing can reduce perceived value</span>
          </li>
        </ul>
      </Card>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button variant="primary" onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  );
}; 