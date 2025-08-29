import { IssueNodeType } from "../zodSchema/issueTreeSchema";

export interface SimpleFormatNode {
  title: string;
  note?: string;
  children: SimpleFormatNode[];
}

/**
 * Markdownライクな階層テキストをパースしてSimpleFormatNodeに変換
 */
export function parseSimpleFormat(text: string): SimpleFormatNode | null {
  const lines = text.split('\n');
  if (lines.length === 0) return null;

  const rootStack: Array<{ node: SimpleFormatNode; level: number }> = [];
  let pendingNoteFor: SimpleFormatNode | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 空行をスキップ
    if (line.trim() === '') {
      continue;
    }

    // ノートライン（>で始まる）を処理
    if (line.trim().startsWith('>')) {
      const noteContent = line.trim().substring(1).trim();
      if (pendingNoteFor) {
        pendingNoteFor.note = pendingNoteFor.note 
          ? pendingNoteFor.note + '\n' + noteContent
          : noteContent;
      }
      continue;
    }

    // ヘッダーライン（#で始まる）を処理
    const headerMatch = line.match(/^(#+)\s+(.+)$/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      const title = headerMatch[2].trim();
      
      const newNode: SimpleFormatNode = {
        title,
        children: []
      };

      // 前のノートを適用
      pendingNoteFor = newNode;

      // ルートレベル（レベル1）の場合
      if (level === 1) {
        if (rootStack.length === 0) {
          rootStack.push({ node: newNode, level });
          continue;
        } else {
          // 2つ目以降のルートレベルは無視（1つのルートのみ）
          continue;
        }
      }

      // 適切な親を見つける
      while (rootStack.length > 0 && rootStack[rootStack.length - 1].level >= level) {
        rootStack.pop();
      }

      if (rootStack.length > 0) {
        const parent = rootStack[rootStack.length - 1];
        parent.node.children.push(newNode);
        rootStack.push({ node: newNode, level });
      }
    }
  }

  return rootStack.length > 0 ? rootStack[0].node : null;
}

/**
 * SimpleFormatNodeをIssueNodeTypeに変換（IDを自動生成）
 */
export function convertToIssueNode(simpleNode: SimpleFormatNode): IssueNodeType {
  return {
    id: crypto.randomUUID(),
    title: simpleNode.title,
    note: simpleNode.note || '',
    isResolved: false,
    isCollapsed: false,
    children: simpleNode.children.map(convertToIssueNode)
  };
}

/**
 * IssueNodeTypeをシンプルフォーマットテキストに変換
 */
export function convertToSimpleFormat(issueNode: IssueNodeType, level: number = 1): string {
  const headerPrefix = '#'.repeat(level);
  let result = `${headerPrefix} ${issueNode.title}\n`;
  
  if (issueNode.note && issueNode.note.trim()) {
    const noteLines = issueNode.note.split('\n');
    for (const noteLine of noteLines) {
      result += `> ${noteLine}\n`;
    }
  }
  
  result += '\n';
  
  for (const child of issueNode.children) {
    result += convertToSimpleFormat(child, level + 1);
  }
  
  return result;
}