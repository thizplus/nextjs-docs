"use client";

import React from "react";
import { ExternalLink } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Simple Markdown renderer that supports:
 * - Bold: **text** or __text__
 * - Italic: *text* or _text_
 * - Links: [text](url) or plain URLs
 * - Images: ![alt](url)
 * - Line breaks
 * - Lists: - item or * item or 1. item
 * - Headers: # ## ###
 */
export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const renderContent = (text: string): React.ReactNode[] => {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];

    lines.forEach((line, lineIndex) => {
      // Headers
      if (line.startsWith("### ")) {
        elements.push(
          <h4 key={lineIndex} className="font-semibold text-base mt-3 mb-1">
            {renderInline(line.slice(4))}
          </h4>
        );
        return;
      }
      if (line.startsWith("## ")) {
        elements.push(
          <h3 key={lineIndex} className="font-semibold text-lg mt-3 mb-1">
            {renderInline(line.slice(3))}
          </h3>
        );
        return;
      }
      if (line.startsWith("# ")) {
        elements.push(
          <h2 key={lineIndex} className="font-bold text-xl mt-3 mb-2">
            {renderInline(line.slice(2))}
          </h2>
        );
        return;
      }

      // List items
      const unorderedMatch = line.match(/^(\s*)([-*])\s+(.*)$/);
      if (unorderedMatch) {
        const indent = unorderedMatch[1].length;
        elements.push(
          <div key={lineIndex} className="flex gap-2" style={{ paddingLeft: `${indent * 8}px` }}>
            <span className="text-muted-foreground">•</span>
            <span>{renderInline(unorderedMatch[3])}</span>
          </div>
        );
        return;
      }

      const orderedMatch = line.match(/^(\s*)(\d+)\.\s+(.*)$/);
      if (orderedMatch) {
        const indent = orderedMatch[1].length;
        elements.push(
          <div key={lineIndex} className="flex gap-2" style={{ paddingLeft: `${indent * 8}px` }}>
            <span className="text-muted-foreground min-w-[1.5em]">{orderedMatch[2]}.</span>
            <span>{renderInline(orderedMatch[3])}</span>
          </div>
        );
        return;
      }

      // Empty line
      if (line.trim() === "") {
        elements.push(<div key={lineIndex} className="h-2" />);
        return;
      }

      // Regular paragraph
      elements.push(
        <p key={lineIndex} className="leading-relaxed">
          {renderInline(line)}
        </p>
      );
    });

    return elements;
  };

  const renderInline = (text: string): React.ReactNode[] => {
    const elements: React.ReactNode[] = [];
    let remaining = text;
    let keyIndex = 0;

    while (remaining.length > 0) {
      // Image: ![alt](url)
      const imageMatch = remaining.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
      if (imageMatch) {
        elements.push(
          <img
            key={keyIndex++}
            src={imageMatch[2]}
            alt={imageMatch[1]}
            className="max-w-full h-auto rounded-lg my-2"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        );
        remaining = remaining.slice(imageMatch[0].length);
        continue;
      }

      // Link: [text](url)
      const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        elements.push(
          <a
            key={keyIndex++}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline break-all"
          >
            {linkMatch[1]}
            <ExternalLink className="h-3 w-3 flex-shrink-0" />
          </a>
        );
        remaining = remaining.slice(linkMatch[0].length);
        continue;
      }

      // Plain URL (http:// or https://)
      const urlMatch = remaining.match(/^(https?:\/\/[^\s<>"\]]+)/);
      if (urlMatch) {
        // Truncate long URLs for display
        const displayUrl = urlMatch[1].length > 40
          ? urlMatch[1].slice(0, 40) + "..."
          : urlMatch[1];
        elements.push(
          <a
            key={keyIndex++}
            href={urlMatch[1]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline break-all"
            title={urlMatch[1]}
          >
            {displayUrl}
            <ExternalLink className="h-3 w-3 flex-shrink-0" />
          </a>
        );
        remaining = remaining.slice(urlMatch[0].length);
        continue;
      }

      // Bold: **text** or __text__
      const boldMatch = remaining.match(/^(\*\*|__)([^*_]+)(\*\*|__)/);
      if (boldMatch) {
        elements.push(
          <strong key={keyIndex++} className="font-semibold">
            {boldMatch[2]}
          </strong>
        );
        remaining = remaining.slice(boldMatch[0].length);
        continue;
      }

      // Italic: *text* or _text_ (but not inside words)
      const italicMatch = remaining.match(/^(\*|_)([^*_]+)(\*|_)/);
      if (italicMatch) {
        elements.push(
          <em key={keyIndex++} className="italic">
            {italicMatch[2]}
          </em>
        );
        remaining = remaining.slice(italicMatch[0].length);
        continue;
      }

      // Code: `text`
      const codeMatch = remaining.match(/^`([^`]+)`/);
      if (codeMatch) {
        elements.push(
          <code
            key={keyIndex++}
            className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
          >
            {codeMatch[1]}
          </code>
        );
        remaining = remaining.slice(codeMatch[0].length);
        continue;
      }

      // Regular text - find next special character
      const nextSpecial = remaining.search(/[*_`\[!]|https?:\/\//);
      if (nextSpecial === -1) {
        // No more special characters
        elements.push(<span key={keyIndex++}>{remaining}</span>);
        break;
      } else if (nextSpecial === 0) {
        // Special character at start but didn't match - treat as regular text
        elements.push(<span key={keyIndex++}>{remaining[0]}</span>);
        remaining = remaining.slice(1);
      } else {
        // Regular text until next special character
        elements.push(<span key={keyIndex++}>{remaining.slice(0, nextSpecial)}</span>);
        remaining = remaining.slice(nextSpecial);
      }
    }

    return elements;
  };

  return (
    <div className={`space-y-1 break-words ${className}`}>
      {renderContent(content)}
    </div>
  );
}
