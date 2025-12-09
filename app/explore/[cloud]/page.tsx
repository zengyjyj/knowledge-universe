"use client"; // Client Component，支持 useState
import { useState } from "react";
import { TREES } from "@/data/cloudsTree/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { TreeNode } from "@/data/cloudsTree/types";

//五个云的结构树目录
export default function CloudPage() {
  const params = useParams();
  const cloudKey = params.cloud;
  const tree = TREES[cloudKey as keyof typeof TREES];

  if (!tree) {
    return <div>云未找到</div>;
  } else {
    console.log("!!!!!!!!cloudKey from URL:", cloudKey);
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>{tree.title}</h2>

      <Tree node={tree} />
    </div>
  );
}

//可折叠展开的目录：
type Props = {
  node: TreeNode;
  path?: string[]; // 记录当前节点的路径
  level?: number;
};

function Tree({ node, path = [], level = 0 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const currentPath = [...path, node.title];

  return (
    <div style={{ marginLeft: level * 16, marginTop: 8 }}>
      <div
        style={{ cursor: hasChildren ? "pointer" : "default" }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren ? (expanded ? "▼ " : "▶ ") : "• "}
        {hasChildren ? (
          node.title
        ) : (
          // 跳转节点内容页
          <Link
            href={{
              pathname: `/node/${node.id}`,
              query: { path: JSON.stringify(currentPath) },
            }}
          >
            {node.title}
          </Link>
        )}
      </div>

      {expanded &&
        node.children?.map((child) => (
          <Tree
            key={child.id}
            node={child}
            path={currentPath}
            level={level + 1}
          />
        ))}
    </div>
  );
}
