import { Dispatch, SetStateAction, memo, useCallback } from 'react';
import { FieldError } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { HelperText, Icon, IconButton, Text, TextInput, Tooltip } from 'react-native-paper';
import { ActivityStep } from '../../../../state/redux/api/wildEventsApi';
import InaturalistTaxa from './InaturalistTaxa';

type Props = {
    steps: ActivityStep[];
    onChange: (...event: any[]) => void;
    error: FieldError | undefined;
    selectedStep: string;
    setSelectedStep: Dispatch<SetStateAction<string>>;
    disabled?: boolean;
}

function StepDetails({ steps, onChange, error, selectedStep, setSelectedStep, disabled }: Readonly<Props>) {
    const { t } = useTranslation();
    // Handle removing the step
    const handleStepRemove = useCallback(() => {
        if (steps && selectedStep) {
            const stepIndex = Number(selectedStep) - 1;
            const newSteps: ActivityStep[] = [
                ...steps.slice(0, stepIndex),
                ...steps.slice(stepIndex + 1)
            ];
            onChange(newSteps);
            setSelectedStep(String(Math.max(1, Number(selectedStep) - 1)));
        }
    }, [steps, onChange, selectedStep, setSelectedStep]);
    // Edit Description
    const handleStepDescription = useCallback((text: string) => {
        if (steps && selectedStep) {
            const stepIndex = Number(selectedStep) - 1;
            const newSteps: ActivityStep[] = [
                ...steps.slice(0, stepIndex),
                {
                    ...steps[stepIndex],
                    description: text
                },
                ...steps.slice(stepIndex + 1)
            ];
            onChange(newSteps);
        }
    }, [steps, selectedStep, onChange]);
    // Edit Criteria
    const handleStepCriteriaValue = useCallback((key: string) => (text: string) => {
        let filteredText;
        switch (key) {
            case 'taxon_id':
                filteredText = text;
                break;
            case 'radius':
                filteredText = text.replace(/[^0-9.]/g, '');
                break;
            default:
                filteredText = text.replace(/(?!^-)[^0-9.]/g, '');
        }
        if (steps && selectedStep) {
            const stepIndex = Number(selectedStep) - 1;
            const newSteps: ActivityStep[] = [
                ...steps.slice(0, stepIndex),
                {
                    ...steps[stepIndex],
                    description: steps[stepIndex].description,
                    criteria: {
                        ...steps[stepIndex].criteria,
                        [key]: filteredText
                    }
                },
                ...steps.slice(stepIndex + 1)
            ];
            onChange(newSteps);
        }
    }, [steps, selectedStep, onChange]);
    // RENDER
    const activeStep: ActivityStep | undefined = steps[Number(selectedStep) - 1];
    return (
        <>
            <View style={styles.activityWrapper}>
                <Text variant='titleMedium' style={styles.heading}>
                    {t(`activityCardStepDetails`)}
                </Text>
                {(!disabled && steps.length > 1) &&
                    <Tooltip title={t('activityCardStepRemove')}>
                        <IconButton
                            icon='trash-can-outline'
                            disabled={disabled || (steps.length <= 1)}
                            animated
                            onPress={handleStepRemove}
                        />
                    </Tooltip>
                }
            </View>
            {!!error &&
                <HelperText type='error'>
                    {error.message}
                </HelperText>
            }
            <View style={styles.activityContent}>
                <TextInput
                    key='description'
                    style={styles.activityDescription}
                    mode='outlined'
                    label={t('activityCardStepDescription')}
                    disabled={disabled}
                    value={activeStep?.description ?? ''}
                    onChangeText={handleStepDescription}
                    left={<TextInput.Icon icon={({ size, color }) => <Icon source='information-outline' size={size} />} focusable={false} disabled={true} />}
                    multiline
                    numberOfLines={3}
                />
                {Object.keys(activeStep?.criteria ?? {}).map((key, index) => {
                    switch (key) {
                        case 'taxon_id':
                            return (
                                <InaturalistTaxa
                                    key={`step${selectedStep}Criterion${index}`}
                                    disabled={disabled}
                                    value={(activeStep?.criteria && activeStep?.criteria[key]) ?? ''}
                                    onChange={handleStepCriteriaValue(key)}
                                />
                            );
                        default:
                            return (
                                <TextInput
                                    key={`step${selectedStep}Criterion${index}`}
                                    disabled={disabled}
                                    mode='outlined'
                                    label={t(`activityCriteria_${key}`, { defaultValue: t('activityCriteria_custom') })}
                                    placeholder={t(`activityCriteriaHelp_${key}`, { defaultValue: t('activityCriteriaHelp_custom') })}
                                    value={activeStep?.criteria && activeStep.criteria[key]}
                                    onChangeText={handleStepCriteriaValue(key)}
                                    keyboardType='decimal-pad'
                                />
                            );
                    }
                })}
            </View>
        </>
    );
}

export default memo(StepDetails);

const styles = StyleSheet.create({
    activityWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: -8,
        marginLeft: 2
    },
    heading: {
        marginTop: 8,
        marginBottom: 16
    },
    activityContent: {
        flex: 1,
        gap: 10
    },
    activityDescription: {
        display: 'flex',
        flex: 1
    }
});
