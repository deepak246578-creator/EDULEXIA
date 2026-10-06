/**
 * SEED DATA FOR DYSLEXIA LEARNING SUPPORT PLATFORM
 * Includes:
 * - Default Users (Student, Parent, Teacher)
 * - 7-Stage Screening Assessment Questions
 * - Progressive Learning Activities (Levels 1 to 6)
 * - Badges & Achievements
 */

// Passwords for demo accounts:
// student@example.com / password123
// parent@example.com / password123
// teacher@example.com / password123
// Pre-computed bcrypt hash for 'password123' (salt rounds 10):
const DEMO_PASSWORD_HASH = '$2a$10$tZ27d1F6Ua85iF7e07PZueYV20h3G9tVjZ7ZcK43E9eTzO6o4mJ7m';

const seedUsers = [
  {
    id: 'user-student-1',
    name: 'Leo Martin',
    email: 'student@example.com',
    passwordHash: DEMO_PASSWORD_HASH,
    role: 'student',
    createdAt: new Date('2026-09-01T10:00:00Z').toISOString()
  },
  {
    id: 'user-parent-1',
    name: 'Sarah Martin (Parent)',
    email: 'parent@example.com',
    passwordHash: DEMO_PASSWORD_HASH,
    role: 'parent',
    studentId: 'user-student-1',
    createdAt: new Date('2026-09-01T10:00:00Z').toISOString()
  },
  {
    id: 'user-teacher-1',
    name: 'Ms. Eleanor Vance (Teacher)',
    email: 'teacher@example.com',
    passwordHash: DEMO_PASSWORD_HASH,
    role: 'teacher',
    authorizedStudentIds: ['user-student-1'],
    createdAt: new Date('2026-09-01T10:00:00Z').toISOString()
  }
];

const seedStudentProfiles = [
  {
    userId: 'user-student-1',
    learningLevel: 2,
    starsCount: 45,
    streakDays: 4,
    lastPracticeDate: new Date().toISOString(),
    preferences: {
      fontSize: 18,
      letterSpacing: 'wide',
      lineSpacing: 'relaxed',
      fontFamily: 'OpenDyslexic',
      colorTheme: 'cream',
      ttsSpeed: 0.9
    }
  }
];

