export const lessonContent = {
  lesson_0: {
    title: 'Investing as a Process',
    shortDescription:
      'Investing is a structured decision-making process, not a single action.',
    steps: {
      concept: {
        title: 'A structured chain of decisions',
        intro: 'Investing works when each decision builds on the previous one.',
        body:
          'Investing is not one action. It is a structured decision-making process with clear steps that build on each other. Buying or selling is only the final step, after you define the target, understand the drivers, choose a strategy, and set the allocation.',
        visualHint: 'Process first, action last.',
      },
      visualization: {
        title: 'The EQTY process map',
        segments: [
          {
            id: 'segment_1',
            label: 'Target',
            value: 0.22,
            description: 'Define what the money should achieve.',
          },
          {
            id: 'segment_2',
            label: 'Drivers',
            value: 0.2,
            description: 'Risk, resources, and time shape the path.',
          },
          {
            id: 'segment_3',
            label: 'Strategy',
            value: 0.2,
            description: 'Turn the target into rules you can follow.',
          },
          {
            id: 'segment_4',
            label: 'Allocation',
            value: 0.2,
            description: 'Decide how capital is distributed.',
          },
          {
            id: 'segment_5',
            label: 'Execution',
            value: 0.18,
            description: 'Only then do you place the order.',
          },
        ],
      },
      scenario: {
        title: 'Plan vs no plan',
        intro: 'Compare a structured process with a reactive one as it unfolds.',
        variants: {
          new: {
            narrative: [
              'A person wants to start investing but has not placed a first trade yet.',
              'A headline creates urgency, yet the goal, risk limits, and time horizon are still undefined.',
              'The process begins by clarifying the target before tools or markets are chosen.',
            ],
            keyInsight:
              'The process slows action so the first decision is made with clarity.',
          },
          growing: {
            narrative: [
              'Someone has tried a broker app and made a few ETF or crypto moves.',
              'Choices start to stack up without a consistent target or risk boundary.',
              'The process pauses to define drivers and strategy before any new allocation.',
            ],
            keyInsight:
              'Consistency comes from clear targets and constraints, not from the latest picks.',
          },
          seasoned: {
            narrative: [
              'An investor has executed before but wants a repeatable structure.',
              'A new opportunity appears, yet the plan feels uneven across cycles.',
              'The process re-centers on target, drivers, and allocation before execution.',
            ],
            keyInsight: 'Structure creates consistency across changing conditions.',
          },
        },
      },
      exercise: {
        title: 'Build the process',
        type: 'sequence',
        description: 'Put the steps in the right order before you execute.',
        items: [
          { id: 'target', label: 'Goal definition' },
          { id: 'drivers', label: 'Individual risk analysis' },
          { id: 'strategy', label: 'Financial investment strategy' },
          { id: 'allocation', label: 'Capital allocation' },
          { id: 'vehicle', label: 'Investment vehicle' },
          { id: 'execution', label: 'Execution' },
        ],
        correctOrder: ['target', 'drivers', 'strategy', 'allocation', 'vehicle', 'execution'],
        feedback: {
          correct:
            'Execution belongs at the end, after the target and constraints are clear.',
          incorrect:
            'Notice how skipping steps removes the logic that protects you from impulse.',
        },
      },
      reflection: {
        title: 'Your takeaway',
        intro: 'Capture the shift in how you think about execution.',
        question: "If there's one thing you take away from this lesson, what is it?",
        placeholder: 'Example: I see why execution should come last.',
      },
      summary: {
        title: 'The full investing process',
        subtitle: 'Execution is the final step — not the starting point.',
        processMap: [
          {
            id: 'target',
            title: 'Target (Goal definition)',
            description: 'Define the objective and the boundaries for execution.',
            substeps: ['Purpose', 'Time horizon', 'Goal type'],
          },
          {
            id: 'drivers',
            title: 'Drivers (Individual risk analysis)',
            description: 'Clarify the constraints that shape every decision.',
            substeps: ['Risk capacity', 'Risk tolerance', 'Financial resources'],
          },
          {
            id: 'strategy',
            title: 'Financial investment strategy',
            description: 'Set the rules that guide decisions under uncertainty.',
            substeps: ['Liquidity', 'Costs', 'Ethics/ESG', 'Dividend preference'],
          },
          {
            id: 'allocation',
            title: 'Capital allocation',
            description: 'Distribute capital across defined priorities.',
            substeps: ['Asset categories', 'Diversification', 'Example allocations'],
          },
          {
            id: 'vehicles',
            title: 'Investment vehicles',
            description: 'Select the tools that express the plan.',
            substeps: ['Equities', 'Bonds', 'ETFs', 'Alternatives'],
          },
          {
            id: 'execution',
            title: 'Execution',
            description: 'Place orders only after the system is clear.',
            substeps: ['Order types', 'Transaction costs', 'Execution comes last'],
          },
        ],
        takeaways: [
          'Investing is a structured process, not a single action.',
          'Buying or selling comes only after the earlier steps.',
          'Understanding the full process reduces impulsive decisions.',
          'The EQTY framework runs from target definition to execution.',
        ],
      },
    },
  },
  lesson_1: {
    title: 'Why Do I Want to Invest?',
    shortDescription: 'Goals give every decision direction.',
    steps: {
      concept: {
        title: 'Investing is a means, not a goal',
        intro: 'A clear goal gives direction to every choice that follows.',
        sectionLabel: 'Your goal determines:',
        drivers: [
          {
            id: 'time',
            label: 'Time',
            detail: 'how long you can afford to wait',
          },
          {
            id: 'risk',
            label: 'Risk',
            detail: 'how much loss you can absorb',
          },
          {
            id: 'personal',
            label: 'Personal situation',
            detail: 'what is actually achievable for you',
          },
        ],
        visualHint: 'Goals turn noise into direction.',
      },
      visualization: {
        title: 'Examples of investment goals',
        cards: [
          {
            id: 'house',
            label: 'House',
            question: 'A home as a goal',
            detail:
              'Investing with a goal like a home gives direction to how much you need and by when.',
          },
          {
            id: 'car',
            label: 'Car',
            question: 'Plan for a later purchase',
            detail:
              'A concrete goal helps you align decisions with a purchase you want to make later.',
          },
          {
            id: 'travel',
            label: 'Travel',
            question: 'Shorter goals still count',
            detail:
              'Smaller or shorter-term goals can also be a reason to save or invest.',
          },
          {
            id: 'retirement',
            label: 'Retirement',
            question: 'Long-term goals need patience',
            detail:
              'Long-term goals often need a different approach and more patience.',
          },
        ],
        segments: [
          {
            id: 'segment_1',
            label: 'Without a goal',
            value: 0.5,
            description:
              'Decisions feel arbitrary. Risk is hard to assess. You react to news and hype instead of following a plan.',
          },
          {
            id: 'segment_2',
            label: 'With a goal',
            value: 0.5,
            description:
              'Decisions have direction. Risk aligns with your time horizon. You have an anchor to return to when uncertainty hits.',
          },
        ],
      },
      scenario: {
        title: 'Define direction first or act immediately?',
        intro:
          'See the difference between investing without a goal and investing with a clear goal.',
        cardLabel: 'Jean-Pierre',
        text:
          'I have €5,000 ready, but I do not yet know what exactly I am investing for.',
        prompt: 'What do you do first?',
        choices: [
          {
            id: 'invest_now',
            label: 'Invest now',
            sublabel: 'Without a goal',
            icon: 'flash-outline',
          },
          {
            id: 'define_goal',
            label: 'Define the goal',
            sublabel: 'Why are you investing?',
            icon: 'layers-outline',
            isKey: true,
          },
        ],
        feedback: {
          incorrect:
            'Without a goal, every investment feels arbitrary. You do not know what you are trying to achieve.',
          correct:
            'Defining your goal first gives your choices direction and makes them more consistent.',
        },
        comparison: {
          left: {
            title: 'WITHOUT A GOAL',
            chartLabel: 'UNCERTAIN',
            items: [
              'Uncertain',
              'No direction',
              'Reactive',
              'No anchor',
            ],
          },
          right: {
            title: 'WITH A GOAL',
            chartLabel: 'STRUCTURED',
            items: [
              'Clear direction',
              'Intentional choices',
              'Fits time & risk',
              'Anchor in doubt',
            ],
          },
        },
        insightLine:
          'A goal is what turns random action into deliberate investing.',
      },
      exercise: {
        title: 'What is missing?',
        type: 'scenario',
        name: 'Anna',
        personalized: true,
        story:
          'Anna has €5,000 and decides to start investing. She picks an ETF she read about in a finance article. Two months later the market drops 15%. She does not know whether to sell, hold, or buy more.',
        question: 'What is missing from Anna\'s approach?',
        options: [
          {
            id: 'knowledge',
            label: 'More knowledge about ETFs',
            reveal:
              'Knowledge helps, but even well-informed investors lose direction without a goal. The problem runs deeper than information.',
          },
          {
            id: 'goal',
            label: 'A concrete investment goal',
            isKey: true,
            reveal:
              'Without a goal, Anna has no anchor. She never defined what the money is supposed to do for her — so every market move feels like a crisis.',
          },
          {
            id: 'capital',
            label: 'A larger starting amount',
            reveal:
              'More capital does not solve missing direction. With €50,000 and no goal, Anna faces the exact same paralysis — just with higher stakes.',
          },
        ],
      },
      reflection: {
        title: 'Reflection',
        question: 'What would your goal be if you were to invest?',
        placeholder: 'Write your answer here...',
      },
      summary: {
        type: 'goalSetting',
        sections: [
          {
            id: 'why',
            question: 'Why do you want to invest?',
            options: [
              'For a home',
              'More freedom',
              'Extra income',
              'Retirement',
              'Something else',
            ],
          },
          {
            id: 'when',
            question: 'When would you roughly like to reach this?',
            options: [
              'Within 2 years',
              'Within 5 years',
              'Within 10 years',
              'Long term',
              "I don't know yet",
            ],
          },
          {
            id: 'fit',
            question: 'What fits you best right now?',
            options: [
              'I mainly want certainty',
              'I can handle some ups and downs',
              'I want to start calmly',
              "I don't know yet",
            ],
          },
        ],
        interpretations: {
          prefix: 'You want to ',
          why: {
            'For a home': 'invest towards owning a home',
            'More freedom': 'build financial freedom',
            'Extra income': 'generate extra income alongside your current earnings',
            'Retirement': 'think ahead and build a supplement to your retirement',
            'Something else': 'pursue a personal goal',
          },
          when: {
            'Within 2 years': 'in the short term',
            'Within 5 years': 'in the medium term',
            'Within 10 years': 'over a longer horizon',
            'Long term': 'over the long term',
            "I don't know yet": 'without a fixed timeline yet',
          },
          fit: {
            'I mainly want certainty': 'You put stability before returns — certainty is your first priority.',
            'I can handle some ups and downs': 'You are willing to accept some volatility in exchange for more growth potential.',
            'I want to start calmly': 'You prefer a calm start, which tells you that stability matters more to you than speed.',
            "I don't know yet": 'Your risk profile is still open — that is an honest and valid starting point.',
          },
        },
        submitLabel: 'Save my goal',
        feedback: {
          valid:
            'Good. You have set a first direction. In the next lessons, we will make it more concrete step by step.',
        },
      },
    },
  },
  lesson_2: {
    title: 'Types of Investment Goals',
    shortDescription: 'Goal type guides future investing choices.',
    steps: {
      concept: {
        title: 'Types of Investment Goals',
        intro:
          'Investing goals are not all the same. The time you have strongly affects how you should approach investing.',
        leadLabel: 'Three goal types',
        leadBody: 'Short, medium, and long term',
        drivers: [
          {
            id: 'short',
            label: 'Short term',
            detail: 'Focus on stability and predictability.',
          },
          {
            id: 'medium',
            label: 'Medium term',
            detail: 'Balance growth with careful risk.',
          },
          {
            id: 'long',
            label: 'Long term',
            detail: 'Focus on growth and accept ups and downs.',
          },
        ],
        visualHint: 'The goal type shapes the choices that come later.',
      },
      visualization: {
        title: 'Short, medium, long',
        subtitle: 'Swipe through the goal types and examples.',
        cardCodePrefix: 'TYPE',
        cards: [
          {
            id: 'short',
            label: 'Short term',
            question: 'Buying something within 1-2 years',
            detail:
              'Because the goal is close, stability and predictability matter most. Example: saving for a trip, laptop, or deposit soon.',
          },
          {
            id: 'medium',
            label: 'Medium term',
            question: 'Saving for something in a few years',
            detail:
              'There is more time, but not unlimited time. The approach usually balances growth with careful risk. Example: saving for a home deposit.',
          },
          {
            id: 'long',
            label: 'Long term',
            question: 'Building wealth over many years',
            detail:
              'With many years ahead, the focus can move more toward growth. Example: building wealth for retirement or future freedom.',
          },
        ],
      },
      scenario: {
        title: 'Short or long thinking?',
        intro: 'Discover how time shapes your approach',
        text:
          'I want to buy something within 2 years and want my money to grow.',
        prompt: 'What would you do in this situation?',
        choices: [
          {
            id: 'max_growth',
            label: 'Seek maximum growth',
            sublabel: 'Even if my money moves up and down',
            icon: 'flash-outline',
          },
          {
            id: 'choose_stability',
            label: 'Choose stability',
            sublabel: 'Because my goal is close',
            icon: 'layers-outline',
            isKey: true,
          },
        ],
        feedback: {
          incorrectLabel: 'NOT THE BEST CHOICE',
          incorrect:
            'Your goal is close. Taking too much risk can mean your money is worth less when you need it.',
          correctLabel: 'GOOD CHOICE',
          correct:
            'Because you need your money soon, stability and predictability are a better fit.',
        },
        comparison: {
          left: {
            title: 'TOO MUCH RISK',
            visualVariant: 'shortRisk',
            items: [
              'Ups and downs',
              'Uncertain result',
              'Chance of loss',
              'Less control',
            ],
          },
          right: {
            title: 'STABLE',
            visualVariant: 'shortStable',
            items: [
              'More predictable',
              'Fewer ups and downs',
              'More certainty',
              'Fits short term',
            ],
          },
        },
        insightLine:
          'A short-term goal needs a different approach than a long-term goal.',
      },
      exercise: {
        title: 'What kind of goal is this?',
        subtitle: 'Choose which goal type fits each scenario.',
        type: 'scenario',
        sections: [
          {
            id: 'why',
            name: 'Joris',
            cardSubtitle: 'Example scenario',
            story: 'Joris wants to buy a car within 1–2 years.',
            question: 'Which goal type fits this?',
            correctOption: 'Short term',
            options: ['Short term', 'Medium term', 'Long term'],
            feedback: {
              correctLabel: 'Correct',
              incorrectLabel: 'Not quite',
              correctText:
                'Correct. This is a short-term goal because it is within 1–2 years.',
              incorrectText:
                'Not quite. This is a short-term goal because it is within 1–2 years.',
            },
          },
          {
            id: 'when',
            name: 'Emma',
            cardSubtitle: 'Example scenario',
            story: 'Emma is saving for something in a few years.',
            question: 'Which goal type fits this?',
            correctOption: 'Medium term',
            options: ['Short term', 'Medium term', 'Long term'],
            feedback: {
              correctLabel: 'Correct',
              incorrectLabel: 'Not quite',
              correctText:
                'Correct. This is a medium-term goal because it is in a few years.',
              incorrectText:
                'Not quite. This is a medium-term goal because it is in a few years.',
            },
          },
          {
            id: 'fit',
            name: 'Lucas',
            cardSubtitle: 'Example scenario',
            story: 'Lucas wants to build wealth for later.',
            question: 'Which goal type fits this?',
            correctOption: 'Long term',
            options: ['Short term', 'Medium term', 'Long term'],
            feedback: {
              correctLabel: 'Correct',
              incorrectLabel: 'Not quite',
              correctText:
                'Correct. This is a long-term goal because it is for later.',
              incorrectText:
                'Not quite. This is a long-term goal because it is for later.',
            },
          },
        ],
        nextQuestionLabel: 'Next question',
        nextLabel: 'Next',
        completionLabel: 'Next',
        lockAnswerAfterSelection: true,
      },
      reflection: {
        title: 'Reflection',
        question: 'Which type of goal fits you best right now?',
        subtitle:
          'Think about what feels closest today. Your answer will be used in future lessons.',
        placeholder: 'Short term, medium term, or long term...',
        insightText:
          'Good. Knowing your current goal type will help future lessons connect decisions to your situation.',
      },
      summary: {
        takeaways: [
          'Different goals require different approaches.',
          'Time plays a key role in what makes sense.',
          'Your goal will influence how you invest later, so this step prepares future decisions.',
        ],
      },
    },
  },
  lesson_3: {
    title: 'What Does Risk Really Mean?',
    shortDescription: 'Risk includes emotions, not just numbers.',
    steps: {
      concept: {
        title: 'Risk is more than loss',
        body:
          'Risk is not only financial. Emotional responses, uncertainty, and recovery time matter. Understanding your perception of risk comes before chasing returns.',
        sectionLabel: 'Risk can show up as:',
        drivers: [
          {
            id: 'financial',
            label: 'Financial impact',
            detail: 'Potential drawdowns or losses.',
          },
          {
            id: 'emotional',
            label: 'Emotional impact',
            detail: 'Stress, regret, and confidence.',
          },
          {
            id: 'uncertainty',
            label: 'Uncertainty',
            detail: 'How predictable the outcome feels.',
          },
          {
            id: 'recovery',
            label: 'Recovery time',
            detail: 'How long it takes to bounce back.',
          },
        ],
        visualHint: 'Two people can experience the same risk differently.',
      },
      visualization: {
        title: 'Risk has multiple layers',
        segments: [
          {
            id: 'segment_1',
            label: 'Financial impact',
            value: 0.28,
            description: 'Potential drawdowns or losses.',
          },
          {
            id: 'segment_2',
            label: 'Emotional impact',
            value: 0.25,
            description: 'Stress, regret, and confidence.',
          },
          {
            id: 'segment_3',
            label: 'Uncertainty',
            value: 0.24,
            description: 'How predictable the outcome feels.',
          },
          {
            id: 'segment_4',
            label: 'Recovery time',
            value: 0.23,
            description: 'How long it takes to bounce back.',
          },
        ],
      },
      scenario: {
        title: 'Risk is personal',
        variants: {
          new: {
            prompt: 'Markets drop 12% in a week. What feels most risky?',
            options: ['Seeing the account fall', 'Feeling regret', 'Missing the goal date'],
            insight: 'Risk can be emotional even when the numbers recover later.',
          },
          growing: {
            prompt: 'Your portfolio swings each month. What makes it feel risky?',
            options: ['Uncertainty about timing', 'Fear of loss', 'Not understanding why'],
            insight: 'Understanding the story behind the swings reduces perceived risk.',
          },
          seasoned: {
            prompt: 'You have seen cycles. What still feels risky?',
            options: ['Drawdowns near your goal', 'Losing sleep', 'Chasing returns'],
            insight: 'Risk increases when timing and emotions collide.',
          },
        },
      },
      exercise: {
        type: 'tradeoff',
        description: 'Adjust the sliders to see how risk feels beyond numbers.',
        sliders: [
          {
            id: 'drawdown',
            label: 'Potential drawdown',
            min: 0,
            max: 30,
            step: 5,
            suffix: '%',
          },
          {
            id: 'sleep',
            label: 'Sleep impact',
            min: 0,
            max: 10,
            step: 1,
            suffix: '/10',
          },
          {
            id: 'uncertainty',
            label: 'Uncertainty',
            min: 0,
            max: 10,
            step: 1,
            suffix: '/10',
          },
        ],
        scoreLabel: 'Risk signal',
        insight: {
          low: 'Risk feels manageable and predictable.',
          mid: 'Risk is present but may be workable with clarity.',
          high: 'Risk feels heavy and likely to disrupt decisions.',
        },
      },
      reflection: {
        question: 'Which part of risk affects you the most: money, uncertainty, or emotion?'
      },
      summary: {
        takeaways: [
          'Risk is not purely financial.',
          'Emotions change how risk feels.',
          'Understanding risk comes before returns.',
        ],
      },
    },
  },
  lesson_4: {
    title: 'Risk Capacity vs Risk Tolerance',
    shortDescription: 'Ability and comfort are different limits.',
    steps: {
      concept: {
        title: 'Capacity is not tolerance',
        body:
          'Risk capacity is the financial ability to take losses. Risk tolerance is the emotional comfort with those losses. Both matter, and they can be very different.',
        visualHint: 'High capacity does not guarantee high tolerance.',
      },
      visualization: {
        title: 'Two separate limits',
        segments: [
          {
            id: 'segment_1',
            label: 'Capacity',
            value: 0.28,
            description: 'Objective ability to absorb losses.',
          },
          {
            id: 'segment_2',
            label: 'Tolerance',
            value: 0.28,
            description: 'Emotional comfort with volatility.',
          },
          {
            id: 'segment_3',
            label: 'Behavior',
            value: 0.22,
            description: 'How you act when stress rises.',
          },
          {
            id: 'segment_4',
            label: 'Outcome',
            value: 0.22,
            description: 'Staying invested requires both limits.',
          },
        ],
      },
      scenario: {
        title: 'Same portfolio, different response',
        variants: {
          new: {
            prompt: 'You can afford risk, but a drawdown scares you. What is missing?',
            options: ['Tolerance', 'Capacity', 'Time horizon'],
            insight: 'You may have capacity, but tolerance is lower.',
          },
          growing: {
            prompt: 'You feel calm during a dip, but cash is tight. What is missing?',
            options: ['Capacity', 'Tolerance', 'Diversification'],
            insight: 'Tolerance is high, but capacity is limited.',
          },
          seasoned: {
            prompt: 'Your plan is sound, yet you keep reacting. Why?',
            options: ['Tolerance mismatch', 'Too much liquidity', 'No strategy'],
            insight: 'Emotional comfort can be the limiting factor.',
          },
        },
      },
      exercise: {
        type: 'choice',
        description: 'Select the response that fits the same portfolio.',
        options: [
          {
            id: 'calm',
            label: 'I feel calm during swings',
            reveal: 'Tolerance matches capacity, so the plan feels stable.',
          },
          {
            id: 'uneasy',
            label: 'I feel uneasy but stay invested',
            reveal: 'Capacity may exist, but tolerance is lower than the risk taken.',
          },
          {
            id: 'stressed',
            label: 'I feel stressed and want to exit',
            reveal: 'A mismatch can push you out at the wrong time.',
          },
        ],
      },
      reflection: {
        question: 'When markets drop, what matters more to you: ability or comfort?'
      },
      summary: {
        takeaways: [
          'Capacity is objective ability to take losses.',
          'Tolerance is emotional comfort with volatility.',
          'Both limits must align for a sustainable plan.',
        ],
      },
    },
  },
  lesson_5: {
    title: 'Understanding Financial Resources',
    shortDescription: 'Invest only what you can truly spare.',
    steps: {
      concept: {
        title: 'Resources create real limits',
        body:
          'Investable resources include initial capital, recurring contributions, and a buffer for emergencies. Investing should not remove stability or create stress.',
        visualHint: 'A buffer keeps the plan sustainable.',
      },
      visualization: {
        title: 'The resource stack',
        segments: [
          {
            id: 'segment_1',
            label: 'Initial capital',
            value: 0.26,
            description: 'The starting amount you can invest.',
          },
          {
            id: 'segment_2',
            label: 'Recurring input',
            value: 0.26,
            description: 'Consistent contributions over time.',
          },
          {
            id: 'segment_3',
            label: 'Emergency buffer',
            value: 0.26,
            description: 'Cash reserved for unexpected needs.',
          },
          {
            id: 'segment_4',
            label: 'Flexibility',
            value: 0.22,
            description: 'Room to adjust when life changes.',
          },
        ],
      },
      scenario: {
        title: 'Protect the buffer',
        variants: {
          new: {
            prompt: 'You want to invest but only have a thin buffer. What is the risk?',
            options: ['Forced selling', 'Too much growth', 'Missing dividends'],
            insight: 'Without a buffer, unexpected costs can break the plan.',
          },
          growing: {
            prompt: 'You can invest monthly, but cash is tight. What matters most?',
            options: ['Sustainable contribution', 'High returns', 'Daily trading'],
            insight: 'Consistency beats intensity when resources are limited.',
          },
          seasoned: {
            prompt: 'Your income is stable. What still protects the plan?',
            options: ['Emergency buffer', 'Market timing', 'Aggressive leverage'],
            insight: 'A buffer keeps decisions calm when surprises arrive.',
          },
        },
      },
      exercise: {
        type: 'tradeoff',
        description: 'Adjust the buffer and strain to see the stability signal.',
        sliders: [
          {
            id: 'buffer',
            label: 'Emergency buffer',
            min: 0,
            max: 6,
            step: 1,
            suffix: ' months',
            invert: true,
          },
          {
            id: 'strain',
            label: 'Contribution strain',
            min: 0,
            max: 10,
            step: 1,
            suffix: '/10',
          },
          {
            id: 'surprise',
            label: 'Unexpected costs',
            min: 0,
            max: 10,
            step: 1,
            suffix: '/10',
          },
        ],
        scoreLabel: 'Stress signal',
        insight: {
          low: 'The plan looks stable and flexible.',
          mid: 'Some strain exists, but it may be manageable.',
          high: 'The plan is fragile and likely to create stress.',
        },
      },
      reflection: {
        question: 'What would make your investing feel more stable month to month?'
      },
      summary: {
        takeaways: [
          'Resources include capital, contributions, and a buffer.',
          'Investing should not remove stability.',
          'Constraints shape which goals are feasible.',
        ],
      },
    },
  },
  lesson_6: {
    title: 'Understanding Time Horizon',
    shortDescription: 'Time changes what risk means.',
    steps: {
      concept: {
        title: 'Time is a risk driver',
        body:
          'Time horizon is how long money can stay invested. Longer horizons allow volatility to smooth out, while short horizons require stability and access.',
        visualHint: 'Short time frames amplify pressure.',
      },
      visualization: {
        title: 'Time changes the feel of risk',
        segments: [
          {
            id: 'segment_1',
            label: 'Time horizon',
            value: 0.28,
            description: 'How long money stays invested.',
          },
          {
            id: 'segment_2',
            label: 'Volatility',
            value: 0.24,
            description: 'Short horizons magnify swings.',
          },
          {
            id: 'segment_3',
            label: 'Decision pressure',
            value: 0.24,
            description: 'Less time means less room to recover.',
          },
          {
            id: 'segment_4',
            label: 'Goal timing',
            value: 0.24,
            description: 'Timing dictates acceptable risk.',
          },
        ],
      },
      scenario: {
        title: 'Time changes the choices',
        variants: {
          new: {
            prompt: 'You need the money in 2 years. What should be true?',
            options: ['Lower volatility', 'Maximum growth', 'Ignore timing'],
            insight: 'Short horizons demand stability and access.',
          },
          growing: {
            prompt: 'You have 10 years. What does time allow?',
            options: ['More volatility', 'No plan needed', 'Only cash'],
            insight: 'Longer horizons allow volatility to be tolerated.',
          },
          seasoned: {
            prompt: 'Your goal date moves closer. What changes?',
            options: ['Pressure rises', 'Risk can increase', 'Time no longer matters'],
            insight: 'Shorter horizons increase decision pressure.',
          },
        },
      },
      exercise: {
        type: 'tradeoff',
        description: 'Move the horizon and access needs to see decision pressure.',
        sliders: [
          {
            id: 'horizon',
            label: 'Time horizon',
            min: 1,
            max: 30,
            step: 1,
            suffix: ' years',
            invert: true,
          },
          {
            id: 'access',
            label: 'Need for access',
            min: 0,
            max: 10,
            step: 1,
            suffix: '/10',
          },
          {
            id: 'certainty',
            label: 'Goal certainty',
            min: 0,
            max: 10,
            step: 1,
            suffix: '/10',
            invert: true,
          },
        ],
        scoreLabel: 'Decision pressure',
        insight: {
          low: 'Pressure is low and volatility is easier to tolerate.',
          mid: 'Pressure is present but manageable with clarity.',
          high: 'Pressure is high, so stability matters most.',
        },
      },
      reflection: {
        question: 'How long can you realistically leave money invested?'
      },
      summary: {
        takeaways: [
          'Time horizon defines acceptable risk.',
          'Longer horizons allow more volatility.',
          'Shorter horizons increase decision pressure.',
        ],
      },
    },
  },
  lesson_7: {
    title: 'What Is an Investment Strategy?',
    shortDescription: 'Strategy creates coherence before products.',
    steps: {
      concept: {
        title: 'Strategy is the coherence layer',
        body:
          'Strategy translates goals and drivers into a consistent approach. It comes before products and stops decisions from fragmenting into reactive moves.',
        visualHint: 'Strategy is the filter, not the product.',
      },
      visualization: {
        title: 'Strategy holds the plan together',
        segments: [
          {
            id: 'segment_1',
            label: 'Goal translation',
            value: 0.26,
            description: 'Turns purpose into a plan.',
          },
          {
            id: 'segment_2',
            label: 'Rules',
            value: 0.25,
            description: 'Defines what you do and avoid.',
          },
          {
            id: 'segment_3',
            label: 'Consistency',
            value: 0.25,
            description: 'Keeps actions aligned over time.',
          },
          {
            id: 'segment_4',
            label: 'Choice filter',
            value: 0.24,
            description: 'Prevents impulse decisions.',
          },
        ],
      },
      scenario: {
        title: 'Strategy before products',
        variants: {
          new: {
            prompt: 'You see a new product. What should guide the decision?',
            options: ['Your strategy', 'The trend', 'A quick win'],
            insight: 'Strategy is the guide, not the product itself.',
          },
          growing: {
            prompt: 'You switch strategies every quarter. What happens?',
            options: ['Decisions fragment', 'Risk drops', 'Returns are guaranteed'],
            insight: 'Without strategy, decisions become reactive and inconsistent.',
          },
          seasoned: {
            prompt: 'You want more consistency. What do you strengthen?',
            options: ['Strategy rules', 'Daily timing', 'Hot tips'],
            insight: 'Clear rules keep the plan consistent over time.',
          },
        },
      },
      exercise: {
        type: 'multi',
        description: 'Toggle what happens when you remove a guiding constraint.',
        options: [
          {
            id: 'no_goal',
            label: 'Ignore the goal',
            impact: 25,
            detail: 'Decisions lose direction and purpose.',
          },
          {
            id: 'no_risk',
            label: 'Ignore risk limits',
            impact: 30,
            detail: 'Volatility can exceed your comfort.',
          },
          {
            id: 'no_liquidity',
            label: 'Ignore liquidity needs',
            impact: 20,
            detail: 'Cash availability can break the plan.',
          },
          {
            id: 'no_costs',
            label: 'Ignore costs',
            impact: 15,
            detail: 'Drag builds quietly over time.',
          },
        ],
        baseScore: 100,
        scoreLabel: 'Strategy coherence',
        insight: {
          high: 'Coherence stays strong when constraints remain.',
          mid: 'Some consistency remains, but cracks appear.',
          low: 'The strategy fragments without clear constraints.',
        },
      },
      reflection: {
        question: 'What rule would keep your investing most consistent?'
      },
      summary: {
        takeaways: [
          'Strategy turns goals into a coherent approach.',
          'It comes before products and execution.',
          'Without strategy, decisions fragment.',
        ],
      },
    },
  },
  lesson_8: {
    title: 'Liquidity',
    shortDescription: 'Access to cash shapes choices.',
    steps: {
      concept: {
        title: 'Liquidity is speed to cash',
        body:
          'Liquidity means how quickly you can convert an investment to cash without heavy loss. Some goals need fast access, others can accept lock-up.',
        visualHint: 'Liquidity is a constraint, not a bonus.',
      },
      visualization: {
        title: 'Liquidity shapes strategy',
        segments: [
          {
            id: 'segment_1',
            label: 'Access speed',
            value: 0.27,
            description: 'How fast you can exit.',
          },
          {
            id: 'segment_2',
            label: 'Lock-up',
            value: 0.24,
            description: 'How long funds are tied up.',
          },
          {
            id: 'segment_3',
            label: 'Flexibility',
            value: 0.24,
            description: 'Ability to respond to changes.',
          },
          {
            id: 'segment_4',
            label: 'Opportunity cost',
            value: 0.25,
            description: 'Trade-off between access and growth.',
          },
        ],
      },
      scenario: {
        title: 'Balance access and growth',
        variants: {
          new: {
            prompt: 'You may need cash soon. What should you prioritize?',
            options: ['Liquidity', 'Maximum growth', 'Random picks'],
            insight: 'When access matters, liquidity is the priority.',
          },
          growing: {
            prompt: 'You want growth but might need funds in 2 years. What is true?',
            options: ['A trade-off exists', 'Liquidity never matters', 'Only growth counts'],
            insight: 'Liquidity and growth pull in different directions.',
          },
          seasoned: {
            prompt: 'You have a long goal but uncertain income. What matters?',
            options: ['Some liquidity', 'Total lock-up', 'Chasing yield'],
            insight: 'Some access can keep the plan stable.',
          },
        },
      },
      exercise: {
        type: 'tradeoff',
        description: 'Move the sliders to feel the liquidity trade-off.',
        sliders: [
          {
            id: 'liquidity',
            label: 'Liquidity need',
            min: 0,
            max: 10,
            step: 1,
            suffix: '/10',
          },
          {
            id: 'growth',
            label: 'Growth focus',
            min: 0,
            max: 10,
            step: 1,
            suffix: '/10',
          },
        ],
        scoreLabel: 'Liquidity pressure',
        insight: {
          low: 'Low pressure: lock-up is acceptable.',
          mid: 'Balanced pressure: mix access and growth.',
          high: 'High pressure: prioritize accessible assets.',
        },
      },
      reflection: {
        question: 'How quickly might you need access to your money?'
      },
      summary: {
        takeaways: [
          'Liquidity is the speed to cash.',
          'Some goals require fast access.',
          'Liquidity shapes product choices.',
        ],
      },
    },
  },
  lesson_9: {
    title: 'Sustainability and Ethics',
    shortDescription: 'Values define your investable universe.',
    steps: {
      concept: {
        title: 'Values shape the universe',
        body:
          'Sustainability and ethics shape what you are willing to own. Exclusions or preferences reduce the investable universe and change the available options.',
        visualHint: 'Values are a filter, not an afterthought.',
      },
      visualization: {
        title: 'Values narrow the universe',
        segments: [
          {
            id: 'segment_1',
            label: 'Values',
            value: 0.26,
            description: 'Personal or ethical priorities.',
          },
          {
            id: 'segment_2',
            label: 'Exclusions',
            value: 0.25,
            description: 'Sectors or practices you avoid.',
          },
          {
            id: 'segment_3',
            label: 'Impact',
            value: 0.25,
            description: 'Alignment between capital and beliefs.',
          },
          {
            id: 'segment_4',
            label: 'Trade-offs',
            value: 0.24,
            description: 'Narrower choices can increase concentration.',
          },
        ],
      },
      scenario: {
        title: 'Ethics in practice',
        variants: {
          new: {
            prompt: 'You care about sustainability. What changes?',
            options: ['Investable options shrink', 'Risk disappears', 'Goals are irrelevant'],
            insight: 'Values narrow the universe and shape trade-offs.',
          },
          growing: {
            prompt: 'You add exclusions. What is the impact?',
            options: ['Less choice', 'Guaranteed returns', 'No effect'],
            insight: 'Every exclusion reduces the pool of options.',
          },
          seasoned: {
            prompt: 'You add strict values. What should you watch?',
            options: ['Concentration risk', 'Free gains', 'No trade-offs'],
            insight: 'A narrower universe can increase concentration risk.',
          },
        },
      },
      exercise: {
        type: 'multi',
        description: 'Select the exclusions that match your values.',
        options: [
          {
            id: 'fossil',
            label: 'Exclude fossil fuels',
            impact: 18,
            detail: 'Removes most energy sector exposure.',
          },
          {
            id: 'weapons',
            label: 'Exclude weapons',
            impact: 12,
            detail: 'Limits defense and arms exposure.',
          },
          {
            id: 'gambling',
            label: 'Exclude gambling',
            impact: 10,
            detail: 'Reduces exposure to gaming operators.',
          },
          {
            id: 'testing',
            label: 'Exclude animal testing',
            impact: 8,
            detail: 'Reduces exposure in certain consumer sectors.',
          },
        ],
        baseScore: 100,
        scoreLabel: 'Opportunity space',
        insight: {
          high: 'Wide universe with many options.',
          mid: 'Focused universe with clear values.',
          low: 'Narrow universe with higher concentration risk.',
        },
      },
      reflection: {
        question: 'Which values feel non-negotiable for you?'
      },
      summary: {
        takeaways: [
          'Values define what you are willing to own.',
          'Exclusions reduce the investable universe.',
          'Ethical choices change trade-offs.',
        ],
      },
    },
  },
  lesson_10: {
    title: 'Dividend Strategy',
    shortDescription: 'Income and growth must align with goals.',
    steps: {
      concept: {
        title: 'Dividends are a choice',
        body:
          'Dividends provide cash flow. Reinvesting them can grow the portfolio, while taking them out provides income. The choice should align with the goal.',
        visualHint: 'Income vs growth is a real trade-off.',
      },
      visualization: {
        title: 'Dividend pathways',
        segments: [
          {
            id: 'segment_1',
            label: 'Income',
            value: 0.26,
            description: 'Cash paid out for spending or saving.',
          },
          {
            id: 'segment_2',
            label: 'Reinvestment',
            value: 0.25,
            description: 'Cash returned to the portfolio.',
          },
          {
            id: 'segment_3',
            label: 'Stability',
            value: 0.25,
            description: 'Dividends can smooth outcomes.',
          },
          {
            id: 'segment_4',
            label: 'Growth',
            value: 0.24,
            description: 'Reinvestment supports compounding.',
          },
        ],
      },
      scenario: {
        title: 'Choose the role of dividends',
        variants: {
          new: {
            prompt: 'You need extra monthly cash. What fits?',
            options: ['Dividend income', 'Reinvestment only', 'Ignore goals'],
            insight: 'Income goals align with dividend payouts.',
          },
          growing: {
            prompt: 'You want growth over 15 years. What fits?',
            options: ['Reinvest dividends', 'Cash them out', 'Trade frequently'],
            insight: 'Reinvestment supports long-term growth.',
          },
          seasoned: {
            prompt: 'You want steady cash flow and growth. What fits?',
            options: ['Blend income and reinvestment', 'Only cash', 'Only growth'],
            insight: 'A blended approach can match mixed goals.',
          },
        },
      },
      exercise: {
        type: 'choice',
        description: 'Pick a portfolio and reveal the dividend impact.',
        options: [
          {
            id: 'payout',
            label: 'High payout portfolio',
            reveal:
              'You receive steady income, but growth may be slower if cash is not reinvested.',
          },
          {
            id: 'reinvest',
            label: 'Reinvesting portfolio',
            reveal:
              'Income is lower now, but growth can accelerate over time.',
          },
          {
            id: 'blend',
            label: 'Balanced portfolio',
            reveal:
              'Some income supports cash needs while part of the return compounds.',
          },
        ],
      },
      reflection: {
        question: 'Would you prefer cash flow now or growth later, and why?'
      },
      summary: {
        takeaways: [
          'Dividends are cash flow, not free money.',
          'Reinvestment supports growth over time.',
          'Dividend strategy should match the goal.',
        ],
      },
    },
  },
  lesson_11: {
    title: 'Cost Structure',
    shortDescription: 'Costs quietly reduce outcomes.',
    steps: {
      concept: {
        title: 'Costs are a hidden drag',
        body:
          'Fees and transaction costs reduce net returns. Some are visible, others are hidden. Over time, small costs compound into large differences.',
        visualHint: 'Costs matter even when returns look strong.',
      },
      visualization: {
        title: 'The cost layers',
        segments: [
          {
            id: 'segment_1',
            label: 'Fees',
            value: 0.26,
            description: 'Management and platform fees.',
          },
          {
            id: 'segment_2',
            label: 'Transactions',
            value: 0.25,
            description: 'Spreads and trading costs.',
          },
          {
            id: 'segment_3',
            label: 'Taxes',
            value: 0.25,
            description: 'Taxes reduce net returns.',
          },
          {
            id: 'segment_4',
            label: 'Hidden drag',
            value: 0.24,
            description: 'Small percentages add up over time.',
          },
        ],
      },
      scenario: {
        title: 'Costs are strategic',
        variants: {
          new: {
            prompt: 'Two funds look similar. What should you compare?',
            options: ['Costs and fees', 'Logo design', 'Daily news'],
            insight: 'Small cost differences add up over time.',
          },
          growing: {
            prompt: 'You trade often. What effect does it have?',
            options: ['Higher costs', 'Guaranteed gains', 'No impact'],
            insight: 'Frequent trades increase transaction drag.',
          },
          seasoned: {
            prompt: 'Returns look good, but net results lag. Why?',
            options: ['Cost drag', 'Too much liquidity', 'More risk needed'],
            insight: 'Hidden costs can quietly erode returns.',
          },
        },
      },
      exercise: {
        type: 'tradeoff',
        description: 'Set the cost inputs and reveal the drag over time.',
        requiresRun: true,
        ctaLabel: 'Reveal drag',
        sliders: [
          {
            id: 'fees',
            label: 'Annual costs',
            min: 0,
            max: 2,
            step: 0.1,
            suffix: '%',
          },
          {
            id: 'years',
            label: 'Holding period',
            min: 1,
            max: 20,
            step: 1,
            suffix: ' years',
          },
          {
            id: 'trading',
            label: 'Trading frequency',
            min: 0,
            max: 10,
            step: 1,
            suffix: '/10',
          },
        ],
        scoreLabel: 'Cost drag',
        insight: {
          low: 'Low drag keeps more of the return.',
          mid: 'Some drag is present, but manageable.',
          high: 'High drag can erase a large share of gains.',
        },
        resultHint: 'Costs compound quietly when the horizon is long.',
      },
      reflection: {
        question: 'Where could hidden costs show up in your plan?'
      },
      summary: {
        takeaways: [
          'Visible and hidden costs reduce net returns.',
          'Small percentages become large over time.',
          'Cost awareness is a strategic choice.',
        ],
      },
    },
  },
  lesson_12: {
    title: 'Strategy Brought Together',
    shortDescription: 'Balance forces into one consistent plan.',
    steps: {
      concept: {
        title: 'Strategy is a combination of choices',
        body:
          'A full strategy combines goals, risk, liquidity, and values into one coherent plan. There is no single right preference, only alignment.',
        visualHint: 'Consistency matters more than perfection.',
      },
      visualization: {
        title: 'Strategy is a balancing act',
        segments: [
          {
            id: 'segment_1',
            label: 'Goals',
            value: 0.25,
            description: 'What the money needs to do.',
          },
          {
            id: 'segment_2',
            label: 'Risk',
            value: 0.25,
            description: 'How much volatility you can accept.',
          },
          {
            id: 'segment_3',
            label: 'Liquidity',
            value: 0.25,
            description: 'How much access you need.',
          },
          {
            id: 'segment_4',
            label: 'Values',
            value: 0.25,
            description: 'What you are willing to own.',
          },
        ],
      },
      scenario: {
        title: 'Trade-offs are real',
        variants: {
          new: {
            prompt: 'You want growth, liquidity, and strict values. What happens?',
            options: ['Tension increases', 'Trade-offs vanish', 'Risk disappears'],
            insight: 'More constraints increase tension in the strategy.',
          },
          growing: {
            prompt: 'You loosen one constraint. What changes?',
            options: ['More flexibility', 'No difference', 'Instant returns'],
            insight: 'Relaxing one constraint can increase flexibility.',
          },
          seasoned: {
            prompt: 'You seek consistency. What is required?',
            options: ['Clear priorities', 'More products', 'Faster trades'],
            insight: 'Clear priorities keep the strategy coherent.',
          },
        },
      },
      exercise: {
        type: 'tradeoff',
        description: 'Adjust the forces and observe the tension signal.',
        scoreMode: 'range',
        sliders: [
          {
            id: 'growth',
            label: 'Growth focus',
            min: 0,
            max: 10,
            step: 1,
            suffix: '/10',
          },
          {
            id: 'liquidity',
            label: 'Liquidity need',
            min: 0,
            max: 10,
            step: 1,
            suffix: '/10',
          },
          {
            id: 'values',
            label: 'Values strictness',
            min: 0,
            max: 10,
            step: 1,
            suffix: '/10',
          },
        ],
        scoreLabel: 'Strategy tension',
        insight: {
          low: 'Forces are aligned and easy to reconcile.',
          mid: 'Some tension exists, so trade-offs are needed.',
          high: 'Conflicting priorities make the strategy harder to hold.',
        },
      },
      reflection: {
        question: 'Which priority is hardest for you to compromise on?'
      },
      summary: {
        takeaways: [
          'Strategy is a combination of aligned choices.',
          'Trade-offs create tension that must be managed.',
          'Consistency matters more than perfect choices.',
        ],
      },
    },
  },
  lesson_13: {
    title: 'What Is Capital Allocation?',
    shortDescription: 'Allocation drives outcomes more than picking.',
    steps: {
      concept: {
        title: 'Allocation is the main driver',
        body:
          'Capital allocation is how you distribute money across asset categories. It reflects goals and risk, and often drives long-term outcomes more than individual picks.',
        visualHint: 'Allocation translates strategy into structure.',
      },
      visualization: {
        title: 'Allocation turns strategy into structure',
        segments: [
          {
            id: 'segment_1',
            label: 'Allocation',
            value: 0.28,
            description: 'The primary driver of outcomes.',
          },
          {
            id: 'segment_2',
            label: 'Consistency',
            value: 0.24,
            description: 'Staying aligned matters more than timing.',
          },
          {
            id: 'segment_3',
            label: 'Risk balance',
            value: 0.24,
            description: 'Balance stability and growth.',
          },
          {
            id: 'segment_4',
            label: 'Reflection of goals',
            value: 0.24,
            description: 'Allocation mirrors priorities.',
          },
        ],
      },
      scenario: {
        title: 'Allocation is strategic',
        variants: {
          new: {
            prompt: 'You are unsure which product to pick. What helps more?',
            options: ['Deciding allocation', 'Chasing trends', 'Guessing returns'],
            insight: 'Allocation sets the structure before products.',
          },
          growing: {
            prompt: 'You want to change results. What should you revisit?',
            options: ['Allocation mix', 'Daily timing', 'News feeds'],
            insight: 'Allocation drives long-term outcomes.',
          },
          seasoned: {
            prompt: 'Your plan feels scattered. What creates coherence?',
            options: ['Clear allocation', 'More products', 'Shorter horizon'],
            insight: 'Allocation keeps the plan aligned.',
          },
        },
      },
      exercise: {
        type: 'tradeoff',
        description: 'Shift the weight and see which tilt appears.',
        insightMode: 'dominant',
        sliders: [
          {
            id: 'cash',
            label: 'Cash weight',
            min: 0,
            max: 100,
            step: 5,
            suffix: '%',
          },
          {
            id: 'bonds',
            label: 'Bonds weight',
            min: 0,
            max: 100,
            step: 5,
            suffix: '%',
          },
          {
            id: 'equities',
            label: 'Equities weight',
            min: 0,
            max: 100,
            step: 5,
            suffix: '%',
          },
        ],
        scoreLabel: 'Allocation tilt',
        insightBySlider: {
          cash: 'Cash tilt: stability and access are the priority.',
          bonds: 'Bond tilt: smoothing volatility is the priority.',
          equities: 'Equity tilt: long-term growth is the priority.',
        },
      },
      reflection: {
        question: 'Which asset role feels most important for your goal right now?'
      },
      summary: {
        takeaways: [
          'Allocation is the main driver of long-term outcomes.',
          'It reflects goals and risk preferences.',
          'Picking products comes after allocation.',
        ],
      },
    },
  },
  lesson_14: {
    title: 'Core Asset Categories',
    shortDescription: 'Cash, bonds, and equities have distinct roles.',
    steps: {
      concept: {
        title: 'Each asset has a role',
        body:
          'Cash provides stability, bonds reduce volatility, and equities drive growth. Each category serves a different function in the plan.',
        visualHint: 'Roles matter more than labels.',
      },
      visualization: {
        title: 'Roles, not rankings',
        segments: [
          {
            id: 'segment_1',
            label: 'Cash',
            value: 0.33,
            description: 'Stability and access.',
          },
          {
            id: 'segment_2',
            label: 'Bonds',
            value: 0.33,
            description: 'Volatility reduction.',
          },
          {
            id: 'segment_3',
            label: 'Equities',
            value: 0.34,
            description: 'Growth potential.',
          },
        ],
      },
      scenario: {
        title: 'Match the role',
        variants: {
          new: {
            prompt: 'You need stability. Which role matters most?',
            options: ['Cash role', 'Equity role', 'Speculation role'],
            insight: 'Cash is designed for stability and access.',
          },
          growing: {
            prompt: 'You want to reduce volatility. Which role fits?',
            options: ['Bond role', 'Equity role', 'No role'],
            insight: 'Bonds help smooth portfolio swings.',
          },
          seasoned: {
            prompt: 'You want long-term growth. Which role fits?',
            options: ['Equity role', 'Cash role', 'None'],
            insight: 'Equities provide the primary growth engine.',
          },
        },
      },
      exercise: {
        type: 'choice',
        description: 'Pick a role and reveal the matching category.',
        options: [
          {
            id: 'stability',
            label: 'Protect capital and stay flexible',
            reveal: 'Cash plays the stability role.',
          },
          {
            id: 'dampening',
            label: 'Reduce volatility in the mix',
            reveal: 'Bonds play the dampening role.',
          },
          {
            id: 'growth',
            label: 'Grow value over the long term',
            reveal: 'Equities play the growth role.',
          },
        ],
      },
      reflection: {
        question: 'Which role do you value most right now?'
      },
      summary: {
        takeaways: [
          'Cash provides stability and access.',
          'Bonds reduce volatility.',
          'Equities drive long-term growth.',
        ],
      },
    },
  },
  lesson_15: {
    title: 'Diversification Within Equities',
    shortDescription: 'Reduce dependency inside equities.',
    steps: {
      concept: {
        title: 'Diversification reduces dependency',
        body:
          'Diversification within equities spreads exposure across regions, sectors, and currencies. It reduces dependency on any single outcome.',
        visualHint: 'Concentration increases vulnerability.',
      },
      visualization: {
        title: 'Layers of diversification',
        segments: [
          {
            id: 'segment_1',
            label: 'Geography',
            value: 0.33,
            description: 'Spread across regions.',
          },
          {
            id: 'segment_2',
            label: 'Sector',
            value: 0.33,
            description: 'Avoid single industry risk.',
          },
          {
            id: 'segment_3',
            label: 'Currency',
            value: 0.34,
            description: 'Reduce dependency on one currency.',
          },
        ],
      },
      scenario: {
        title: 'Concentration vs resilience',
        variants: {
          new: {
            prompt: 'Your portfolio is one region only. What happens?',
            options: ['Higher vulnerability', 'Guaranteed growth', 'No impact'],
            insight: 'Single-region exposure increases dependency on one outcome.',
          },
          growing: {
            prompt: 'You focus on one sector. What is the risk?',
            options: ['Sector shocks', 'Lower volatility', 'More access'],
            insight: 'Sector concentration amplifies shocks.',
          },
          seasoned: {
            prompt: 'You ignore currency exposure. What can happen?',
            options: ['Currency risk rises', 'Costs drop', 'Risk disappears'],
            insight: 'Currency exposure can add hidden volatility.',
          },
        },
      },
      exercise: {
        type: 'multi',
        description: 'Remove diversification layers and see resilience drop.',
        options: [
          {
            id: 'geo',
            label: 'Remove geographic diversification',
            impact: 30,
            detail: 'Regional shocks hit the whole equity sleeve.',
          },
          {
            id: 'sector',
            label: 'Remove sector diversification',
            impact: 30,
            detail: 'Industry downturns dominate the outcome.',
          },
          {
            id: 'currency',
            label: 'Remove currency diversification',
            impact: 20,
            detail: 'Currency swings add hidden volatility.',
          },
        ],
        baseScore: 100,
        scoreLabel: 'Resilience',
        insight: {
          high: 'Diversification keeps equity exposure resilient.',
          mid: 'Some resilience remains, but weak spots appear.',
          low: 'Concentration creates fragile outcomes.',
        },
      },
      reflection: {
        question: 'Which diversification layer feels most important to you?'
      },
      summary: {
        takeaways: [
          'Diversification reduces dependency on single outcomes.',
          'Geography, sector, and currency all matter.',
          'Concentration increases vulnerability.',
        ],
      },
    },
  },
  lesson_16: {
    title: 'Allocation Examples',
    shortDescription: 'Different timelines need different mixes.',
    steps: {
      concept: {
        title: 'Allocation reflects the goal',
        body:
          'Short-term goals usually favor stability, medium-term goals balance growth and control, and long-term goals can lean into growth.',
        visualHint: 'The mix follows the timeline.',
      },
      visualization: {
        title: 'Allocation shifts by timeline',
        segments: [
          {
            id: 'segment_1',
            label: 'Short-term mix',
            value: 0.34,
            description: 'Stability and access are dominant.',
          },
          {
            id: 'segment_2',
            label: 'Medium-term mix',
            value: 0.33,
            description: 'Balanced growth and stability.',
          },
          {
            id: 'segment_3',
            label: 'Long-term mix',
            value: 0.33,
            description: 'Growth weight increases.',
          },
        ],
      },
      scenario: {
        title: 'Examples are about fit',
        variants: {
          new: {
            prompt: 'You need money in 2 years. What mix is likely?',
            options: ['Stability-focused', 'Growth-heavy', 'Random'],
            insight: 'Short-term timelines prioritize stability.',
          },
          growing: {
            prompt: 'You have 7 years. What mix fits?',
            options: ['Balanced mix', 'All cash', 'All growth'],
            insight: 'Medium-term timelines balance risk and growth.',
          },
          seasoned: {
            prompt: 'You have 25 years. What mix is common?',
            options: ['Growth-focused', 'Only cash', 'No plan'],
            insight: 'Long-term timelines can lean toward growth.',
          },
        },
      },
      exercise: {
        type: 'choice',
        description: 'Select a timeline and reveal the typical mix.',
        options: [
          {
            id: 'short',
            label: '2-year goal',
            reveal: 'Example mix: stability-first with high access.',
          },
          {
            id: 'medium',
            label: '7-year goal',
            reveal: 'Example mix: balanced across stability and growth.',
          },
          {
            id: 'long',
            label: '25-year goal',
            reveal: 'Example mix: growth-tilted with less need for access.',
          },
        ],
      },
      reflection: {
        question: 'Which example feels closest to your timeline?'
      },
      summary: {
        takeaways: [
          'Allocation reflects the timeline and goal.',
          'Short-term goals prioritize stability.',
          'Long-term goals can lean into growth.',
        ],
      },
    },
  },
  lesson_17: {
    title: 'What Are Investment Vehicles?',
    shortDescription: 'Vehicles are tools, not decisions.',
    steps: {
      concept: {
        title: 'Vehicles implement the plan',
        body:
          'Investment vehicles are tools that execute a strategy. They are not the strategy itself. Vehicles come after allocation and must fit the plan.',
        visualHint: 'Tools are chosen last.',
      },
      visualization: {
        title: 'Tools, not decisions',
        segments: [
          {
            id: 'segment_1',
            label: 'Implementation',
            value: 0.26,
            description: 'Vehicles carry out the plan.',
          },
          {
            id: 'segment_2',
            label: 'Fit',
            value: 0.25,
            description: 'Vehicles must match allocation.',
          },
          {
            id: 'segment_3',
            label: 'Order',
            value: 0.25,
            description: 'Vehicles come after strategy.',
          },
          {
            id: 'segment_4',
            label: 'Tools',
            value: 0.24,
            description: 'They are not the decision itself.',
          },
        ],
      },
      scenario: {
        title: 'Vehicles follow strategy',
        variants: {
          new: {
            prompt: 'You like a new product. What should you check first?',
            options: ['Strategy fit', 'Hype level', 'Daily price'],
            insight: 'Vehicle choice should follow strategy fit.',
          },
          growing: {
            prompt: 'You pick a vehicle before allocation. What happens?',
            options: ['Mismatch risk', 'Guaranteed results', 'Lower costs'],
            insight: 'Choosing vehicles early can misalign the plan.',
          },
          seasoned: {
            prompt: 'You want consistency. What stays fixed?',
            options: ['Strategy and allocation', 'Trends', 'Short-term gains'],
            insight: 'Vehicles should fit what is already defined.',
          },
        },
      },
      exercise: {
        type: 'choice',
        description: 'Pick a tool and reveal whether it fits the goal.',
        options: [
          {
            id: 'mismatch',
            label: 'High-volatility product for a short-term goal',
            reveal: 'The tool does not fit the goal and increases risk.',
          },
          {
            id: 'fit',
            label: 'Stable vehicle for a near-term need',
            reveal: 'The tool fits the goal because stability is required.',
          },
          {
            id: 'late',
            label: 'Pick a vehicle before defining strategy',
            reveal: 'Without strategy, tool choice becomes guesswork.',
          },
        ],
      },
      reflection: {
        question: 'Which decision should happen before choosing a vehicle?'
      },
      summary: {
        takeaways: [
          'Vehicles implement strategy, they do not define it.',
          'Tool choice comes after allocation.',
          'Misusing tools increases risk.',
        ],
      },
    },
  },
  lesson_18: {
    title: 'Equities',
    shortDescription: 'Ownership exposure and long-term growth.',
    steps: {
      concept: {
        title: 'Equity means ownership',
        body:
          'Equities represent ownership in a company. Owning shares gives you exposure to growth and sometimes dividends, but also to volatility.',
        visualHint: 'Ownership comes with both upside and downside.',
      },
      visualization: {
        title: 'The equity role',
        segments: [
          {
            id: 'segment_1',
            label: 'Ownership',
            value: 0.28,
            description: 'Shares represent a claim on the business.',
          },
          {
            id: 'segment_2',
            label: 'Participation',
            value: 0.24,
            description: 'You participate in growth and losses.',
          },
          {
            id: 'segment_3',
            label: 'Dividends',
            value: 0.24,
            description: 'Some equities pay cash to owners.',
          },
          {
            id: 'segment_4',
            label: 'Volatility',
            value: 0.24,
            description: 'Prices can move quickly.',
          },
        ],
      },
      scenario: {
        title: 'Ownership perspective',
        variants: {
          new: {
            prompt: 'You buy a share. What does that mean?',
            options: ['You own part of a company', 'You lent money', 'You hold cash'],
            insight: 'Equities represent ownership.',
          },
          growing: {
            prompt: 'Equities grow, but what else comes with them?',
            options: ['Volatility', 'Guaranteed income', 'No risk'],
            insight: 'Ownership includes volatility as well as upside.',
          },
          seasoned: {
            prompt: 'Why keep equities long-term?',
            options: ['Growth potential', 'Short-term stability', 'Guaranteed returns'],
            insight: 'Equities are designed for long-term growth.',
          },
        },
      },
      exercise: {
        type: 'choice',
        description: 'Pick the statement that matches equities.',
        options: [
          {
            id: 'ownership',
            label: 'I own a small part of a company',
            reveal: 'Correct: equities represent ownership and participation in outcomes.',
          },
          {
            id: 'loan',
            label: 'I lend money to a company',
            reveal: 'That describes bonds, not equities.',
          },
          {
            id: 'cash',
            label: 'I hold cash with no exposure',
            reveal: 'Cash is stability, not ownership.',
          },
        ],
      },
      reflection: {
        question: 'How do you feel about owning part of a company?'
      },
      summary: {
        takeaways: [
          'Equities represent ownership.',
          'They offer growth and dividends with volatility.',
          'They are suited for long-term goals.',
        ],
      },
    },
  },
  lesson_19: {
    title: 'Bonds',
    shortDescription: 'Stability through lending.',
    steps: {
      concept: {
        title: 'Bonds are loans',
        body:
          'Bonds are loans to governments or companies. They tend to offer more predictable returns and reduce volatility in a portfolio.',
        visualHint: 'Bonds stabilize more than they excite.',
      },
      visualization: {
        title: 'The bond role',
        segments: [
          {
            id: 'segment_1',
            label: 'Loan',
            value: 0.27,
            description: 'You lend capital to an issuer.',
          },
          {
            id: 'segment_2',
            label: 'Predictability',
            value: 0.25,
            description: 'Returns are more stable than equities.',
          },
          {
            id: 'segment_3',
            label: 'Volatility reduction',
            value: 0.24,
            description: 'Bonds smooth portfolio swings.',
          },
          {
            id: 'segment_4',
            label: 'Stability',
            value: 0.24,
            description: 'They support balance in the mix.',
          },
        ],
      },
      scenario: {
        title: 'Stability focus',
        variants: {
          new: {
            prompt: 'You want to reduce volatility. What helps?',
            options: ['Bonds', 'More equities', 'No plan'],
            insight: 'Bonds are used to dampen volatility.',
          },
          growing: {
            prompt: 'You want predictable returns. What fits?',
            options: ['Bonds', 'Speculation', 'Random picks'],
            insight: 'Bonds are structured for predictability.',
          },
          seasoned: {
            prompt: 'You want balance in the portfolio. What helps?',
            options: ['A bond allocation', 'Only equities', 'Only cash'],
            insight: 'Bonds provide stability in a mixed portfolio.',
          },
        },
      },
      exercise: {
        type: 'tradeoff',
        description: 'Adjust the bond share to see the stability signal.',
        sliders: [
          {
            id: 'bondShare',
            label: 'Bond share',
            min: 0,
            max: 100,
            step: 5,
            suffix: '%',
          },
        ],
        scoreLabel: 'Volatility dampening',
        insight: {
          low: 'Equity-heavy mixes can feel more volatile.',
          mid: 'A blend can balance growth and stability.',
          high: 'Higher bond weight increases stability.',
        },
      },
      reflection: {
        question: 'How important is stability in your plan?'
      },
      summary: {
        takeaways: [
          'Bonds are loans with more predictable returns.',
          'They reduce volatility in a portfolio.',
          'They support balance and stability.',
        ],
      },
    },
  },
  lesson_20: {
    title: 'ETFs',
    shortDescription: 'Built-in diversification and efficiency.',
    steps: {
      concept: {
        title: 'ETFs bundle many assets',
        body:
          'ETFs hold a basket of assets, often tracking an index. They provide diversification, are usually cost efficient, and simplify implementation.',
        visualHint: 'One vehicle can hold many positions.',
      },
      visualization: {
        title: 'ETF benefits',
        segments: [
          {
            id: 'segment_1',
            label: 'Bundle',
            value: 0.26,
            description: 'Many holdings in one vehicle.',
          },
          {
            id: 'segment_2',
            label: 'Diversification',
            value: 0.26,
            description: 'Spread across assets or sectors.',
          },
          {
            id: 'segment_3',
            label: 'Index tracking',
            value: 0.24,
            description: 'Follows a defined benchmark.',
          },
          {
            id: 'segment_4',
            label: 'Efficiency',
            value: 0.24,
            description: 'Often lower cost than active funds.',
          },
        ],
      },
      scenario: {
        title: 'Density of diversification',
        variants: {
          new: {
            prompt: 'You want exposure to many companies at once. What fits?',
            options: ['ETF', 'Single stock', 'Cash only'],
            insight: 'ETFs bundle many holdings into one vehicle.',
          },
          growing: {
            prompt: 'You want cost efficiency and broad exposure. What fits?',
            options: ['ETF', 'Frequent trading', 'Unfocused picks'],
            insight: 'ETFs provide broad exposure with efficiency.',
          },
          seasoned: {
            prompt: 'You want diversification without complexity. What fits?',
            options: ['ETF', 'Manual selection', 'No plan'],
            insight: 'ETFs simplify diversification.',
          },
        },
      },
      exercise: {
        type: 'tradeoff',
        description: 'Move the holdings count to see diversification density.',
        sliders: [
          {
            id: 'holdings',
            label: 'Holdings count',
            min: 5,
            max: 500,
            step: 5,
          },
        ],
        scoreLabel: 'Diversification density',
        insight: {
          low: 'Few holdings create concentrated exposure.',
          mid: 'A moderate basket offers balanced diversification.',
          high: 'Broad holdings provide strong diversification.',
        },
      },
      reflection: {
        question: 'Do you prefer broad exposure or focused bets, and why?'
      },
      summary: {
        takeaways: [
          'ETFs bundle many assets into one vehicle.',
          'They provide diversification and efficiency.',
          'They simplify implementation of strategy.',
        ],
      },
    },
  },
  lesson_21: {
    title: 'Alternative Investment Vehicles',
    shortDescription: 'High volatility and limited fit.',
    steps: {
      concept: {
        title: 'Alternatives are not always a fit',
        body:
          'Alternatives like gold or crypto exist, but they often carry high volatility and uncertainty. EQTY focuses on structured finance and clear decision paths.',
        visualHint: 'Not every vehicle fits every goal.',
      },
      visualization: {
        title: 'Alternative boundaries',
        segments: [
          {
            id: 'segment_1',
            label: 'Volatility',
            value: 0.28,
            description: 'Price swings can be extreme.',
          },
          {
            id: 'segment_2',
            label: 'Uncertainty',
            value: 0.24,
            description: 'Outcomes can be hard to predict.',
          },
          {
            id: 'segment_3',
            label: 'Fit',
            value: 0.24,
            description: 'Not all goals benefit from alternatives.',
          },
          {
            id: 'segment_4',
            label: 'Boundaries',
            value: 0.24,
            description: 'EQTY prioritizes structured finance.',
          },
        ],
      },
      scenario: {
        title: 'Know the boundaries',
        variants: {
          new: {
            prompt: 'You want stability but consider crypto. What is the risk?',
            options: ['High volatility', 'Guaranteed safety', 'No trade-offs'],
            insight: 'High volatility can conflict with stability goals.',
          },
          growing: {
            prompt: 'You want clarity but explore alternatives. What changes?',
            options: ['Uncertainty increases', 'Risk disappears', 'Costs vanish'],
            insight: 'Alternatives can increase uncertainty.',
          },
          seasoned: {
            prompt: 'You value structure. What fits best?',
            options: ['Structured finance', 'Unclear vehicles', 'Random exposure'],
            insight: 'Clear structure supports consistent decisions.',
          },
        },
      },
      exercise: {
        type: 'tradeoff',
        description: 'Adjust volatility and transparency to see the boundary signal.',
        sliders: [
          {
            id: 'volatility',
            label: 'Volatility level',
            min: 0,
            max: 10,
            step: 1,
            suffix: '/10',
          },
          {
            id: 'transparency',
            label: 'Transparency',
            min: 0,
            max: 10,
            step: 1,
            suffix: '/10',
            invert: true,
          },
          {
            id: 'liquidity',
            label: 'Liquidity clarity',
            min: 0,
            max: 10,
            step: 1,
            suffix: '/10',
            invert: true,
          },
        ],
        scoreLabel: 'Boundary signal',
        insight: {
          low: 'The vehicle feels structured and easier to assess.',
          mid: 'Some uncertainty is present and needs caution.',
          high: 'The boundary is high risk and unclear for most goals.',
        },
      },
      reflection: {
        question: 'Where do you draw your boundary for unclear risk?'
      },
      summary: {
        takeaways: [
          'Alternatives can be volatile and uncertain.',
          'Not every vehicle fits every goal.',
          'EQTY focuses on structured finance.',
        ],
      },
    },
  },
  lesson_22: {
    title: 'What Does Execution Mean?',
    shortDescription: 'Execution is the technical final step.',
    steps: {
      concept: {
        title: 'Execution is the technical step',
        body:
          'Execution is the act of placing an order through a broker. It is a technical step that depends on the decisions made earlier.',
        visualHint: 'Execution only makes sense at the end.',
      },
      visualization: {
        title: 'Execution in context',
        segments: [
          {
            id: 'segment_1',
            label: 'Broker',
            value: 0.26,
            description: 'The intermediary that places orders.',
          },
          {
            id: 'segment_2',
            label: 'Order',
            value: 0.25,
            description: 'The instruction to buy or sell.',
          },
          {
            id: 'segment_3',
            label: 'Settlement',
            value: 0.25,
            description: 'Completion after execution.',
          },
          {
            id: 'segment_4',
            label: 'Dependencies',
            value: 0.24,
            description: 'Execution depends on prior steps.',
          },
        ],
      },
      scenario: {
        title: 'Execution without context',
        variants: {
          new: {
            prompt: 'You want to place an order without a plan. What is missing?',
            options: ['Prior steps', 'More speed', 'More products'],
            insight: 'Execution depends on goals, risk, and strategy.',
          },
          growing: {
            prompt: 'You know the product but not the goal. What happens?',
            options: ['Execution feels premature', 'Risk disappears', 'Returns rise'],
            insight: 'Without context, execution is just a guess.',
          },
          seasoned: {
            prompt: 'You are ready to execute. What confirms readiness?',
            options: ['Clear strategy', 'News updates', 'Random timing'],
            insight: 'Execution follows clarity, not headlines.',
          },
        },
      },
      exercise: {
        type: 'choice',
        description: 'Attempt execution and see why it is locked.',
        options: [
          {
            id: 'execute',
            label: 'Place order now',
            reveal:
              'Execution is locked until the goal, risk, and allocation are defined.',
          },
        ],
      },
      reflection: {
        question: 'What needs to be clear before execution makes sense?'
      },
      summary: {
        takeaways: [
          'Execution is the technical final step.',
          'It depends on earlier decisions.',
          'EQTY focuses on understanding before action.',
        ],
      },
    },
  },
  lesson_23: {
    title: 'Orders and Transaction Costs',
    shortDescription: 'Order types and costs change outcomes.',
    steps: {
      concept: {
        title: 'Orders affect outcomes',
        body:
          'Market and limit orders behave differently. Spreads and transaction costs reduce net returns. Understanding mechanics prevents surprises.',
        visualHint: 'Order choice affects price and cost.',
      },
      visualization: {
        title: 'Order mechanics',
        segments: [
          {
            id: 'segment_1',
            label: 'Market order',
            value: 0.26,
            description: 'Executes immediately at current price.',
          },
          {
            id: 'segment_2',
            label: 'Limit order',
            value: 0.25,
            description: 'Executes only at a set price.',
          },
          {
            id: 'segment_3',
            label: 'Spread',
            value: 0.25,
            description: 'The cost between buy and sell prices.',
          },
          {
            id: 'segment_4',
            label: 'Transaction cost',
            value: 0.24,
            description: 'Costs reduce net results.',
          },
        ],
      },
      scenario: {
        title: 'Order choice matters',
        variants: {
          new: {
            prompt: 'You need fast execution. Which order fits?',
            options: ['Market order', 'Limit order', 'No order'],
            insight: 'Market orders prioritize speed.',
          },
          growing: {
            prompt: 'You want price control. Which order fits?',
            options: ['Limit order', 'Market order', 'Ignore spreads'],
            insight: 'Limit orders prioritize price control.',
          },
          seasoned: {
            prompt: 'You trade frequently. What increases?',
            options: ['Transaction costs', 'Risk disappears', 'Returns rise'],
            insight: 'Frequent trades increase costs and reduce net results.',
          },
        },
      },
      exercise: {
        type: 'choice',
        description: 'Pick an order type and reveal the outcome.',
        options: [
          {
            id: 'market',
            label: 'Market order',
            reveal: 'Fast execution, but price control is limited.',
          },
          {
            id: 'limit',
            label: 'Limit order',
            reveal: 'Price control is higher, but execution is not guaranteed.',
          },
          {
            id: 'ignore',
            label: 'Ignore the spread',
            reveal: 'Ignoring spreads and costs reduces net returns.',
          },
        ],
      },
      reflection: {
        question: 'Do you value speed or price control more, and why?'
      },
      summary: {
        takeaways: [
          'Market and limit orders behave differently.',
          'Spreads and costs reduce net returns.',
          'Order mechanics prevent surprises.',
        ],
      },
    },
  },
  lesson_24: {
    title: 'Why Execution Comes Last',
    shortDescription: 'Acting early increases risk.',
    steps: {
      concept: {
        title: 'Execution is the last step for a reason',
        body:
          'Execution comes after goals, risk, strategy, and allocation. Acting too early increases risk because decisions lack context.',
        visualHint: 'Skipping steps creates avoidable risk.',
      },
      visualization: {
        title: 'Sequence protects decisions',
        segments: [
          {
            id: 'segment_1',
            label: 'Sequence',
            value: 0.26,
            description: 'Each step builds on the last.',
          },
          {
            id: 'segment_2',
            label: 'Risk control',
            value: 0.25,
            description: 'Clarity reduces reactive moves.',
          },
          {
            id: 'segment_3',
            label: 'Clarity',
            value: 0.25,
            description: 'Decisions are anchored by purpose.',
          },
          {
            id: 'segment_4',
            label: 'Action',
            value: 0.24,
            description: 'Execution happens only after clarity.',
          },
        ],
      },
      scenario: {
        title: 'Skipped steps create risk',
        variants: {
          new: {
            prompt: 'You execute before defining a goal. What happens?',
            options: ['Higher risk', 'More clarity', 'Lower costs'],
            insight: 'Skipping steps creates unnecessary risk.',
          },
          growing: {
            prompt: 'You skip allocation planning. What changes?',
            options: ['Decisions fragment', 'Risk disappears', 'Returns rise'],
            insight: 'Execution without allocation creates inconsistency.',
          },
          seasoned: {
            prompt: 'You skip risk assessment. What is the danger?',
            options: ['Mismatch with comfort', 'More growth', 'Less volatility'],
            insight: 'Skipping risk assessment increases the chance of regret.',
          },
        },
      },
      exercise: {
        type: 'multi',
        description: 'Skip steps and watch decision quality fall.',
        options: [
          {
            id: 'skip_goal',
            label: 'Skip goal definition',
            impact: 25,
            detail: 'Decisions lose direction without a goal.',
          },
          {
            id: 'skip_risk',
            label: 'Skip risk assessment',
            impact: 30,
            detail: 'Comfort and capacity may be misaligned.',
          },
          {
            id: 'skip_strategy',
            label: 'Skip strategy',
            impact: 25,
            detail: 'Choices fragment without a guiding approach.',
          },
          {
            id: 'skip_allocation',
            label: 'Skip allocation',
            impact: 20,
            detail: 'Execution lacks structure and balance.',
          },
        ],
        baseScore: 100,
        scoreLabel: 'Decision quality',
        insight: {
          high: 'Decision quality stays strong when steps remain.',
          mid: 'Quality drops as steps are skipped.',
          low: 'Skipping key steps creates a fragile plan.',
        },
      },
      reflection: {
        question: 'Which step would be most risky for you to skip?'
      },
      summary: {
        takeaways: [
          'Execution is the final step, not the first.',
          'Skipping steps increases risk and confusion.',
          'Clarity before action keeps the plan stable.',
        ],
      },
    },
  },
  lesson_25: {
    title: 'Understanding the Full Investment Process',
    shortDescription: 'Rebuild the full model end-to-end.',
    steps: {
      concept: {
        title: 'The process is the lesson',
        body:
          'Investing is structured. Each step builds logically, and execution only makes sense at the end. EQTY builds insight, not advice.',
        visualHint: 'Insight comes before action.',
      },
      visualization: {
        title: 'Full process recap',
        segments: [
          {
            id: 'segment_1',
            label: 'Goal',
            value: 0.18,
            description: 'Define what the money should achieve.',
          },
          {
            id: 'segment_2',
            label: 'Drivers',
            value: 0.17,
            description: 'Risk, resources, and time.',
          },
          {
            id: 'segment_3',
            label: 'Strategy',
            value: 0.17,
            description: 'Coherent approach and rules.',
          },
          {
            id: 'segment_4',
            label: 'Allocation',
            value: 0.17,
            description: 'Distribute capital by role.',
          },
          {
            id: 'segment_5',
            label: 'Vehicles',
            value: 0.16,
            description: 'Select tools to implement.',
          },
          {
            id: 'segment_6',
            label: 'Execution',
            value: 0.15,
            description: 'Place orders only after clarity.',
          },
        ],
      },
      scenario: {
        title: 'Whole model thinking',
        variants: {
          new: {
            prompt: 'You want to move fast. What keeps you safe?',
            options: ['Following the process', 'Skipping steps', 'Copying others'],
            insight: 'The process protects decisions from impulse.',
          },
          growing: {
            prompt: 'You feel overwhelmed. What helps most?',
            options: ['Rebuilding the sequence', 'Picking products', 'Chasing returns'],
            insight: 'Clarity returns when the sequence is rebuilt.',
          },
          seasoned: {
            prompt: 'You want consistency across cycles. What matters?',
            options: ['Process discipline', 'Constant changes', 'More complexity'],
            insight: 'Process discipline creates consistency.',
          },
        },
      },
      exercise: {
        type: 'sequence',
        description: 'Rebuild the full process from memory.',
        items: [
          { id: 'goal', label: 'Define the goal' },
          { id: 'drivers', label: 'Assess drivers (risk, resources, time)' },
          { id: 'strategy', label: 'Set the strategy' },
          { id: 'allocation', label: 'Design the allocation' },
          { id: 'vehicles', label: 'Select vehicles' },
          { id: 'execution', label: 'Execute the order' },
        ],
        correctOrder: ['goal', 'drivers', 'strategy', 'allocation', 'vehicles', 'execution'],
        feedback: {
          correct: 'You rebuilt the full EQTY process in the right order.',
          incorrect:
            'Review the sequence and place execution last after the supporting steps.',
        },
      },
      reflection: {
        question: 'Which step is most valuable for you to revisit regularly?'
      },
      summary: {
        takeaways: [
          'Investing is a structured process.',
          'Each step builds on the last.',
          'Execution only makes sense at the end.',
        ],
      },
    },
  },
};
