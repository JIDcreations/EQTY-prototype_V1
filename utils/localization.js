import { lessonContent } from '../data/lessonContent';
import { lessonContentNl } from '../data/lessonContentNl';
import { lessons, modules } from '../data/curriculum';
import { curriculumNl } from '../data/curriculumNl';

const LOCALE_MAP = {
  english: 'en',
  dutch: 'nl',
  nederlands: 'nl',
  en: 'en',
  nl: 'nl',
};

const LESSON_OVERVIEW_COPY = {
  en: {
    outcomesLabel: "What you'll learn",
    lessonPointsLabel: 'In this lesson',
    estimatedTimeLabel: 'Estimated time',
    readinessLabel: 'Focused start',
    minutesLabel: (minutes) => `~${minutes} min`,
    lessonMetaChips: {
      lesson_0: ['~8 min', 'Introduction'],
    },
    defaultHook: 'Clarity first. Action second.',
    lessonHooks: {
      lesson_0: "Learn the 'Investing as a process' plan.",
      lesson_1: 'A clear reason makes every next decision easier.',
    },
    defaultOutcomes: [
      'Understand core idea',
      'See decision flow',
      'Begin with confidence',
    ],
    lessonOutcomes: {
      lesson_0: [
        'Learn to think in steps',
        'See why taking action comes last',
        'Learn to invest according to a plan',
      ],
      lesson_1: [
        'Define your real why',
        'Choose direction over noise',
        'Start with clear intent',
      ],
    },
    startLesson: 'Begin lesson',
    back: 'Back',
  },
  nl: {
    outcomesLabel: 'Wat je zal leren',
    lessonPointsLabel: 'In deze les',
    estimatedTimeLabel: 'Geschatte tijd',
    readinessLabel: 'Gerichte start',
    minutesLabel: (minutes) => `~${minutes} min`,
    lessonMetaChips: {
      lesson_0: ['~8 min', 'Introductie'],
    },
    defaultHook: 'Eerst helderheid. Dan actie.',
    lessonHooks: {
      lesson_0: 'Leer het ‘Beleggen als proces’-plan kennen.',
      lesson_1: 'Een duidelijk waarom maakt elke keuze makkelijker.',
    },
    defaultOutcomes: [
      'Begrijp het kernidee',
      'Zie de beslisflow',
      'Start met vertrouwen',
    ],
    lessonOutcomes: {
      lesson_0: [
        'Leer je denken in stappen',
        'Zie je waarom handelen als laatste komt',
        'Leer je beleggen volgens een plan',
      ],
      lesson_1: [
        'Bepaal je echte waarom',
        'Kies richting, geen ruis',
        'Start met heldere intentie',
      ],
    },
    startLesson: 'Start les',
    back: 'Terug',
  },
};

const INTRO_STEP_TITLES = {
  en: {
    2: 'From goal to execution',
    4: 'Build the process',
    5: 'Reflection',
    6: 'The full investing process',
  },
  nl: {
    2: 'Van doel tot uitvoering',
    4: 'Bouw het proces',
    5: 'Reflectie',
    6: 'Het volledige investeringsproces',
  },
};

