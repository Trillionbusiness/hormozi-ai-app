import React from 'react';

interface MarkdownRendererProps {
  content: string;
  theme?: 'light' | 'dark';
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, theme = 'light' }) => {
  const textColors = {
    light: {
      h1: 'text-gray-900', h2: 'text-gray-900', h3: 'text-gray-800', p: 'text-gray-800', li: 'text-gray-700', quote: 'text-gray-600', hr: 'border-gray-300'
    },
    dark: {
      h1: 'text-white', h2: 'text-white', h3: 'text-gray-200', p: 'text-gray-200', li: 'text-gray-300', quote: 'text-gray-400', hr: 'border-gray-700'
    }
  };
  const colors = textColors[theme];

  const renderLine = (line: string) => {
    const html = line
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/~~(.*?)~~/g, '<del>$1</del>');
    return { __html: html };
  };

  const parseMarkdown = (markdown: string): React.ReactNode[] => {
    if (!markdown) return [];
    const elements: React.ReactNode[] = [];
    const lines = markdown.split('\n');
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      if (line.startsWith('### ')) {
        elements.push(<h3 key={i} className={`text-xl font-bold ${colors.h3} mt-6 mb-2`} dangerouslySetInnerHTML={renderLine(line.substring(4))} />);
        i++; continue;
      }
      if (line.startsWith('## ')) {
        elements.push(<h2 key={i} className={`text-2xl font-bold ${colors.h2} mt-8 mb-3 pb-1 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`} dangerouslySetInnerHTML={renderLine(line.substring(3))} />);
        i++; continue;
      }
      if (line.startsWith('# ')) {
        elements.push(<h1 key={i} className={`text-3xl font-black ${colors.h1} mt-10 mb-4 pb-2 border-b-2 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-400'}`} dangerouslySetInnerHTML={renderLine(line.substring(2))} />);
        i++; continue;
      }
      if (line.match(/^---*$/)) {
        elements.push(<hr key={i} className={`my-6 ${colors.hr}`} />);
        i++; continue;
      }
      
      const listMatch = line.match(/^(\s*)([*-]|\d+\.|•)\s(.*)/);
      if (listMatch) {
        const listType = listMatch[2].match(/\d+/) ? 'ol' : 'ul';
        const listItems = [];
        
        while (i < lines.length) {
            const currentLineMatch = lines[i].match(/^(\s*)(?:[*-]|\d+\.|•)\s(.*)/);
            if (currentLineMatch) {
                listItems.push(
                    <li key={i} className={`${colors.li} leading-relaxed mb-1`} dangerouslySetInnerHTML={renderLine(currentLineMatch[2])} />
                );
                i++;
            } else {
                break;
            }
        }

        const listElement = React.createElement(
          listType,
          { key: `list-${i}`, className: `space-y-1 my-4 pl-6 ${listType === 'ul' ? 'list-disc' : 'list-decimal'}` },
          listItems
        );
        elements.push(listElement);
        continue;
      }
      
      if (line.startsWith('> ')) {
          const quoteLines: string[] = [];
          while (i < lines.length && lines[i].startsWith('> ')) {
              quoteLines.push(lines[i].substring(2));
              i++;
          }
          elements.push(
              <blockquote key={`quote-${i}`} className={`border-l-4 ${theme === 'dark' ? 'border-gray-500' : 'border-gray-300'} pl-4 my-4 italic ${colors.quote}`}>
                  {quoteLines.map((qLine, qIndex) => <p key={qIndex} dangerouslySetInnerHTML={renderLine(qLine)} />)}
              </blockquote>
          );
          continue;
      }

      if (line.trim() !== '') {
        elements.push(<p key={i} className={`text-base ${colors.p} leading-relaxed my-2`} dangerouslySetInnerHTML={renderLine(line)} />);
      }

      i++;
    }
    return elements;
  }

  return <div>{parseMarkdown(content)}</div>;
};

export default MarkdownRenderer;