import { getTraining, type TrainingGroup } from "@/repositories/training.repository";

/**
 * Returns the training data grouped by institution.
 * The cv.service will flatten this into individual course entries.
 */
export function getGrouped(): TrainingGroup[] {
  return getTraining();
}