const LESSON_STEP_COPY = {
  en: {
    buttons: {
      next: 'Next',
      continue: 'Continue',
      reset: 'Reset',
      completeExercise: 'Complete exercise',
      completeLesson: 'Complete lesson',
      submitReflection: 'Save reflection',
    },
    lessonSuccess: {
      congrats: 'Well done.',
      completedLabel: 'LESSON COMPLETE',
      title: 'Introduction lesson is finished!',
      subtitle: (lessonTitle) => `${lessonTitle} is finished.`,
      introSubtitle: 'You finished the introductory lesson about investing as a process.',
      detail: 'Keep going with the next lessons to deepen the full process.',
      introDetail:
        'You can now start the full lessons that cover the entire investing process in depth.',
      cta: 'Go to Home',
      fallbackTitle: 'This lesson',
    },
    labels: {
      lessonFlow: 'Lesson flow',
      investingProcess: 'Investing process',
      investingProcessStatic: 'Investing process (6 steps)',
      termsInLesson: 'Terms in this lesson',
      searchAllTerms: 'Search all terms',
      fullGlossaryResults: 'Results from full glossary',
      part: 'Part',
      step: 'Step',
      lessonFlowPhases: {
        1: 'Concept',
        2: 'Visualization',
        3: 'Contextual example',
        4: 'Practical exercise',
        5: 'Reflection',
        6: 'Summary',
      },
      processContext:
        'The fixed framework behind every investment.',
      processTapMore: 'Tap the steps for more info.',
      processOverview:
        'This is an overview. You’re learning the process.',
      insight: 'Insight',
      outcome: 'Outcome',
      aligned: 'Aligned',
      recheckFlow: 'Recheck the flow',
      yourOrder: 'Your order',
      actions: 'Actions',
      yourProcess: 'Your process',
      availableSteps: 'Available steps',
      executionLast: 'Execution (last)',
      emptySlot: 'Empty slot',
      placeStepHere: 'Place step here',
      needHint: 'Need a hint?',
      hint: 'Hint',
      revealImpact: 'Reveal impact',
      signal: 'Signal',
      coverage: 'Coverage',
      keyTakeaways: 'Key takeaways',
      eqtyInsight: 'EQTY insight',
      reflectionLabel: 'Reflection',
      yourAnswer: 'Your answer',
      reflectionSavedShort: 'Saved',
      tapElements: 'Tap elements to explore',
      animationPlaceholder: 'Animation placeholder',
      tapReturn: 'Tap to return',
      tapDetails: 'Tap for details',
      tapStation: 'Tap a station to expand.',
      tapInsightToConfirm: 'Tap each insight to confirm it.',
      allInsightsConfirmed: "You've got it. Ready to complete the lesson.",
    },
    messages: {
      noExercise: 'No exercise is available for this lesson.',
      tapActions: 'Tap actions below to build the sequence.',
      correctOrder: 'Correct order - you can continue.',
      incorrectOrder: 'Order is off - try again.',
      hintBody: 'Execution is never the starting point. Begin by defining the goal.',
      selectItems: 'Select items to see the impact.',
      reflectionQuestion: 'What did you learn from this lesson?',
      reflectionPlaceholder: 'Type your response here...',
      reflectionSaved: 'Saved to personalize upcoming lessons.',
      reflectionSubtitle: 'Write down what you take away from this lesson.',
      reflectionPersonalizationHint: 'Your answer personalises future lessons.',
      reflectionLockedTitle: 'Response locked',
      reflectionLockedBody:
        'Saved to personalize upcoming lessons. You can’t add another response.',
      reflectionShort:
        'The lesson centers on defining each step before execution to keep decisions grounded.',
      reflectionStructure:
        'Noted - execution gains meaning when it follows the full sequence of steps.',
      reflectionEmotion:
        'Noted - a defined process can reduce reactive execution by adding pause and clarity.',
      reflectionDefault:
        'This reflection ties back to the idea that execution works best after the earlier steps are set.',
    },
    introConcept: {
      definition: 'Definition',
      title: 'What is Investing as a Process?',
      paragraph:
        'Investing as a process is a step-by-step plan you follow before you actually start investing. You first learn to make the right choices, and only then start investing.',
      processTitle: 'Investing process',
      processHint: 'Tap a step to see its role.',
      steps: [
        {
          id: 'goal',
          label: 'Goal definition',
          detail: 'Clarify what the money should achieve.',
        },
        {
          id: 'risk',
          label: 'Individual risk analysis',
          detail: 'Define risk capacity, tolerance, and time horizon.',
        },
        {
          id: 'strategy',
          label: 'Financial investment strategy',
          detail: 'Translate the goal into guiding rules.',
        },
        {
          id: 'allocation',
          label: 'Capital allocation',
          detail: 'Decide how capital is distributed across assets.',
        },
        {
          id: 'vehicle',
          label: 'Investment vehicle',
          detail: 'Select the instruments that fit the allocation.',
        },
        {
          id: 'execution',
          label: 'Execution',
          detail: 'Place the order only after the process is clear.',
        },
      ],
    },
    introVisualization: {
      subtitle: 'Each decision naturally leads to the next.',
      steps: [
        {
          id: 'goal',
          label: 'Goal definition',
          question: 'What should my money achieve?',
          why: 'Goals are about direction, not choice yet.',
          detail:
            'A target defines purpose and timing before any product or ticker enters the picture.',
        },
        {
          id: 'risk',
          label: 'Individual risk analysis',
          question: 'How much instability can I handle?',
          why: 'Risk is tolerance for movement, not danger.',
          detail:
            'Risk analysis clarifies capacity, tolerance, and horizon so choices stay within your limits.',
        },
        {
          id: 'strategy',
          label: 'Financial investment strategy',
          question: 'How do I translate intent into rules?',
          why: 'Strategy reduces complexity, it does not add it.',
          detail: 'Strategy turns goals and constraints into a repeatable rule set you can follow.',
        },
        {
          id: 'allocation',
          label: 'Capital allocation',
          question: 'How is my money spread?',
          why: 'Allocation is structure, not math at this stage.',
          detail:
            'Allocation decides how much goes where, shaping outcomes more than any single pick.',
        },
        {
          id: 'vehicle',
          label: 'Investment vehicle',
          question: 'What tool executes the plan?',
          why: 'Vehicles are means, not strategy.',
          detail:
            'Vehicles are the tools that implement allocation (funds, ETFs, bonds, equities).',
        },
        {
          id: 'execution',
          label: 'Execution',
          question: 'When do I act?',
          why: 'Execution is final, not iterative.',
          detail:
            'Execution is the final act - order type, timing, and costs - after everything else is clear.',
        },
      ],
    },
    introScenario: {
      structuredLabel: 'With a plan',
      structuredSubline: 'Choose before executing.',
      reactiveLabel: 'Without a plan',
      reactiveSubline: 'Execute without direction.',
      headerHelper:
        'See the difference between investing immediately without a plan and investing as a deliberate process.',
      progressLabel: 'Process progress',
      sliderHelper: 'Drag to see what happens when execution happens too early.',
      stableLabel: 'Stable',
      volatileLabel: 'Volatile',
      insightLine:
        'When execution happens too early, the outcome becomes unpredictable.',
      steps: [
        { id: 'goal', label: 'Goal' },
        { id: 'risk', label: 'Risk' },
        { id: 'strategy', label: 'Strategy' },
        { id: 'allocation', label: 'Allocation' },
        { id: 'vehicle', label: 'Vehicle' },
        { id: 'execution', label: 'Execution' },
      ],
    },
    introExercise: {
      instruction: 'Tap the steps in the correct order before execution.',
      correct: 'Correct order - you can continue.',
      incorrect: 'Order is off - try again.',
    },
  },
  nl: {
    buttons: {
      next: 'Volgende',
      continue: 'Doorgaan',
      reset: 'Reset',
      completeExercise: 'Oefening afronden',
      completeLesson: 'Les afronden',
      submitReflection: 'Antwoord opslaan',
    },
    lessonSuccess: {
      congrats: 'Goed gedaan.',
      completedLabel: 'LES AFGEROND',
      title: 'Inleidende les is afgerond!',
      subtitle: (lessonTitle) => `Je hebt ${lessonTitle} afgerond.`,
      introSubtitle: 'Je hebt de inleidende les over beleggen als proces afgerond.',
      detail: 'Ga verder met de volgende lessen om het volledige proces te verdiepen.',
      introDetail:
        'Je kan nu starten met de volledige lessen die het beleggingsproces stap voor stap uitleggen.',
      cta: 'Naar Home',
      fallbackTitle: 'Deze les',
    },
    labels: {
      lessonFlow: 'Lesverloop',
      investingProcess: 'Beleggingsproces',
      investingProcessStatic: 'Beleggingsproces (6 stappen)',
      termsInLesson: 'Begrippen in deze les',
      searchAllTerms: 'Zoek in alle begrippen',
      fullGlossaryResults: 'Resultaten uit de volledige woordenlijst',
      part: 'Onderdeel',
      step: 'Stap',
      lessonFlowPhases: {
        1: 'Concept',
        2: 'Visualisatie',
        3: 'Contextueel voorbeeld',
        4: 'Praktische oefening',
        5: 'Reflectie',
        6: 'Samenvatting',
      },
      processContext:
        'het vaste stappenplan dat elke investering structureert.',
      processTapMore: 'Tik op de stappen voor meer info.',
      processOverview:
        'Dit is een overzicht. Je leert hier het proces.',
      insight: 'Inzicht',
      outcome: 'Uitkomst',
      aligned: 'In lijn',
      recheckFlow: 'Controleer de volgorde',
      yourOrder: 'Jouw volgorde',
      actions: 'Acties',
      yourProcess: 'Jouw proces',
      availableSteps: 'Beschikbare stappen',
      executionLast: 'Uitvoering (laatst)',
      emptySlot: 'Lege plek',
      placeStepHere: 'Plaats hier de juiste stap',
      needHint: 'Hint nodig?',
      hint: 'Hint',
      revealImpact: 'Toon impact',
      signal: 'Signaal',
      coverage: 'Dekking',
      keyTakeaways: 'Belangrijkste inzichten',
      eqtyInsight: 'EQTY inzicht',
      reflectionLabel: 'Reflectie',
      yourAnswer: 'Jouw antwoord',
      reflectionSavedShort: 'Opgeslagen',
      tapElements: 'Tik op elementen om te verkennen',
      animationPlaceholder: 'Animatie placeholder',
      tapReturn: 'Tik om terug te gaan',
      tapDetails: 'Tik voor details',
      tapStation: 'Tik op een stap om uit te vouwen.',
      tapInsightToConfirm: 'Tik op elk inzicht om het te bevestigen.',
      allInsightsConfirmed: 'Je begrijpt het. Klaar om de les af te ronden.',
    },
    messages: {
      noExercise: 'Er is geen oefening beschikbaar voor deze les.',
      tapActions: 'Tik op de acties hieronder om de volgorde op te bouwen.',
      correctOrder: 'Juiste volgorde - je kunt doorgaan.',
      incorrectOrder: 'Volgorde klopt niet - probeer opnieuw.',
      hintBody: 'Uitvoering is nooit het startpunt. Begin met het definieren van het doel.',
      selectItems: 'Selecteer items om de impact te zien.',
      reflectionQuestion: 'Wat heb je geleerd uit deze les?',
      reflectionPlaceholder: 'Typ hier je antwoord...',
      reflectionSaved: 'Opgeslagen om komende lessen te personaliseren.',
      reflectionSubtitle: 'Schrijf op wat jij meeneemt uit deze les.',
      reflectionPersonalizationHint: 'Je antwoord personaliseert je volgende lessen.',
      reflectionLockedTitle: 'Reactie vergrendeld',
      reflectionLockedBody:
        'Opgeslagen om komende lessen te personaliseren. Je kunt geen extra antwoord sturen.',
      reflectionShort:
        'De les draait om het definieren van elke stap voor uitvoering om beslissingen stevig te houden.',
      reflectionStructure:
        'Genoteerd - uitvoering krijgt betekenis wanneer ze de volledige reeks stappen volgt.',
      reflectionEmotion:
        'Genoteerd - een gedefinieerd proces kan reactieve uitvoering verminderen door pauze en helderheid toe te voegen.',
      reflectionDefault:
        'Deze reflectie sluit aan bij het idee dat uitvoering het best werkt nadat de eerdere stappen zijn gezet.',
    },
    introConcept: {
      definition: 'Definitie',
      title: 'Wat is Beleggen als een proces?',
      paragraph:
        'Beleggen als een proces is een stappenplan dat je volgt vóór je start met beleggen. Je leert eerst de juiste keuzes maken, en daarna pas beleggen.',
      processTitle: 'Beleggingsproces',
      processHint: 'Tik op een stap om de rol te zien.',
      steps: [
        {
          id: 'goal',
          label: 'Doelbepaling',
          detail: 'Wat wil je met je belegging bereiken?',
        },
        {
          id: 'risk',
          label: 'Individuele risicoanalyse',
          detail: 'Hoeveel risico kan en wil je nemen?',
        },
        {
          id: 'strategy',
          label: 'Financiële investeringsstrategie',
          detail: 'Welke aanpak ga je volgen om je doel te bereiken?',
        },
        {
          id: 'allocation',
          label: 'Kapitaalallocatie',
          detail: 'Hoe verdeel je je geld over verschillende beleggingen?',
        },
        {
          id: 'vehicle',
          label: 'Beleggingsinstrument',
          detail:
            'In welke beleggingen ga je investeren, zoals aandelen, ETF’s of obligaties.',
        },
        {
          id: 'execution',
          label: 'Uitvoering',
          detail:
            'De stap waarin je de investering effectief uitvoert via een broker.',
        },
      ],
    },
    introVisualization: {
      subtitle: 'Elke beslissing leidt natuurlijk naar de volgende.',
      steps: [
        {
          id: 'goal',
          label: 'Doelbepaling',
          question: 'Wat moet mijn geld bereiken?',
          why: 'Doelen gaan over richting, nog niet over keuze.',
          detail:
            'Een doel bepaalt het doel en de timing voordat er een product of ticker in beeld komt.',
        },
        {
          id: 'risk',
          label: 'Individuele risicoanalyse',
          question: 'Hoeveel instabiliteit kan ik aan?',
          why: 'Risico is tolerantie voor beweging, geen gevaar.',
          detail:
            'Risicoanalyse verduidelijkt capaciteit, tolerantie en horizon zodat keuzes binnen je grenzen blijven.',
        },
        {
          id: 'strategy',
          label: 'Financiele investeringsstrategie',
          question: 'Hoe vertaal ik intentie naar regels?',
          why: 'Strategie vermindert complexiteit, ze voegt die niet toe.',
          detail:
            'Strategie zet doelen en randvoorwaarden om in een herhaalbare set regels die je kunt volgen.',
        },
        {
          id: 'allocation',
          label: 'Kapitaalallocatie',
          question: 'Hoe is mijn geld verdeeld?',
          why: 'Allocatie is structuur, niet rekenen in deze fase.',
          detail:
            'Allocatie bepaalt hoeveel waarheen gaat en vormt de uitkomsten meer dan een enkele keuze.',
        },
        {
          id: 'vehicle',
          label: 'Beleggingsinstrument',
          question: 'Welke tool voert het plan uit?',
          why: 'Instrumenten zijn middelen, geen strategie.',
          detail:
            "Instrumenten zijn de tools die de allocatie uitvoeren (fondsen, ETF's, obligaties, aandelen).",
        },
        {
          id: 'execution',
          label: 'Uitvoering',
          question: 'Wanneer handel ik?',
          why: 'Uitvoering is definitief, niet iteratief.',
          detail:
            'Uitvoering is de laatste handeling - ordertype, timing en kosten - nadat alles helder is.',
        },
      ],
    },
    introScenario: {
      structuredLabel: 'Met\nstappenplan',
      structuredSubline: 'Eerst kiezen,\ndan uitvoeren.',
      reactiveLabel: 'Zonder stappenplan',
      reactiveSubline: 'Uitvoeren\nzonder plan.',
      headerHelper:
        'Zie het verschil tussen direct investeren zonder plan en investeren als een doordacht proces.',
      progressLabel: 'Procesvoortgang',
      sliderHelper:
        'Schuif om te zien wat er gebeurt wanneer uitvoering te vroeg gebeurt.',
      stableLabel: 'Stabiel',
      volatileLabel: 'Volatiel',
      insightLine:
        'Wanneer uitvoering te vroeg gebeurt, wordt het resultaat onvoorspelbaar.',
      steps: [
        { id: 'goal', label: 'Doel' },
        { id: 'risk', label: 'Risico' },
        { id: 'strategy', label: 'Strategie' },
        { id: 'allocation', label: 'Allocatie' },
        { id: 'vehicle', label: 'Instrument' },
        { id: 'execution', label: 'Uitvoering' },
      ],
    },
    introExercise: {
      instruction: 'Tik de stappen in de juiste volgorde voordat je uitvoert.',
      correct: 'Juiste volgorde - je kunt doorgaan.',
      incorrect: 'Volgorde klopt niet - probeer opnieuw.',
    },
  },
};