// Screening questions for the 7 stages
const screeningStagesQuestions = [
  {
    stageId: 'letterRecognition',
    stageNumber: 1,
    title: 'Stage 1 – Letter Recognition',
    subtitle: 'Look at the prompt and pick the matching letter symbol.',
    instructions: 'Tap or click the letter that matches the spoken sound or description. Pay close attention to letter shapes.',
    weight: 0.10,
    items: [
      {
        id: 'lr-1',
        prompt: 'Select the lowercase letter: "b"',
        audioCue: 'Find the letter b, as in ball',
        options: ['d', 'b', 'p', 'q'],
        correctAnswer: 'b',
        focus: 'Mirror letter discrimination (b/d)'
      },
      {
        id: 'lr-2',
        prompt: 'Select the lowercase letter: "d"',
        audioCue: 'Find the letter d, as in dog',
        options: ['b', 'q', 'p', 'd'],
        correctAnswer: 'd',
        focus: 'Mirror letter discrimination (d/b)'
      },
      {
        id: 'lr-3',
        prompt: 'Select the lowercase letter: "p"',
        audioCue: 'Find the letter p, as in pen',
        options: ['p', 'q', 'b', 'd'],
        correctAnswer: 'p',
        focus: 'Mirror letter discrimination (p/q)'
      },
      {
        id: 'lr-4',
        prompt: 'Select the lowercase letter: "q"',
        audioCue: 'Find the letter q, as in queen',
        options: ['g', 'p', 'q', 'd'],
        correctAnswer: 'q',
        focus: 'Mirror letter discrimination (q/p)'
      },
      {
        id: 'lr-5',
        prompt: 'Select the lowercase letter: "m"',
        audioCue: 'Find the letter m, as in moon',
        options: ['w', 'n', 'u', 'm'],
        correctAnswer: 'm',
        focus: 'Inversion discrimination (m/w/n)'
      }
    ]
  },
  {
    stageId: 'letterSoundMatching',
    stageNumber: 2,
    title: 'Stage 2 – Letter–Sound Matching',
    subtitle: 'Connect letters to their phonics sounds.',
    instructions: 'Listen to the sound and choose the letter that makes that primary sound.',
    weight: 0.15,
    items: [
      {
        id: 'lsm-1',
        prompt: 'Which letter makes the /k/ sound as in "Cat"?',
        audioCue: 'The sound /k/',
        options: ['C', 'S', 'T', 'M'],
        correctAnswer: 'C',
        focus: 'Initial consonant phoneme /k/'
      },
      {
        id: 'lsm-2',
        prompt: 'Which letter makes the /s/ sound as in "Sun"?',
        audioCue: 'The sound /s/',
        options: ['Z', 'C', 'S', 'F'],
        correctAnswer: 'S',
        focus: 'Fricative consonant /s/'
      },
      {
        id: 'lsm-3',
        prompt: 'Which letter makes the /f/ sound as in "Fish"?',
        audioCue: 'The sound /f/',
        options: ['V', 'T', 'P', 'F'],
        correctAnswer: 'F',
        focus: 'Consonant sound /f/'
      },
      {
        id: 'lsm-4',
        prompt: 'Which letter makes the short vowel sound /æ/ as in "Apple"?',
        audioCue: 'The short vowel sound /æ/',
        options: ['A', 'E', 'I', 'O'],
        correctAnswer: 'A',
        focus: 'Short vowel identification /æ/'
      }
    ]
  },
  {
    stageId: 'phonologicalSkills',
    stageNumber: 3,
    title: 'Stage 3 – Phonological Skills',
    subtitle: 'Sound matching, blending, and segmentation.',
    instructions: 'Work with the individual sounds inside words.',
    weight: 0.20,
    items: [
      {
        id: 'ps-1',
        type: 'blending',
        prompt: 'Blend these sounds together: /k/ + /æ/ + /t/. What word does it make?',
        audioCue: '/k/ ... /æ/ ... /t/',
        options: ['BAT', 'CAT', 'CAP', 'MAT'],
        correctAnswer: 'CAT',
        focus: 'CVC Blending'
      },
      {
        id: 'ps-2',
        type: 'segmentation',
        prompt: 'How many individual sounds are in the word "SHIP"?',
        audioCue: 'Word: SHIP. /ʃ/ - /ɪ/ - /p/',
        options: ['2 sounds', '3 sounds', '4 sounds', '5 sounds'],
        correctAnswer: '3 sounds',
        focus: 'Phoneme segmentation with digraph'
      },
      {
        id: 'ps-3',
        type: 'rhyme',
        prompt: 'Which word rhymes with "SUN"?',
        audioCue: 'SUN',
        options: ['RUN', 'SIT', 'MAN', 'PIN'],
        correctAnswer: 'RUN',
        focus: 'Rhyme recognition'
      },
      {
        id: 'ps-4',
        type: 'firstSound',
        prompt: 'What is the FIRST sound you hear in the word "BOAT"?',
        audioCue: 'BOAT',
        options: ['/b/', '/d/', '/t/', '/oʊ/'],
        correctAnswer: '/b/',
        focus: 'Initial phoneme isolation'
      }
    ]
  },
  {
    stageId: 'wordRecognition',
    stageNumber: 4,
    title: 'Stage 4 – Word Recognition',
    subtitle: 'Progressive word reading and visual word discrimination.',
    instructions: 'Read each word carefully and select the word that matches the target.',
    weight: 0.20,
    items: [
      {
        id: 'wr-1',
        prompt: 'Identify the word: "cat"',
        audioCue: 'cat',
        options: ['bat', 'cat', 'cap', 'mat'],
        correctAnswer: 'cat',
        focus: 'CVC word recognition'
      },
      {
        id: 'wr-2',
        prompt: 'Identify the word: "cap"',
        audioCue: 'cap',
        options: ['map', 'cup', 'cap', 'lap'],
        correctAnswer: 'cap',
        focus: 'Vowel and coda discrimination'
      },
      {
        id: 'wr-3',
        prompt: 'Identify the word: "map"',
        audioCue: 'map',
        options: ['mop', 'man', 'nap', 'map'],
        correctAnswer: 'map',
        focus: 'Minimal pair differentiation'
      },
      {
        id: 'wr-4',
        prompt: 'Identify the word: "mop"',
        audioCue: 'mop',
        options: ['top', 'mop', 'pop', 'map'],
        correctAnswer: 'mop',
        focus: 'Progression sequence: cat -> cap -> map -> mop'
      },
      {
        id: 'wr-5',
        prompt: 'Identify the word with a consonant blend: "slip"',
        audioCue: 'slip',
        options: ['spin', 'skip', 'slip', 'slap'],
        correctAnswer: 'slip',
        focus: 'Initial consonant blend'
      }
    ]
  },
  {
    stageId: 'sentenceReading',
    stageNumber: 5,
    title: 'Stage 5 – Sentence Reading',
    subtitle: 'Read simple sentences and verify understanding.',
    instructions: 'Read the short sentence and choose the word that completes the sentence correctly.',
    weight: 0.15,
    items: [
      {
        id: 'sr-1',
        prompt: 'Sentence: "The big dog ran in the green ______."',
        audioCue: 'The big dog ran in the green park',
        options: ['park', 'dark', 'pork', 'bark'],
        correctAnswer: 'park',
        focus: 'Sentence context and phonics completion'
      },
      {
        id: 'sr-2',
        prompt: 'Sentence: "A little fox jumped over the ______."',
        audioCue: 'A little fox jumped over the log',
        options: ['fog', 'leg', 'log', 'rug'],
        correctAnswer: 'log',
        focus: 'Sentence fluency & word tracking'
      },
      {
        id: 'sr-3',
        prompt: 'Sentence: "The bright sun is up in the blue ______."',
        audioCue: 'The bright sun is up in the blue sky',
        options: ['sea', 'sky', 'spy', 'ski'],
        correctAnswer: 'sky',
        focus: 'High frequency sight word in context'
      }
    ]
  },
  {
    stageId: 'passageReading',
    stageNumber: 6,
    title: 'Stage 6 – Passage Reading',
    subtitle: 'Short age-appropriate story reading with comprehension.',
    instructions: 'Read this mini-passage carefully, then answer the questions below.',
    passageText: 'Pip is a fluffy orange cat. Pip likes to play with a soft red ball in the yard. When the sun gets warm, Pip takes a nap under the big oak tree.',
    weight: 0.15,
    items: [
      {
        id: 'pr-1',
        prompt: 'What kind of animal is Pip?',
        options: ['A dog', 'A cat', 'A rabbit', 'A bird'],
        correctAnswer: 'A cat',
        focus: 'Direct detail retrieval from passage'
      },
      {
        id: 'pr-2',
        prompt: 'What color is the soft ball Pip plays with?',
        options: ['Blue', 'Green', 'Red', 'Yellow'],
        correctAnswer: 'Red',
        focus: 'Attribute and adjective retention'
      },
      {
        id: 'pr-3',
        prompt: 'Where does Pip sleep when it gets warm?',
        options: ['In the kitchen', 'Under the big oak tree', 'On the bed', 'In a box'],
        correctAnswer: 'Under the big oak tree',
        focus: 'Passage spatial and narrative comprehension'
      }
    ]
  },
  {
    stageId: 'optionalVoiceReading',
    stageNumber: 7,
    title: 'Stage 7 – Optional Voice Reading',
    subtitle: 'Read aloud using your microphone (optional speech recognition).',
    instructions: 'Press the microphone button and read the sentence out loud. You can also skip this stage if you prefer not to use a microphone!',
    weight: 0.05,
    isOptional: true,
    items: [
      {
        id: 'vr-1',
        targetPhrase: 'The brave owl can see in the dark night.',
        displaySentence: 'The brave owl can see in the dark night.',
        focus: 'Oral reading fluency & speech-to-text comparison'
      }
    ]
  }
];

