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
        title: 'Doelhelderheid stuurt keuzes',
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
        title: 'Begin met het waarom',
        variants: {
          new: {
            prompt: 'Een vriend zegt dat investeren altijd slim is. Wat doe je?',
            options: ['Investeer meteen', 'Bepaal eerst je doel'],
            insight:
              'Zonder doel is elke investering een gok. Je doel vertelt je waarom je belegt en wat je ermee wilt bereiken.',
          },
          growing: {
            prompt: 'Je wilt serieus beginnen met investeren. Wat komt eerst?',
            options: ['Kies een strategie', 'Bepaal eerst je doel'],
            insight: 'Eerst komt het doel. Strategie volgt het doel, niet andersom.',
          },
          seasoned: {
            prompt: 'Je herbekijkt je plan. Wat houdt het coherent?',
            options: ['Pas je aan aan het nieuws', 'Herbekijk het doel'],
            insight: 'Terugkoppelen naar het doel houdt je plan consistent over cycli.',
          },
        },
      },
      exercise: {
        type: 'choice',
        description:
          'Kies het meest concrete beleggingsdoel. Een goed doel heeft een tijdshorizon, een bedrag en een duidelijk resultaat.',
        options: [
          {
            id: 'vague',
            label: 'Ik wil geld laten groeien',
            reveal:
              'Dit is een wens, geen doel. Het mist een tijdshorizon en een concreet resultaat. Zonder deze ankerpunten kun je geen plan opstellen.',
          },
          {
            id: 'partial',
            label: 'Ik wil een financieel buffer opbouwen',
            reveal:
              'Beter dan niets, maar nog onvolledig. Hoeveel buffer? Tegen wanneer? Een doel heeft specificiteit nodig om beslissingen te sturen.',
          },
          {
            id: 'concrete',
            label: 'Ik wil over 7 jaar €25.000 gespaard hebben voor een aanbetaling op een woning',
            reveal:
              'Dit is een concreet doel. Het bevat een tijdshorizon (7 jaar), een bedrag (€25.000) en een duidelijk resultaat. Dit stuurt al je beleggingsbeslissingen.',
          },
        ],
      },
      reflection: {
        title: 'Reflectie',
        question: 'Wat is jouw doel als je zou investeren?',
        placeholder: 'Schrijf hier je antwoord...',
      },
      summary: {
        scenario: {
          text:
            'Lena heeft €3.000 gespaard en besluit te investeren omdat een vriend goede resultaten boekte. Ze kiest willekeurig een aantal aandelen en ETFs. Na zes maanden staat ze op -12% en vraagt zich af: bijkopen of verkopen?',
          question: 'Wat ontbreekt er in Lena\'s aanpak?',
          options: [
            {
              id: 'knowledge',
              label: 'Meer kennis over beleggingen',
              reveal:
                'Kennis helpt, maar ook ervaren beleggers maken slechte keuzes zonder een duidelijk doel. Het probleem zit dieper.',
            },
            {
              id: 'goal',
              label: 'Een concreet beleggingsdoel',
              reveal:
                'Zonder doel is elke beslissing willekeurig. Bijkopen of verkopen? Lena weet het niet, omdat ze nooit heeft bepaald wat het geld voor haar moet doen.',
              isKey: true,
            },
            {
              id: 'capital',
              label: 'Een groter startkapitaal',
              reveal:
                'Meer geld lost het probleem niet op. Met €10.000 en geen doel staat Lena voor exact hetzelfde dilemma, maar dan met hogere inzet.',
            },
          ],
        },
        takeaways: [
          'Investeren is een tool, niet het doel zelf.',
          'Doelen geven richting aan elke beslissing.',
          'Zonder doel voelen strategieën willekeurig.',
        ],
      },
    },
  },
};