const LANGUAGE_OPTIONS = {
  en: [
    { value: 'English', label: 'English' },
    { value: 'Dutch', label: 'Dutch' },
    { value: 'French', label: 'French' },
    { value: 'German', label: 'German' },
  ],
  nl: [
    { value: 'English', label: 'Engels' },
    { value: 'Dutch', label: 'Nederlands' },
    { value: 'French', label: 'Frans' },
    { value: 'German', label: 'Duits' },
  ],
};

const ONBOARDING_COPY = {
  en: {
    welcome: {
      title: 'Welcome to EQTY',
      subtitle:
        'EQTY provides a structured preparation for investing, with a focus on insight before action.',
      primaryCta: 'Create account',
      secondaryCta: 'Log in',
      tapHint: 'Tap to continue',
    },
    whatIsEqty: {
      title: 'Investing as a process',
      intro: 'EQTY teaches you step by step what preparation is needed before you start investing.',
      emphasis: 'Investing as a process is a fixed method with clear steps.',
      outro: 'After all lessons, you will know what is needed to start investing.',
      button: 'Continue',
    },
    positioning: {
      stepLabel: 'Step 02',
      badge: 'EQTY positioning',
      title: 'Build to understand investing',
      subtitle: 'Clear lessons, calm pacing, and context that grows with you.',
      tapHint: 'Tap to continue',
    },
    ai: {
      stepLabel: 'Step 03',
      badge: 'AI transparency',
      title: 'How AI works in EQTY',
      subtitle: 'AI adapts explanations and examples.\nNo advice, no predictions.',
      tapHint: 'Tap to continue',
    },
    entry: {
      kicker: 'Start here',
      title: 'Create your EQTY account',
      subtitle: 'A quick setup unlocks the calm, personalized learning experience.',
      cardTitle: 'Create account',
      cardSubtitle: 'Choose a sign-up path.',
      button: 'Create account',
      loginLink: 'I already have an account',
      sheetTitle: 'Create your EQTY account',
      apple: 'Continue with Apple',
      google: 'Continue with Google',
      email: 'Continue with email',
    },
    login: {
      badge: 'Welcome back',
      title: 'Log in',
      subtitle: 'Use any details for this prototype.',
      usernameLabel: 'Username or email',
      usernamePlaceholder: 'Your username or email',
      passwordLabel: 'Create password',
      passwordPlaceholder: '********',
      forgotPassword: 'Forgot password?',
      button: 'Log in',
      divider: 'or',
      socialApple: 'Apple',
      socialGoogle: 'Google',
      link: "Don't have an account? Create account",
    },
    email: {
      badge: 'Email sign up',
      title: 'Create account',
      subtitle: 'Set up your EQTY profile in seconds.',
      usernameLabel: 'Name',
      usernamePlaceholder: 'Your name',
      socialApple: 'Apple',
      socialGoogle: 'Google',
      emailLabel: 'Email',
      emailPlaceholder: 'you@example.com',
      passwordLabel: 'Password',
      passwordPlaceholder: '********',
      passwordHint: 'Min. 8 characters',
      confirmLabel: 'Confirm password',
      confirmPlaceholder: '********',
      passwordMismatch: 'Passwords do not match.',
      divider: 'or',
      button: 'Create account',
      link: 'Already have an account? Log in',
    },
    basicInfo: {
      badge: 'Account setup',
      title: 'About you',
      subtitle: 'This helps personalize your experience.',
      nameLabel: 'Name',
      namePlaceholder: 'Your name',
      birthLabel: 'Date of birth',
      birthPlaceholder: 'DD / MM / YYYY',
      button: 'Create account',
    },
    language: {
      badge: 'Preferences',
      title: 'Choose your language',
      subtitle: 'You can change this later in Profile.',
      button: 'Continue',
      selected: 'Selected',
    },
    questionsIntro: {
      badge: 'Personal context',
      title: 'Personalize your experience',
      subtitle: 'Answer 3 quick questions so we can tailor lessons to you.',
      primaryButton: 'Answer 3 questions',
      secondaryButton: 'Do this later',
      cardTitle: 'Your story in three beats',
      cardSubtitle: 'Short, honest, and easy.',
      bullets: [
        'Your current experience.',
        'What you already understand.',
        'Why you want to start now.',
      ],
      note: 'Editable later in Profile.',
      button: 'Start',
    },
    questionsScreen: {
      badge: 'Personal context',
      title: 'Personalize your path',
      subtitle:
        'Answer 3 quick questions so the AI can personalize lesson content and examples based on your answers.',
      primaryButton: 'Save & continue',
      secondaryButton: 'Do later',
    },
    question: {
      badge: 'Your perspective',
      placeholder: 'Share a few thoughts...',
      button: 'Next',
      finishButton: 'Go to Home',
      labelPrefix: 'Question',
      questions: {
        experienceAnswer: 'What have you already done in terms of investing?',
        knowledgeAnswer: 'What do you already know about investing today?',
        motivationAnswer: 'Why do you want to start investing?',
      },
    },
    confirmation: {
      badge: 'All set',
      title: 'You are all set',
      lines: [
        'Your answers are saved in your profile.',
        'You can edit them later.',
        'They are used to adapt explanations and examples.',
      ],
      button: 'Go to EQTY',
    },
    gate: {
      badge: 'Required',
      title: 'Answer 3 questions to unlock Lesson 1',
      subtitle: 'Your answers help personalize the lesson examples before you continue.',
      primaryButton: 'Answer questions',
      secondaryButton: 'Back',
    },
  },
  nl: {
    welcome: {
      title: 'Welkom bij EQTY',
      subtitle:
        'EQTY biedt een gestructureerde voorbereiding op beleggen, met focus op inzicht vóór actie.',
      primaryCta: 'Maak een account',
      secondaryCta: 'Log in',
      tapHint: 'Tik om door te gaan',
    },
    whatIsEqty: {
      title: 'Beleggen als een proces',
      intro: 'EQTY leert je stap voor stap welke voorbereiding nodig is vóór je begint met investeren.',
      emphasis: 'Beleggen als een proces is een vaste methode met duidelijke stappen.',
      outro: 'Na alle lessen weet je wat nodig is om te beginnen met beleggen.',
      button: 'Doorgaan',
    },
    positioning: {
      stepLabel: 'Stap 02',
      badge: 'EQTY positionering',
      title: 'Bouw om investeren te begrijpen',
      subtitle: 'Heldere lessen, rustig tempo en context die met je meegroeit.',
      tapHint: 'Tik om door te gaan',
    },
    ai: {
      stepLabel: 'Stap 03',
      badge: 'AI transparantie',
      title: 'Hoe AI werkt in EQTY',
      subtitle: 'AI past uitleg en voorbeelden aan.\nGeen advies, geen voorspellingen.',
      tapHint: 'Tik om door te gaan',
    },
    entry: {
      kicker: 'Start hier',
      title: 'Maak je EQTY account',
      subtitle: 'Een snelle setup opent de rustige, gepersonaliseerde leerervaring.',
      cardTitle: 'Maak account',
      cardSubtitle: 'Kies een manier om te registreren.',
      button: 'Maak account',
      loginLink: 'Ik heb al een account',
      sheetTitle: 'Maak je EQTY account',
      apple: 'Ga verder met Apple',
      google: 'Ga verder met Google',
      email: 'Ga verder met e-mail',
    },
    login: {
      badge: 'Welkom terug',
      title: 'Log in',
      subtitle: 'Gebruik om het even welke gegevens voor deze prototype.',
      usernameLabel: 'Gebruikersnaam of e-mail',
      usernamePlaceholder: 'Jouw gebruikersnaam of e-mail',
      passwordLabel: 'Maak wachtwoord',
      passwordPlaceholder: '********',
      forgotPassword: 'Wachtwoord vergeten?',
      button: 'Log in',
      divider: 'of',
      socialApple: 'Apple',
      socialGoogle: 'Google',
      link: 'Nog geen account? Maak account',
    },
    email: {
      badge: 'Aanmelden met e-mail',
      title: 'Account aanmaken',
      subtitle: 'Maak in enkele seconden je EQTY-profiel.',
      usernameLabel: 'Naam',
      usernamePlaceholder: 'Jouw naam',
      socialApple: 'Apple',
      socialGoogle: 'Google',
      emailLabel: 'E-mail',
      emailPlaceholder: 'jij@voorbeeld.com',
      passwordLabel: 'Maak Wachtwoord',
      passwordPlaceholder: '********',
      passwordHint: 'Min. 8 tekens',
      confirmLabel: 'Bevestig wachtwoord',
      confirmPlaceholder: '********',
      passwordMismatch: 'Wachtwoorden komen niet overeen.',
      divider: 'of',
      button: 'Account aanmaken',
      link: 'Heb je al een account? Log in',
    },
    basicInfo: {
      badge: 'Account instellen',
      title: 'Over jou',
      subtitle: 'Dit helpt om je ervaring te personaliseren.',
      nameLabel: 'Naam',
      namePlaceholder: 'Jouw naam',
      birthLabel: 'Geboortedatum',
      birthPlaceholder: 'DD / MM / JJJJ',
      button: 'Account maken',
    },
    language: {
      badge: 'Voorkeuren',
      title: 'Kies je taal',
      subtitle: 'Je kan dit later wijzigen in Profiel.',
      button: 'Doorgaan',
      selected: 'Gekozen',
    },
    questionsIntro: {
      badge: 'Persoonlijke context',
      title: 'Personaliseer je ervaring',
      subtitle: 'Beantwoord 3 korte vragen zodat we lessen op jou afstemmen.',
      primaryButton: 'Beantwoord 3 vragen',
      secondaryButton: 'Doe dit later',
      cardTitle: 'Je verhaal in drie stappen',
      cardSubtitle: 'Kort, eerlijk en eenvoudig.',
      bullets: [
        'Je huidige ervaring.',
        'Wat je al begrijpt.',
        'Waarom je nu wil beginnen.',
      ],
      note: 'Later aanpasbaar in Profiel.',
      button: 'Start',
    },
    questionsScreen: {
      badge: 'Persoonlijke context',
      title: 'Personaliseer je pad',
      subtitle:
        'Beantwoord 3 korte vragen zodat de AI de lesinhoud en voorbeelden kan personaliseren op basis van jouw antwoorden.',
      primaryButton: 'Opslaan en doorgaan',
      secondaryButton: 'Later',
    },
    question: {
      badge: 'Jouw perspectief',
      placeholder: 'Deel een paar gedachten...',
      button: 'Volgende',
      finishButton: 'Ga naar home',
      labelPrefix: 'Vraag',
      questions: {
        experienceAnswer: 'Wat heb je al gedaan op vlak van investeren?',
        knowledgeAnswer: 'Wat weet je vandaag al over investeren?',
        motivationAnswer: 'Waarom wil je nu beginnen met investeren?',
      },
    },
    confirmation: {
      badge: 'Alles klaar',
      title: 'Je bent helemaal klaar',
      lines: [
        'Je antwoorden zijn opgeslagen in je profiel.',
        'Je kan ze later aanpassen.',
        'Ze worden gebruikt om uitleg en voorbeelden aan te passen.',
      ],
      button: 'Ga naar EQTY',
    },
    gate: {
      badge: 'Vereist',
      title: 'Beantwoord 3 vragen om Les 1 te ontgrendelen',
      subtitle: 'Je antwoorden helpen om lesvoorbeelden te personaliseren voordat je doorgaat.',
      primaryButton: 'Beantwoord vragen',
      secondaryButton: 'Terug',
    },
  },
};

