import * as Crypto from 'expo-crypto';
import { useEffect, useState } from 'react';
import { Control, Controller, UseFormSetValue, useWatch } from 'react-hook-form';
import { View } from 'react-native';
import { ActivityCreate } from '../../../../state/redux/api/wildEventsApi';
import StepButtons, { ADD_STEP } from './StepButtons';
import StepDetails from './StepDetails';

type Props = {
    control: Control<ActivityCreate, any>;
    setValue: UseFormSetValue<ActivityCreate>;
    initialType?: ActivityCreate['type'];
    loading?: boolean;
}

function Steps({ control, setValue, initialType, loading }: Readonly<Props>) {
    // Form
    const type = useWatch({ control, name: 'type' });
    const steps = useWatch({ control, name: 'steps' });
    // State
    const [selectedStep, setSelectedStep] = useState('1');
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
    }, [type, steps, addNewStep, stepCount]);

    // TODO: Implement validation rules
    
    // Validation
    // let stepError = false;
    // for (let tempStep of (steps ?? [])) {
    //     if (!tempStep.description || tempStep.description.trim().length <= 0) {
    //         stepError = true;
    //         break;
    //     }
    //     const tempCriteria = tempStep.criteria;
    //     if (tempCriteria) {
    //         for (let key of Object.keys(tempCriteria)) {
    //             if (!tempCriteria[key] || tempCriteria[key].trim().length <= 0) {
    //                 stepError = true;
    //                 break;
    //             }
    //         }
    //     }
    // }
    // RENDER
    return (
        <Controller control={control}
            name='steps'
            disabled={loading}
            // rules={{}}
            render={({ field: { onChange, value, disabled } }) => (
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
