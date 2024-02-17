import { ActivityCalculation, ActivityStepResult } from "@/state/redux/api/wildEventsApi";
import { ParticipantScore } from "../ActivityParticipantScore";

export function generateScoreMap(map: Map<string, ActivityCalculation>, results?: ActivityStepResult[]) {
    for (let result of results ?? []) {
        if (result.participantScores) {
            for (let participant of Object.keys(result.participantScores)) {
                const tempScore = result.participantScores[participant];
                const tempTotal = map.get(participant);
                let total = null;
                if (tempTotal) {
                    total = { ...tempTotal };
                    total.score = total.score! + (tempScore.score ?? 0);
                    total.observations?.push(...tempScore.observations ?? []);
                }
                else {
                    total = {
                        score: tempScore.score ?? 0,
                        observations: [...(tempScore.observations ?? [])]
                    };
                }
                map.set(participant, total);
            }
        }
    }
}

export function generateScoreList(map: Map<string, ActivityCalculation>) {
    const finalTotals: ParticipantScore[] = [];
    for (let entry of map) {
        finalTotals.push({
            name: entry[0],
            score: entry[1].score,
            observations: entry[1].observations
        });
    }
    finalTotals.sort((a, b) => (b.score! - a.score!));
    return finalTotals;
}

export function generateStepScoreList(stepResults: ActivityStepResult) {
    const finalTotals: ParticipantScore[] = [];
    for (let entry of Object.entries(stepResults.participantScores ?? {})) {
        finalTotals.push({
            name: entry[0],
            score: entry[1].score,
            observations: entry[1].observations
        });
    }
    finalTotals.sort((a, b) => (b.score! - a.score!));
    return finalTotals;
}