const HOME_COPY = {
  en: {
    greetingHi: 'Hi',
    greetingMorning: 'Good morning',
    greetingAfternoon: 'Good afternoon',
    greetingEvening: 'Good evening',
    defaultName: 'there',
    nextLessonTitle: 'Your next lesson',
    currentLessonLabel: 'Current lesson',
    learningPathTitle: 'Learning path',
    nextThemesTitle: 'Next themes',
    moduleLabel: 'Module',
    lessonLabel: 'Lesson',
    moduleFallbackTitle: 'Current module',
    lessonFallbackTitle: 'Current lesson',
    lessonFallbackDescription: 'Continue the next lesson in your series.',
    moduleFallbackDescription: 'Build the foundation for today.',
    startLesson: 'Start lesson',
    continueLesson: 'Continue lesson',
    upcomingTitle: 'Upcoming lessons',
    viewAll: 'View all',
    overviewTitle: 'Lesson overview',
    overviewLabels: {
      modules: 'Modules',
      lessons: 'Lessons',
      completed: 'Completed',
    },
    progressCount: (completed, total) => `${completed} of ${total} lessons completed`,
    lessonPosition: (position, total) => `Lesson ${position} of ${total}`,
    lessonLine: (position, title) => `Lesson ${position} · ${title}`,
    lessonShort: (position) => `Lesson ${position}`,
  },
  nl: {
    greetingHi: 'Hi',
    greetingMorning: 'Goedemorgen',
    greetingAfternoon: 'Goedemiddag',
    greetingEvening: 'Goedenavond',
    defaultName: 'daar',
    nextLessonTitle: 'Volgende les',
    currentLessonLabel: 'Nu bezig',
    learningPathTitle: 'Leerpad',
    nextThemesTitle: 'Volgende thema’s',
    moduleLabel: 'Module',
    lessonLabel: 'Les',
    moduleFallbackTitle: 'Huidige module',
    lessonFallbackTitle: 'Huidige les',
    lessonFallbackDescription: 'Ga verder met de volgende les in je reeks.',
    moduleFallbackDescription: 'Bouw de basis voor vandaag.',
    startLesson: 'Start les',
    continueLesson: 'Ga verder met je les',
    upcomingTitle: 'Volgende lessen',
    viewAll: 'Bekijk alles',
    overviewTitle: 'Lesoverzicht',
    overviewLabels: {
      modules: 'Modules',
      lessons: 'Lessen',
      completed: 'Afgerond',
    },
    progressCount: (completed, total) => `${completed} van ${total} lessen afgerond`,
    lessonPosition: (position, total) => `Les ${position} van ${total}`,
    lessonLine: (position, title) => `Les ${position} · ${title}`,
    lessonShort: (position) => `Les ${position}`,
  },
};

const HOME_LESSON_CARD_COPY = {
  en: {
    default: {
      label: 'In this lesson',
      title: 'Investing follows a process',
      body: 'You learn how decisions build on each other before you start investing.',
    },
    lesson_0: {
      label: 'In this lesson',
      title: 'Investing is not a single action, but a process',
      body:
        'You learn how each decision builds on the previous one before you actually start investing.',
    },
  },
  nl: {
    default: {
      label: 'In deze les',
      title: 'Beleggen volgt een proces',
      body: 'Je leert hoe beslissingen op elkaar voortbouwen vóór je begint te investeren.',
    },
    lesson_0: {
      label: 'In deze les',
      title: 'Beleggen is geen losse actie, maar een proces',
      body:
        'Je leert hoe elke beslissing op de vorige voortbouwt, nog vóór je effectief begint te investeren.',
    },
  },
};

