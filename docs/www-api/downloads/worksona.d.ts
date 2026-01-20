declare module 'worksona' {
  export interface WorksonaOptions {
    apiKeys: {
      openai?: string;
      anthropic?: string;
      google?: string;
    };
    debug?: boolean;
    defaultProvider?: 'openai' | 'anthropic' | 'google';
    defaultModel?: string;
    controlPanel?: boolean;
  }

  export interface AgentTraits {
    personality?: string[];
    knowledge?: string[];
    tone?: string;
    background?: string;
  }

  export interface AgentConfig {
    provider?: 'openai' | 'anthropic' | 'google';
    model?: string;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
    systemPrompt?: string;
    examples?: Array<{
      user: string;
      assistant: string;
    }>;
  }

  export interface AgentConfiguration {
    id: string;
    name: string;
    description?: string;
    traits?: AgentTraits;
    config: AgentConfig;
  }

  export interface Transaction {
    timestamp: Date;
    query: string;
    response: string | null;
    duration: number;
    error: Error | null;
    provider: string;
    model: string;
  }

  export interface Metrics {
    totalQueries: number;
    avgResponseTime: number;
    lastActive: Date | null;
    successRate: number;
    errorCount: number;
  }

  export interface AgentState {
    isActive: boolean;
    currentProvider: string;
    currentModel: string;
    lastError: Error | null;
  }

  export interface Agent {
    id: string;
    name: string;
    description?: string;
    config: AgentConfig;
    traits?: AgentTraits;
    addTransaction(transaction: Transaction): void;
    getHistory(): Transaction[];
    getMetrics(): Metrics;
    getState(): AgentState;
  }

  export interface ChatOptions {
    provider?: 'openai' | 'anthropic' | 'google';
    temperature?: number;
    maxTokens?: number;
  }

  export interface ImageProcessingOptions {
    prompt?: string;
    detail?: 'auto' | 'low' | 'high';
  }

  export interface ImageGenerationOptions {
    model?: string;
    size?: '256x256' | '512x512' | '1024x1024' | '1024x1792' | '1792x1024';
    n?: number;
    response_format?: 'url' | 'b64_json';
    quality?: 'standard' | 'hd';
    style?: 'vivid' | 'natural';
  }

  export interface WorksonaError extends Error {
    code: string;
    originalError?: Error;
  }

  export type EventHandler = (data: any) => void;

  export class Worksona {
    constructor(options: WorksonaOptions);

    // Agent Management
    loadAgent(config: AgentConfiguration | string): Promise<Agent | null>;
    getAgent(agentId: string): Agent | undefined;
    getAllAgents(): Agent[];
    removeAgent(agentId: string): boolean;
    getAgentHistory(agentId: string): Transaction[];
    getAgentMetrics(agentId: string): Metrics | null;
    getAgentState(agentId: string): AgentState | null;

    // Chat
    chat(agentId: string, message: string, options?: ChatOptions): Promise<string | null>;

    // Image Processing
    processImage(agentId: string, imageData: string, options?: ImageProcessingOptions): Promise<string | null>;
    analyzeImage(agentId: string, imageData: string, options?: ImageProcessingOptions): Promise<string | null>;
    generateImage(agentId: string, prompt: string, options?: ImageGenerationOptions): Promise<string | null>;
    editImage(agentId: string, imageData: string, prompt: string, options?: ImageGenerationOptions): Promise<string | null>;
    variationImage(agentId: string, imageData: string, options?: ImageGenerationOptions): Promise<string | null>;

    // Events
    on(event: string, handler: EventHandler): void;
    off(event: string, handler: EventHandler): void;

    // Control Panel
    createControlPanel(containerId: string): void;
    createFloatingControlPanel(): void;
    updateControlPanel(): void;
  }

  export default Worksona;
}

declare global {
  interface Window {
    Worksona: typeof import('worksona').Worksona;
  }
} 