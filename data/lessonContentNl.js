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
    title: 'Waarom wil ik investeren?',
    shortDescription: 'Doelen geven richting aan elke beslissing.',
    steps: {
      concept: {
        title: 'Investeren is een middel, geen doel',
        intro: 'Een duidelijk doel geeft richting aan elke volgende keuze.',
        sectionLabel: 'Je doel bepaalt:',
        sectionHint: 'Tik op een factor om te begrijpen waarom.',
        drivers: [
          {
            id: 'time',
            label: 'Tijd',
            detail: 'hoe lang je kan wachten',
          },
          {
            id: 'risk',
            label: 'Risico',
            detail: 'hoeveel verlies je aankan',
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
        title: 'Wat kan je doel zijn?',
        subtitle:
          'Ontdek voorbeelden van doelen waarvoor mensen investeren.',
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
        title: 'Eerst richting bepalen of meteen handelen?',
        intro:
          'Zie het verschil tussen investeren zonder doel en met een duidelijk doel.',
        cardLabel: 'Jean-Pierre',
        text:
          'Ik heb €5.000 klaarstaan, maar ik weet nog niet waarvoor ik precies investeer.',
        prompt: 'Wat doe je eerst?',
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
        story:
          'Joris heeft €5.000 gespaard en begint met investeren. Hij kiest een ETF uit een artikel. Na 2 maanden staat hij op -15%. Nu weet hij niet of hij moet verkopen, vasthouden of bijkopen.',
        question: 'Wat ontbreekt er in zijn aanpak?',
        feedback: {
          correctLabel: '✔ GOED',
          incorrectLabel: 'NIET HELEMAAL',
          correctText:
            'Zonder doel weet Joris niet waarom hij investeert. Daardoor weet hij ook niet hoe hij moet reageren wanneer de markt daalt.',
          incorrectText:
            'Meer kennis of een groter bedrag helpt niet als je geen doel hebt. Zonder doel blijven beslissingen willekeurig.',
        },
        options: [
          {
            id: 'knowledge',
            label: 'Meer kennis over ETF\'s',
            reveal:
              'Meer kennis of een groter bedrag helpt niet als je geen doel hebt. Zonder doel blijven beslissingen willekeurig.',
          },
          {
            id: 'goal',
            label: 'Een concreet beleggingsdoel',
            isKey: true,
            reveal:
              'Zonder doel weet Joris niet waarom hij investeert. Daardoor weet hij ook niet hoe hij moet reageren wanneer de markt daalt.',
          },
          {
            id: 'capital',
            label: 'Een groter startbedrag',
            reveal:
              'Meer kennis of een groter bedrag helpt niet als je geen doel hebt. Zonder doel blijven beslissingen willekeurig.',
          },
        ],
      },
      reflection: {
        title: 'Reflectie',
        question: 'Wat is jouw doel als je zou investeren?',
        placeholder: 'Schrijf hier je antwoord...',
      },
      summary: {
        type: 'goalSetting',
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
            'Voor een woning': 'investeren voor een eigen woning',
            'Meer vrijheid': 'financiële vrijheid opbouwen',
            'Extra inkomen': 'extra inkomen opbouwen naast je huidige inkomen',
            'Pensioen': 'vooruitdenken en een aanvulling op je pensioen opbouwen',
            'Iets anders': 'een persoonlijk doel nastreven',
          },
          when: {
            'Binnen 2 jaar': 'op korte termijn',
            'Binnen 5 jaar': 'op middellange termijn',
            'Binnen 10 jaar': 'op langere termijn',
            'Op lange termijn': 'op de lange termijn',
            'Ik weet het nog niet': 'zonder vaste tijdshorizon',
          },
          fit: {
            'Ik wil vooral zekerheid': 'Je stelt zekerheid boven rendement — stabiliteit is je eerste prioriteit.',
            'Ik kan wat schommelingen aan': 'Je bent bereid om wat schommelingen te accepteren in ruil voor meer groeipotentieel.',
            'Ik wil rustig starten': 'Je kiest voor een rustige start, wat betekent dat stabiliteit belangrijker is voor jou dan snelheid.',
            'Ik weet het nog niet': 'Je risicoprofiel is nog open — dat is een eerlijk en geldig startpunt.',
          },
        },
        submitLabel: 'Doel opslaan',
        feedback: {
          valid:
            'Goed. Je hebt een eerste richting bepaald. In de volgende lessen maken we dit stap voor stap concreter.',
        },
      },
    },
  },
};
