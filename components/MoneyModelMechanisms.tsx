
import React from 'react';
import { GeneratedMoneyModelMechanisms, MoneyModelMechanism } from '../types';
import Card from './common/Card';

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-2xl font-black text-white tracking-tight border-b-2 border-yellow-400 pb-2 mb-6">{children}</h3>
);

const MechanismCard: React.FC<{ mechanism: MoneyModelMechanism }> = ({ mechanism }) => {
    const typeStyles = {
        Attraction: {
            borderColor: 'border-yellow-400',
            bgColor: 'bg-yellow-900/20',
            textColor: 'text-yellow-300',
            icon: '👋'
        },
        Upsell: {
            borderColor: 'border-green-400',
            bgColor: 'bg-green-900/20',
            textColor: 'text-green-300',
            icon: '💰'
        },
        Downsell: {
            borderColor: 'border-blue-400',
            bgColor: 'bg-blue-900/20',
            textColor: 'text-blue-300',
            icon: '🤝'
        },
        Continuity: {
            borderColor: 'border-purple-400',
            bgColor: 'bg-purple-900/20',
            textColor: 'text-purple-300',
            icon: '🔄'
        },
    };

    const styles = typeStyles[mechanism.mechanismType];

    return (
        <Card className={`${styles.bgColor} border-t-4 ${styles.borderColor}`}>
            <div className="flex items-start gap-4">
                <span className="text-3xl">{styles.icon}</span>
                <div>
                    <p className={`font-bold uppercase tracking-wider text-sm ${styles.textColor}`}>{mechanism.mechanismType} Offer</p>
                    <h4 className="text-xl font-bold text-white">{mechanism.tacticName}</h4>
                </div>
            </div>
            
            <div className="mt-4 pl-12 space-y-4">
                <div>
                    <p className="font-semibold text-gray-300">Your Strategy:</p>
                    <p className="text-gray-400 text-sm">{mechanism.strategy}</p>
                </div>
                 <div>
                    <p className="font-semibold text-gray-300">Example Offer:</p>
                    <p className="text-gray-400 text-sm italic bg-gray-900/50 p-3 rounded-md mt-1">"{mechanism.example}"</p>
                </div>
                 <div>
                    <p className="font-semibold text-gray-300">How to Do It:</p>
                    <p className="text-gray-400 text-sm whitespace-pre-wrap">{mechanism.implementationNotes}</p>
                </div>
            </div>
        </Card>
    );
};


const MoneyModelMechanisms: React.FC<{ moneyModelMechanisms: GeneratedMoneyModelMechanisms }> = ({ moneyModelMechanisms }) => {
  return (
    <Card>
      <SectionHeader>{moneyModelMechanisms.title}</SectionHeader>
      <div className="text-center mb-8 bg-gray-900/70 p-4 rounded-lg border border-gray-700">
        <p className="text-lg font-bold text-yellow-400">The Big Idea</p>
        <p className="text-gray-300 italic">"{moneyModelMechanisms.corePrinciple}"</p>
      </div>
      <div className="space-y-6">
        {moneyModelMechanisms.mechanisms.map((mechanism, index) => (
            <MechanismCard key={index} mechanism={mechanism} />
        ))}
      </div>
    </Card>
  );
};

export default MoneyModelMechanisms;
