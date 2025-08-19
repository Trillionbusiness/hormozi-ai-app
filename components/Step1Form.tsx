
import React, { useState } from 'react';
import { BusinessData } from '../types';
import Card from './common/Card';
import { businessExamples } from '../data/businessExamples';
import { generateFieldSuggestion } from '../services/hormoziAiService';

interface Step1FormProps {
  onSubmit: (data: BusinessData) => void;
}

const currencies = [
  { code: 'USD', name: 'USD - US Dollar' },
  { code: 'EUR', name: 'EUR - Euro' },
  { code: 'JPY', name: 'JPY - Japanese Yen' },
  { code: 'GBP', name: 'GBP - British Pound' },
  { code: 'AUD', name: 'AUD - Australian Dollar' },
  { code: 'CAD', name: 'CAD - Canadian Dollar' },
  { code: 'CHF', name: 'CHF - Swiss Franc' },
  { code: 'CNY', name: 'CNY - Chinese Yuan' },
  { code: 'INR', name: 'INR - Indian Rupee' },
  { code: 'BRL', name: 'BRL - Brazilian Real' },
  { code: 'ZAR', name: 'ZAR - South African Rand'},
  { code: 'SGD', name: 'SGD - Singapore Dollar'},
  { code: 'AED', name: 'AED - UAE Dirham' },
];

const countries = [
  "United States", "United Kingdom", "United Arab Emirates", "Canada", "Australia", "Germany", "France", "Japan", "China", "India", "Brazil", "South Africa", "Singapore", "Other"
];

const businessCategories = [
    "All Categories",
    "Local Business",
    "Service Business",
    "Agency / Consulting",
    "SaaS / Digital Product",
    "E-commerce",
];


