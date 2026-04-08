import OpenAI from 'openai';
import { env } from '@config/env.js';
import logger from '@config/logger.js';

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const CYBER_MENTOR_SYSTEM_PROMPT = `You are a Senior Security Mentor and Cybersecurity Expert AI Assistant.

Your primary responsibilities:
1. Provide expert guidance on cybersecurity topics, ethical hacking, and network security
2. Help students understand complex security concepts and tools (Nmap, Metasploit, etc.)
3. Explain bash/PowerShell commands in security context
4. Provide educational resources and best practices
5. Guide students through cybersecurity labs and challenges

CRITICAL SAFETY RULES:
- NEVER provide actual malware code, exploit code, or step-by-step instructions for attacking systems
- NEVER help with illegal hacking activities or unauthorized access
- NEVER provide credentials, API keys, or sensitive authentication methods
- NEVER bypass security controls or create backdoors
- REJECT requests that could cause harm

ALLOWED TOPICS:
✓ Explaining security concepts and theories
✓ Teaching about defense mechanisms
✓ Lab environment exploitations (controlled, educational settings)
✓ Reviewing code for security vulnerabilities
✓ Network analysis and packet inspection
✓ Secure coding practices
✓ Compliance and standards (NIST, CIS, etc.)

TEACHING APPROACH:
- Ask clarifying questions about the student's learning goal
- Provide context and explain "why" not just "how"
- Suggest legitimate security tools and resources
- Encourage hands-on practice in safe environments
- Connect concepts to real-world applications

If a request is suspicious or potentially harmful:
1. Refuse politely but firmly
2. Explain why it's inappropriate
3. Offer an alternative educational path`;

export interface TerminalMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class TerminalService {
  static async chat(
    messages: TerminalMessage[],
    context?: {
      course?: string;
      lesson?: string;
      topic?: string;
      level?: string;
    }
  ): Promise<{ message: string; tokensUsed: number }> {
    try {
      const systemPrompt = this.buildSystemPrompt(context);

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map((m) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          })),
        ],
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 0.9,
      });

      const assistantMessage = response.choices[0]?.message?.content || '';
      const tokensUsed = response.usage?.total_tokens || 0;

      logger.info('Terminal chat response', {
        tokensUsed,
        messageLength: assistantMessage.length,
      });

      return {
        message: assistantMessage,
        tokensUsed,
      };
    } catch (error) {
      logger.error('OpenAI API error:', error);
      throw new Error('Failed to process terminal request');
    }
  }

  private static buildSystemPrompt(context?: any): string {
    let prompt = CYBER_MENTOR_SYSTEM_PROMPT;

    if (context?.course) {
      prompt += `\n\nCurrent Course: ${context.course}`;
    }

    if (context?.lesson) {
      prompt += `\nCurrent Lesson: ${context.lesson}`;
    }

    if (context?.topic) {
      prompt += `\nTopic: ${context.topic}`;
    }

    if (context?.level) {
      prompt += `\nStudent Level: ${context.level}`;
    }

    return prompt;
  }

  static async validatePrompt(message: string): Promise<boolean> {
    const dangerousKeywords = [
      'create malware',
      'denial of service',
      'ddos',
      'ransomware',
      'trojan',
      'backdoor',
      'keylogger',
      'exploit',
      'crack',
      'bypass',
      'hack',
      'unauthorized access',
    ];

    const lowerMessage = message.toLowerCase();
    return !dangerousKeywords.some((keyword) => lowerMessage.includes(keyword));
  }
}
