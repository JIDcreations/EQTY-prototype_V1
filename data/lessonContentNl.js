export const lessonContentNl = {
  lesson_0: {
    title: 'Investeren als proces',
    shortDescription:
      'Investeren is een gestructureerd beslissingsproces, geen enkele handeling.',
    steps: {
      concept: {
        title: 'Een gestructureerde keten van beslissingen',
        intro: 'Investeren werkt wanneer elke beslissing voortbouwt op de vorige.',
        body:
          'Investeren is geen eenmalige actie. Het is een gestructureerd beslissingsproces met duidelijke stappen die op elkaar voortbouwen. Kopen of verkopen is pas de laatste stap, nadat je het doel bepaalt, de drijvers begrijpt, een strategie kiest en de allocatie vastlegt.',
        visualHint: 'Eerst het proces, dan de actie.',
      },
      visualization: {
        title: 'De EQTY-proceskaart',
        segments: [
          {
            id: 'segment_1',
            label: 'Doel',
            value: 0.22,
            description: 'Bepaal wat het geld moet bereiken.',
          },
          {
            id: 'segment_2',
            label: 'Drijvers',
            value: 0.2,
            description: 'Risico, middelen en tijd vormen het pad.',
          },
          {
            id: 'segment_3',
            label: 'Strategie',
            value: 0.2,
            description: 'Vertaal het doel naar regels die je kunt volgen.',
          },
          {
            id: 'segment_4',
            label: 'Allocatie',
            value: 0.2,
            description: 'Bepaal hoe kapitaal wordt verdeeld.',
          },
          {
            id: 'segment_5',
            label: 'Uitvoering',
            value: 0.18,
            description: 'Pas dan plaats je de order.',
          },
        ],
      },
      scenario: {
        title: 'Handelen of eerst het proces?',
        intro: 'Vergelijk een gestructureerd proces met een reactieve aanpak terwijl het zich ontvouwt.',
        variants: {
          new: {
            narrative: [
              'Iemand wil beginnen met investeren maar heeft nog geen eerste transactie gedaan.',
              'Een kop in het nieuws zorgt voor urgentie, maar het doel, de risicogrenzen en de tijdshorizon zijn nog niet bepaald.',
              'Het proces start met het verduidelijken van het doel voordat er tools of markten gekozen worden.',
            ],
            keyInsight:
              'Het proces vertraagt de actie zodat de eerste beslissing met helderheid wordt genomen.',
          },
          growing: {
            narrative: [
              'Iemand heeft een broker-app geprobeerd en een paar ETF- of cryptotransacties gedaan.',
              'Keuzes stapelen zich op zonder een consistent doel of risicokader.',
              'Het proces pauzeert om drijvers en strategie te definieren voordat er een nieuwe allocatie komt.',
            ],
            keyInsight:
              'Consistentie komt uit heldere doelen en randvoorwaarden, niet uit de nieuwste picks.',
          },
          seasoned: {
            narrative: [
              'Een belegger heeft eerder uitgevoerd maar wil een herhaalbare structuur.',
              'Er verschijnt een nieuwe kans, maar het plan voelt ongelijk verdeeld over cycli.',
              'Het proces hercentreert op doel, drijvers en allocatie voordat er wordt uitgevoerd.',
            ],
            keyInsight: 'Structuur zorgt voor consistentie bij veranderende omstandigheden.',
          },
        },
      },
      exercise: {
        title: 'Rangschik de stappen',
        type: 'sequence',
        description: 'Zet de stappen in de juiste volgorde voordat je uitvoert.',
        items: [
          { id: 'target', label: 'Doelbepaling' },
          { id: 'drivers', label: 'Individuele risicoanalyse' },
          { id: 'strategy', label: 'Financiele investeringsstrategie' },
          { id: 'allocation', label: 'Kapitaalallocatie' },
          { id: 'vehicle', label: 'Beleggingsinstrument' },
          { id: 'execution', label: 'Uitvoering' },
        ],
        correctOrder: ['target', 'drivers', 'strategy', 'allocation', 'vehicle', 'execution'],
        feedback: {
          correct:
            'Uitvoering hoort op het einde, nadat het doel en de randvoorwaarden helder zijn.',
          incorrect:
            'Zie hoe het overslaan van stappen de logica verwijdert die je beschermt tegen impuls.',
        },
      },
      reflection: {
        question: 'Als er één ding is dat je geleerd hebt uit deze les, wat is het?',
        placeholder: 'Schrijf hier je antwoord...',
      },
      summary: {
        title: 'Het volledige investeringsproces',
        subtitle: 'Uitvoering is de laatste stap - niet het vertrekpunt.',
        processMap: [
          {
            id: 'target',
            title: 'Doel (Doelbepaling)',
            description: 'Definieer het doel en de grenzen voor uitvoering.',
            substeps: ['Doel', 'Tijdshorizon', 'Doeltype'],
          },
          {
            id: 'drivers',
            title: 'Drijvers (Individuele risicoanalyse)',
            description: 'Verduidelijk de randvoorwaarden die elke beslissing vormen.',
            substeps: ['Risicocapaciteit', 'Risicotolerantie', 'Financiele middelen'],
          },
          {
            id: 'strategy',
            title: 'Financiele investeringsstrategie',
            description: 'Zet de regels vast die beslissingen onder onzekerheid sturen.',
            substeps: ['Liquiditeit', 'Kosten', 'Ethiek/ESG', 'Dividendvoorkeur'],
          },
          {
            id: 'allocation',
            title: 'Kapitaalallocatie',
            description: 'Verdeel kapitaal over gedefinieerde prioriteiten.',
            substeps: ['Activaklassen', 'Diversificatie', 'Voorbeeldallocaties'],
          },
          {
            id: 'vehicles',
            title: 'Beleggingsinstrumenten',
            description: 'Selecteer de tools die het plan uitdrukken.',
            substeps: ['Aandelen', 'Obligaties', "ETF's", 'Alternatieven'],
          },
          {
            id: 'execution',
            title: 'Uitvoering',
            description: 'Plaats orders pas wanneer het systeem duidelijk is.',
            substeps: ['Ordertypes', 'Transactiekosten', 'Uitvoering komt als laatste'],
          },
        ],
        takeaways: [
          'Investeren is een gestructureerd proces, geen enkele handeling.',
          'Kopen of verkopen komt pas na de eerdere stappen.',
          'Inzicht in het volledige proces vermindert impulsieve beslissingen.',
          'Het EQTY-framework loopt van doelbepaling tot uitvoering.',
        ],
      },
    },
  },
  lesson_1: {
    title: 'Waarom wil ik beleggen?',
    shortDescription: 'Doelen geven richting aan elke beslissing.',
    steps: {
      concept: {
        title: 'Wat is een beleggingsdoel?',
        intro: 'Een doel geeft richting aan hoe je investeert',
        sectionLabel: 'Je doel bepaalt:',
        drivers: [
          {
            id: 'time',
            label: 'Tijd',
            detail: 'hoe lang je kan wachten',
          },
          {
            id: 'risk',
            label: 'Risico',
            detail: 'Hoe zou je reageren als je belegging 10% daalt?',
          },
          {
            id: 'personal',
            label: 'Persoonlijke situatie',
            detail: 'wat voor jou haalbaar is',
          },
        ],
        visualHint: 'Doelen maken van ruis richting.',
      },
      visualization: {
        title: 'Voorbeelden van beleggingsdoelen',
        subtitle: 'Ontdek concrete doelen en hoe ze werken.',
        cards: [
          {
            id: 'house',
            label: 'Huis',
            question: 'Een woning als doel',
            detail:
              'Investeren met een doel zoals een woning geeft richting aan hoeveel je nodig hebt en tegen wanneer.',
          },
          {
            id: 'car',
            label: 'Auto',
            question: 'Een aankoop later plannen',
            detail:
              'Een concreet doel helpt je om keuzes af te stemmen op een aankoop later.',
          },
          {
            id: 'travel',
            label: 'Reis',
            question: 'Ook kortere doelen tellen mee',
            detail:
              'Ook kleinere of kortere termijn doelen kunnen een reden zijn om te sparen of investeren.',
          },
          {
            id: 'retirement',
            label: 'Pensioen',
            question: 'Lange termijn vraagt geduld',
            detail:
              'Lange termijn doelen vragen vaak een andere aanpak en meer geduld.',
          },
        ],
        segments: [
          {
            id: 'segment_1',
            label: 'Zonder doel',
            value: 0.5,
            description:
              'Beslissingen voelen willekeurig. Risico is moeilijk te beoordelen. Je reageert op nieuws en hypes in plaats van een plan te volgen.',
          },
          {
            id: 'segment_2',
            label: 'Met doel',
            value: 0.5,
            description:
              'Beslissingen hebben richting. Risico sluit aan bij je tijdshorizon. Je hebt een anker om op terug te vallen bij onzekerheid.',
          },
        ],
      },
      scenario: {
        title: 'Meteen investeren of eerst doel?',
        intro: 'Ontdek wat het verschil maakt',
        cardLabel: 'Jean-Pierre',
        text:
          'Ik heb €5.000 klaarstaan, maar ik weet nog niet waarvoor ik precies investeer.',
        prompt: 'Wat zou jij doen in deze situatie?',
        choices: [
          {
            id: 'invest_now',
            label: 'Nu investeren',
            sublabel: 'Zonder doel',
            icon: 'flash-outline',
          },
          {
            id: 'define_goal',
            label: 'Doel bepalen',
            sublabel: 'Waarom investeer je?',
            icon: 'layers-outline',
            isKey: true,
          },
        ],
        feedback: {
          incorrect:
            'Zonder doel voelt elke investering willekeurig. Je weet niet wat je probeert te bereiken.',
          correct:
            'Door eerst je doel te bepalen krijgen je keuzes richting en worden ze consistenter.',
        },
        comparison: {
          left: {
            title: 'ZONDER DOEL',
            chartLabel: 'ONZEKER',
            items: [
              'Onzeker',
              'Geen richting',
              'Impulsief',
              'Geen houvast',
            ],
          },
          right: {
            title: 'MET DOEL',
            chartLabel: 'GERICHT',
            items: [
              'Duidelijke richting',
              'Bewuste keuzes',
              'Past bij tijd & risico',
              'Houvast bij twijfel',
            ],
          },
        },
        insightLine:
          'Een doel maakt het verschil tussen willekeurig handelen en bewust investeren.',
      },
      exercise: {
        title: 'Wat deed Joris fout?',
        subtitle: 'Ontdek wat ontbreekt voordat je begint met investeren.',
        type: 'scenario',
        cardLabel: 'Scenario',
        storyLead: 'Joris wil beginnen met investeren omdat hij',
        storyQuoteField: 'motivationAnswer',
        storyQuoteFallback: 'een huis wil kopen',
        storyTail:
          'Na een paar weken weet hij niet goed of hij moet bijhouden, verkopen of veranderen.',
        question: 'Wat ontbreekt er in zijn aanpak?',
        feedback: {
          correctLabel: 'GOED',
          incorrectLabel: 'NIET HELEMAAL',
          correctText:
            'Zonder doel weet Joris niet waarom hij investeert. Daardoor weet hij ook niet hoe hij moet reageren wanneer de markt daalt.',
          incorrectText:
            'Meer kennis of een groter bedrag helpt niet als je geen doel hebt. Zonder doel blijven beslissingen willekeurig.',
        },
        options: [
          {
            id: 'knowledge',
            label: 'Hij maakte te snel keuzes',
            reveal:
              'Meer kennis of een groter bedrag helpt niet als je geen doel hebt. Zonder doel blijven beslissingen willekeurig.',
          },
          {
            id: 'goal',
            label: 'Hij had geen duidelijk doel voor ogen',
            isKey: true,
            reveal:
              'Zonder doel weet Joris niet waarom hij investeert. Daardoor weet hij ook niet hoe hij moet reageren wanneer de markt daalt.',
          },
          {
            id: 'capital',
            label: 'Hij wist niet goed waarin hij investeerde',
            reveal:
              'Meer kennis of een groter bedrag helpt niet als je geen doel hebt. Zonder doel blijven beslissingen willekeurig.',
          },
        ],
      },
      reflection: {
        title: 'Reflectie',
        question: 'Wat zou er gebeuren als je investeert zonder doel?',
        subtitle: 'Denk kort na over wat er mis kan lopen zonder duidelijke richting.',
        insightText:
          'Zonder doel worden je beslissingen willekeurig. Je weet niet wanneer je moet bijsturen, waardoor je sneller twijfelt of verkeerd reageert.',
        placeholder: 'Schrijf hier je antwoord...',
      },
      summary: {
        type: 'goalSetting',
        title: 'Pas dit toe op jouw situatie',
        subtitle: 'Maak je doel concreter. Je antwoorden komen terug in de volgende lessen.',
        sections: [
          {
            id: 'why',
            question: 'Waarom wil je investeren?',
            options: [
              'Voor een woning',
              'Meer vrijheid',
              'Extra inkomen',
              'Pensioen',
              'Iets anders',
            ],
          },
          {
            id: 'when',
            question: 'Wanneer wil je dit ongeveer bereiken?',
            options: [
              'Binnen 2 jaar',
              'Binnen 5 jaar',
              'Binnen 10 jaar',
              'Op lange termijn',
              'Ik weet het nog niet',
            ],
          },
          {
            id: 'fit',
            question: 'Wat past het best bij jou nu?',
            options: [
              'Ik wil vooral zekerheid',
              'Ik kan wat schommelingen aan',
              'Ik wil rustig starten',
              'Ik weet het nog niet',
            ],
          },
        ],
        interpretations: {
          prefix: 'Je wil ',
          why: {
            'Voor een woning': 'investeren voor een woning',
            'Meer vrijheid': 'meer vrijheid opbouwen',
            'Extra inkomen': 'extra inkomen opbouwen',
            'Pensioen': 'je pensioen aanvullen',
            'Iets anders': 'een persoonlijk doel bereiken',
          },
          when: {
            'Binnen 2 jaar': 'op korte termijn',
            'Binnen 5 jaar': 'op middellange termijn',
            'Binnen 10 jaar': 'op langere termijn',
            'Op lange termijn': 'op de lange termijn',
            'Ik weet het nog niet': 'zonder vaste horizon',
          },
          fit: {
            'Ik wil vooral zekerheid': 'Zekerheid is voor jou belangrijker dan rendement.',
            'Ik kan wat schommelingen aan': 'Je aanvaardt schommelingen voor meer groeikans.',
            'Ik wil rustig starten': 'Je wil rustig starten, met focus op stabiliteit.',
            'Ik weet het nog niet': 'Je profiel ligt nog open, en dat is oké.',
          },
        },
        submitLabel: 'Les afronden',
        feedback: {
          valid:
            'Goed. Je hebt een eerste richting bepaald. In de volgende lessen maken we dit stap voor stap concreter.',
        },
      },
    },
  },
  lesson_2: {
    title: 'Soorten beleggingsdoelen',
    shortDescription: 'Het type doel stuurt latere beleggingskeuzes.',
    steps: {
      concept: {
        title: 'Soorten beleggingsdoelen',
        intro:
          'Beleggingsdoelen verschillen. De tijd die je hebt bepaalt hoe je investeert.',
        leadLabel: 'Drie soorten doelen',
        leadBody: 'Korte, middellange en lange termijn doelen',
        drivers: [
          {
            id: 'short',
            label: 'Korte termijn',
            detail: 'Focus op stabiliteit en voorspelbare resultaten.',
          },
          {
            id: 'medium',
            label: 'Middellange termijn',
            detail: 'Zoek balans tussen groei en risico.',
          },
          {
            id: 'long',
            label: 'Lange termijn',
            detail: 'Focus op groei en accepteer schommelingen.',
          },
        ],
        visualHint: 'Het type doel stuurt de keuzes die later volgen.',
      },
      visualization: {
        title: 'Korte, middellange en lange termijn',
        subtitle: 'Swipe door de verschillende soorten doelen en voorbeelden.',
        cardCodePrefix: 'TYPE',
        cards: [
          {
            id: 'short',
            label: 'Korte termijn',
            question: 'Iets kopen binnen 1–2 jaar',
            detail:
              'Je doel ligt dichtbij. Daarom kies je voor stabiliteit en voorspelbare resultaten.',
            example: 'Sparen voor een reis, laptop of voorschot',
          },
          {
            id: 'medium',
            label: 'Middellange termijn',
            question: 'Sparen voor iets binnen enkele jaren',
            detail:
              'Je hebt wat tijd, maar niet onbeperkt. Je zoekt balans tussen groei en risico.',
            example: 'Sparen voor een woning of grote uitgave',
          },
          {
            id: 'long',
            label: 'Lange termijn',
            question: 'Vermogen opbouwen op lange termijn',
            detail:
              'Je hebt veel tijd. Daardoor kan je schommelingen accepteren en focussen op groei.',
            example: 'Pensioen of financiële vrijheid',
          },
        ],
      },
      scenario: {
        title: 'Kort of lang denken?',
        intro: 'Ontdek hoe tijd je aanpak bepaalt',
        cardLabel: 'Pieter-Jan',
        text:
          'Ik wil binnen 2 jaar een auto kopen en wil hiervoor mijn geld laten groeien.',
        prompt: 'Wat zou jij doen in deze situatie?',
        choices: [
          {
            id: 'max_growth',
            label: 'Maximale groei zoeken',
            sublabel: 'Ook als mijn geld schommelt',
            icon: 'flash-outline',
          },
          {
            id: 'choose_stability',
            label: 'Kiezen voor stabiliteit',
            sublabel: 'Omdat mijn doel dichtbij is',
            icon: 'layers-outline',
            isKey: true,
          },
        ],
        feedback: {
          incorrectLabel: 'NIET DE BESTE KEUZE',
          incorrect:
            'Je doel ligt dichtbij. Te veel risico nemen kan ervoor zorgen dat je geld minder waard is wanneer je het nodig hebt.',
          correctLabel: 'GOEDE KEUZE',
          correct:
            'Omdat je je geld snel nodig hebt, kies je beter voor stabiliteit en voorspelbaarheid.',
        },
        comparison: {
          left: {
            title: 'TE VEEL RISICO',
            visualVariant: 'shortRisk',
            items: [
              'Schommelt',
              'Kans op verlies',
              'Geen richting',
              'Minder controle',
            ],
          },
          right: {
            title: 'STABIEL',
            visualVariant: 'shortStable',
            items: [
              'Voorspelbaar',
              'Rustiger',
              'Meer zekerheid',
              'Korte termijn',
            ],
          },
        },
        insightLine:
          'Hoeveel tijd je hebt, bepaalt je aanpak.',
      },
      exercise: {
        title: 'Koppel elke situatie',
        subtitle: 'Kies welk doeltype bij elke situatie past.',
        type: 'guidedGoal',
        sections: [
          {
            id: 'why',
            question: 'Je wil iets kopen binnen 1-2 jaar.',
            correctOption: 'Korte termijn',
            options: ['Korte termijn', 'Middellange termijn', 'Lange termijn'],
          },
          {
            id: 'when',
            question: 'Je spaart voor iets over enkele jaren.',
            correctOption: 'Middellange termijn',
            options: ['Korte termijn', 'Middellange termijn', 'Lange termijn'],
          },
          {
            id: 'fit',
            question: 'Je wil vermogen opbouwen over vele jaren.',
            correctOption: 'Lange termijn',
            options: ['Korte termijn', 'Middellange termijn', 'Lange termijn'],
          },
        ],
        interpretations: {
          prefix: '',
          why: {
            'Korte termijn': 'Iets kopen binnen 1-2 jaar is een doel op korte termijn.',
            'Middellange termijn': 'Dit doel is dichtbij, dus korte termijn past beter dan middellange termijn.',
            'Lange termijn': 'Dit doel is te dichtbij om als lange termijn te behandelen.',
          },
          when: {
            'Korte termijn': 'Enkele jaren is meestal langer dan een kortetermijndoel.',
            'Middellange termijn': 'Sparen voor iets over enkele jaren is een doel op middellange termijn.',
            'Lange termijn': 'Enkele jaren is meestal niet lang genoeg om als lange termijn te behandelen.',
          },
          fit: {
            'Korte termijn': 'Vele jaren vooruit is langer dan een kortetermijndoel.',
            'Middellange termijn': 'Vele jaren vooruit gaat meestal verder dan middellange termijn.',
            'Lange termijn': 'Vermogen opbouwen over vele jaren is een doel op lange termijn.',
          },
        },
        submitLabel: 'Controleer mijn antwoorden',
        feedback: {
          valid:
            'Goed. Het doeltype herkennen helpt je later een passende aanpak te kiezen.',
          invalid:
            'Nog niet helemaal. Kijk opnieuw naar hoe snel elk doel bereikt moet worden.',
        },
      },
      reflection: {
        title: 'Reflectie',
        question: 'Welk type doel past nu het best bij jou?',
        subtitle:
          'Denk aan wat vandaag het dichtst bij jouw situatie ligt. Je antwoord komt terug in toekomstige lessen.',
        placeholder: 'Korte termijn, middellange termijn of lange termijn...',
        insightText:
          'Goed. Je huidige doeltype kennen helpt om toekomstige lessen aan jouw situatie te koppelen.',
      },
      summary: {
        takeaways: [
          'Verschillende doelen vragen verschillende aanpakken.',
          'Tijd speelt een grote rol in wat logisch is.',
          'Je doel bepaalt mee hoe je later investeert, dus deze stap bereidt toekomstige keuzes voor.',
        ],
      },
    },
  },
};
