import { Question } from '../types';

export interface LocalizedQuestionContent {
  question: string;
  options?: string[];
  explanation: string;
}

const TRUE_FALSE_OPTIONS: Record<string, [string, string]> = {
  en: ['True', 'False'],
  hi: ['सत्य', 'असत्य'],
  te: ['నిజం', 'తప్పు'],
  de: ['Wahr', 'Falsch'],
  fr: ['Vrai', 'Faux'],
  ja: ['正しい', '誤り'],
  or: ['ସତ୍ୟ', 'ମିଥ୍ୟା'],
  mai: ['सत्य', 'असत्य'],
  mwr: ['सांच', 'झूठ'],
  bgc: ['साच', 'झूठ'],
  mr: ['सत्य', 'असत्य'],
  as: ['সত্য', 'মিছা'],
  gu: ['સાચું', 'ખોટું'],
  kn: ['ನಿಜ', 'ತಪ್ಪು'],
  kok: ['खरे', 'फट'],
  ml: ['ശരി', 'തെറ്റ്'],
  lus: ['Dik', 'Dik lo'],
  pa: ['ਸੱਚ', 'ਝੂਠ'],
  bn: ['সত্য', 'মিথ্যা'],
  trp: ['Thik', 'Hokya'],
  ne: ['सत्य', 'गलत'],
  kha: ['Bashisha', 'Babakla'],
  mni: ['চুম্বি', 'লাল্লি'],
};

