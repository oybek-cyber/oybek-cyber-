/**
 * AI Terminal utilities for processing user queries
 */

interface CommandSuggestion {
  command: string
  description: string
  example: string
}

/**
 * Get command suggestions based on user input
 */
export const getCommandSuggestions = (query: string): CommandSuggestion[] => {
  const suggestions: Record<string, CommandSuggestion[]> = {
    bash: [
      {
        command: 'find',
        description: 'Search for files in a directory hierarchy',
        example: 'find / -name "file.txt" -type f 2>/dev/null',
      },
      {
        command: 'grep',
        description: 'Search text using patterns',
        example: 'grep -r "pattern" /path/to/search',
      },
      {
        command: 'awk',
        description: 'Pattern scanning and processing language',
        example: 'awk \'{print $1, $2}\' file.txt',
      },
      {
        command: 'sed',
        description: 'Stream editor for filtering and transforming text',
        example: 'sed -i \'s/old/new/g\' file.txt',
      },
    ],
    powershell: [
      {
        command: 'Get-ChildItem',
        description: 'List directory contents',
        example: 'Get-ChildItem -Path C:\\ -Recurse',
      },
      {
        command: 'Get-Process',
        description: 'Get running processes',
        example: 'Get-Process | Where-Object {$_.CPU -gt 100}',
      },
      {
        command: 'Invoke-WebRequest',
        description: 'Send HTTP request',
        example: 'Invoke-WebRequest -Uri "https://api.example.com"',
      },
    ],
    python: [
      {
        command: 'requests',
        description: 'HTTP library for Python',
        example: 'import requests; response = requests.get("https://api.example.com")',
      },
      {
        command: 'subprocess',
        description: 'Execute system commands from Python',
        example: 'import subprocess; result = subprocess.run(["ls", "-la"])',
      },
    ],
  }

  const lowerQuery = query.toLowerCase()
  
  for (const [category, cmds] of Object.entries(suggestions)) {
    if (lowerQuery.includes(category)) {
      return cmds
    }
  }

  return []
}

/**
 * Determine command category from user input
 */
export const detectCommandCategory = (query: string): string => {
  const lowerQuery = query.toLowerCase()
  
  if (
    lowerQuery.includes('bash') ||
    lowerQuery.includes('sh ') ||
    lowerQuery.includes('linux') ||
    lowerQuery.includes('grep') ||
    lowerQuery.includes('find') ||
    lowerQuery.includes('sed')
  ) {
    return 'bash'
  }
  
  if (
    lowerQuery.includes('powershell') ||
    lowerQuery.includes('get-') ||
    lowerQuery.includes('windows') ||
    lowerQuery.includes('.ps1')
  ) {
    return 'powershell'
  }
  
  if (
    lowerQuery.includes('python') ||
    lowerQuery.includes('.py') ||
    lowerQuery.includes('import')
  ) {
    return 'python'
  }
  
  return 'general'
}

/**
 * Format terminal output with syntax highlighting hints
 */
export const formatTerminalOutput = (output: string): string => {
  // Add syntax highlighting hints for terminal output
  return output
    .replace(/ERROR:/gi, '\x1b[31mERROR\x1b[0m:') // Red for errors
    .replace(/WARNING:/gi, '\x1b[33mWARNING\x1b[0m:') // Yellow for warnings
    .replace(/SUCCESS:/gi, '\x1b[32mSUCCESS\x1b[0m:') // Green for success
}

/**
 * Security check for potentially dangerous commands
 */
export const hasSecurityRisk = (command: string): boolean => {
  const dangerousPatterns = [
    /rm\s+-rf\s+\//i,
    /:\(\)\s*{\s*:\|:\s*&\s*};\s*:/i, // Forkbomb
    /dd\s+if=\/dev\/zero\s+of=/i,
    /mkfs\./i,
  ]

  return dangerousPatterns.some((pattern) => pattern.test(command))
}

/**
 * Generate security warning for command
 */
export const getSecurityWarning = (command: string): string | null => {
  if (command.includes('rm -rf /')) {
    return 'WARNING: This command will PERMANENTLY DELETE your entire system. Are you sure?'
  }
  
  if (command.includes('sudo') && command.includes('chmod 777')) {
    return 'WARNING: Setting 777 permissions is a security risk. Use more restrictive permissions.'
  }
  
  if (command.includes('eval') || command.includes('exec')) {
    return 'WARNING: Using eval/exec can be a security risk. Ensure input is properly validated.'
  }

  return null
}
