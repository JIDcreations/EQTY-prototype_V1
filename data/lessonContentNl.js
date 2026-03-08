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
        title: 'Plan vs geen plan',
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
        title: 'Jouw inzicht',
        intro: 'Leg de verschuiving vast in hoe je naar uitvoering kijkt.',
        question: 'Wat is er veranderd in hoe je naar uitvoering kijkt na deze les?',
        placeholder: 'Voorbeeld: Ik zie waarom uitvoering als laatste hoort te komen.',
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
        body:
          'Investeren heeft alleen zin als het een persoonlijk doel dient. Zonder doel missen beslissingen richting en voelen ze reactief. Een helder doel stuurt elke volgende stap.',
        visualHint: 'Doelen maken van ruis richting.',
      },
      visualization: {
        title: 'Doelhelderheid stuurt keuzes',
        segments: [
          {
            id: 'segment_1',
            label: 'Doel',
            value: 0.3,
            description: 'De uitkomst die je met het geld wilt bereiken.',
          },
          {
            id: 'segment_2',
            label: 'Richting',
            value: 0.25,
            description: 'Doelen geven richting aan risico en tijd.',
          },
          {
            id: 'segment_3',
            label: 'Afwegingen',
            value: 0.25,
            description: 'Doelen maken afwegingen makkelijker te accepteren.',
          },
          {
            id: 'segment_4',
            label: 'Toewijding',
            value: 0.2,
            description: 'Een doel maakt consistentie doelgericht.',
          },
        ],
      },
      scenario: {
        title: 'Begin met het waarom',
        variants: {
          new: {
            prompt: 'Een vriend zegt dat investeren altijd slim is. Wat vraag je jezelf?',
            options: ['Wat is mijn doel?', 'Welk aandeel is het best?', 'Hoe snel kan ik dit laten groeien?'],
            insight: 'Je doel is het anker. Het vertelt je waar het geld voor dient.',
          },
          growing: {
            prompt: 'Je wilt serieus beginnen met investeren. Wat komt eerst?',
            options: ['Bepaal het doel', 'Kies een strategie', 'Stel een rendementsdoel'],
            insight: 'Eerst komt het doel. Strategie volgt het doel, niet andersom.',
          },
          seasoned: {
            prompt: 'Je herbekijkt je plan. Wat houdt het coherent?',
            options: ['Herbekijk het doel', 'Jaag een nieuw thema na', 'Pas je aan aan het nieuws'],
            insight: 'Terugkoppelen naar het doel houdt je plan consistent over cycli.',
          },
        },
      },
      exercise: {
        type: 'choice',
        description:
          'Kies een strategie zonder een doel te definieren. Bekijk daarna wat er ontbreekt.',
        options: [
          {
            id: 'growth',
            label: 'Focus op agressieve groei',
            reveal:
              'Dit kan passen bij een langetermijndoel voor groei. Zonder dat doel voelt het risico willekeurig.',
          },
          {
            id: 'income',
            label: 'Focus op stabiele inkomsten',
            reveal:
              'Dit kan passen bij een cashflowdoel. Zonder doel voelt het traag of onduidelijk.',
          },
          {
            id: 'safety',
            label: 'Focus op kortetermijnveiligheid',
            reveal:
              'Dit past bij nabije behoeften. Zonder doel beperkt het groei zonder reden.',
          },
        ],
      },
      reflection: {
        title: 'Reflectie',
        question: 'Wat is een echt doel dat je wilt dat je geld dient?'
      },
      summary: {
        takeaways: [
          'Investeren is een tool, niet het doel zelf.',
          'Doelen geven richting aan elke beslissing.',
          'Zonder doel voelen strategieen willekeurig.',
        ],
      },
    },
  },
};
