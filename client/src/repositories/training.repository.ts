import data from "@/content/training.json";

export type TrainingGroup = (typeof data)[number];

export function getTraining() {
  return data;
}