// Progressive Learning Activities (Levels 1 to 6)
const seedLearningActivities = [
  // LEVEL 1: Simple letters and sounds
  {
    id: 'act-l1-01',
    level: 1,
    title: 'Letter Mirror Safari: b vs d',
    type: 'letter_discrimination',
    skillArea: 'letterRecognition',
    difficulty: 'beginner',
    description: 'Learn the "bat before the ball" trick to never mix up b and d again!',
    starsAwarded: 5,
    estimatedMinutes: 3,
    content: {
      ruleTip: 'Remember: Letter "b" has a tall bat then a round ball on the right!',
      rounds: [
        { prompt: 'Pick the letter "b"', target: 'b', options: ['d', 'b', 'p', 'q'] },
        { prompt: 'Pick the letter "d"', target: 'd', options: ['b', 'q', 'd', 'p'] },
        { prompt: 'Does "bag" start with b or d?', target: 'b', options: ['b', 'd'] },
        { prompt: 'Does "door" start with b or d?', target: 'd', options: ['d', 'b'] }
      ]
    }
  },
  {
    id: 'act-l1-02',
    level: 1,
    title: 'Sound Catcher: Consonant Phonics',
    type: 'sound_matching',
    skillArea: 'letterSoundMatching',
    difficulty: 'beginner',
    description: 'Catch the right sounds for S, M, T, and P.',
    starsAwarded: 5,
    estimatedMinutes: 4,
    content: {
      rounds: [
        { prompt: 'Listen: /s/ as in Sun. Which letter matches?', sound: '/s/', target: 'S', options: ['S', 'C', 'Z', 'T'] },
        { prompt: 'Listen: /m/ as in Moon. Which letter matches?', sound: '/m/', target: 'M', options: ['W', 'N', 'M', 'H'] },
        { prompt: 'Listen: /p/ as in Pop. Which letter matches?', sound: '/p/', target: 'P', options: ['B', 'D', 'P', 'Q'] }
      ]
    }
  },

  // LEVEL 2: Simple words
  {
    id: 'act-l2-01',
    level: 2,
    title: 'The Cat Ladder: Word Transformation',
    type: 'word_progression',
    skillArea: 'wordRecognition',
    difficulty: 'elementary',
    description: 'Step along the word ladder: cat → cap → map → mop!',
    starsAwarded: 8,
    estimatedMinutes: 5,
    content: {
      ladder: ['cat', 'cap', 'map', 'mop'],
      rounds: [
        { prompt: 'Change the last letter of "cat" to make a hat you wear on your head:', target: 'cap', options: ['cup', 'cap', 'can', 'cab'] },
        { prompt: 'Change the first letter of "cap" to make something you use to find treasure:', target: 'map', options: ['mop', 'map', 'nap', 'sap'] },
        { prompt: 'Change the middle vowel of "map" to make a cleaning tool for the floor:', target: 'mop', options: ['mop', 'top', 'pop', 'hop'] }
      ]
    }
  },
  {
    id: 'act-l2-02',
    level: 2,
    title: 'Sound Blending Workshop',
    type: 'sound_blending',
    skillArea: 'phonologicalSkills',
    difficulty: 'elementary',
    description: 'Slide sounds together smoothly to create complete words.',
    starsAwarded: 8,
    estimatedMinutes: 4,
    content: {
      rounds: [
        { sounds: ['/f/', '/ɪ/', '/ʃ/'], prompt: 'Slide sounds: /f/ + /ɪ/ + /ʃ/', target: 'FISH', options: ['WISH', 'DISH', 'FISH', 'FIST'] },
        { sounds: ['/s/', '/ʌ/', '/n/'], prompt: 'Slide sounds: /s/ + /ʌ/ + /n/', target: 'SUN', options: ['RUN', 'FUN', 'BUN', 'SUN'] },
        { sounds: ['/b/', '/ʊ/', '/k/'], prompt: 'Slide sounds: /b/ + /ʊ/ + /k/', target: 'BOOK', options: ['LOOK', 'HOOK', 'BOOK', 'TOOK'] }
      ]
    }
  },

  // LEVEL 3: Word groups
  {
    id: 'act-l3-01',
    level: 3,
    title: 'Rhyme Castle & Word Families',
    type: 'word_grouping',
    skillArea: 'phonologicalSkills',
    difficulty: 'intermediate',
    description: 'Group words into -at, -op, and -in rhyming neighborhoods.',
    starsAwarded: 10,
    estimatedMinutes: 5,
    content: {
      families: ['-at family', '-op family', '-in family'],
      rounds: [
        { prompt: 'Which word belongs to the -at family with "cat" and "bat"?', target: 'flat', options: ['clip', 'flat', 'frog', 'stop'] },
        { prompt: 'Which word belongs to the -op family with "mop" and "top"?', target: 'drop', options: ['drop', 'drag', 'drip', 'drum'] },
        { prompt: 'Which word belongs to the -in family with "pin" and "win"?', target: 'spin', options: ['span', 'spun', 'spin', 'spit'] }
      ]
    }
  },
  {
    id: 'act-l3-02',
    level: 3,
    title: 'Consonant Blends Adventure',
    type: 'word_recognition',
    skillArea: 'wordRecognition',
    difficulty: 'intermediate',
    description: 'Spot initial consonant blends: bl-, cr-, st-, and fl-.',
    starsAwarded: 10,
    estimatedMinutes: 5,
    content: {
      rounds: [
        { prompt: 'Find the word that begins with the blend "st-":', target: 'star', options: ['scar', 'star', 'spar', 'soar'] },
        { prompt: 'Find the word that begins with the blend "bl-":', target: 'blue', options: ['glue', 'clue', 'blue', 'flue'] },
        { prompt: 'Find the word that begins with the blend "cr-":', target: 'crab', options: ['grab', 'scab', 'drab', 'crab'] }
      ]
    }
  },

  // LEVEL 4: Simple sentences
  {
    id: 'act-l4-01',
    level: 4,
    title: 'Sentence Builder: Animal Tales',
    type: 'sentence_practice',
    skillArea: 'sentenceReading',
    difficulty: 'intermediate',
    description: 'Read and arrange sentence tiles in the correct meaningful order.',
    starsAwarded: 12,
    estimatedMinutes: 6,
    content: {
      rounds: [
        {
          scrambled: ['brown', 'The', 'fox', 'jumped', 'high'],
          correctSequence: ['The', 'brown', 'fox', 'jumped', 'high'],
          fullSentence: 'The brown fox jumped high.'
        },
        {
          scrambled: ['swims', 'A', 'little', 'fish', 'fast'],
          correctSequence: ['A', 'little', 'fish', 'swims', 'fast'],
          fullSentence: 'A little fish swims fast.'
        }
      ]
    }
  },

  // LEVEL 5: Short passages
  {
    id: 'act-l5-01',
    level: 5,
    title: 'Story Explorer: The Treehouse Club',
    type: 'passage_practice',
    skillArea: 'passageReading',
    difficulty: 'advanced',
    description: 'Read an engaging 3-paragraph adventure with text-to-speech support.',
    starsAwarded: 15,
    estimatedMinutes: 7,
    content: {
      passage: 'Leo and Maya built a wooden treehouse high in the maple tree. From the top window, they could see the sparkling blue lake and the rolling green hills. Every Saturday, they would pack a snack of apples and crackers and read mystery books under the leafy canopy.',
      questions: [
        { prompt: 'Where was the treehouse built?', target: 'In the maple tree', options: ['In an oak tree', 'In the maple tree', 'On the roof', 'In the garage'] },
        { prompt: 'What could Leo and Maya see from the window?', target: 'The sparkling blue lake', options: ['A tall mountain', 'The busy highway', 'The sparkling blue lake', 'A swimming pool'] }
      ]
    }
  },

  // LEVEL 6: Advanced reading activities
  {
    id: 'act-l6-01',
    level: 6,
    title: 'Fluency Master: Expedition North',
    type: 'advanced_reading',
    skillArea: 'passageReading',
    difficulty: 'expert',
    description: 'Read descriptive multi-sentence passages with pacing guides and vocabulary enrichment.',
    starsAwarded: 20,
    estimatedMinutes: 8,
    content: {
      passage: 'The arctic polar bear has thick fur and a layer of warm fat that protects it from freezing polar winds. Despite weighing hundreds of pounds, polar bears can swim for hours across icy channels without tiring.',
      vocabulary: [
        { word: 'protects', meaning: 'keeps safe from harm or harsh conditions' },
        { word: 'channels', meaning: 'stretches of water between lands' }
      ],
      questions: [
        { prompt: 'What protects the polar bear from freezing winds?', target: 'Thick fur and warm fat', options: ['A warm cave', 'Thick fur and warm fat', 'Special boots', 'Swimming fast'] }
      ]
    }
  }
];

