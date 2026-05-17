import { Injectable } from '@nestjs/common';

@Injectable()
export class TemplateService {
  render(template: string, context: Record<string, string | undefined>) {
    return template
      .replace(/{{name}}/g, context.name ?? 'there')
      .replace(/{{company}}/g, context.company ?? 'your team');
  }
}

