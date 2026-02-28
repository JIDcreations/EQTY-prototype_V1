import { lessonContent } from '../data/lessonContent';
import { lessonContentNl } from '../data/lessonContentNl';
import { lessons, modules } from '../data/curriculum';
import { curriculumNl } from '../data/curriculumNl';

const LOCALE_MAP = {
  English: 'en',
  Dutch: 'nl',
};

const LESSON_OVERVIEW_COPY = {
  en: {
    whatYoullLearn: "What you'll learn",
    keyTakeaways: 'Key takeaways',
    lessonStructure: 'Lesson flow',
    lessonFlowHeader: 'Lesson flow (6 parts)',
    show: 'Show',
    hide: 'Hide',
    startLesson: 'Start lesson',
    back: 'Back',
    stepLabels: [
      'Concept',
      'Visualization',
      'Contextual example',
      'Practical exercise',
      'Reflection',
      'Summary',
    ],
    statusCompleted: 'Completed',
    statusCurrent: 'Current',
    statusUpcoming: 'Upcoming',
    lessonFinished: 'Lesson finished',
  },
  nl: {
    whatYoullLearn: 'Wat je leert',
    keyTakeaways: 'Belangrijkste inzichten',
    lessonStructure: 'Lesverloop',
    lessonFlowHeader: 'Lesverloop (6 onderdelen)',
    show: 'Toon',
    hide: 'Verberg',
    startLesson: 'Start les',
    back: 'Terug',
    stepLabels: [
      'Concept',
      'Visualisatie',
      'Contextueel voorbeeld',
      'Praktische oefening',
      'Reflectie',
      'Samenvatting',
    ],
    statusCompleted: 'Afgerond',
    statusCurrent: 'Huidig',
    statusUpcoming: 'Aankomend',
    lessonFinished: 'Les afgerond',
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
    },
    lessonSuccess: {
      title: 'Introduction lesson is finished!',
      subtitle: (lessonTitle) => `${lessonTitle} is finished.`,
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
      needHint: 'Need a hint?',
      hint: 'Hint',
      revealImpact: 'Reveal impact',
      signal: 'Signal',
      coverage: 'Coverage',
      keyTakeaways: 'Key takeaways',
      eqtyInsight: 'EQTY insight',
      tapElements: 'Tap elements to explore',
      animationPlaceholder: 'Animation placeholder',
      tapReturn: 'Tap to return',
      tapDetails: 'Tap for details',
      tapStation: 'Tap a station to expand.',
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
      title: 'What is investing as a process?',
      paragraph:
        'Investing is not a single action. It is a sequence of decisions that build on each other. Buying or selling only happens at the final step.',
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
    },
    lessonSuccess: {
      title: 'Inleidende les is afgerond!',
      subtitle: (lessonTitle) => `Je hebt ${lessonTitle} afgerond.`,
      detail: 'Ga verder met de volgende lessen om het volledige proces te verdiepen.',
      introDetail:
        'Je kan nu starten met de volledige lessen over het hele investeringsproces in detail.',
      cta: 'Naar Home',
      fallbackTitle: 'Deze les',
    },
    labels: {
      lessonFlow: 'Lesverloop',
      investingProcess: 'Beleggingsproces',
      investingProcessStatic: 'Beleggingsproces (6 stappen)',
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
      needHint: 'Hint nodig?',
      hint: 'Hint',
      revealImpact: 'Toon impact',
      signal: 'Signaal',
      coverage: 'Dekking',
      keyTakeaways: 'Belangrijkste inzichten',
      eqtyInsight: 'EQTY inzicht',
      tapElements: 'Tik op elementen om te verkennen',
      animationPlaceholder: 'Animatie placeholder',
      tapReturn: 'Tik om terug te gaan',
      tapDetails: 'Tik voor details',
      tapStation: 'Tik op een stap om uit te vouwen.',
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
      title: 'Wat is investeren als proces?',
      paragraph:
        'Investeren is geen eenmalige actie. Het is een reeks beslissingen die op elkaar voortbouwen. Kopen of verkopen gebeurt pas in de laatste stap.',
      processTitle: 'Beleggingsproces',
      processHint: 'Tik op een stap om de rol te zien.',
      steps: [
        {
          id: 'goal',
          label: 'Doelbepaling',
          detail: 'Verduidelijk wat het geld moet bereiken.',
        },
        {
          id: 'risk',
          label: 'Individuele risicoanalyse',
          detail: 'Bepaal risicocapaciteit, risicotolerantie en tijdshorizon.',
        },
        {
          id: 'strategy',
          label: 'Financiele investeringsstrategie',
          detail: 'Vertaal het doel naar leidende regels.',
        },
        {
          id: 'allocation',
          label: 'Kapitaalallocatie',
          detail: 'Bepaal hoe kapitaal over activa wordt verdeeld.',
        },
        {
          id: 'vehicle',
          label: 'Beleggingsinstrument',
          detail: 'Kies de instrumenten die passen bij de allocatie.',
        },
        {
          id: 'execution',
          label: 'Uitvoering',
          detail: 'Plaats de order pas wanneer het proces helder is.',
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
      primaryCta: 'Maak account',
      secondaryCta: 'Log in',
      tapHint: 'Tik om door te gaan',
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
    support: {
      title: 'Help & support',
      subtitle: 'Find answers or get in touch',
      helpCenter: 'Help center',
      contactSupport: 'Contact support',
      faq: 'FAQ',
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
    support: {
      title: 'Hulp en ondersteuning',
      subtitle: 'Vind antwoorden of neem contact op',
      helpCenter: 'Helpcenter',
      contactSupport: 'Contact met support',
      faq: 'FAQ',
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
  return LOCALE_MAP[language] || 'en';
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

export function formatLessonModuleLabel(language, moduleNumber, lessonOrder) {
  const locale = getLocaleKey(language);
  if (locale === 'nl') {
    return moduleNumber !== undefined
      ? `Module ${moduleNumber}, Les ${lessonOrder}`
      : `Les ${lessonOrder}`;
  }
  return moduleNumber !== undefined
    ? `Module ${moduleNumber}, Lesson ${lessonOrder}`
    : `Lesson ${lessonOrder}`;
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