// Seed Badges & Achievements
const seedAchievements = [
  {
    id: 'badge-screening-star',
    code: 'screening_star',
    title: 'Screening Star',
    description: 'Completed your first full reading screening!',
    icon: 'Star',
    color: 'amber'
  },
  {
    id: 'badge-challenge-accepted',
    code: 'challenge_accepted',
    title: 'Challenge Accepted',
    description: 'Started your customized personalized learning path!',
    icon: 'ShieldAlert',
    color: 'indigo'
  },
  {
    id: 'badge-reading-explorer',
    code: 'reading_explorer',
    title: 'Reading Explorer',
    description: 'Completed 3 different reading activities!',
    icon: 'Compass',
    color: 'emerald'
  },
  {
    id: 'badge-puzzle-solver',
    code: 'puzzle_solver',
    title: 'Puzzle Solver',
    description: 'Solved letter discrimination or phonics puzzle rounds!',
    icon: 'Puzzle',
    color: 'purple'
  },
  {
    id: 'badge-practice-champion',
    code: 'practice_champion',
    title: 'Practice Champion',
    description: 'Maintained a multi-day practice streak!',
    icon: 'Trophy',
    color: 'yellow'
  }
];

// Sample screening attempts history for demo student
const seedScreeningAttempts = [
  {
    id: 'attempt-demo-1',
    studentId: 'user-student-1',
    date: new Date('2026-09-15T14:30:00Z').toISOString(),
    screeningScore: 58,
    supportLevel: 'moderate',
    interpretationLabel: 'Additional Reading Support May Be Useful',
    positiveHeadline: 'Ready to Grow!',
    positiveMessage: 'We identified specific sound and word areas where targeted exercises and guided tools will make reading much smoother.',
    stageScores: {
      letterRecognition: { rawScore: 80, accuracy: 80, rating: 'Strong' },
      letterSoundMatching: { rawScore: 50, accuracy: 50, rating: 'Needs Practice' },
      phonologicalSkills: { rawScore: 50, accuracy: 50, rating: 'Needs Practice' },
      wordRecognition: { rawScore: 60, accuracy: 60, rating: 'Moderate' },
      sentenceReading: { rawScore: 66, accuracy: 66, rating: 'Moderate' },
      passageReading: { rawScore: 66, accuracy: 66, rating: 'Moderate' },
      optionalVoiceReading: { rawScore: 75, accuracy: 75, rating: 'Strong', included: true }
    },
    recommendedStartingLevel: 2,
    supportAreas: [
      'Letter–Sound Matching',
      'Phonological Skills (Sound Blending & Segmentation)',
      'Word Recognition & Progression'
    ]
  }
];

module.exports = {
  DEMO_PASSWORD_HASH,
  seedUsers,
  seedStudentProfiles,
  screeningStagesQuestions,
  seedLearningActivities,
  seedAchievements,
  seedScreeningAttempts
};
