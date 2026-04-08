import axiosInstance from '@api/axiosInstance';
import { handleApiError, logError } from '@api/errorHandler';

/**
 * Type definitions for Terminal Service
 */
export interface TerminalCommand {
  id: string;
  command: string;
  description?: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface TerminalSession {
  id: string;
  userId: string;
  startedAt: string;
  endedAt?: string;
  commandsExecuted: number;
  isActive: boolean;
}

export interface CommandExecutionRequest {
  command: string;
  sessionId?: string;
  context?: Record<string, any>;
}

export interface CommandExecutionResponse {
  success: boolean;
  output: string;
  exitCode: number;
  executionTime: number;
  suggestions?: string[];
  feedback?: string;
}

/**
 * Terminal Service
 * Handles communication with the AI-powered terminal backend
 */
class TerminalService {
  /**
   * Execute a command in the terminal
   */
  async sendTerminalCommand(
    request: CommandExecutionRequest
  ): Promise<CommandExecutionResponse | null> {
    try {
      const response = await axiosInstance.post<CommandExecutionResponse>(
        '/terminal/execute',
        request
      );

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        'Failed to execute command. Please try again.'
      );
      logError('TerminalService.sendTerminalCommand', error, { request });
      throw new Error(errorMessage);
    }
  }

  /**
   * Start a new terminal session
   */
  async startSession(): Promise<TerminalSession | null> {
    try {
      const response = await axiosInstance.post<TerminalSession>(
        '/terminal/session/start'
      );

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        'Failed to start terminal session. Please try again.'
      );
      logError('TerminalService.startSession', error);
      throw new Error(errorMessage);
    }
  }

  /**
   * End a terminal session
   */
  async endSession(sessionId: string): Promise<void> {
    try {
      await axiosInstance.post(`/terminal/session/${sessionId}/end`);
    } catch (error) {
      logError('TerminalService.endSession', error, { sessionId });
      // Don't throw - session can end even if API fails
    }
  }

  /**
   * Get current session
   */
  async getCurrentSession(): Promise<TerminalSession | null> {
    try {
      const response = await axiosInstance.get<TerminalSession>(
        '/terminal/session/current'
      );

      return response.data;
    } catch (error) {
      logError('TerminalService.getCurrentSession', error);
      return null;
    }
  }

  /**
   * Get session history
   */
  async getSessionHistory(limit: number = 20): Promise<TerminalSession[]> {
    try {
      const response = await axiosInstance.get<TerminalSession[]>(
        '/terminal/session/history',
        { params: { limit } }
      );

      return response.data;
    } catch (error) {
      logError('TerminalService.getSessionHistory', error, { limit });
      return [];
    }
  }

  /**
   * Get available commands
   */
  async getAvailableCommands(): Promise<TerminalCommand[]> {
    try {
      const response = await axiosInstance.get<TerminalCommand[]>(
        '/terminal/commands'
      );

      return response.data;
    } catch (error) {
      logError('TerminalService.getAvailableCommands', error);
      return [];
    }
  }

  /**
   * Get command suggestions based on partial input
   */
  async getCommandSuggestions(
    partialCommand: string
  ): Promise<TerminalCommand[]> {
    try {
      const response = await axiosInstance.get<TerminalCommand[]>(
        '/terminal/commands/suggest',
        { params: { q: partialCommand } }
      );

      return response.data;
    } catch (error) {
      logError('TerminalService.getCommandSuggestions', error, {
        partialCommand,
      });
      return [];
    }
  }

  /**
   * Get AI feedback for a command
   */
  async getCommandFeedback(command: string): Promise<string | null> {
    try {
      const response = await axiosInstance.post<{ feedback: string }>(
        '/terminal/feedback',
        { command }
      );

      return response.data.feedback;
    } catch (error) {
      logError('TerminalService.getCommandFeedback', error, { command });
      return null;
    }
  }

  /**
   * Execute a learning challenge
   */
  async executeChallenge(
    command: string,
    challengeId: string
  ): Promise<CommandExecutionResponse | null> {
    try {
      const response = await axiosInstance.post<CommandExecutionResponse>(
        `/terminal/challenges/${challengeId}/execute`,
        { command }
      );

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        'Failed to execute challenge. Please try again.'
      );
      logError('TerminalService.executeChallenge', error, {
        challengeId,
        command,
      });
      throw new Error(errorMessage);
    }
  }

  /**
   * Save command to favorites
   */
  async addCommandToHistory(command: string): Promise<void> {
    try {
      await axiosInstance.post('/terminal/history', { command });
    } catch (error) {
      logError('TerminalService.addCommandToHistory', error, { command });
      // Don't throw - history save failure shouldn't break functionality
    }
  }

  /**
   * Get command history for current user
   */
  async getCommandHistory(limit: number = 50): Promise<string[]> {
    try {
      const response = await axiosInstance.get<{ commands: string[] }>(
        '/terminal/history',
        { params: { limit } }
      );

      return response.data.commands;
    } catch (error) {
      logError('TerminalService.getCommandHistory', error, { limit });
      return [];
    }
  }
}

export default new TerminalService();
