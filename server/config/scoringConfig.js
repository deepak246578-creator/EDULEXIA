/**
 * SCORING CONFIGURATION (PROTOTYPE DEVELOPMENT ONLY)
 * 
 * IMPORTANT NOTICE:
 * These weights and threshold ranges are prototype development values.
 * They are NOT clinically or medically validated and MUST NOT be represented as such.
 * This platform is a screening and educational learning-support tool,
 * NOT a medical diagnostic instrument.
 */

const scoringConfig = {
  // Prototype weights per screening stage (must sum to 1.0 / 100%)
  stageWeights: {
    letterRecognition: 0.10,    // Stage 1 - 10%
    letterSoundMatching: 0.15,  // Stage 2 - 15%
    phonologicalSkills: 0.20,   // Stage 3 - 20%
    wordRecognition: 0.20,      // Stage 4 - 20%
    sentenceReading: 0.15,      // Stage 5 - 15%
    passageReading: 0.15,       // Stage 6 - 15%
    optionalVoiceReading: 0.05  // Stage 7 - 5% (recalculated if voice is skipped)
  },

  // Prototype interpretation thresholds
  // Note: Higher score indicates greater need for reading practice & support
  thresholds: [
    {
      min: 0,
      max: 20,
      category: 'few_indicators',
      label: 'Fewer Indicators Detected',
      headline: 'Great Foundation!',
      positiveMessage: 'Your responses show great foundational reading comfort. Let\'s continue exploring fun reading adventures and boosting fluency!',
      colorCode: 'emerald',
      supportLevel: 'minimal'
    },
    {
      min: 21,
      max: 40,
      category: 'monitor_areas',
      label: 'Some Areas to Monitor',
      headline: 'Solid Progress!',
      positiveMessage: 'You already possess several strong reading skills. Practicing a few specific word patterns will help build even more confidence.',
      colorCode: 'blue',
      supportLevel: 'mild'
    },
    {
      min: 41,
      max: 60,
      category: 'additional_support',
      label: 'Additional Reading Support May Be Useful',
      headline: 'Ready to Grow!',
      positiveMessage: 'We identified specific sound and word areas where targeted exercises and guided tools will make reading much smoother.',
      colorCode: 'amber',
      supportLevel: 'moderate'
    },
    {
      min: 61,
      max: 80,
      category: 'several_support_areas',
      label: 'Several Areas May Require Additional Support',
      headline: 'Challenge Accepted!',
      positiveMessage: 'Some reading areas will benefit from extra guided practice. That is totally okay — we celebrate effort and will take it step-by-step with fun tools!',
      colorCode: 'orange',
      supportLevel: 'substantial'
    },
    {
      min: 81,
      max: 100,
      category: 'stronger_indicators',
      label: 'Stronger Indicators Detected; Professional Evaluation May Be Considered',
      headline: 'Every Journey Starts with One Step!',
      positiveMessage: 'You worked hard on this screening! Responses suggest specialized reading strategies will be super helpful. Consulting an educational or reading specialist can offer wonderful individualized support.',
      colorCode: 'purple',
      supportLevel: 'high',
      recommendProfessionalEval: true
    }
  ],

  // Skill categorization criteria (based on domain accuracy %)
  skillLevels: {
    strong: { minAccuracy: 80, label: 'Strong' },
    moderate: { minAccuracy: 55, label: 'Moderate' },
    needsPractice: { minAccuracy: 0, label: 'Needs Practice' }
  },

  // Regulatory and medical disclaimer required on all outputs
  disclaimer: 'This screening result is for educational guidance and practice recommendations only. It is NOT a medical diagnosis of dyslexia or any learning disability. Scores represent support indicators, not a percentage of dyslexia.'
};

module.exports = scoringConfig;