const LESSON_RESOURCES_COPY = {
  en: {
    title: 'Extra info',
    subtitle: 'Go deeper on the concepts behind your lessons',
    themeLabel: (n) => `Theme ${n}`,
    lessonLabel: (n) => `Lesson ${n}`,
    searchPlaceholder: 'Search a lesson or concept',
    noSearchResults: 'No lessons match your search.',
    openResource: 'Open',
    currentLessonTag: 'Your lesson',
    completedTag: 'Done',
    lessonsCount: (n) => `${n} lessons`,
    sourcesCount: (n) => `${n} sources`,
    noResources: 'No resources available for this lesson yet.',
    topicTitles: {
      market_basics: 'Market Basics',
      risk_return: 'Risk & Return',
      portfolio_building: 'Portfolio Building',
      etfs_funds: 'ETFs & Funds',
      stocks_equity: 'Stocks & Equity',
      bonds_income: 'Bonds & Fixed Income',
      orders_trading: 'Orders & Trading',
      costs_fees: 'Costs & Fees',
      taxes_regulation: 'Taxes & Regulation',
      time_goals: 'Time Horizon & Goals',
      macro_rates: 'Macro & Rates',
      behavior_psychology: 'Behavior & Psychology',
    },
    topicDescriptions: {
      market_basics: 'Core building blocks of how markets price and trade assets.',
      risk_return: 'How performance and uncertainty are measured and compared.',
      portfolio_building: 'How to structure, balance, and maintain an investing mix.',
      etfs_funds: 'Pooled vehicles, how they track markets, and share classes.',
      stocks_equity: 'Company ownership, valuation, and equity-specific terms.',
      bonds_income: 'Debt instruments, yields, and rate sensitivity concepts.',
      orders_trading: 'How trades are placed, executed, and managed.',
      costs_fees: 'What you pay to invest and where costs show up.',
      taxes_regulation: 'Taxes, compliance, and investor protection topics.',
      time_goals: 'Planning, timelines, and goal-driven investing decisions.',
      macro_rates: 'Economic forces that shape markets and investment returns.',
      behavior_psychology: 'Common decision traps that affect investing behavior.',
    },
  },
  nl: {
    title: 'Extra info',
    subtitle: 'Verdiep je kennis over de concepten achter je lessen',
    themeLabel: (n) => `Thema ${n}`,
    lessonLabel: (n) => `Les ${n}`,
    searchPlaceholder: 'Zoek een les of concept',
    noSearchResults: 'Geen lessen gevonden voor je zoekopdracht.',
    openResource: 'Openen',
    currentLessonTag: 'Jouw les',
    completedTag: 'Klaar',
    lessonsCount: (n) => `${n} lessen`,
    sourcesCount: (n) => `${n} bronnen`,
    noResources: 'Nog geen bronnen beschikbaar voor deze les.',
    topicTitles: {
      market_basics: 'Marktbeginselen',
      risk_return: 'Risico & Rendement',
      portfolio_building: 'Portefeuille opbouwen',
      etfs_funds: "ETF's & Fondsen",
      stocks_equity: 'Aandelen',
      bonds_income: 'Obligaties',
      orders_trading: 'Orders & Trading',
      costs_fees: 'Kosten & Vergoedingen',
      taxes_regulation: 'Belastingen & Regelgeving',
      time_goals: 'Tijdshorizon & Doelen',
      macro_rates: 'Macro & Rente',
      behavior_psychology: 'Gedrag & Psychologie',
    },
    topicDescriptions: {
      market_basics: 'De bouwstenen van hoe markten activa waarderen en verhandelen.',
      risk_return: 'Hoe prestaties en onzekerheid worden gemeten en vergeleken.',
      portfolio_building: 'Hoe je een beleggingsmix opbouwt, balanceert en onderhoudt.',
      etfs_funds: "Beleggingsfondsen, hoe ze markten volgen en aandelenklassen.",
      stocks_equity: 'Aandeelhouderschap, waardering en aandeel-specifieke begrippen.',
      bonds_income: 'Schuldinstrumenten, rendementen en rentegevoeligheidsbegrippen.',
      orders_trading: 'Hoe orders worden geplaatst, uitgevoerd en beheerd.',
      costs_fees: 'Wat je betaalt om te beleggen en waar kosten zichtbaar zijn.',
      taxes_regulation: 'Belastingen, naleving en beleggersbescherming.',
      time_goals: 'Planning, tijdlijnen en doelgerichte beleggingsbeslissingen.',
      macro_rates: 'Economische krachten die markten en beleggingsrendementen vormen.',
      behavior_psychology: 'Veelvoorkomende beslissingsfouten die beleggingsgedrag beïnvloeden.',
    },
  },
};

const LESSON_VIDEOS_COPY = {
  en: {
    title: 'Videos',
    subtitle: 'Quick visual explainers for each lesson',
    featuredTitle: 'Featured for your current lesson',
    featuredFallback: 'No featured video yet. Explore lesson videos below.',
    watchNow: 'Watch now',
    allFilter: 'All',
    currentFilter: 'Current',
    completedFilter: 'Completed',
    upcomingFilter: 'Upcoming',
    noLessons: 'No lessons found for this filter.',
    lessonVideoLabel: 'Lesson video',
    glossaryVideoLabel: 'Glossary video',
    fallbackVideoLabel: 'Suggested explainer',
    sourceLesson: 'Lesson summary',
    sourceGlossary: 'Glossary',
    sourceYoutube: 'YouTube',
    statusCurrent: 'Current',
    statusUpcoming: 'Upcoming',
    statusCompleted: 'Completed',
    browseSectionTitle: 'Browse by topic',
    videosCountFn: (n) => `${n} video${n !== 1 ? 's' : ''}`,
    currentLessonBadge: 'Matching your current lesson',
  },
  nl: {
    title: 'Videos',
    subtitle: 'Snelle visuele uitleg per les',
    featuredTitle: 'Uitgelicht voor je huidige les',
    featuredFallback: 'Nog geen uitgelichte video. Bekijk de lesvideo’s hieronder.',
    watchNow: 'Bekijk nu',
    allFilter: 'Alles',
    currentFilter: 'Huidig',
    completedFilter: 'Afgerond',
    upcomingFilter: 'Aankomend',
    noLessons: 'Geen lessen gevonden voor deze filter.',
    lessonVideoLabel: 'Lesvideo',
    glossaryVideoLabel: 'Glossary video',
    fallbackVideoLabel: 'Aanbevolen uitleg',
    sourceLesson: 'Les samenvatting',
    sourceGlossary: 'Glossary',
    sourceYoutube: 'YouTube',
    statusCurrent: 'Huidig',
    statusUpcoming: 'Aankomend',
    statusCompleted: 'Afgerond',
    browseSectionTitle: 'Bekijk per thema',
    videosCountFn: (n) => `${n} video's`,
    currentLessonBadge: 'Passend bij je huidige les',
  },
};

