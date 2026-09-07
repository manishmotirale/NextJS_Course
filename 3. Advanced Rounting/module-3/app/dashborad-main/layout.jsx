import Link from "next/link";

export default function DashboardMainLayout({ tab1, tab2, stats, feed }) {
  return (
    <div>
      <nav style={{ marginBottom: "10px" }}>
        <Link href="/dashborad-main/tab1">Tab 1</Link> | {""}
        <Link href="/dashborad-main/tab2">Tab 2</Link> | {""}
        <Link href="/dashborad-main/stats">Stats</Link> | {""}
        <Link href="/dashborad-main/feed">Feed</Link> | {""}
      </nav>

      <div>{tab1}</div>
      <div>{tab2}</div>
      <div>{stats}</div>
      <div>{feed}</div>
    </div>
  );
}
