import { fetchNodeDrafts, fetchSubcategories } from "./actions";
import DraftsClient from "./DraftsClient";

export default async function DraftsPage() {
  const drafts = await fetchNodeDrafts();
  const subcategories = await fetchSubcategories();

  return <DraftsClient initialDrafts={drafts} subcategories={subcategories} />;
}