const SETTINGS_COPY = {
  en: {
    languageTitle: 'Language',
    saved: 'Saved',
    selected: 'Selected',
    onboardingQuestions: 'Onboarding questions',
    common: {
      off: 'Off',
      comingLater: 'Coming later',
    },
    settingsHome: {
      title: 'Settings',
      subtitle: 'Account, preferences, and support',
      logoutButton: 'Log out',
      logoutAlertTitle: 'Log out',
      logoutAlertMessage: 'Are you sure you want to log out?',
      logoutAlertCancel: 'Cancel',
      logoutAlertConfirm: 'Log out',
      categories: {
        account: {
          label: 'Account',
          subtitle: 'Username, email, reset password',
        },
        security: {
          label: 'Security',
          subtitle: 'Two-factor authentication (coming later)',
        },
        personal: {
          label: 'Personal context (AI)',
          subtitle: 'Onboarding answers and AI context',
        },
        preferences: {
          label: 'Preferences',
          subtitle: 'Language, appearance',
        },
        accessibility: {
          label: 'Accessibility',
          subtitle: 'Text size and preview',
        },
        support: {
          label: 'Help & support',
          subtitle: 'Help center, contact support, FAQ',
        },
      },
    },
    preferences: {
      title: 'Preferences',
      subtitle: 'Language and appearance choices',
      languageLabel: 'Language',
      appearanceLabel: 'Appearance',
    },
    security: {
      title: 'Security',
      subtitle: 'Account protection',
      twoFactorLabel: 'Two-factor authentication',
      twoFactorSubtitle: 'Extra security for your account',
    },
    account: {
      title: 'Account',
      subtitle: 'Update your username, email, and password',
      usernameLabel: 'Username',
      usernamePlaceholder: 'Enter username',
      emailLabel: 'Email address',
      emailPlaceholder: 'name@email.com',
      resetPasswordLabel: 'Reset password',
      saveChanges: 'Save changes',
      cancel: 'Cancel',
      emptyValue: '—',
    },
    personalContext: {
      title: 'Personal context (AI)',
      subtitle:
        'Answer these questions to adapt examples, pacing, and feedback. No financial advice.',
      questions: [
        {
          label: 'Question 01',
          prompt: 'What have you already done in terms of investing?',
          placeholder: 'e.g. nothing yet, crypto, ETFs, savings...',
        },
        {
          label: 'Question 02',
          prompt: 'What do you already know about investing today?',
          placeholder: 'e.g. basic terms, risks, returns...',
        },
        {
          label: 'Question 03',
          prompt: 'Why do you want to start investing?',
          placeholder: 'e.g. long-term growth, curiosity, financial independence...',
        },
      ],
      note: 'Changes apply to future explanations and scenarios only.',
      saveChanges: 'Save changes',
      cancel: 'Cancel',
    },
    support: {
      title: 'Help & support',
      subtitle: 'Find answers or get in touch',
      helpCenter: 'Help center',
      contactSupport: 'Contact support',
      faq: 'FAQ',
    },
    helpCenter: {
      title: 'Help center',
      subtitle: 'Browse quick answers and guided steps.',
      searchTitle: 'Search the help center',
      searchPlaceholder: 'Search help topics',
      helperText: 'Popular: resetting passwords, lesson progress, and profile updates.',
      browseTopicsTitle: 'Browse topics',
      topics: [
        {
          title: 'Getting started',
          description: 'Set up your profile, choose a goal, and begin your first lesson.',
        },
        {
          title: 'Lessons and progress',
          description:
            'How lessons work, what is tracked, and how to pick the next step.',
        },
        {
          title: 'Account and security',
          description: 'Update your email, reset passwords, and manage access.',
        },
        {
          title: 'Troubleshooting',
          description: 'Fix loading issues, missing progress, or sync delays.',
        },
      ],
      popularGuidesTitle: 'Popular guides',
      guides: [
        {
          title: 'Reset your password',
          description: 'Head to Settings > Account to reset your credentials.',
        },
        {
          title: 'Update profile details',
          description: 'Keep your learning context and goals up to date.',
        },
        {
          title: 'Track lesson progress',
          description: 'See completed lessons and what is coming up next.',
        },
        {
          title: 'Review your notes',
          description: 'Return to lesson summaries for quick refreshers.',
        },
        {
          title: 'Adjust text size',
          description: 'Increase readability from the accessibility settings.',
        },
      ],
      noGuides: 'No guides match that search yet.',
      needMoreHelpTitle: 'Need more help?',
      needMoreHelpText:
        'Contact support for account access, lesson issues, or feedback on the learning flow.',
      contactSupportCta: 'Contact support',
    },
    faq: {
      title: 'FAQ',
      subtitle: 'Answers to the most common questions.',
      items: [
        {
          question: 'How do lessons work?',
          answer:
            'Each lesson is a short flow with concepts, examples, and exercises. Your progress saves automatically.',
        },
        {
          question: 'How do I see my progress?',
          answer:
            'Your progress appears on the home screen and in your profile overview. Completed lessons stay marked.',
        },
        {
          question: 'Can I update my learning context?',
          answer:
            'Yes. Update your experience, knowledge, or motivation from the profile settings at any time.',
        },
        {
          question: 'I forgot my password. What should I do?',
          answer:
            'Use the reset password option in settings. You can also contact support if you are locked out.',
        },
        {
          question: 'Is my data private?',
          answer:
            'We store only your profile context and lesson progress. Do not share sensitive financial details.',
        },
        {
          question: 'Why is content missing or not loading?',
          answer:
            'Try refreshing the app or checking your connection. If it persists, send us a support request.',
        },
      ],
      stillNeedHelpTitle: 'Still need help?',
      stillNeedHelpText:
        'Visit the help center or send a support request for anything not covered here.',
      contactSupportCta: 'Contact support',
    },
    contactSupport: {
      title: 'Contact support',
      subtitle: 'We usually reply within 24 hours.',
      contactOptionsTitle: 'Contact options',
      channels: [
        {
          label: 'In-app chat',
          subtitle: 'Fastest response. Weekdays 09:00 to 17:00.',
        },
        {
          label: 'Email support',
          subtitle: 'support@example.com. Replies within 24 hours.',
        },
        {
          label: 'Phone line',
          subtitle: '+1 (555) 014-2030 for account access issues.',
        },
      ],
      beforeReachOutTitle: 'Before you reach out',
      beforeReachOutText:
        'Including these details helps us resolve your request faster:',
      checklist: [
        'Your account email or username.',
        'What you were trying to do when it happened.',
        'Device model and OS version.',
        'Screenshots or screen recordings if possible.',
      ],
      sendRequestTitle: 'Send a request',
      subjectLabel: 'Subject',
      subjectPlaceholder: 'Short summary',
      messageLabel: 'Message',
      messagePlaceholder: 'Describe what you need help with',
      helperText: 'Please do not include passwords or sensitive financial details.',
      sendButton: 'Send message',
      sentToast: 'Support request sent',
    },
    changePassword: {
      title: 'Reset password',
      subtitle: 'Change your password',
      currentPasswordLabel: 'Current password',
      currentPasswordPlaceholder: 'Enter current password',
      newPasswordLabel: 'New password',
      newPasswordPlaceholder: 'Create a new password',
      confirmPasswordLabel: 'Confirm new password',
      confirmPasswordPlaceholder: 'Confirm new password',
      forgotPasswordCta: 'Forgot password? Send reset link',
      saveChanges: 'Save changes',
      cancel: 'Cancel',
    },
    resetPassword: {
      title: 'Forgot password',
      subtitle: 'Request a reset link',
      emailLabel: 'Email address',
      emailPlaceholder: 'name@email.com',
      hint: "We'll send a reset link to your email.",
      sendResetLink: 'Send reset link',
      cancel: 'Cancel',
      sentToast: 'Reset link sent',
    },
    loggedOut: {
      title: 'You are logged out',
      description:
        'This prototype uses local-only data. Tap below to continue with a demo profile.',
      cta: 'Log in',
    },
    accessibility: {
      title: 'Accessibility',
      subtitle: 'Adjust text size for better readability',
      textSizeTitle: 'Text size',
      textSizeSubtitle: 'Adjust text size for better readability',
      previewTitle: 'Preview',
      previewText:
        'Investing is a long-term journey. Adjust the text size to match your comfort.',
    },
  },
  nl: {
    languageTitle: 'Taal',
    saved: 'Opgeslagen',
    selected: 'Gekozen',
    onboardingQuestions: 'Onboardingvragen',
    common: {
      off: 'Uit',
      comingLater: 'Komt later',
    },
    settingsHome: {
      title: 'Instellingen',
      subtitle: 'Account, voorkeuren en ondersteuning',
      logoutButton: 'Uitloggen',
      logoutAlertTitle: 'Uitloggen',
      logoutAlertMessage: 'Weet je zeker dat je wilt uitloggen?',
      logoutAlertCancel: 'Annuleren',
      logoutAlertConfirm: 'Uitloggen',
      categories: {
        account: {
          label: 'Account',
          subtitle: 'Gebruikersnaam, e-mail, wachtwoord resetten',
        },
        security: {
          label: 'Beveiliging',
          subtitle: 'Tweestapsverificatie (komt later)',
        },
        personal: {
          label: 'Persoonlijke context (AI)',
          subtitle: 'Onboarding-antwoorden en AI-context',
        },
        preferences: {
          label: 'Voorkeuren',
          subtitle: 'Taal, weergave',
        },
        accessibility: {
          label: 'Toegankelijkheid',
          subtitle: 'Tekstgrootte en voorbeeld',
        },
        support: {
          label: 'Hulp en ondersteuning',
          subtitle: 'Helpcenter, contact met support, FAQ',
        },
      },
    },
    preferences: {
      title: 'Voorkeuren',
      subtitle: 'Taal- en weergavekeuzes',
      languageLabel: 'Taal',
      appearanceLabel: 'Weergave',
    },
    security: {
      title: 'Beveiliging',
      subtitle: 'Accountbescherming',
      twoFactorLabel: 'Tweestapsverificatie',
      twoFactorSubtitle: 'Extra beveiliging voor je account',
    },
    account: {
      title: 'Account',
      subtitle: 'Werk je gebruikersnaam, e-mail en wachtwoord bij',
      usernameLabel: 'Gebruikersnaam',
      usernamePlaceholder: 'Voer gebruikersnaam in',
      emailLabel: 'E-mailadres',
      emailPlaceholder: 'naam@email.com',
      resetPasswordLabel: 'Wachtwoord resetten',
      saveChanges: 'Wijzigingen opslaan',
      cancel: 'Annuleren',
      emptyValue: '—',
    },
    personalContext: {
      title: 'Persoonlijke context (AI)',
      subtitle:
        'Beantwoord deze vragen zodat voorbeelden, tempo en feedback worden aangepast. Geen financieel advies.',
      questions: [
        {
          label: 'Vraag 01',
          prompt: 'Wat heb je al gedaan op vlak van investeren?',
          placeholder: 'bv. nog niets, crypto, ETF\'s, sparen...',
        },
        {
          label: 'Vraag 02',
          prompt: 'Wat weet je vandaag al over investeren?',
          placeholder: 'bv. basisbegrippen, risico, rendement...',
        },
        {
          label: 'Vraag 03',
          prompt: 'Waarom wil je beginnen met investeren?',
          placeholder: 'bv. groei op lange termijn, nieuwsgierigheid, financiele onafhankelijkheid...',
        },
      ],
      note: 'Wijzigingen gelden alleen voor toekomstige uitleg en scenario\'s.',
      saveChanges: 'Wijzigingen opslaan',
      cancel: 'Annuleren',
    },
    support: {
      title: 'Hulp en ondersteuning',
      subtitle: 'Vind antwoorden of neem contact op',
      helpCenter: 'Helpcenter',
      contactSupport: 'Contact met support',
      faq: 'FAQ',
    },
    helpCenter: {
      title: 'Helpcenter',
      subtitle: 'Bekijk snelle antwoorden en duidelijke stappen.',
      searchTitle: 'Zoek in het helpcenter',
      searchPlaceholder: 'Zoek hulponderwerpen',
      helperText:
        'Populair: wachtwoorden resetten, lesvoortgang en profielupdates.',
      browseTopicsTitle: 'Onderwerpen',
      topics: [
        {
          title: 'Aan de slag',
          description: 'Stel je profiel in, kies een doel en start je eerste les.',
        },
        {
          title: 'Lessen en voortgang',
          description:
            'Hoe lessen werken, wat wordt bijgehouden en hoe je je volgende stap kiest.',
        },
        {
          title: 'Account en beveiliging',
          description: 'Werk je e-mail bij, reset wachtwoorden en beheer toegang.',
        },
        {
          title: 'Probleemoplossing',
          description: 'Los laadproblemen, ontbrekende voortgang of syncvertraging op.',
        },
      ],
      popularGuidesTitle: 'Populaire handleidingen',
      guides: [
        {
          title: 'Wachtwoord resetten',
          description: 'Ga naar Instellingen > Account om je wachtwoord te resetten.',
        },
        {
          title: 'Profielgegevens bijwerken',
          description: 'Houd je leercontext en doelen up-to-date.',
        },
        {
          title: 'Lesvoortgang volgen',
          description: 'Bekijk afgeronde lessen en wat hierna komt.',
        },
        {
          title: 'Notities opnieuw bekijken',
          description: 'Ga terug naar lessamenvattingen voor een snelle opfrisser.',
        },
        {
          title: 'Tekstgrootte aanpassen',
          description: 'Verhoog de leesbaarheid via toegankelijkheidsinstellingen.',
        },
      ],
      noGuides: 'Geen handleidingen gevonden voor deze zoekopdracht.',
      needMoreHelpTitle: 'Meer hulp nodig?',
      needMoreHelpText:
        'Neem contact op met support voor accounttoegang, lesproblemen of feedback over de leerflow.',
      contactSupportCta: 'Contact met support',
    },
    faq: {
      title: 'FAQ',
      subtitle: 'Antwoorden op de meest gestelde vragen.',
      items: [
        {
          question: 'Hoe werken lessen?',
          answer:
            'Elke les is een korte flow met concepten, voorbeelden en oefeningen. Je voortgang wordt automatisch opgeslagen.',
        },
        {
          question: 'Hoe zie ik mijn voortgang?',
          answer:
            'Je voortgang staat op het homescherm en in je profieloverzicht. Afgeronde lessen blijven gemarkeerd.',
        },
        {
          question: 'Kan ik mijn leercontext aanpassen?',
          answer:
            'Ja. Werk je ervaring, kennis of motivatie op elk moment bij in de profielinstellingen.',
        },
        {
          question: 'Ik ben mijn wachtwoord vergeten. Wat nu?',
          answer:
            'Gebruik de optie om je wachtwoord te resetten in instellingen. Je kunt ook support contacteren als je bent buitengesloten.',
        },
        {
          question: 'Zijn mijn gegevens prive?',
          answer:
            'We slaan alleen je profielcontext en lesvoortgang op. Deel geen gevoelige financiele details.',
        },
        {
          question: 'Waarom ontbreekt inhoud of laadt iets niet?',
          answer:
            'Probeer de app te vernieuwen of controleer je verbinding. Blijft het probleem? Stuur dan een supportverzoek.',
        },
      ],
      stillNeedHelpTitle: 'Nog hulp nodig?',
      stillNeedHelpText:
        'Ga naar het helpcenter of stuur een supportverzoek voor alles wat hier niet wordt behandeld.',
      contactSupportCta: 'Contact met support',
    },
    contactSupport: {
      title: 'Contact met support',
      subtitle: 'We antwoorden meestal binnen 24 uur.',
      contactOptionsTitle: 'Contactopties',
      channels: [
        {
          label: 'In-app chat',
          subtitle: 'Snelste reactie. Weekdagen van 09:00 tot 17:00.',
        },
        {
          label: 'E-mail support',
          subtitle: 'support@example.com. Antwoord binnen 24 uur.',
        },
        {
          label: 'Telefonische lijn',
          subtitle: '+1 (555) 014-2030 voor problemen met accounttoegang.',
        },
      ],
      beforeReachOutTitle: 'Voor je contact opneemt',
      beforeReachOutText:
        'Met deze details kunnen we je verzoek sneller oplossen:',
      checklist: [
        'Je account-e-mail of gebruikersnaam.',
        'Wat je probeerde te doen toen het probleem optrad.',
        'Toestelmodel en OS-versie.',
        'Screenshots of schermopnames indien mogelijk.',
      ],
      sendRequestTitle: 'Stuur een verzoek',
      subjectLabel: 'Onderwerp',
      subjectPlaceholder: 'Korte samenvatting',
      messageLabel: 'Bericht',
      messagePlaceholder: 'Beschrijf waarbij je hulp nodig hebt',
      helperText: 'Deel geen wachtwoorden of gevoelige financiele details.',
      sendButton: 'Verstuur bericht',
      sentToast: 'Supportverzoek verzonden',
    },
    changePassword: {
      title: 'Wachtwoord resetten',
      subtitle: 'Wijzig je wachtwoord',
      currentPasswordLabel: 'Huidig wachtwoord',
      currentPasswordPlaceholder: 'Voer huidig wachtwoord in',
      newPasswordLabel: 'Nieuw wachtwoord',
      newPasswordPlaceholder: 'Maak een nieuw wachtwoord',
      confirmPasswordLabel: 'Bevestig nieuw wachtwoord',
      confirmPasswordPlaceholder: 'Bevestig nieuw wachtwoord',
      forgotPasswordCta: 'Wachtwoord vergeten? Stuur resetlink',
      saveChanges: 'Wijzigingen opslaan',
      cancel: 'Annuleren',
    },
    resetPassword: {
      title: 'Wachtwoord vergeten',
      subtitle: 'Vraag een resetlink aan',
      emailLabel: 'E-mailadres',
      emailPlaceholder: 'naam@email.com',
      hint: 'We sturen een resetlink naar je e-mailadres.',
      sendResetLink: 'Verstuur resetlink',
      cancel: 'Annuleren',
      sentToast: 'Resetlink verzonden',
    },
    loggedOut: {
      title: 'Je bent uitgelogd',
      description:
        'Dit prototype gebruikt alleen lokale data. Tik hieronder om verder te gaan met een demoprofiel.',
      cta: 'Inloggen',
    },
    accessibility: {
      title: 'Toegankelijkheid',
      subtitle: 'Pas tekstgrootte aan voor betere leesbaarheid',
      textSizeTitle: 'Tekstgrootte',
      textSizeSubtitle: 'Pas tekstgrootte aan voor betere leesbaarheid',
      previewTitle: 'Voorbeeld',
      previewText:
        'Investeren is een langetermijnreis. Pas de tekstgrootte aan voor jouw comfort.',
    },
  },
};