const InputField: React.FC<{
    id: string,
    label: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    placeholder: string,
    type?: string,
    required?: boolean,
    onAutofill?: () => void,
    isAutofilling?: boolean
}> = ({ id, label, value, onChange, placeholder, type = "text", required = true, onAutofill, isAutofilling }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <div className="relative">
            <input 
                type={type}
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition ${onAutofill ? 'pr-10' : ''}`}
                required={required}
            />
            {onAutofill && (
                <button
                    type="button"
                    onClick={onAutofill}
                    disabled={isAutofilling}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-yellow-400 hover:text-yellow-300 disabled:opacity-50 disabled:cursor-wait"
                    aria-label={`Get AI suggestion for ${label}`}
                    title={`Get AI suggestion for ${label}`}
                >
                    {isAutofilling ? (
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3.25a.75.75 0 01.75.75v1.25h1.25a.75.75 0 010 1.5H10.75v1.25a.75.75 0 01-1.5 0V6.75H8a.75.75 0 010-1.5h1.25V3.999a.75.75 0 01.75-.75zM10 16.75a.75.75 0 01-.75-.75v-1.25H8a.75.75 0 010-1.5h1.25v-1.25a.75.75 0 011.5 0v1.25h1.25a.75.75 0 010 1.5H10.75v1.25a.75.75 0 01-.75.75zM3.25 10a.75.75 0 01.75-.75h1.25V8a.75.75 0 011.5 0v1.25h1.25a.75.75 0 010 1.5H6.75v1.25a.75.75 0 01-1.5 0V10.75H4a.75.75 0 01-.75-.75zM16.75 10a.75.75 0 01-.75.75h-1.25v1.25a.75.75 0 01-1.5 0V10.75h-1.25a.75.75 0 010-1.5h1.25V8a.75.75 0 011.5 0v1.25h1.25a.75.75 0 01.75.75z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>
            )}
        </div>
    </div>
);


const SelectField: React.FC<{ id: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, children: React.ReactNode }> = ({ id, label, value, onChange, children }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <select
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            required
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
        >
            {children}
        </select>
    </div>
);

const RadioGroupField: React.FC<{ id: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, options: { label: string, value: string }[] }> = ({ id, label, value, onChange, options }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <div className="flex items-center space-x-6">
            {options.map(option => (
                <label key={option.value} className="flex items-center space-x-2 text-gray-200 cursor-pointer">
                    <input
                        type="radio"
                        name={id}
                        value={option.value}
                        checked={value === option.value}
                        onChange={onChange}
                        required
                        className="h-4 w-4 text-yellow-400 bg-gray-800 border-gray-600 focus:ring-yellow-400 focus:ring-offset-gray-900"
                    />
                    <span>{option.label}</span>
                </label>
            ))}
        </div>
    </div>
);

const FormSectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="text-lg font-bold text-yellow-400 border-b border-gray-600 pb-2 mt-8 mb-6">{children}</h3>
);

const Step1Form: React.FC<Step1FormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<BusinessData>({
    country: '',
    currency: '',
    businessType: '',
    location: '',
    monthlyRevenue: '',
    employees: '',
    marketingMethods: '',
    biggestChallenge: '',
    coreOffer: '',
    targetClient: '',
    offerTimeline: '',
    hasSalesTeam: '',
    monthlyAdSpend: '',
    profitGoal: '',
    hasCertifications: '',
    hasTestimonials: '',
    physicalCapacity: '',
    ancillaryProducts: '',
    perceivedMaxPrice: '',
    dailyTimeCommitment: '',
    businessStage: 'existing',
    fundingStatus: undefined,
  });

  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [generatingField, setGeneratingField] = useState<keyof BusinessData | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
        const newState = { ...prev, [name]: value };
        if (name === 'businessStage' && value === 'existing') {
            newState.fundingStatus = undefined;
        }
        if (name === 'businessStage' && value === 'new' && !newState.fundingStatus) {
            newState.fundingStatus = 'bootstrapped';
        }
        return newState;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleAutofill = () => {
    const categoryFiltered = selectedCategory === "All Categories"
        ? businessExamples
        : businessExamples.filter(ex => ex.category === selectedCategory);
    
    const stageFiltered = categoryFiltered.filter(ex => ex.businessStage === formData.businessStage);

    let examplesToUse = stageFiltered.length > 0 ? stageFiltered : categoryFiltered;

    if (examplesToUse.length === 0) {
      examplesToUse = businessExamples;
    }

    const randomIndex = Math.floor(Math.random() * examplesToUse.length);
    const example = examplesToUse[randomIndex];

    const fullData: BusinessData = {
        country: '', currency: '', businessType: '', location: '', monthlyRevenue: '', employees: '', marketingMethods: '',
        biggestChallenge: '', coreOffer: '', targetClient: '', offerTimeline: 'one_time', hasSalesTeam: 'no',
        monthlyAdSpend: '0', profitGoal: '', hasCertifications: 'no', hasTestimonials: 'no', physicalCapacity: '',
        ancillaryProducts: '', perceivedMaxPrice: '', dailyTimeCommitment: '', businessStage: 'existing', fundingStatus: undefined,
        ...example,
    };

    setFormData(fullData);
  };

  const handleGenerateField = async (fieldName: keyof BusinessData) => {
    setGeneratingField(fieldName);
    try {
        const suggestion = await generateFieldSuggestion(formData, fieldName);
        setFormData(prev => ({...prev, [fieldName]: suggestion}));
    } catch (error) {
        console.error(`Failed to generate suggestion for ${fieldName}`, error);
    } finally {
        setGeneratingField(null);
    }
  };
  
  const subheaderText = formData.businessStage === 'new' 
    ? "Get ideas for a new venture, or describe your own."
    : "Describe your current business, or get examples to inspire you.";

  return (
    <Card>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">Start Your Plan.</h2>
        <p className="text-gray-400 mt-2">{subheaderText}</p>
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
            <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-sm"
            >
                {businessCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <button
                type="button"
                onClick={handleAutofill}
                className="px-4 py-2 bg-gray-600 text-yellow-300 font-semibold rounded-md hover:bg-gray-500 transition-colors text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 3a1 1 0 011 1v1.334l1.322-1.323a1 1 0 111.414 1.414l-1.403 1.404A5.001 5.001 0 0115 10a5 5 0 01-5 5v2a1 1 0 11-2 0v-2a5 5 0 01-5-5c0-1.606.767-3.033 1.95-3.95l-1.405-1.404a1 1 0 111.414-1.414L8 5.334V4a1 1 0 011-1zm-4.322 7.323a3 3 0 106.644 0 3 3 0 00-6.644 0z" />
                <path d="M10 4a1 1 0 011 1v.01a1 1 0 11-2 0V5a1 1 0 011-1z" />
              </svg>
              Shuffle & Autofill
            </button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">

        <FormSectionHeader>Your Situation</FormSectionHeader>
        <div className="grid md:grid-cols-2 gap-6 items-start">
            <RadioGroupField
                id="businessStage"
                label="What is your business stage?"
                value={formData.businessStage || 'existing'}
                onChange={handleChange}
                options={[
                    { label: 'Improving an Existing Business', value: 'existing' },
                    { label: 'Starting a New Business', value: 'new' }
                ]}
            />
            {formData.businessStage === 'new' && (
                <RadioGroupField
                    id="fundingStatus"
                    label="How are you funding it?"
                    value={formData.fundingStatus || 'bootstrapped'}
                    onChange={handleChange}
                    options={[
                        { label: 'Bootstrapping (No Money)', value: 'bootstrapped' },
                        { label: 'With Funding / Capital', value: 'funded' }
                    ]}
                />
            )}
        </div>
        
        <FormSectionHeader>Your Business</FormSectionHeader>
        <div className="grid md:grid-cols-2 gap-6">
            <InputField id="businessType" label="Business Type or Idea" value={formData.businessType} onChange={handleChange} placeholder="e.g., SaaS, Coaching, Agency" onAutofill={() => handleGenerateField('businessType')} isAutofilling={generatingField === 'businessType'} />
            <InputField id="location" label="City & State/Province" value={formData.location} onChange={handleChange} placeholder="e.g., Austin, Texas" />
             <SelectField id="country" label="Country" value={formData.country} onChange={handleChange}>
                <option value="" disabled>Select Country</option>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </SelectField>
            <SelectField id="currency" label="Currency" value={formData.currency} onChange={handleChange}>
                <option value="" disabled>Select Currency</option>
                {currencies.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
            </SelectField>
            <InputField id="employees" label="Current or Planned Employees" value={formData.employees} onChange={handleChange} placeholder="e.g., 3" type="number" />
            <InputField id="monthlyRevenue" label="Current Monthly Revenue (use 0 for new ideas)" value={formData.monthlyRevenue} onChange={handleChange} placeholder="e.g., 50000" type="text" />
        </div>

        <FormSectionHeader>Your Offer</FormSectionHeader>
        <div className="grid md:grid-cols-2 gap-6">
            <InputField id="marketingMethods" label="Current or Planned Marketing" value={formData.marketingMethods} onChange={handleChange} placeholder="e.g., Social Media, Referrals" onAutofill={() => handleGenerateField('marketingMethods')} isAutofilling={generatingField === 'marketingMethods'} />
            <InputField id="biggestChallenge" label="Biggest Challenge or Question" value={formData.biggestChallenge} onChange={handleChange} placeholder="What holds you back?" onAutofill={() => handleGenerateField('biggestChallenge')} isAutofilling={generatingField === 'biggestChallenge'} />
            <InputField id="coreOffer" label="Main Offer & Price (or idea)" value={formData.coreOffer} onChange={handleChange} placeholder="e.g., 12-Week Program for 2000" onAutofill={() => handleGenerateField('coreOffer')} isAutofilling={generatingField === 'coreOffer'} />
            <SelectField id="offerTimeline" label="Offer Timeline" value={formData.offerTimeline} onChange={handleChange}>
                <option value="" disabled>Select Timeline</option>
                <option value="monthly">Per Month</option>
                <option value="quarterly">Per Quarter</option>
                <option value="half_yearly">Per Half-Year</option>
                <option value="one_time">One-Time Package</option>
            </SelectField>
            <div className="md:col-span-2">
                <InputField id="targetClient" label="Your Ideal Customer" value={formData.targetClient} onChange={handleChange} placeholder="Describe your ideal customer" onAutofill={() => handleGenerateField('targetClient')} isAutofilling={generatingField === 'targetClient'}/>
            </div>
        </div>

        <FormSectionHeader>Your Tools & Goals</FormSectionHeader>
        <div className="grid md:grid-cols-2 gap-6">
            <InputField id="dailyTimeCommitment" label="Daily Hours for Growth" value={formData.dailyTimeCommitment} onChange={handleChange} placeholder="e.g., 2" type="number" />
            <InputField id="profitGoal" label="Desired Monthly Profit" value={formData.profitGoal} onChange={handleChange} placeholder="e.g., 100000" type="text" />
            <RadioGroupField id="hasSalesTeam" label="Have or plan a sales team?" value={formData.hasSalesTeam} onChange={handleChange} options={[{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}]} />
            <RadioGroupField id="hasCertifications" label="Have or need certifications?" value={formData.hasCertifications} onChange={handleChange} options={[{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}]} />
            <InputField id="monthlyAdSpend" label="Monthly Ad Spend (current or planned)" value={formData.monthlyAdSpend} onChange={handleChange} placeholder="e.g., 5000" type="text" />
            <InputField id="physicalCapacity" label="Location Capacity (if any)" value={formData.physicalCapacity} onChange={handleChange} placeholder="e.g., 100 customers" type="text" required={false} />
            <RadioGroupField id="hasTestimonials" label="Have testimonials?" value={formData.hasTestimonials} onChange={handleChange} options={[{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}]} />
             <div className="md:col-span-2">
                <InputField id="ancillaryProducts" label="Other Items for Sale?" value={formData.ancillaryProducts} onChange={handleChange} placeholder="List any extra products or ideas" required={false} onAutofill={() => handleGenerateField('ancillaryProducts')} isAutofilling={generatingField === 'ancillaryProducts'} />
            </div>
             <div className="md:col-span-2">
                <InputField id="perceivedMaxPrice" label="What would a perfect result be worth to a customer?" value={formData.perceivedMaxPrice} onChange={handleChange} placeholder="e.g., 10000" type="text" />
            </div>
        </div>
        
        <div className="pt-4">
            <button 
                type="submit" 
                className="w-full bg-yellow-400 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-400"
            >
                Make My Plan!
            </button>
        </div>
      </form>
    </Card>
  );
};

export default Step1Form;