"use client";

import { useSearchParams, useParams } from "next/navigation";
import { NODES, NodeKey } from "@/data/nodes/types";

export default function NodePage() {
  const params = useParams();
  const nodeId = params.nodeId as NodeKey;
  const node = NODES[nodeId];
  if (!node) {
    return <div>节点不存在</div>;
  }

  const searchParams = useSearchParams();
  const pathParam = searchParams.get("path") || "[]";
  const path: string[] = JSON.parse(pathParam);

  return (
    <div style={{ padding: 40 }}>
      {/* path of node*/}
      <div style={{ marginBottom: 20, color: "#666" }}>
        {path.map((p, i) => (
          <span key={i}>
            {p}
            {i < path.length - 1 ? " > " : ""}
          </span>
        ))}
      </div>

      <h2>{node.title}</h2>
      <p>{node.description}</p>
    </div>
  );
}
