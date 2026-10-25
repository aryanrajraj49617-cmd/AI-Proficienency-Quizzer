import { Question } from '../types';

export const STARTER_QUESTIONS: Question[] = [
  // --- 1. AI basics ---
  {
    id: 'ai-basic-01',
    topic: 'AI basics',
    difficulty: 'Beginner',
    type: 'multiple_choice',
    question: 'What is the primary difference between Artificial General Intelligence (AGI) and Narrow AI?',
    options: [
      'Narrow AI performs specific tasks, while AGI can theoretically perform any intellectual task a human can.',
      'Narrow AI operates only on smartphones, while AGI operates on cloud supercomputers.',
      'AGI is already widely deployed in consumer search engines, while Narrow AI is experimental.',
      'Narrow AI uses machine learning, whereas AGI relies exclusively on hand-written if-then rules.'
    ],
    correctIndex: 0,
    explanation: 'Narrow AI is designed and trained for specialized tasks like translation or image recognition, whereas AGI refers to hypothetical systems capable of generalized human-level cognitive reasoning.'
  },
  {
    id: 'ai-basic-02',
    topic: 'AI basics',
    difficulty: 'Beginner',
    type: 'true_false',
    question: 'Modern Artificial Intelligence systems possess genuine conscious understanding of the words and images they process.',
    options: ['True', 'False'],
    correctIndex: 1,
    explanation: 'AI systems identify statistical patterns and mathematical correlations in data rather than possessing conscious awareness, beliefs, or subjective experience.'
  },
  {
    id: 'ai-basic-03',
    topic: 'AI basics',
    difficulty: 'Intermediate',
    type: 'multiple_choice',
    question: 'What role does a "loss function" play during the training of an artificial neural network?',
    options: [
      'It compresses training image files to save disk space.',
      'It mathematically measures the discrepancy between model predictions and target ground-truth values.',
      'It encrypts neural weights to prevent reverse engineering.',
      'It limits power consumption during GPU training cycles.'
    ],
    correctIndex: 1,
    explanation: 'A loss function quantifies model prediction errors, providing the objective metric that optimization algorithms use to adjust weights during training.'
  },
  {
    id: 'ai-basic-04',
    topic: 'AI basics',
    difficulty: 'Advanced',
    type: 'scenario',
    question: 'A computer vision team notices their defect detection model achieves 99.4% accuracy during training but drops to 61% accuracy on unseen factory cameras. Which phenomenon is most likely occurring?',
    options: [
      'Catastrophic forgetting caused by underfitting the dataset.',
      'High model variance leading to overfitting on training camera lighting and angles.',
      'The loss function converged to zero gradient too early.',
      'The learning rate was set too conservatively for backpropagation.'
    ],
    correctIndex: 1,
    explanation: 'A huge drop in performance between training and test sets is the textbook signature of overfitting, where the model memorizes specific training noise instead of generalizable features.'
  },

  // --- 2. Machine learning ---
  {
    id: 'ml-01',
    topic: 'Machine learning',
    difficulty: 'Beginner',
    type: 'multiple_choice',
    question: 'Which machine learning paradigm uses labeled data pairs consisting of input features and known correct target labels?',
    options: [
      'Supervised learning',
      'Unsupervised learning',
      'Reinforcement learning',
      'Self-organizing clustering'
    ],
    correctIndex: 0,
    explanation: 'Supervised learning trains predictive algorithms on input-output training pairs where the true outcome label is explicitly provided.'
  },
  {
    id: 'ml-02',
    topic: 'Machine learning',
    difficulty: 'Beginner',
    type: 'true_false',
    question: 'In reinforcement learning, the learning agent discovers optimal strategies by receiving feedback in the form of rewards or penalties.',
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: 'Reinforcement learning optimizes an agent policy over time through trial-and-error interaction with an environment guided by scalar reward signals.'
  },
  {
    id: 'ml-03',
    topic: 'Machine learning',
    difficulty: 'Intermediate',
    type: 'multiple_choice',
    question: 'Why do data scientists partition datasets into distinct training, validation, and test splits?',
    options: [
      'To prevent the model from memorizing test data and honestly evaluate its generalization on unseen records.',
      'To comply with mandatory IEEE licensing standards for database tables.',
      'To increase the total number of parameters that the neural network can store.',
      'To ensure that all numeric columns have a mean of zero and standard deviation of one.'
    ],
    correctIndex: 0,
    explanation: 'Keeping a held-out test split ensures that model performance metrics reflect how well the algorithm generalizes to real-world, unseen data.'
  },
  {
    id: 'ml-04',
    topic: 'Machine learning',
    difficulty: 'Advanced',
    type: 'scenario',
    question: 'A medical diagnostic model must classify rare cancers that occur in only 0.2% of patient records. Evaluating the model solely on raw accuracy produces a deceptive 99.8% score. Which metric should the team prioritize?',
    options: [
      'Mean Squared Error (MSE)',
      'Precision, Recall, and PR-AUC',
      'Raw Training Accuracy',
      'Categorical Cross-Entropy without weighting'
    ],
    correctIndex: 1,
    explanation: 'On highly imbalanced datasets, standard accuracy is misleading because a naive model predicting negative every time looks accurate, making recall and precision essential metrics.'
  },

  // --- 3. LLMs and prompting ---
  {
    id: 'llm-01',
    topic: 'LLMs and prompting',
    difficulty: 'Beginner',
    type: 'multiple_choice',
    question: 'In the context of Large Language Models (LLMs), what does "hallucination" describe?',
    options: [
      'Generating confident-sounding claims that are factually incorrect or unsupported by evidence.',
      'An internal memory leak that causes the GPU server to reboot.',
      'Translating text into poetic or metaphorical language unexpectedly.',
      'Refusing to respond due to content safety guardrails.'
    ],
    correctIndex: 0,
    explanation: 'Hallucination refers to generative models producing fabricated, plausible-sounding statements that have no factual grounding.'
  },
  {
    id: 'llm-02',
    topic: 'LLMs and prompting',
    difficulty: 'Beginner',
    type: 'true_false',
    question: 'Few-shot prompting involves providing one or more representative examples of the desired input and output within the prompt.',
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: 'Few-shot prompting guides model formatting and reasoning style by providing demonstration exemplars directly in the context window.'
  },
  {
    id: 'llm-03',
    topic: 'LLMs and prompting',
    difficulty: 'Intermediate',
    type: 'multiple_choice',
    question: 'What is the primary function of the "Temperature" parameter when sampling responses from an LLM?',
    options: [
      'It adjusts the physical temperature of the server rack cooling fans.',
      'It modulates response randomness, where lower values make output more deterministic and higher values make it more diverse.',
      'It sets the maximum token length of the generated response.',
      'It regulates the model strictness regarding ethical content filters.'
    ],
    correctIndex: 1,
    explanation: 'Temperature controls the probability distribution flattening during token selection, with low temperatures yielding focused, deterministic outputs.'
  },
  {
    id: 'llm-04',
    topic: 'LLMs and prompting',
    difficulty: 'Intermediate',
    type: 'scenario',
    question: 'You want an LLM to accurately extract invoice numbers, dates, and line items from messy emails. Which prompt engineering technique is most effective?',
    options: [
      'Instructing the model to "be smart and think outside the box".',
      'Providing an explicit system role, specifying JSON output schema, and providing 2 few-shot extraction examples.',
      'Setting the temperature to 1.8 to encourage creative interpretation.',
      'Repeating the prompt three times in uppercase letters.'
    ],
    correctIndex: 1,
    explanation: 'Combining role specification, strict schema constraints, and demonstration examples yields the most consistent structured data extraction from LLMs.'
  },
  {
    id: 'llm-05',
    topic: 'LLMs and prompting',
    difficulty: 'Advanced',
    type: 'multiple_choice',
    question: 'What is Retrieval-Augmented Generation (RAG) and why is it used?',
    options: [
      'A method to train models from scratch on quantum computers.',
      'A technique that retrieves relevant documents from an external knowledge base and feeds them into the prompt to ground model answers.',
      'A hardware acceleration protocol for running LLMs on mobile devices without RAM.',
      'An automated system that replaces human annotators during reinforcement learning.'
    ],
    correctIndex: 1,
    explanation: 'RAG anchors LLM generation to verified external enterprise documents, drastically reducing hallucinations and keeping responses current without costly model retraining.'
  },

  // --- 4. AI tools ---
  {
    id: 'tools-01',
    topic: 'AI tools',
    difficulty: 'Beginner',
    type: 'multiple_choice',
    question: 'Which of the following describes an AI "Agent" as distinct from a standard conversational chatbot?',
    options: [
      'An agent can plan multi-step actions, call external APIs or tools, and interact autonomously with software environments.',
      'An agent requires human approval for every keystroke it writes.',
      'An agent is purely a hardware robot with mechanical arms.',
      'An agent cannot process natural language inputs.'
    ],
    correctIndex: 0,
    explanation: 'AI agents extend conversational models by planning sequential tasks, executing code, and using digital tools or web APIs to achieve end goals.'
  },
  {
    id: 'tools-02',
    topic: 'AI tools',
    difficulty: 'Beginner',
    type: 'true_false',
    question: 'Diffusion models are a popular class of generative AI architectures specifically widely used for generating high-fidelity images and audio.',
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: 'Diffusion models generate realistic media by iteratively removing Gaussian noise from a random latent canvas guided by conditioning prompts.'
  },
  {
    id: 'tools-03',
    topic: 'AI tools',
    difficulty: 'Intermediate',
    type: 'scenario',
    question: 'A software engineer uses an AI code completion assistant to speed up development. What is the recommended best practice before pushing generated code to production?',
    options: [
      'Commit and push immediately because modern AI code generators produce defect-free code.',
      'Review code logic line-by-line, run automated unit tests, and perform standard security and license scans.',
      'Strip out all unit tests since the AI has verified the implementation internally.',
      'Ask the AI if its code contains any bugs and accept its self-assessment.'
    ],
    correctIndex: 1,
    explanation: 'Human developer review, rigorous testing, and security scanning are critical because AI assistants can hallucinate subtle bugs or insecure dependencies.'
  },
  {
    id: 'tools-04',
    topic: 'AI tools',
    difficulty: 'Advanced',
    type: 'multiple_choice',
    question: 'What is "Vector Embeddings" in modern semantic search and AI toolchains?',
    options: [
      'High-resolution SVG image files created by text-to-image generators.',
      'Dense numerical vectors that capture the semantic meaning and contextual relationships of text chunks in high-dimensional space.',
      'A method of compressing SQL relational databases onto flash memory.',
      'A cybersecurity firewall that blocks unauthorized prompt injections.'
    ],
    correctIndex: 1,
    explanation: 'Vector embeddings map words, sentences, or documents into geometric spaces where items with similar semantic meanings cluster closely together.'
  },

  // --- 5. Data and privacy ---
  {
    id: 'privacy-01',
    topic: 'Data and privacy',
    difficulty: 'Beginner',
    type: 'multiple_choice',
    question: 'Why should employees avoid pasting confidential client contracts or trade secrets into public consumer AI services without enterprise agreements?',
    options: [
      'The consumer tool might use prompt data to train future foundational models, exposing private information to external users.',
      'Consumer AI tools automatically notify law enforcement about business text.',
      'Public tools convert all submitted text into cryptocurrency transactions.',
      'Entering confidential text automatically deletes the original document on local computers.'
    ],
    correctIndex: 0,
    explanation: 'Public consumer AI tools often retain submitted prompts for model improvement by default, risking intellectual property and customer privacy disclosure.'
  },
  {
    id: 'privacy-02',
    topic: 'Data and privacy',
    difficulty: 'Beginner',
    type: 'true_false',
    question: 'Anonymizing a dataset by merely removing customer names always prevents individuals from being re-identified when combined with other public datasets.',
    options: ['True', 'False'],
    correctIndex: 1,
    explanation: 'Simple pseudonymization is insufficient because auxiliary attributes like ZIP codes, birthdates, and gender can easily re-identify individuals through linkage attacks.'
  },
  {
    id: 'privacy-03',
    topic: 'Data and privacy',
    difficulty: 'Intermediate',
    type: 'scenario',
    question: 'A hospital plans to train a diagnostic model on patient records while adhering to strict privacy regulations like HIPAA and GDPR. Which privacy-preserving technique enables distributed training without centralizing patient records?',
    options: [
      'Federated Learning',
      'Unrestricted Public Web Scraping',
      'Single-node SQLite consolidation',
      'Plaintext FTP synchronization'
    ],
    correctIndex: 0,
    explanation: 'Federated learning trains models collaboratively across decentralized hospital nodes by transmitting only gradient updates rather than raw patient data.'
  },
  {
    id: 'privacy-04',
    topic: 'Data and privacy',
    difficulty: 'Advanced',
    type: 'multiple_choice',
    question: 'What is "Differential Privacy" and how does it protect training dataset contributors?',
    options: [
      'A formal mathematical standard that injects calibrated statistical noise so that the presence or absence of any single individual cannot be inferred from query outputs.',
      'A legal contract signed between data providers and cloud vendors.',
      'A technique that stores data across different hard drive partitions.',
      'A user interface toggle that disables browser tracking cookies.'
    ],
    correctIndex: 0,
    explanation: 'Differential privacy provides provable mathematical guarantees that output distributions remain virtually unchanged whether any single individual is included in the data or not.'
  },

  // --- 6. Ethics and safety ---
  {
    id: 'ethics-01',
    topic: 'Ethics and safety',
    difficulty: 'Beginner',
    type: 'multiple_choice',
    question: 'What is algorithmic bias in machine learning systems?',
    options: [
      'Systematic and repeatable errors in an AI system that create unfair outcomes, often reflecting historical societal prejudices in the training data.',
      'A temporary glitch caused by an overheated GPU processor.',
      'The natural preference of a computer system to run Python over JavaScript.',
      'A deliberate feature programmed to penalize faster network connections.'
    ],
    correctIndex: 0,
    explanation: 'Algorithmic bias arises when models learn and amplify historical inequities, skewed sampling distributions, or flawed labeling present in training data.'
  },
  {
    id: 'ethics-02',
    topic: 'Ethics and safety',
    difficulty: 'Beginner',
    type: 'true_false',
    question: 'A deepfake is synthetic media generated or manipulated using artificial intelligence to realistically depict someone doing or saying something they never did.',
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: 'Deepfakes use generative models to fabricate authentic-looking audio, video, or imagery, presenting substantial safety and impersonation challenges.'
  },
  {
    id: 'ethics-03',
    topic: 'Ethics and safety',
    difficulty: 'Intermediate',
    type: 'scenario',
    question: 'A commercial bank deploys an AI credit underwriting model that systematically rejects loan applications from a protected demographic group at double the average rate, despite identical financial creditworthiness. What should the institution do?',
    options: [
      'Ignore the disparity because AI algorithms are purely mathematical and cannot be biased.',
      'Halt automated decisions, conduct a thorough fairness audit across features and proxies, and implement debiasing mitigation techniques.',
      'Double the interest rate on accepted loans from that group to offset perceived risk.',
      'Delete the training dataset so regulators cannot inspect the inputs.'
    ],
    correctIndex: 1,
    explanation: 'Institutions have ethical and legal responsibilities to audit decision engines for disparate impact and eliminate discriminatory proxy variables.'
  },
  {
    id: 'ethics-04',
    topic: 'Ethics and safety',
    difficulty: 'Advanced',
    type: 'multiple_choice',
    question: 'In AI alignment and safety research, what does the "alignment problem" specifically refer to?',
    options: [
      'Aligning text margins neatly within chat bubble UI containers.',
      'The challenge of ensuring AI systems reliably pursue human values and intended goals without harmful unintended consequences.',
      'Calibrating camera lens optics for high-speed drone navigation.',
      'Synchronizing database clocks across distributed data center servers.'
    ],
    correctIndex: 1,
    explanation: 'The alignment problem centers on ensuring that powerful autonomous systems act in accordance with true human intentions, values, and safety boundaries.'
  },

  // --- 7. AI in the workplace ---
  {
    id: 'workplace-01',
    topic: 'AI in the workplace',
    difficulty: 'Beginner',
    type: 'multiple_choice',
    question: 'What is the "Human-in-the-Loop" (HITL) approach in enterprise AI workflows?',
    options: [
      'A system design where human experts review, guide, or approve critical AI suggestions before they take real-world effect.',
      'A requirement that employees must write all code by hand without auto-completion.',
      'A gaming simulation used to train corporate managers in virtual reality.',
      'A mandatory daily exercise program for data science employees.'
    ],
    correctIndex: 0,
    explanation: 'Human-in-the-loop ensures that human judgment, accountability, and domain expertise remain the final checkpoint for high-stakes AI-assisted decisions.'
  },
  {
    id: 'workplace-02',
    topic: 'AI in the workplace',
    difficulty: 'Beginner',
    type: 'true_false',
    question: 'AI adoption in business is purely about replacing human staff, with no capacity to augment productivity or automate tedious repetitive tasks.',
    options: ['True', 'False'],
    correctIndex: 1,
    explanation: 'The primary value of modern workplace AI is cognitive augmentation—freeing human professionals from manual drudgery so they can focus on high-judgment, strategic work.'
  },
  {
    id: 'workplace-03',
    topic: 'AI in the workplace',
    difficulty: 'Intermediate',
    type: 'scenario',
    question: 'A customer support department is adopting generative AI to draft email responses to client inquiries. What is the most effective operational workflow?',
    options: [
      'Allow the AI to send unreviewed replies automatically to all customers directly from the mailbox.',
      'Use the AI to retrieve relevant policy articles and draft suggested replies for customer support agents to review, personalize, and approve before sending.',
      'Prohibit support agents from using any digital tools and mandate pen-and-paper communication.',
      'Use the AI only to generate marketing slogans for internal employee newsletters.'
    ],
    correctIndex: 1,
    explanation: 'Pairing AI-drafted recommendations with human agent verification blends speed with accuracy, empathy, and organizational accountability.'
  },
  {
    id: 'workplace-04',
    topic: 'AI in the workplace',
    difficulty: 'Intermediate',
    type: 'multiple_choice',
    question: 'Why is establishing an internal "Acceptable Use Policy for Generative AI" essential for modern organizations?',
    options: [
      'To provide employees clear guardrails on approved tools, IP protection, confidentiality rules, and verification requirements.',
      'To legally ban all software updates across employee laptops.',
      'To ensure all team members use the exact same brand of desktop monitors.',
      'To eliminate the need for corporate data backups.'
    ],
    correctIndex: 0,
    explanation: 'An AI acceptable use policy clarifies legal boundaries, protects intellectual property, and empowers employees to leverage AI safely and responsibly.'
  },
  {
    id: 'workplace-05',
    topic: 'AI in the workplace',
    difficulty: 'Advanced',
    type: 'scenario',
    question: 'A marketing team wants to use an AI image generator for a global commercial ad campaign. What critical legal check must the legal/creative team conduct before publishing?',
    options: [
      'Ensure the prompt used fewer than 10 words.',
      'Review copyright terms, commercial licensing rights of the tool, trademark clearances, and rights of publicity for any depicted likenesses.',
      'Confirm that the image was generated exclusively on a weekend.',
      'Verify that the image file size is an odd number of megabytes.'
    ],
    correctIndex: 1,
    explanation: 'Commercial publication of AI imagery requires thorough due diligence on model license terms, avoiding trademark infringement, and ensuring no unauthorized real likenesses are used.'
  }
];

