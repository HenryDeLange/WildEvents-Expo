import { Dispatch, SetStateAction, memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { SegmentedButtons, SegmentedButtonsProps } from 'react-native-paper';

// TODO: Get these values from the BE via an endpoint
const MAX_STEPS = 5;

export const ADD_STEP = 'NewStep';

type Props = {
    stepCount: number;
    selectedStep: string;
    setSelectedStep: Dispatch<SetStateAction<string>>;
    disabled?: boolean;
}

function StepButtons({ stepCount, selectedStep, setSelectedStep, disabled }: Readonly<Props>) {
    const { t } = useTranslation();
    const stepOptions = useMemo<SegmentedButtonsProps['buttons']>(() => {
        const stepButtons: SegmentedButtonsProps['buttons'] = [{
            value: '1',
            label: t('activityCardStepCount', { step: 1 }),
            disabled: disabled
        }];
        for (let i = 2; i <= stepCount; i++) {
            stepButtons.push({
                value: String(i),
                label: t('activityCardStepCount', { step: i }),
                disabled: disabled
            });
        }
        if (stepButtons.length < MAX_STEPS) {
            stepButtons.push({
                value: ADD_STEP,
                label: t('activityCardStepAdd'),
                disabled: disabled,
                icon: 'plus'
            });
        }
        return stepButtons;
    }, [stepCount, disabled]);
    const handleValueChange = useCallback((value: string) => {
        setSelectedStep(value);
    }, [setSelectedStep]);
    // RENDER
    return (
        <SegmentedButtons
            style={styles.segmentedButtons}
            value={selectedStep}
            onValueChange={handleValueChange}
            buttons={stepOptions}
            density='medium'
        />
    );
}

export default memo(StepButtons);

const styles = StyleSheet.create({
    segmentedButtons: {
        flexWrap: 'wrap'
    }
});