const APPEARANCE_OPTIONS = {
  en: [
    { label: 'Dark', value: 'Dark' },
    { label: 'Light', value: 'Light' },
    { label: 'System', value: 'System' },
  ],
  nl: [
    { label: 'Donker', value: 'Dark' },
    { label: 'Licht', value: 'Light' },
    { label: 'Systeem', value: 'System' },
  ],
};

const TEXT_SIZE_OPTIONS = {
  en: [
    { label: 'Default', value: 'Default' },
    { label: 'Comfort', value: 'Comfort' },
    { label: 'Large', value: 'Large' },
  ],
  nl: [
    { label: 'Standaard', value: 'Default' },
    { label: 'Comfort', value: 'Comfort' },
    { label: 'Groot', value: 'Large' },
  ],
};

const GLOSSARY_COPY = {
  en: {
    title: 'Glossary',
    subtitle: 'Find terms fast without leaving your flow.',
    searchLabel: 'Search glossary',
    searchPlaceholder: 'Search terms, tags, or categories',
    filterAll: 'All',
    allTerms: 'All terms',
    fallbackTerms: 'Terms',
    termCount: (count) => `${count} terms`,
    noMatches: 'No matches. Try another term.',
    definition: 'Definition',
    example: 'Example',
    watchVideo: 'Watch 2-minute video',
    explainForMeTitle: 'Explain for me',
    explainForMeBody: 'Tap below for a tailored explanation.',
    explainForMeButton: 'Explain for me',
    back: 'Back',
  },
  nl: {
    title: 'Woordenlijst',
    subtitle: 'Vind snel begrippen zonder je flow te onderbreken.',
    searchLabel: 'Zoek in woordenlijst',
    searchPlaceholder: 'Zoek begrippen, tags of categorieen',
    filterAll: 'Alles',
    allTerms: 'Alle begrippen',
    fallbackTerms: 'Begrippen',
    termCount: (count) => `${count} begrippen`,
    noMatches: 'Geen resultaten. Probeer een ander begrip.',
    definition: 'Definitie',
    example: 'Voorbeeld',
    watchVideo: 'Bekijk video van 2 minuten',
    explainForMeTitle: 'Leg uit voor mij',
    explainForMeBody: 'Tik hieronder voor een uitleg op maat.',
    explainForMeButton: 'Leg uit voor mij',
    back: 'Terug',
  },
};