export const INITIAL_BADGES = [
  {
    id: 'badge-first-quiz',
    name: 'First Step',
    description: 'Completed your very first AI proficiency quiz',
    icon: 'Compass',
    category: 'milestone' as const,
    unlocked: false
  },
  {
    id: 'badge-high-score',
    name: 'Honors Graduate',
    description: 'Achieved an 80% or higher score on a quiz',
    icon: 'Award',
    category: 'score' as const,
    unlocked: false
  },
  {
    id: 'badge-expert',
    name: 'AI Mastermind',
    description: 'Attained the Expert proficiency level (85%+)',
    icon: 'Crown',
    category: 'score' as const,
    unlocked: false
  },
  {
    id: 'badge-perfect',
    name: 'Perfectionist',
    description: 'Scored 100% on a full 10-question assessment',
    icon: 'Sparkles',
    category: 'score' as const,
    unlocked: false
  },
  {
    id: 'badge-prompt-master',
    name: 'Prompt Engineer',
    description: 'Achieved 100% accuracy on LLMs and prompting questions',
    icon: 'Terminal',
    category: 'topic' as const,
    unlocked: false
  },
  {
    id: 'badge-ethical-mind',
    name: 'Guardian of Ethics',
    description: 'Achieved 100% accuracy on Ethics and safety questions',
    icon: 'ShieldCheck',
    category: 'topic' as const,
    unlocked: false
  },
  {
    id: 'badge-streak-3',
    name: 'Consistent Learner',
    description: 'Maintained a 3-quiz completion streak',
    icon: 'Flame',
    category: 'streak' as const,
    unlocked: false
  },
  {
    id: 'badge-speed-demon',
    name: 'Swift Thinker',
    description: 'Finished a 10-question quiz in under 2 minutes with 70%+ score',
    icon: 'Zap',
    category: 'milestone' as const,
    unlocked: false
  }
];
