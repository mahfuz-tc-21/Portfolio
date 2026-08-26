export interface DebugSystem {
  id: string;
  systemName: string;
  problem: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  buildingId: string;
}

export interface PipelineStage {
  id: string;
  label: string;
  order: number;
}

export interface PipelineLevel {
  level: number;
  title: string;
  stages: PipelineStage[];
}

export const debugSystems: DebugSystem[] = [
  {
    id: 'api-error',
    systemName: 'API Gateway',
    problem: 'API ERROR Status: 401 Unauthorized',
    options: ['Check Authentication Token', 'Delete Database', 'Change Tailwind CSS Config', 'Restart Browser'],
    correctAnswer: 'Check Authentication Token',
    hint: 'A 401 status indicates authentication credentials are missing or invalid.',
    buildingId: 'project-avenue'
  },
  {
    id: 'db-error',
    systemName: 'Central Database Core',
    problem: 'Database connection failed: Access denied for root@localhost',
    options: ['Delete frontend codebase', 'Check connection configuration & passwords', 'Change CTA button color', 'Restart monitor display'],
    correctAnswer: 'Check connection configuration & passwords',
    hint: 'Access denied usually points to mismatched passwords or usernames in DB config files.',
    buildingId: 'developer-hq'
  },
  {
    id: 'ai-error',
    systemName: 'ML Inference Engine',
    problem: 'Pipeline Warning: Model is receiving unprocessed inputs resulting in low accuracy.',
    options: ['Preprocess and clean the raw inputs', 'Remove the model completely', 'Delete the train datasets', 'Alter page padding CSS'],
    correctAnswer: 'Preprocess and clean the raw inputs',
    hint: 'Raw inputs need features scaled, formatted, and normalized before inference feeding.',
    buildingId: 'ai-lab'
  },
  {
    id: 'cors-error',
    systemName: 'CORS Security Node',
    problem: 'Blocked by CORS Policy: No Access-Control-Allow-Origin header present.',
    options: ['Configure CORS middleware on backend', 'Buy a new domain name', 'Clear browser caches', 'Rebuild React layout'],
    correctAnswer: 'Configure CORS middleware on backend',
    hint: 'Cross-origin requests must be explicitly allowed by the server using appropriate CORS headers.',
    buildingId: 'github-center'
  },
  {
    id: 'dns-error',
    systemName: 'Gateway Domain router',
    problem: 'DNS_PROBE_FINISHED_NXDOMAIN',
    options: ['Verify domain registrar DNS records', 'Format operating system', 'Rewrite index.html', 'Email GitHub Support'],
    correctAnswer: 'Verify domain registrar DNS records',
    hint: 'NXDOMAIN indicates the domain query does not exist in domain name server records.',
    buildingId: 'city-exit'
  }
];

export const pipelineLevels: PipelineLevel[] = [
  {
    level: 1,
    title: 'Basic Machine Learning Pipeline',
    stages: [
      { id: 'data', label: 'Raw Data Input', order: 1 },
      { id: 'preprocess', label: 'Data Cleaning', order: 2 },
      { id: 'model', label: 'Model Training', order: 3 },
      { id: 'evaluate', label: 'Model Evaluation', order: 4 }
    ]
  },
  {
    level: 2,
    title: 'Supervised Classification Pipeline',
    stages: [
      { id: 'ingest', label: 'Data Ingestion', order: 1 },
      { id: 'split', label: 'Train/Test Split', order: 2 },
      { id: 'extract', label: 'Feature Extraction', order: 3 },
      { id: 'train', label: 'Classifier Fitting', order: 4 },
      { id: 'metrics', label: 'F1/ROC Testing', order: 5 }
    ]
  },
  {
    level: 3,
    title: 'AI RAG Agent Pipeline',
    stages: [
      { id: 'query', label: 'User Query Input', order: 1 },
      { id: 'vector', label: 'Context Retrieval', order: 2 },
      { id: 'prompt', label: 'Prompt Synthesis', order: 3 },
      { id: 'llm', label: 'LLM Generation', order: 4 },
      { id: 'post', label: 'Response Sanitization', order: 5 }
    ]
  }
];
