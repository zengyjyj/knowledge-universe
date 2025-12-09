import Link from "next/link";

export default function Home() {
  return (
    <main style={styles.container}>
      <h1 style={styles.title}>知识宇宙</h1>

      <p style={styles.subtitle}>(产品说明)用结构，而不是碎片，重新理解世界</p>

      <div style={styles.buttons}>
        <Link href="/explore">
          <button style={styles.button}>随便看看</button>
        </Link>

        <Link href="/goal">
          <button style={styles.button}>我有明确目标</button>
        </Link>

        <Link href="/ask">
          <button style={styles.button}>我只想问一个问题</button>
        </Link>
      </div>
    </main>
  );
}

const styles = {
  container: {
    paddingTop: 120,
    textAlign: "center" as const,
    animation: "fadeIn 1.2s ease-out",
  },
  title: {
    fontSize: 42,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 48,
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: 16,
  },
  button: {
    padding: "12px 20px",
    borderRadius: 8,
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
    fontSize: 14,
  },
};
