import * as Crypto from 'expo-crypto';
import { useEffect, useState } from 'react';
import { Control, Controller, UseFormSetValue, UseFormTrigger, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { ActivityCreate, ActivityStep } from '../../../../state/redux/api/wildEventsApi';
import StepButtons, { ADD_STEP } from './StepButtons';
import StepDetails from './StepDetails';

type Props = {
    control: Control<ActivityCreate, any>;
    setValue: UseFormSetValue<ActivityCreate>;
    trigger: UseFormTrigger<ActivityCreate>;
    initialType?: ActivityCreate['type'];
    loading?: boolean;
}

function Steps({ control, setValue, trigger, initialType, loading }: Readonly<Props>) {
    const { t } = useTranslation();
    // Form
    const type = useWatch({ control, name: 'type' });
    const steps = useWatch({ control, name: 'steps' });
    // State
    const [selectedStep, setSelectedStep] = useState('1');
    const [blankStepCriteria, setBlankStepCriteria] = useState(true);
    // Handle type change
    useEffect(() => {
        setSelectedStep('1');
        if (type !== initialType) {
            switch (type) {
                case 'RACE':
                    setValue('steps', [{
                        id: Crypto.randomUUID(),
                        description: '',
                        criteria: { 'taxon_name': '' }
                    }]);
                    break;
                case 'HUNT':
                    setValue('steps', [{
                        id: Crypto.randomUUID(),
                        description: '',
                        criteria: { 'taxon_name': '', 'lat': '', 'lng': '', 'radius': '' }
                    }]);
                    break;
                case 'QUIZ':
                    setValue('steps', [{
                        id: Crypto.randomUUID(),
                        description: '',
                        criteria: { 'taxon_name': '' }
                    }]);
                    break;
                case 'EXPLORE':
                    setValue('steps', [{
                        id: Crypto.randomUUID(),
                        description: '',
                        criteria: { 'nelat': '', 'nelng': '', 'swlat': '', 'swlng': '' }
                    }]);
                    break;
            }
        }
    }, [initialType, type, setValue, setSelectedStep]);
    // Handle adding a new step
    const addNewStep = selectedStep === ADD_STEP;
    const stepCount = steps.length;
    useEffect(() => {
        if (addNewStep) {
            setSelectedStep(String(stepCount + 1));
            switch (type) {
                case 'RACE':
                    setValue('steps', [...steps, {
                        id: Crypto.randomUUID(),
                        description: '',
                        criteria: { 'taxon_name': '' }
                    }]);
                    break;
                case 'HUNT':
                    setValue('steps', [...steps, {
                        id: Crypto.randomUUID(),
                        description: '',
                        criteria: { 'taxon_name': '', 'lat': '', 'lng': '', 'radius': '' }
                    }]);
                    break;
                case 'QUIZ':
                    setValue('steps', [...steps, {
                        id: Crypto.randomUUID(),
                        description: '',
                        criteria: { 'taxon_name': '' }
                    }]);
                    break;
                case 'EXPLORE':
                    setValue('steps', [...steps, {
                        id: Crypto.randomUUID(),
                        description: '',
                        criteria: { 'nelat': '', 'nelng': '', 'swlat': '', 'swlng': '' }
                    }]);
                    break;
            }
        }
        // Trigger the validation rules
        if (!blankStepCriteria) {
            trigger('steps');
        }
    }, [type, steps, addNewStep, stepCount, blankStepCriteria]);
    useEffect(() => {
        // Logic to (un)hide validation errors before the fields have been edited
        if (steps.length > 1) {
            setBlankStepCriteria(false);
        }
        else if (steps.length === 1) {
            if (steps[0].description) {
                setBlankStepCriteria(false);
            }
            else {
                let hasCriteria = false;
                for (let key of Object.keys(steps[0].criteria ?? {})) {
                    hasCriteria = steps[0].criteria ? !!steps[0].criteria[key] : false;
                    break;
                }
                if (hasCriteria) {
                    setBlankStepCriteria(false);
                }
            }
        }
    }, [steps]);
    // RENDER
    return (
        <Controller control={control}
            name='steps'
            disabled={loading}
            rules={{
                validate: {
                    description: (steps: ActivityStep[]) => {
                        for (let step of steps) {
                            if (!step.description || step.description.trim().length <= 0) {
                                return t('activityCardStepDescriptionRequired', { step: steps.indexOf(step) + 1 });
                            }
                        }
                        return true;
                    },
                    criteria: (steps: ActivityStep[]) => {
                        for (let step of steps) {
                            const tempCriteria = step.criteria;
                            if (tempCriteria) {
                                for (let key of Object.keys(tempCriteria)) {
                                    if (!tempCriteria[key] || tempCriteria[key].trim().length <= 0) {
                                        return t('activityCardStepCriteriaRequired', { step: steps.indexOf(step) + 1 });
                                    }
                                }
                            }
                        }
                        return true;
                    },
                }
            }}
            render={({ field: { onChange, value, disabled }, fieldState: { error } }) => (
                <View>
                    <StepButtons
                        stepCount={stepCount}
                        selectedStep={selectedStep}
                        setSelectedStep={setSelectedStep}
                        disabled={disabled}
                    />
                    <StepDetails
                        steps={value}
                        onChange={onChange}
                        error={error}
                        selectedStep={selectedStep}
                        setSelectedStep={setSelectedStep}
                        disabled={disabled}
                    />
                </View>
            )}
        />
    );
}

export default Steps;
