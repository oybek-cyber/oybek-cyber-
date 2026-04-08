import { useState, useRef, useEffect } from 'react';
import { terminalService, CommandExecutionResponse } from '@services';
import { showErrorToast, showInfoToast } from '@api';

/**
 * Example Terminal Component
 * Demonstrates how to use terminalService for command execution
 * 
 * Usage:
 * <Route path="/terminal" element={<TerminalPageExample />} />
 */

interface CommandHistory {
  id: string;
  command: string;
  output: string;
  exitCode: number;
  timestamp: Date;
}

export const TerminalPageExample = () => {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const commandInputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  /**
   * Initialize terminal session on mount
   */
  useEffect(() => {
    initializeSession();
  }, []);

  /**
   * Auto-scroll to latest output
   */
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  /**
   * Initialize terminal session
   */
  const initializeSession = async () => {
    try {
      const session = await terminalService.startSession();
      if (session) {
        setSessionId(session.id);
        showInfoToast('Terminal session started');
      }
    } catch (error) {
      showErrorToast(
        error instanceof Error ? error.message : 'Failed to start terminal'
      );
    }
  };

  /**
   * Execute command
   */
  const executeCommand = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!command.trim()) {
      return;
    }

    setIsExecuting(true);

    try {
      // Execute command
      const result = await terminalService.sendTerminalCommand({
        command: command.trim(),
        sessionId: sessionId || undefined,
      });

      if (result) {
        // Add to history
        const newCommand: CommandHistory = {
          id: Date.now().toString(),
          command: command.trim(),
          output: result.output,
          exitCode: result.exitCode,
          timestamp: new Date(),
        };

        setHistory(prev => [...prev, newCommand]);

        // Show feedback if available
        if (result.feedback) {
          showInfoToast(result.feedback);
        }

        // Clear input
        setCommand('');
        commandInputRef.current?.focus();

        // Save to history
        await terminalService.addCommandToHistory(command.trim());
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Command execution failed';
      showErrorToast(errorMessage);

      // Add error to history
      const newCommand: CommandHistory = {
        id: Date.now().toString(),
        command: command.trim(),
        output: errorMessage,
        exitCode: 1,
        timestamp: new Date(),
      };

      setHistory(prev => [...prev, newCommand]);
    } finally {
      setIsExecuting(false);
    }
  };

  /**
   * Clear terminal
   */
  const clearTerminal = () => {
    setHistory([]);
  };

  /**
   * Get command suggestions
   */
  const getCommandSuggestions = async (partial: string) => {
    if (!partial) return;

    try {
      const suggestions = await terminalService.getCommandSuggestions(partial);
      if (suggestions.length > 0) {
        console.log('Suggestions:', suggestions);
      }
    } catch (error) {
      console.error('Error getting suggestions:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">
            Cyber Terminal
          </h1>
          <p className="text-gray-400">
            Interactive cybersecurity learning environment
          </p>
        </div>

        {/* Terminal Container */}
        <div className="bg-black rounded-lg border border-gray-700 overflow-hidden">
          {/* Terminal Header */}
          <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-gray-300 text-sm">
              {sessionId ? `Session: ${sessionId.slice(0, 8)}...` : 'Initializing...'}
            </span>
            <button
              onClick={clearTerminal}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded"
            >
              Clear
            </button>
          </div>

          {/* Terminal Output */}
          <div
            ref={outputRef}
            className="bg-black p-6 h-96 overflow-y-auto font-mono text-green-400 text-sm"
          >
            {history.length === 0 ? (
              <div className="text-gray-600">
                <p>Welcome to Cyber Terminal</p>
                <p className="mt-2">Type a command and press Enter to execute</p>
              </div>
            ) : (
              history.map(cmd => (
                <div key={cmd.id} className="mb-4">
                  {/* Command Prompt */}
                  <div className="flex gap-2">
                    <span className="text-blue-400">$</span>
                    <span className="text-green-400 flex-1">{cmd.command}</span>
                  </div>

                  {/* Output */}
                  {cmd.output && (
                    <div className="mt-1 ml-4 whitespace-pre-wrap text-gray-300">
                      {cmd.output}
                    </div>
                  )}

                  {/* Exit Code */}
                  {cmd.exitCode !== 0 && (
                    <div className="mt-1 ml-4 text-red-400 text-xs">
                      Exit code: {cmd.exitCode}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Terminal Input */}
          <div className="bg-black border-t border-gray-700 px-6 py-4">
            <form onSubmit={executeCommand} className="flex gap-2">
              <span className="text-green-400 font-mono">$</span>
              <input
                ref={commandInputRef}
                type="text"
                value={command}
                onChange={e => setCommand(e.target.value)}
                onBlur={() => {
                  if (command.length > 2) {
                    getCommandSuggestions(command);
                  }
                }}
                disabled={isExecuting}
                placeholder="Enter command..."
                className="flex-1 bg-transparent text-green-400 font-mono outline-none placeholder-gray-600"
              />
              <button
                type="submit"
                disabled={isExecuting || !command.trim()}
                className={`px-4 py-2 rounded font-medium transition ${
                  isExecuting || !command.trim()
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isExecuting ? 'Executing...' : 'Execute'}
              </button>
            </form>
          </div>
        </div>

        {/* Help Info */}
        <div className="mt-6 bg-gray-800/30 border border-gray-700 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">💡 Tips</h3>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>• Type partial commands to get suggestions</li>
            <li>• Your commands are saved to history</li>
            <li>• Get AI-powered feedback on commands</li>
            <li>• Use your session for learning challenges</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TerminalPageExample;