const GLOSSARY_CATEGORY_COPY = {
  nl: {
    market_basics: {
      title: 'Marktbasis',
      description: 'Kernbegrippen over hoe markten prijzen vormen en handelen.',
    },
    risk_return: {
      title: 'Risico en Rendement',
      description: 'Hoe prestaties en onzekerheid gemeten en vergeleken worden.',
    },
    portfolio_building: {
      title: 'Portefeuilleopbouw',
      description: 'Hoe je een mix opbouwt, balanceert en onderhoudt.',
    },
    etfs_funds: {
      title: 'ETF\'s en Fondsen',
      description: 'Gebundelde producten, indexvolging en aandelenklassen.',
    },
    stocks_equity: {
      title: 'Aandelen en Equity',
      description: 'Bedrijfseigendom, waardering en termen rond aandelen.',
    },
    bonds_income: {
      title: 'Obligaties en Vastrentend',
      description: 'Schuldinstrumenten, rendement en rentegevoeligheid.',
    },
    orders_trading: {
      title: 'Orders en Handel',
      description: 'Hoe transacties geplaatst, uitgevoerd en beheerd worden.',
    },
    costs_fees: {
      title: 'Kosten en Vergoedingen',
      description: 'Welke kosten je betaalt en waar ze zichtbaar zijn.',
    },
    taxes_regulation: {
      title: 'Belastingen en Regelgeving',
      description: 'Belastingen, naleving en beleggersbescherming.',
    },
    time_goals: {
      title: 'Tijdshorizon en Doelen',
      description: 'Planning, timing en doelgerichte beleggingskeuzes.',
    },
    macro_rates: {
      title: 'Macro en Rente',
      description: 'Economische krachten die markten en rendementen sturen.',
    },
    behavior_psychology: {
      title: 'Gedrag en Psychologie',
      description: 'Veelvoorkomende denkfouten bij beleggingsbeslissingen.',
    },
  },
};

export function getLocaleKey(language) {
  const raw = typeof language === 'string' ? language.trim() : '';
  if (!raw) return 'en';

  const normalized = raw.toLowerCase().replace(/_/g, '-');
  if (normalized === 'nl' || normalized.startsWith('nl-')) return 'nl';
  if (normalized === 'en' || normalized.startsWith('en-')) return 'en';

  return LOCALE_MAP[normalized] || 'en';
}

export function getLessonContent(lessonId, language) {
  const locale = getLocaleKey(language);
  const localized = locale === 'nl' ? lessonContentNl : null;
  return localized?.[lessonId] || lessonContent[lessonId] || lessonContent.lesson_0;
}

export function getLocalizedLessons(language) {
  const locale = getLocaleKey(language);
  if (locale !== 'nl') return lessons;
  return lessons.map((lesson) => {
    const override = curriculumNl.lessons?.[lesson.id];
    return override ? { ...lesson, ...override } : lesson;
  });
}

export function getLocalizedModules(language) {
  const locale = getLocaleKey(language);
  if (locale !== 'nl') return modules;
  return modules.map((module) => {
    const override = curriculumNl.modules?.[module.id];
    return override ? { ...module, ...override } : module;
  });
}

export function getLessonOverviewCopy(language) {
  const locale = getLocaleKey(language);
  return LESSON_OVERVIEW_COPY[locale] || LESSON_OVERVIEW_COPY.en;
}

export function getLessonStepCopy(language) {
  const locale = getLocaleKey(language);
  return LESSON_STEP_COPY[locale] || LESSON_STEP_COPY.en;
}

export function getLanguageOptions(language) {
  const locale = getLocaleKey(language);
  return LANGUAGE_OPTIONS[locale] || LANGUAGE_OPTIONS.en;
}

export function getOnboardingCopy(language) {
  const locale = getLocaleKey(language);
  return ONBOARDING_COPY[locale] || ONBOARDING_COPY.en;
}

export function getHomeCopy(language) {
  const locale = getLocaleKey(language);
  return HOME_COPY[locale] || HOME_COPY.en;
}

export function getHomeLessonCardCopy(lessonId, language) {
  const locale = getLocaleKey(language);
  const localized = HOME_LESSON_CARD_COPY[locale] || HOME_LESSON_CARD_COPY.en;
  return localized?.[lessonId] || localized.default || HOME_LESSON_CARD_COPY.en.default;
}

export function getLessonResourcesCopy(language) {
  const locale = getLocaleKey(language);
  return LESSON_RESOURCES_COPY[locale] || LESSON_RESOURCES_COPY.en;
}

export function getLessonVideosCopy(language) {
  const locale = getLocaleKey(language);
  return LESSON_VIDEOS_COPY[locale] || LESSON_VIDEOS_COPY.en;
}

export function getSettingsCopy(language) {
  const locale = getLocaleKey(language);
  return SETTINGS_COPY[locale] || SETTINGS_COPY.en;
}

export function getAppearanceOptions(language) {
  const locale = getLocaleKey(language);
  return APPEARANCE_OPTIONS[locale] || APPEARANCE_OPTIONS.en;
}

export function getTextSizeOptions(language) {
  const locale = getLocaleKey(language);
  return TEXT_SIZE_OPTIONS[locale] || TEXT_SIZE_OPTIONS.en;
}

export function getGlossaryCopy(language) {
  const locale = getLocaleKey(language);
  return GLOSSARY_COPY[locale] || GLOSSARY_COPY.en;
}

export function getLocalizedGlossaryCategories(language, categories = []) {
  const locale = getLocaleKey(language);
  const localizedById = GLOSSARY_CATEGORY_COPY[locale];
  if (!localizedById) return categories;
  return categories.map((category) => {
    const override = localizedById[category.id];
    return override ? { ...category, ...override } : category;
  });
}

export function formatLessonModuleLabel(language, themeIndex, lessonIndexInTheme) {
  const parsedThemeIndex = Number(themeIndex);
  const hasThemeIndex = Number.isFinite(parsedThemeIndex);
  if (!hasThemeIndex) {
    return formatLessonUnitLabel(language, lessonIndexInTheme);
  }
  return formatThemeLessonContextLabel(language, themeIndex, lessonIndexInTheme, 'comma');
}

export function formatThemeUnitLabel(language, themeIndex) {
  const locale = getLocaleKey(language);
  const parsedThemeIndex = Number(themeIndex);
  const normalizedThemeIndex = Number.isFinite(parsedThemeIndex)
    ? Math.max(1, parsedThemeIndex)
    : themeIndex;
  const themePrefix = locale === 'nl' ? 'THEMA' : 'THEME';
  return `${themePrefix} ${normalizedThemeIndex}`;
}

export function formatLessonUnitLabel(language, lessonIndexInTheme) {
  const locale = getLocaleKey(language);
  const parsedLessonIndex = Number(lessonIndexInTheme);
  const normalizedLessonIndex = Number.isFinite(parsedLessonIndex)
    ? Math.max(1, parsedLessonIndex)
    : lessonIndexInTheme;
  const lessonPrefix = locale === 'nl' ? 'LES' : 'LESSON';
  return `${lessonPrefix} ${normalizedLessonIndex}`;
}

export function formatThemeLessonContextLabel(
  language,
  themeIndex,
  lessonIndexInTheme,
  separator = 'dot'
) {
  const joiner = separator === 'comma' ? ', ' : ' · ';
  return `${formatThemeUnitLabel(language, themeIndex)}${joiner}${formatLessonUnitLabel(
    language,
    lessonIndexInTheme
  )}`;
}

export function getIntroStepTitle(language, step) {
  const locale = getLocaleKey(language);
  return INTRO_STEP_TITLES[locale]?.[step] || INTRO_STEP_TITLES.en[step] || null;
}

export function formatOnboardingQuestionLabel(language, step) {
  const locale = getLocaleKey(language);
  const prefix = ONBOARDING_COPY[locale]?.question?.labelPrefix || ONBOARDING_COPY.en.question.labelPrefix;
  const padded = String(step).padStart(2, '0');
  return `${prefix} ${padded}`;
}

export function formatHomeLessonCount(language, current, total) {
  const locale = getLocaleKey(language);
  if (locale === 'nl') {
    return `Les ${current}/${total}`;
  }
  return `Lesson ${current}/${total}`;
}

export function formatHomeModuleLabel(language, moduleNumber, moduleTitle, moduleIndex) {
  const locale = getLocaleKey(language);
  const moduleName = moduleTitle || '';
  if (moduleNumber !== undefined && moduleNumber !== null) {
    return `Module ${moduleNumber} ${moduleName}`.trim();
  }
  if (moduleIndex !== undefined && moduleIndex !== null) {
    return `Module ${moduleIndex} ${moduleName}`.trim();
  }
  return locale === 'nl' ? 'Modulefocus' : 'Module focus';
}
