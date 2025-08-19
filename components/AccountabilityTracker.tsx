import React, { useState, useMemo } from 'react';
import { GeneratedAccountabilityTracker, TrackerPhase, TrackerAction } from '../types';
import Card from './common/Card';
import ProgressBar from './common/ProgressBar';

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-2xl font-black text-white tracking-tight border-b-2 border-yellow-400 pb-2 mb-6">{children}</h3>
);

interface PhaseCardProps {
    phase: TrackerPhase;
    onUpdateAction: (updatedAction: TrackerAction) => void;
    isStatic?: boolean;
}

const PhaseCard: React.FC<PhaseCardProps> = ({ phase, onUpdateAction, isStatic }) => {
    const completedActions = useMemo(() => phase.actions.filter(a => a.isComplete).length, [phase.actions]);
    const totalActions = phase.actions.length;
    const progress = totalActions > 0 ? (completedActions / totalActions) * 100 : 0;

    return (
        <Card className="bg-gray-800/50 border-gray-700">
            <h4 className="text-xl font-bold text-yellow-400">Phase {phase.phaseNumber}: {phase.title}</h4>
            <p className="text-gray-400 italic mt-1">🎯 Your Goal: {phase.goal}</p>

            <div className="my-4">
                <ProgressBar progress={progress} loadingText={`${completedActions} / ${totalActions} Actions Complete`} />
            </div>

            <div className="space-y-4">
                <div>
                    <h5 className="font-bold text-white mb-2">Key Actions:</h5>
                    <div className="space-y-3">
                        {phase.actions.map(action => (
                            <ActionItem key={action.id} action={action} onUpdate={onUpdateAction} isStatic={isStatic} />
                        ))}
                    </div>
                </div>
                <div>
                     <h5 className="font-bold text-white mb-2">Daily Checklist:</h5>
                     <ul className="space-y-2">
                        {phase.dailyChecklist.map((item, index) => (
                            <li key={index} className="flex items-center text-gray-300 text-sm">
                                <span className="flex items-center justify-center w-5 h-5 bg-gray-700 border border-gray-600 rounded mr-3"></span>
                                {item}
                            </li>
                        ))}
                     </ul>
                </div>
            </div>
        </Card>
    );
};

interface ActionItemProps {
    action: TrackerAction;
    onUpdate: (updatedAction: TrackerAction) => void;
    isStatic?: boolean;
}

const ActionItem: React.FC<ActionItemProps> = ({ action, onUpdate, isStatic }) => {
    const handleCheck = () => {
        if (isStatic) return;
        onUpdate({ ...action, isComplete: !action.isComplete });
    };
    
    return (
        <div className={`p-4 rounded-lg transition-colors ${action.isComplete ? 'bg-green-900/40 border-green-700' : 'bg-gray-700/60 border-gray-600'} border-l-4`}>
            <div className="flex items-start gap-3">
                {!isStatic && (
                    <input
                        type="checkbox"
                        checked={action.isComplete}
                        onChange={handleCheck}
                        className="h-6 w-6 mt-1 rounded bg-gray-800 border-gray-500 text-yellow-400 focus:ring-yellow-400 focus:ring-offset-gray-800 cursor-pointer"
                    />
                )}
                <div className="flex-grow">
                     <p className={`font-semibold ${action.isComplete ? 'text-green-300 line-through' : 'text-gray-200'}`}>{action.description}</p>
                     <p className="text-xs text-gray-400 mt-1">📈 Metric: {action.metric}</p>
                </div>
            </div>
            {!isStatic && (
                 <div className="mt-3 pl-9">
                    <textarea
                        value={action.resultNotes}
                        onChange={(e) => onUpdate({ ...action, resultNotes: e.target.value })}
                        placeholder="What happened? What did you learn?"
                        className="w-full bg-gray-800/70 border border-gray-600 rounded-md py-1 px-2 text-gray-200 text-sm h-16 focus:ring-2 focus:ring-yellow-400"
                    />
                </div>
            )}
        </div>
    );
};


interface AccountabilityTrackerProps {
  tracker: GeneratedAccountabilityTracker;
  isStatic?: boolean;
}

const AccountabilityTracker: React.FC<AccountabilityTrackerProps> = ({ tracker, isStatic = false }) => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phases, setPhases] = useState<TrackerPhase[]>(tracker.phases);

  const currentPhase = phases[currentPhaseIndex];
  const isPhaseComplete = useMemo(() => currentPhase.actions.every(a => a.isComplete), [currentPhase.actions]);
  const isFinalPhase = currentPhaseIndex === phases.length - 1;

  const handleUpdateAction = (updatedAction: TrackerAction) => {
    const newPhases = [...phases];
    const phaseToUpdate = newPhases[currentPhaseIndex];
    const actionIndex = phaseToUpdate.actions.findIndex(a => a.id === updatedAction.id);
    if (actionIndex !== -1) {
        phaseToUpdate.actions[actionIndex] = updatedAction;
        setPhases(newPhases);
    }
  };
  
  const goToNextPhase = () => {
    if (!isFinalPhase) {
        setCurrentPhaseIndex(prev => prev + 1);
    }
  };

  return (
    <Card>
      <SectionHeader>{tracker.title}</SectionHeader>
      <div className="text-center mb-8 bg-gray-900/70 p-4 rounded-lg border border-gray-700">
        <p className="text-lg font-bold text-yellow-400">The Big Idea</p>
        <p className="text-gray-300 italic">"{tracker.corePrinciple}"</p>
      </div>
      
      <PhaseCard phase={currentPhase} onUpdateAction={handleUpdateAction} isStatic={isStatic} />

      {!isStatic && (
          <div className="mt-6 text-center">
            {isPhaseComplete && !isFinalPhase && (
                 <button
                    onClick={goToNextPhase}
                    className="px-8 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105"
                 >
                    Complete Phase & Unlock Next Steps &rarr;
                </button>
            )}
            {isPhaseComplete && isFinalPhase && (
                 <div className="p-4 bg-green-500 text-white font-bold rounded-lg">
                    🎉 Congratulations! You've completed the Action Playbook. Now, keep the momentum going!
                </div>
            )}
          </div>
      )}
    </Card>
  );
};

export default AccountabilityTracker;