// Localized question content map by Question ID
export const QUESTION_LOCALIZATIONS: Record<string, Record<string, LocalizedQuestionContent>> = {
  'ai-basic-01': {
    hi: {
      question: 'आर्टिफिशियल जनरल इंटेलिजेंस (AGI) और नैरो एआई (Narrow AI) के बीच मुख्य अंतर क्या है?',
      options: [
        'नैरो एआई विशिष्ट कार्यों के लिए होता है, जबकि एजीआई सैद्धांतिक रूप से मानव स्तर के किसी भी बौद्धिक कार्य को कर सकता है।',
        'नैरो एआई केवल स्मार्टफोन पर काम करता है, जबकि एजीआई सुपरकंप्यूटर पर चलता है।',
        'एजीआई वर्तमान में खोज इंजनों में तैनात है, जबकि नैरो एआई एक प्रयोग है।',
        'नैरो एआई मशीन लर्निंग का उपयोग करता है, जबकि एजीआई केवल हाथ से लिखे नियमों पर निर्भर करता है।'
      ],
      explanation: 'नैरो एआई अनुवाद या छवि पहचान जैसे विशिष्ट कार्यों के लिए प्रशिक्षित होता है, जबकि एजीआई सामान्य मानव स्तर की संज्ञानात्मक तर्क क्षमता को दर्शाता है।'
    },
    te: {
      question: 'ఆర్టిఫిషియల్ జనరల్ ఇంటెలిజెన్స్ (AGI) మరియు నారో AI (Narrow AI) మధ్య ప్రాథమిక వ్యత్యాసం ఏమిటి?',
      options: [
        'నారో AI నిర్దిష్ట పనులను చేస్తుంది, అయితే AGI సైద్ధాంతికంగా మానవుడు చేయగల ఏదైనా మేధోపరమైన పనిని చేయగలదు.',
        'నారో AI స్మార్ట్‌ఫోన్‌లలో మాత్రమే పనిచేస్తుంది, AGI సూపర్ కంప్యూటర్‌లలో మాత్రమే నడుస్తుంది.',
        'AGI ఇప్పటికే సెర్చ్ ఇంజిన్‌లలో ఉంది, నారో AI ప్రయోగాత్మకమైనది.',
        'నారో AI మెషిన్ లెర్నింగ్ ఉపయోగిస్తుంది, AGI కేవలం కోడ్ నియమాలపై ఆధారపడుతుంది.'
      ],
      explanation: 'నారో AI అనువాదం లేదా ముఖ గుర్తింపు వంటి ప్రత్యేక పనుల కోసం రూపొందించబడింది, AGI మానవ స్థాయి ఆలోచనను సూచిస్తుంది.'
    },
    de: {
      question: 'Was ist der Hauptunterschied zwischen Künstlicher Allgemeiner Intelligenz (AGI) und Enger KI (Narrow AI)?',
      options: [
        'Enge KI führt spezifische Aufgaben aus, während AGI theoretisch jede intellektuelle menschliche Aufgabe bewältigen kann.',
        'Enge KI läuft nur auf Smartphones, während AGI auf Cloud-Supercomputern läuft.',
        'AGI ist bereits in Suchmaschinen im Einsatz, während Enge KI noch rein experimentell ist.',
        'Enge KI nutzt Machine Learning, während AGI ausschließlich auf Wenn-Dann-Regeln basiert.'
      ],
      explanation: 'Enge KI ist auf spezialisierte Aufgaben ausgelegt, während AGI hypothetische Systeme mit allgemeiner kognitiver Denkfähigkeit bezeichnet.'
    },
    fr: {
      question: 'Quelle est la principale différence entre l\'IA générale (AGI) et l\'IA étroite (Narrow AI) ?',
      options: [
        'L\'IA étroite accomplit des tâches précises, tandis que l\'AGI peut accomplir toute tâche intellectuelle humaine.',
        'L\'IA étroite ne fonctionne que sur mobile, alors que l\'AGI nécessite des supercalculateurs.',
        'L\'AGI est déjà déployée dans les moteurs de recherche grand public, tandis que l\'IA étroite est un test.',
        'L\'IA étroite utilise le machine learning, alors que l\'AGI repose uniquement sur des règles codées.'
      ],
      explanation: 'L\'IA étroite est conçue pour des tâches dédiées (traduction, vision), tandis que l\'AGI désigne une capacité cognitive généralisée.'
    },
    ja: {
      question: '汎用人工知能（AGI）と特化型AI（Narrow AI）の主な違いは何ですか？',
      options: [
        '特化型AIは特定のタスクを実行し、AGIは理論上人間ができるあらゆる知的作業を実行できる。',
        '特化型AIはスマホ上でのみ動作し、AGIはスパコンでのみ動作する。',
        'AGIはすでに検索エンジンで広く使われており、特化型AIは実験段階である。',
        '特化型AIは機械学習を用い、AGIは手書きのルールのみに依存する。'
      ],
      explanation: '特化型AIは画像認識や翻訳など個別タスクに特化しており、AGIは人間レベルの汎用的な推論を行うシステムを指します。'
    },
    bn: {
      question: 'আর্টিফিশিয়াল জেনারেল ইন্টেলিজেন্স (AGI) এবং ন্যারো এআই (Narrow AI)-এর মধ্যে মূল পার্থক্য কী?',
      options: [
        'ন্যারো এআই নির্দিষ্ট কাজ করে, আর এজিআই তাত্ত্বিকভাবে মানুষের মতো যেকোনো বুদ্ধিবৃত্তিক কাজ করতে সক্ষম।',
        'ন্যারো এআই কেবল স্মার্টফোনে চলে, আর এজিআই সুপারকম্পিউটারে চলে।',
        'এজিআই সার্চ ইঞ্জিনে ব্যবহৃত হচ্ছে, আর ন্যারো এআই কেবল পরীক্ষামূলক।',
        'ন্যারো এআই মেশিন লার্নিং ব্যবহার করে, কিন্তু এজিআই শুধু হস্তলিখিত নিয়মের ওপর নির্ভর করে।'
      ],
      explanation: 'ন্যারো এআই অনুবাদ বা ছবি শনাক্তকরণের মতো নির্দিষ্ট কাজের জন্য প্রশিক্ষিত, যেখানে এজিআই সাধারণ মানবীয় বিচারবুদ্ধিকে বোঝায়।'
    },
    mr: {
      question: 'आर्टिफिशियल जनरल इंटेलिजन्स (AGI) आणि नॅरो एआय (Narrow AI) मध्ये काय मुख्य फरक आहे?',
      options: [
        'नॅरो एआय विशिष्ट कामे करते, तर एजीआय मानवाप्रमाणे कोणतीही बौद्धिक कामे करण्यास सक्षम असते.',
        'नॅरो एआय फक्त मोबाईलवर चालते, तर एजीआय सुपर कॉम्प्युटरवर चालते.',
        'एजीআই आधीच सर्च इंजिनमध्ये वापरले जात आहे, तर नॅरो एआय प्रायोगिक आहे.',
        'नॅरो एआय मशीन लर्निंग वापरते, तर एजीआय केवळ हाताने लिहिलेल्या नियमांवर आधारित असते.'
      ],
      explanation: 'नॅरो एआय भाषांतर किंवा चेहरे ओळखण्यासारख्या विशिष्ट कामांसाठी तयार केले जाते, तर एजीआय सार्वत्रिक विचार क्षमतेचा संदर्भ देते.'
    },
    gu: {
      question: 'આર્ટિફિશિયલ જનરલ ઇન્ટેલિજન્સ (AGI) અને નેરો AI (Narrow AI) વચ્ચે મુખ્ય તફાવત શો છે?',
      options: [
        'નેરો AI ચોક્કસ કાર્યો કરે છે, જ્યારે AGI સૈદ્ધાંતિક રીતે માનવી જેવું કોઈ પણ બૌદ્ધિક કાર્ય કરી શકે છે.',
        'નેરો AI ફક્ત સ્માર્ટફોન પર ચાલે છે, જ્યારે AGI સુપરકમ્પ્યુટર પર ચાલે છે.',
        'AGI હાલમાં સર્ચ એન્જિનમાં ઉપલબ્ધ છે, જ્યારે નેરો AI પ્રાયોગિક છે.',
        'નેરો AI મશીન લર્નિંગ વાપરે છે, જ્યારે AGI ફક્ત કોડિંગ નિયમો પર ચાલે છે.'
      ],
      explanation: 'નેરો AI ચોક્કસ કાર્યો માટે ડિઝાઇન કરવામાં આવે છે, જ્યારે AGI માનવીય સામાન્ય તર્ક ક્ષમતા દર્શાવે છે.'
    },
    or: {
      question: 'ଆର୍ଟିଫିସିଆଲ୍ ଜେନେରାଲ୍ ଇଣ୍ଟେଲିଜେନ୍ସ (AGI) ଏବଂ ନାରୋ AI (Narrow AI) ମଧ୍ୟରେ ମୁଖ୍ୟ ପାର୍ଥକ୍ୟ କ\'ଣ?',
      options: [
        'ନାରୋ AI ନିର୍ଦ୍ଦିଷ୍ଟ କାର୍ଯ୍ୟ କରେ, କିନ୍ତୁ AGI ମଣିଷ ପରି ଯେକୌଣସି ବୌଦ୍ଧିକ କାର୍ଯ୍ୟ କରିବାକୁ ସକ୍ଷମ।',
        'ନାରୋ AI କେବଳ ଫୋନରେ ଚାଲେ, AGI ସୁପର କମ୍ପ୍ୟୁଟରରେ ଚାଲେ।',
        'AGI ସର୍ଚ୍ଚ ଇଞ୍ଜିନରେ ପ୍ରୟୋଗ ହେଉଛି, ନାରୋ AI ପରୀକ୍ଷାମୂଳକ।',
        'ନାରୋ AI ମେସିନ୍ ଲର୍ଣ୍ଣିଂ ବ୍ୟବହାର କରେ, AGI କେବଳ ସାଧାରଣ ନିୟମ ଉପରେ ଚାଲେ।'
      ],
      explanation: 'ନାରୋ AI ଅନୁବାଦ ବା ଫଟୋ ଚିହ୍ନଟ ପରି ନିର୍ଦ୍ଦିଷ୍ଟ କାର୍ଯ୍ୟ ପାଇଁ ପ୍ରଶିକ୍ଷିତ ହୋଇଥାଏ, କିନ୍ତୁ AGI ମାନବ ସ୍ତରର ସାଧାରଣ ବୁଦ୍ଧିମତାକୁ ବୁଝାଏ।'
    },
    pa: {
      question: 'ਆਰਟੀਫੀਸ਼ੀਅਲ ਜਨਰਲ ਇੰਟੈਲੀਜੈਂਸ (AGI) ਅਤੇ ਨੈਰੋ AI (Narrow AI) ਵਿੱਚ ਕੀ ਮੁੱਖ ਅੰਤਰ ਹੈ?',
      options: [
        'ਨੈਰੋ AI ਵਿਸ਼ੇਸ਼ ਕੰਮ ਕਰਦੀ ਹੈ, ਜਦੋਂ ਕਿ AGI ਸਿਧਾਂਤਕ ਤੌਰ \'ਤੇ ਮਨੁੱਖ ਵਾਂਗ ਕੋਈ ਵੀ ਬੌਧਿਕ ਕੰਮ ਕਰ ਸਕਦੀ ਹੈ।',
        'ਨੈਰੋ AI ਸਿਰਫ਼ ਸਮਾਰਟਫ਼ੋਨ \'ਤੇ ਕੰਮ ਕਰਦੀ ਹੈ, ਜਦੋਂ ਕਿ AGI ਸੁਪਰ ਕੰਪਿਊਟਰਾਂ \'ਤੇ ਚੱਲਦੀ ਹੈ।',
        'AGI ਪਹਿਲਾਂ ਹੀ ਖੋਜ ਇੰਜਣਾਂ ਵਿੱਚ ਹੈ, ਜਦਕਿ ਨੈਰੋ AI ਪ੍ਰਯੋਗਾਤਮਕ ਹੈ।',
        'ਨੈਰੋ AI ਮਸ਼ੀਨ ਲਰਨਿੰਗ ਵਰਤਦੀ ਹੈ, ਜਦਕਿ AGI ਸਿਰਫ਼ ਹੱਥੀਂ ਲਿਖੇ ਨਿਯਮਾਂ \'ਤੇ ਨਿਰਭਰ ਹੈ।'
      ],
      explanation: 'ਨੈਰੋ AI ਅਨੁਵਾਦ ਜਾਂ ਫੋਟੋ ਪਛਾਣ ਵਰਗੇ ਖਾਸ ਕੰਮਾਂ ਲਈ ਸਿੱਖਿਅਤ ਹੁੰਦੀ ਹੈ, ਜਦਕਿ AGI ਮਨੁੱਖੀ ਪੱਧਰ ਦੀ ਸੋਚਣ ਸ਼ਕਤੀ ਨੂੰ ਦਰਸਾਉਂਦੀ ਹੈ।'
    },
  },
  'ai-basic-02': {
    hi: {
      question: 'आधुनिक आर्टिफिशियल इंटेलिजेंस सिस्टम के पास उन शब्दों और छवियों की वास्तविक सचेत समझ होती है जिन्हें वे संसाधित करते हैं।',
      explanation: 'एआई सिस्टम सचेत जागरूकता के बजाय डेटा में सांख्यिकीय पैटर्न और गणितीय संबंधों की पहचान करते हैं।'
    },
    te: {
      question: 'ఆధునిక AI వ్యవస్థలు తాము ప్రాసెస్ చేసే పదాలు మరియు చిత్రాల గురించి నిజమైన స్పృహతో కూడిన అవగాహనను కలిగి ఉంటాయి.',
      explanation: 'AI వ్యవస్థలు స్పృహ లేదా భావాలను కలిగి ఉండవు; అవి డేటాలోని గణాంక నమూనాలను మాత్రమే గుర్తిస్తాయి.'
    },
    de: {
      question: 'Moderne KI-Systeme besitzen ein echtes bewusstes Verständnis der von ihnen verarbeiteten Wörter und Bilder.',
      explanation: 'KI-Systeme erkennen statistische Muster und Korrelationen, anstatt ein echtes Bewusstsein oder Verständnis zu besitzen.'
    },
    fr: {
      question: 'Les systèmes d\'IA actuels possèdent une réelle compréhension consciente des mots et des images qu\'ils traitent.',
      explanation: 'Les modèles d\'IA identifient des corrélations statistiques mathématiques sans conscience ni compréhension subjective.'
    },
    ja: {
      question: '最新の人工知能システムは、処理する単語や画像を真に意識的に理解している。',
      explanation: 'AIシステムは意識的な理解や主観的経験を持つのではなく、データ内の統計的パターンと相関関係を特定しているだけです。'
    },
    bn: {
      question: 'আধুনিক কৃত্রিম বুদ্ধিমত্তা ব্যবস্থা যে শব্দ ও ছবি প্রক্রিয়াকরণ করে, সেগুলোর বাস্তব সচেতন উপলব্ধি ধারণ করে।',
      explanation: 'এআই সিস্টেম সচেতন অনুভূতির পরিবর্তে তথ্যের মধ্যে গাণিতিক ও পরিসংখ্যানগত প্যাটার্ন খুঁজে কাজ করে।'
    },
    mr: {
      question: 'आधुनिक कृत्रिम बुद्धिमत्ता प्रणाली प्रक्रिया करत असलेल्या शब्दांची आणि चित्रांची खरी जाणीवपूर्वक समज बाळगतात.',
      explanation: 'एआय प्रणालीकडे जाणीव नसते; त्या केवळ डेटामधील सांख्यिकीय नमुने ओळखतात.'
    },
    gu: {
      question: 'આધુનિક આર્ટિફિશિયલ ઇન્ટેલિજન્સ સિસ્ટમ્સ પ્રોસેસ કરેલા શબ્દો અને ચિત્રોની વાસ્તવિક સભાન સમજ ધરાવે છે.',
      explanation: 'AI સિસ્ટમ્સ સભાન સમજને બદલે ડેટામાં ગાણિતિક અને આંકડાકીય પેટર્નની ઓળખ કરે છે.'
    },
  },
  'ml-01': {
    hi: {
      question: 'कौन सा मशीन लर्निंग प्रतिमान इनपुट सुविधाओं और ज्ञात सही लेबल वाले लेबल किए गए डेटा जोड़े का उपयोग करता है?',
      options: [
        'पर्यवेक्षित शिक्षण (Supervised learning)',
        'अपर्यवेक्षित शिक्षण (Unsupervised learning)',
        'सुदृढ़ीकरण शिक्षण (Reinforcement learning)',
        'स्व-आयोजित क्लस्टरिंग (Self-organizing clustering)'
      ],
      explanation: 'पर्यवेक्षित शिक्षण में एल्गोरिदम को इनपुट-आउटपुट प्रशिक्षण जोड़ों पर प्रशिक्षित किया जाता है जहाँ सही परिणाम लेबल स्पष्ट रूप से प्रदान किया जाता है।'
    },
    te: {
      question: 'ఇన్‌పుట్ ఫీచర్‌లు మరియు సరైన లేబుల్‌లతో కూడిన డేటాను ఉపయోగించే మెషిన్ లెర్నింగ్ విధానం ఏది?',
      options: [
        'సూపర్‌వైజ్డ్ లెర్నింగ్ (Supervised learning)',
        'అన్‌సూపర్‌వైజ్డ్ లెర్నింగ్ (Unsupervised learning)',
        'రీన్‌ఫోర్స్‌మెంట్ లెర్నింగ్ (Reinforcement learning)',
        'క్లస్టరింగ్ (Clustering)'
      ],
      explanation: 'సూపర్‌వైజ్డ్ లెర్నింగ్ తెలిసిన లక్ష్య లేబుల్‌లతో అల్గారిథమ్‌లను శిక్షణ ఇస్తుంది.'
    },
    de: {
      question: 'Welches Machine-Learning-Paradigma verwendet gelabelte Datenpaare aus Eingabemerkmalen und bekannten Ziel-Labels?',
      options: [
        'Überwachtes Lernen (Supervised Learning)',
        'Unüberwachtes Lernen (Unsupervised Learning)',
        'Bestärkendes Lernen (Reinforcement Learning)',
        'Selbstorganisierende Cluster'
      ],
      explanation: 'Überwachtes Lernen trainiert Modelle anhand von Input-Output-Paaren, bei denen das korrekte Ergebnis explizit vorgegeben ist.'
    },
    fr: {
      question: 'Quel paradigme d\'apprentissage automatique utilise des données étiquetées comprenant des entrées et des cibles correctes ?',
      options: [
        'Apprentissage supervisé (Supervised learning)',
        'Apprentissage non supervisé (Unsupervised learning)',
        'Apprentissage par renforcement (Reinforcement learning)',
        'Clustering automatique'
      ],
      explanation: 'L\'apprentissage supervisé entraîne des algorithmes sur des données où le résultat attendu est expressément fourni.'
    },
    ja: {
      question: '入力特徴量と既知の正解ラベルから構成されるラベル付きデータ対を使用する機械学習の手法はどれですか？',
      options: [
        '教師あり学習 (Supervised learning)',
        '教師なし学習 (Unsupervised learning)',
        '強化学習 (Reinforcement learning)',
        '自己組織化クラスタリング'
      ],
      explanation: '教師あり学習は、正解ラベルがあらかじめ与えられた入力と出力のペアデータを用いてモデルを学習させます。'
    },
    bn: {
      question: 'কোন মেশিন লার্নিং পদ্ধতিতে ইনপুট এবং সঠিক উত্তরের লেবেলযুক্ত ডেটা ব্যবহার করা হয়?',
      options: [
        'সুপারভাইজড লার্নিং (Supervised learning)',
        'আনসুপারভাইজড লার্নিং (Unsupervised learning)',
        'রিইনফোর্সমেন্ট লার্নিং (Reinforcement learning)',
        'সেলফ অর্গানাইজিং ক্লাস্টারিং'
      ],
      explanation: 'সুপারভাইজড লার্নিংয়ে সঠিক উত্তরের লেবেলসহ ইনপুট ডেটা দিয়ে অ্যালগরিদমকে শেখানো হয়।'
    },
    mr: {
      question: 'कोणत्या मशीन लर्निंग पद्धतीमध्ये लेबल केलेला डेटा (इनपुट आणि अचूक उत्तर) वापरला जातो?',
      options: [
        'सुपरव्हाइज्ड लर्निंग (Supervised learning)',
        'अनसुपरव्हाइज्ड लर्निंग (Unsupervised learning)',
        'रीइन्फोर्समेंट लर्निंग (Reinforcement learning)',
        'क्लस्टरिंग (Clustering)'
      ],
      explanation: 'सुपरव्हाइज्ड लर्निंगमध्ये योग्य परिणामासह मॉडेलला प्रशिक्षण दिले जाते.'
    },
  },
  'llm-01': {
    hi: {
      question: 'लार्ज लैंग्वेज मॉडल्स (LLMs) के संदर्भ में "हैलुसिनेशन" (Hallucination) का क्या अर्थ है?',
      options: [
        'आत्मविश्वास से भरे ऐसे दावे उत्पन्न करना जो तथ्यात्मक रूप से गलत या निराधार हों।',
        'एक आंतरिक मेमोरी लीक जिससे सर्वर पुनः चालू हो जाता है।',
        'पाठ का अप्रत्याशित रूप से काव्यात्मक भाषा में अनुवाद करना।',
        'सुरक्षा प्रतिबंधों के कारण उत्तर देने से मना करना।'
      ],
      explanation: 'हैलुसिनेशन का अर्थ है जब जनरेटिव मॉडल पूरी तरह मनगढ़ंत और तथ्यात्मक रूप से असत्य दावे सच्चाई की तरह प्रस्तुत करते हैं।'
    },
    te: {
      question: 'లార్జ్ లాంగ్వేజ్ మోడల్స్ (LLMs) లో "హాలూసినేషన్" (Hallucination) దేనిని సూచిస్తుంది?',
      options: [
        'వాస్తవ ఆధారాలు లేని తప్పుడు సమాచారాన్ని నమ్మకంగా చెప్పడం.',
        'సర్వర్ రీబూట్ అయ్యే మెమరీ సమస్య.',
        'టెక్స్ట్‌ను ఊహించని విధంగా కవిత్వంలోకి మార్చడం.',
        'భద్రతా నిబంధనల వల్ల సమాధానం ఇవ్వకపోవడం.'
      ],
      explanation: 'హాలూసినేషన్ అనేది వాస్తవికత లేని సమాచారాన్ని మోడల్ కల్పించి సత్యం వలె చెప్పే దృగ్విషయం.'
    },
    de: {
      question: 'Was beschreibt "Halluzination" im Kontext von Großen Sprachmodellen (LLMs)?',
      options: [
        'Das selbstsichere Generieren von Aussagen, die faktisch falsch oder unbelegt sind.',
        'Ein Speicherleck, das zum Neustart des Servers führt.',
        'Das überraschende Übersetzen von Text in poetische Sprache.',
        'Die Verweigerung einer Antwort aufgrund von Sicherheitsrichtlinien.'
      ],
      explanation: 'Halluzination beschreibt das Phänomen, wenn generative Modelle scheinbar plausible, aber sachlich frei erfundene Aussagen treffen.'
    },
    fr: {
      question: 'Dans le contexte des grands modèles de langage (LLM), qu\'appelle-t-on une "hallucination" ?',
      options: [
        'Générer avec assurance des affirmations factuellement inexactes ou sans fondement.',
        'Une fuite de mémoire provoquant le redémarrage du serveur.',
        'Une traduction inattendue en prose poétique.',
        'Un refus de répondre lié aux filtres de sécurité.'
      ],
      explanation: 'L\'hallucination désigne la propension d\'un modèle génératif à formuler des affirmations plausibles mais totalement inventées.'
    },
    ja: {
      question: '大規模言語モデル（LLM）において「ハルシネーション（幻覚）」とは何を指しますか？',
      options: [
        '事実に反する、あるいは根拠のない主張をあたかも真実であるかのように生成すること。',
        'サーバーが再起動する原因となる内部メモリリーク。',
        'テキストが予期せず詩的または比喩的な言語に変換されること。',
        '安全性ガイドラインにより回答を拒否すること。'
      ],
      explanation: 'ハルシネーションとは、もっともらしく聞こえるが事実無根の情報を生成AIが出力してしまう現象です。'
    },
    bn: {
      question: 'লার্জ ল্যাঙ্গুয়েজ মডেলের (LLM) ক্ষেত্রে "হ্যালুসিনেশন" বলতে কী বোঝায়?',
      options: [
        'আত্মবিশ্বাসের সাথে এমন তথ্য প্রদান করা যা তথ্যগতভাবে ভুল বা ভিত্তিহীন।',
        'একটি অভ্যন্তরীণ মেমোরি ত্রুটি যা সার্ভার বন্ধ করে দেয়।',
        'পাঠ্যকে অপ্রত্যাশিতভাবে কাব্যের মতো অনুবাদ করা।',
        'নিরাপত্তা ফিল্টারের কারণে উত্তর দিতে অস্বীকার করা।'
      ],
      explanation: 'হ্যালুসিনেশন হলো জেনারেটিভ মডেল দ্বারা বাস্তব ভিত্তিহীন তথ্যকে সত্যের মতো উপস্থাপন করা।'
    },
    mr: {
      question: 'लार्ज लँग्वेज मॉडेल्स (LLMs) च्या संदर्भात "हॅलुसिनेशन" (Hallucination) म्हणजे काय?',
      options: [
        'तथ्य नसलेली किंवा चुकीची माहिती आत्मविश्वासाने सत्य म्हणून सादर करणे.',
        'मेमरी लीक ज्यामुळे सर्व्हर बंद पडतो.',
        'कवितेच्या भाषेत भाषांतर करणे.',
        'सुरक्षा नियमांमुळे उत्तर देण्यास नकार देणे.'
      ],
      explanation: 'हॅलुसिनेशन म्हणजे कोणत्याही पुराव्याशिवाय मॉडेलने काल्पनिक माहिती खरी असल्यासारखी सांगणे.'
    },
  },
  'tools-01': {
    hi: {
      question: 'मानक चैटबॉट की तुलना में एक एआई "एजेंट" (Agent) की क्या पहचान है?',
      options: [
        'एक एजेंट बहु-चरणीय कार्य योजना बना सकता है, एपीआई या टूल कॉल कर सकता है और सॉफ़्टवेयर वातावरण के साथ स्वायत्त रूप से बातचीत कर सकता है।',
        'एक एजेंट को लिखे जाने वाले प्रत्येक अक्षर के लिए मानव अनुमोदन की आवश्यकता होती है।',
        'एक एजेंट विशुद्ध रूप से यांत्रिक हथियारों वाला एक रोबोट है।',
        'एक एजेंट प्राकृतिक भाषा को समझ नहीं सकता।'
      ],
      explanation: 'एआई एजेंट कार्यों की योजना बनाकर, टूल्स का उपयोग करके और लक्ष्य प्राप्त करने के लिए कोड या वेब एपीआई चलाकर काम करते हैं।'
    },
    te: {
      question: 'సాధారణ చాట్‌బాట్‌తో పోలిస్తే AI "ఏజెంట్" (Agent) లక్షణం ఏమిటి?',
      options: [
        'ఏజెంట్ స్వయంప్రతిపత్తితో వివిధ దశల పనులను ప్లాన్ చేయగలదు మరియు బాహ్య API టూల్స్‌ను ఉపయోగించగలదు.',
        'ప్రతి అక్షరానికి మానవ అనుమతి అవసరం.',
        'ఏజెంట్ అంటే మెకానికల్ రోబోట్ మాత్రమే.',
        'ఏజెంట్ మానవ భాషను అర్థం చేసుకోలేదు.'
      ],
      explanation: 'AI ఏజెంట్లు నిర్ణయాలు తీసుకుంటూ, సాఫ్ట్‌వేర్ టూల్స్‌తో స్వతంత్రంగా పనులు పూర్తి చేయగలవు.'
    },
    de: {
      question: 'Was unterscheidet einen KI-"Agenten" von einem herkömmlichen Chatbot?',
      options: [
        'Ein Agent kann mehrstufige Aktionen planen, externe APIs aufrufen und eigenständig in Software-Umgebungen agieren.',
        'Ein Agent benötigt für jeden Tastaturanschlag menschliche Freigabe.',
        'Ein Agent ist ausschließlich ein physischer Roboter mit Greifarmen.',
        'Ein Agent kann keine natürliche Sprache verstehen.'
      ],
      explanation: 'KI-Agenten erweitern Sprachmodelle, indem sie komplexe Aufgaben autonom planen, Werkzeuge bedienen und APIs ausführen.'
    },
  },
  'privacy-01': {
    hi: {
      question: 'कर्मचारियों को बिना एंटरप्राइज अनुबंध के सार्वजनिक उपभोक्ता एआई में गोपनीय ग्राहक अनुबंध या व्यावसायिक रहस्य क्यों नहीं डालने चाहिए?',
      options: [
        'उपभोक्ता टूल भविष्य के मॉडलों को प्रशिक्षित करने के लिए प्रॉम्प्ट डेटा का उपयोग कर सकता है, जिससे निजी जानकारी उजागर हो सकती है।',
        'सार्वजनिक एआई उपकरण स्वचालित रूप से पुलिस को सूचित करते हैं।',
        'वे सभी टेक्स्ट को क्रिप्टोकरेंसी में बदल देते हैं।',
        'गोपनीय टेक्स्ट डालने से कंप्यूटर से मूल फ़ाइल हट जाती है।'
      ],
      explanation: 'सार्वजनिक एआई सेवाएं डिफ़ॉल्ट रूप से प्रॉम्प्ट्स को मॉडल सुधार के लिए रख सकती हैं, जिससे बौद्धिक संपदा का खतरा होता है।'
    },
    de: {
      question: 'Warum sollten Mitarbeiter keine vertraulichen Kundendaten in öffentliche KI-Dienste ohne Unternehmensvertrag einfügen?',
      options: [
        'Der Dienst könnte die Prompt-Daten zum Training künftiger Modelle verwenden und so interne Daten offenlegen.',
        'Öffentliche KI-Tools benachrichtigen automatisch die Behörden.',
        'Öffentliche Tools wandeln Text in Kryptowährung um.',
        'Das Eingeben löscht automatisch die lokale Datei.'
      ],
      explanation: 'Öffentliche KI-Dienste speichern Prompts häufig standardmäßig zur Modellverbesserung, was Datenschutzrisiken birgt.'
    },
  },
  'ethics-01': {
    hi: {
      question: 'मशीन लर्निंग सिस्टम में एल्गोरिथम पूर्वाग्रह (Algorithmic Bias) क्या है?',
      options: [
        'एआई में व्यवस्थित और बार-बार होने वाली त्रुटियां जो अनुचित परिणाम देती हैं, जो अक्सर प्रशिक्षण डेटा में मौजूद ऐतिहासिक सामाजिक पूर्वाग्रहों को दर्शाती हैं।',
        'प्रोसेसर के गर्म होने के कारण होने वाली अस्थायी खराबी।',
        'कंप्यूटर द्वारा पायथन को जावास्क्रिप्ट से बेहतर मानना।',
        'धीमे इंटरनेट कनेक्शन के लिए बनाया गया नियम।'
      ],
      explanation: 'एल्गोरिथम पूर्वाग्रह तब उत्पन्न होता है जब मॉडल प्रशिक्षण डेटा में मौजूद ऐतिहासिक असमानताओं और पक्षपातपूर्ण लेबलिंग को सीख लेते हैं।'
    },
  },
  'workplace-01': {
    hi: {
      question: 'एंटरप्राइज एआई वर्कफ़्लो में "ह्यूमन-इन-द-लूप" (HITL) दृष्टिकोण क्या है?',
      options: [
        'एक प्रणाली डिज़ाइन जहाँ मानव विशेषज्ञ महत्वपूर्ण एआई सुझावों के लागू होने से पहले उनकी समीक्षा और अनुमोदन करते हैं।',
        'एक नियम जहाँ सभी कोड बिना एआई सहायता के हाथ से लिखना अनिवार्य हो।',
        'प्रबंधकों को प्रशिक्षित करने के लिए एक गेमिंग सिमुलेशन।',
        'डेटा वैज्ञानिकों के लिए अनिवार्य दैनिक व्यायाम।'
      ],
      explanation: 'ह्यूमन-इन-द-लूप यह सुनिश्चित करता है कि उच्च-जोखिम वाले एआई निर्णयों में मानव निर्णय और जिम्मेदारी अंतिम जांच बिंदु बनी रहे।'
    },
  }
};

/**
 * Localizes a question into the requested language if a translation exists.
 * Falls back to English with localized True/False options and topic/difficulty translation.
 */
export function localizeQuestion(question: Question, langCode: string): Question {
  if (!question || langCode === 'en') {
    return question;
  }

  // Handle True / False option translation automatically for all 23 languages
  let localizedOptions = question.options;
  if (question.type === 'true_false' && TRUE_FALSE_OPTIONS[langCode]) {
    const pair = TRUE_FALSE_OPTIONS[langCode];
    localizedOptions = [pair[0], pair[1]];
  }

  // Look for specific question translations
  const specific = QUESTION_LOCALIZATIONS[question.id]?.[langCode];
  if (specific) {
    return {
      ...question,
      question: specific.question || question.question,
      options: specific.options || localizedOptions,
      explanation: specific.explanation || question.explanation,
    };
  }

  // If no exact match, return question with localized True/False if applicable
  return {
    ...question,
    options: localizedOptions,
  };
}
