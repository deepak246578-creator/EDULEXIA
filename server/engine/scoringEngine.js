/**
 * SCORING ENGINE (PROTOTYPE IMPLEMENTATION)
 * 
 * Computes:
 * 1. Domain/stage accuracy and rating (Strong, Moderate, Needs Practice).
 * 2. Weighted overall Screening Score (0 - 100).
 * 3. Support indicators, positive messaging, and identified focus areas.
 * 
 * IMPORTANT:
 * - This engine produces a Screening/Support Indicator Score, NOT a percentage of dyslexia.
 * - This tool is NOT a medical or clinical diagnostic system.
 */

const scoringConfig = require('../config/scoringConfig');

class ScoringEngine {
  /**
   * Evaluate a student's responses across the 7 screening stages
   * 
   * @param {Object} stageResponses - Object mapping stageId -> array of item responses
   * e.g. {
   *   letterRecognition: [ { itemId: 'lr-1', selectedAnswer: 'b', isCorrect: true, responseTimeMs: 1200 }, ... ],
   *   ...
   *   optionalVoiceReading: { attempted: true, confidenceScore: 85, recognizedText: '...' }
   * }
   * @returns {Object} Calculated screening outcome with domain breakdown and positive narrative
   */
  static evaluateScreening(stageResponses) {
    const rawWeights = { ...scoringConfig.stageWeights };
    const voiceStageResponse = stageResponses.optionalVoiceReading;
    const voiceIncluded = voiceStageResponse && voiceStageResponse.attempted;

    // If voice was skipped, re-normalize weights of stages 1-6 to sum to 1.0 (100%)
    let activeWeights = { ...rawWeights };
    if (!voiceIncluded) {
      delete activeWeights.optionalVoiceReading;
      const currentSum = Object.values(activeWeights).reduce((a, b) => a + b, 0);
      Object.keys(activeWeights).forEach(key => {
        activeWeights[key] = activeWeights[key] / currentSum;
      });
    }

    const stageResults = {};
    let totalWeightedScore = 0;
    const supportAreas = [];

    // Evaluate stages 1 to 6 (standard multiple-choice items)
    const standardStages = [
      { id: 'letterRecognition', label: 'Letter Recognition' },
      { id: 'letterSoundMatching', label: 'Letter–Sound Matching' },
      { id: 'phonologicalSkills', label: 'Phonological Skills' },
      { id: 'wordRecognition', label: 'Word Recognition' },
      { id: 'sentenceReading', label: 'Sentence Reading' },
      { id: 'passageReading', label: 'Passage Reading' }
    ];

    standardStages.forEach(({ id, label }) => {
      const items = stageResponses[id] || [];
      const totalItems = items.length || 1;
      const correctCount = items.filter(i => i.isCorrect).length;
      const accuracyPercent = Math.round((correctCount / totalItems) * 100);

      // Inverted error metric: higher indicator score corresponds to higher difficulty/need for support
      // Let difficultyIndicator = (100 - accuracyPercent)
      const stageDifficultyIndicator = 100 - accuracyPercent;

      let rating = 'Needs Practice';
      if (accuracyPercent >= scoringConfig.skillLevels.strong.minAccuracy) {
        rating = 'Strong';
      } else if (accuracyPercent >= scoringConfig.skillLevels.moderate.minAccuracy) {
        rating = 'Moderate';
      }

      if (rating === 'Needs Practice' || rating === 'Moderate') {
        supportAreas.push(label);
      }

      const weight = activeWeights[id] || 0;
      totalWeightedScore += stageDifficultyIndicator * weight;

      stageResults[id] = {
        label,
        totalItems,
        correctCount,
        accuracy: accuracyPercent,
        difficultyIndicator: stageDifficultyIndicator,
        rating,
        weight: Math.round(weight * 100),
        items
      };
    });

    // Evaluate Stage 7: Optional Voice Reading
    if (voiceIncluded) {
      const voiceAccuracy = Math.min(100, Math.max(0, voiceStageResponse.confidenceScore || 80));
      const voiceIndicator = 100 - voiceAccuracy;
      let voiceRating = 'Needs Practice';
      if (voiceAccuracy >= scoringConfig.skillLevels.strong.minAccuracy) {
        voiceRating = 'Strong';
      } else if (voiceAccuracy >= scoringConfig.skillLevels.moderate.minAccuracy) {
        voiceRating = 'Moderate';
      }

      const weight = activeWeights.optionalVoiceReading || 0.05;
      totalWeightedScore += voiceIndicator * weight;

      stageResults.optionalVoiceReading = {
        label: 'Optional Voice Reading',
        attempted: true,
        accuracy: voiceAccuracy,
        difficultyIndicator: voiceIndicator,
        rating: voiceRating,
        weight: Math.round(weight * 100),
        details: voiceStageResponse
      };
    } else {
      stageResults.optionalVoiceReading = {
        label: 'Optional Voice Reading',
        attempted: false,
        skipped: true,
        weight: 0,
        note: 'Skipped by student (weights dynamically re-balanced)'
      };
    }

    // Round total score 0-100
    const finalScore = Math.max(0, Math.min(100, Math.round(totalWeightedScore)));

    // Find interpretation threshold tier
    const thresholdTier = scoringConfig.thresholds.find(
      t => finalScore >= t.min && finalScore <= t.max
    ) || scoringConfig.thresholds[scoringConfig.thresholds.length - 1];

    // Determine recommended starting level (1 to 6) based on skill profile
    const recommendedStartingLevel = this.calculateStartingLevel(stageResults);

    return {
      screeningScore: finalScore,
      scoreScaleMax: 100,
      supportLevel: thresholdTier.supportLevel,
      interpretationLabel: thresholdTier.label,
      positiveHeadline: thresholdTier.headline,
      positiveMessage: thresholdTier.positiveMessage,
      colorCode: thresholdTier.colorCode,
      recommendProfessionalEval: !!thresholdTier.recommendProfessionalEval,
      disclaimer: scoringConfig.disclaimer,
      stageScores: stageResults,
      skillProfile: {
        letterRecognition: stageResults.letterRecognition.rating,
        letterSoundMatching: stageResults.letterSoundMatching.rating,
        phonologicalSkills: stageResults.phonologicalSkills.rating,
        wordRecognition: stageResults.wordRecognition.rating,
        sentenceReading: stageResults.sentenceReading.rating,
        passageReading: stageResults.passageReading.rating,
        optionalVoiceReading: stageResults.optionalVoiceReading.rating || 'Skipped'
      },
      supportAreas: supportAreas.length > 0 ? supportAreas : ['General Reading Fluency & Exploration'],
      recommendedStartingLevel
    };
  }

  /**
   * Determine optimal learning level (1 - 6) based on domain ratings
   */
  static calculateStartingLevel(stageResults) {
    const lr = stageResults.letterRecognition?.accuracy || 0;
    const lsm = stageResults.letterSoundMatching?.accuracy || 0;
    const ps = stageResults.phonologicalSkills?.accuracy || 0;
    const wr = stageResults.wordRecognition?.accuracy || 0;
    const sr = stageResults.sentenceReading?.accuracy || 0;
    const pr = stageResults.passageReading?.accuracy || 0;

    // If foundational letter recognition or sounds need work -> Level 1
    if (lr < 65 || lsm < 60) {
      return 1;
    }
    // If phonological skills or simple words need work -> Level 2
    if (ps < 65 || wr < 65) {
      return 2;
    }
    // If word grouping or blends need work -> Level 3
    if (wr < 80 || ps < 80) {
      return 3;
    }
    // If sentence comprehension needs work -> Level 4
    if (sr < 75) {
      return 4;
    }
    // If passage reading needs work -> Level 5
    if (pr < 75) {
      return 5;
    }
    // Advanced readers -> Level 6
    return 6;
  }
}

module.exports = ScoringEngine;
