import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Clock, Info } from 'lucide-react';

interface MessageContentProps {
  content: string;
}

const FormattedAIResponse: React.FC<MessageContentProps> = ({ content }) => {
  const isMealPlan = content.includes("Breakfast") && content.includes("Lunch") && content.includes("Dinner");
  
  const renderers = {
    // Handle paragraphs
    p: (props: { children?: React.ReactNode }) => {
      const { children } = props;
      if (typeof children === 'string' && !children.startsWith('**')) {
        return <p className="text-sm text-zinc-300 ml-6 mb-4">{children}</p>;
      }
      return <p className="text-zinc-200 mb-2">{children}</p>;
    },

    // Handle strong/bold text
    strong: (props: { children?: React.ReactNode }) => {
      const { children } = props;
      if (typeof children !== 'string') return <strong className="text-white">{children}</strong>;
      
      if (children.includes('AM') || children.includes('PM')) {
        const [title, time] = children.split('(');
        return (
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">{title.trim()}</h3>
            {time && (
              <div className="flex items-center text-zinc-400">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-sm">({time}</span>
              </div>
            )}
          </div>
        );
      }
      
      if (children.includes('Rationale')) {
        return (
          <div className="flex items-center gap-2 text-pink-400 mt-2">
            <Info className="w-4 h-4" />
            <span className="text-sm font-semibold">{children}</span>
          </div>
        );
      }
      
      if (children.includes('Plan') || children.startsWith('Step') || children.includes('Guidelines')) {
        return <h2 className="text-xl font-bold text-pink-400 border-b border-zinc-700 pb-2">{children}</h2>;
      }
      
      return <strong className="text-white">{children}</strong>;
    },

    // Handle unordered lists
    ul: (props: { children?: React.ReactNode }) => (
      <ul className="list-disc list-inside space-y-1 text-zinc-200 mb-2">
        {props.children}
      </ul>
    ),

    // Handle ordered lists
    ol: (props: { children?: React.ReactNode }) => (
      <ol className="list-decimal list-inside space-y-1 text-zinc-200 mb-2">
        {props.children}
      </ol>
    ),

    // Handle list items
    li: (props: { children?: React.ReactNode }) => (
      <li className="text-zinc-200">{props.children}</li>
    ),

    // Handle blockquotes
    blockquote: (props: { children?: React.ReactNode }) => (
      <blockquote className="border-l-4 border-pink-400 pl-4 my-2 text-zinc-300 italic">
        {props.children}
      </blockquote>
    ),

    // Handle inline code
    code: (props: { children?: React.ReactNode }) => (
      <code className="bg-zinc-700 px-1.5 py-0.5 rounded text-pink-400 text-sm">
        {props.children}
      </code>
    ),
  };

  return (
    <div className={`space-y-2 ${isMealPlan ? 'bg-zinc-800/50 rounded-lg p-4' : ''}`}>
      <ReactMarkdown components={renderers}>{content}</ReactMarkdown>
    </div>
  );
};

export default FormattedAIResponse;