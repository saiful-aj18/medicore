import { ChevronRight } from "lucide-react";
import { aiInsights } from "../data/dashboard";

export default function AIAssistant() {
  return (
    <section className="card span-4">
      <div className="card-head">
        <h2>AI hospital assistant</h2>
      </div>
      <h3 style={{ fontSize: "13.5px", margin: "10px 0 0" }}>Today&apos;s Insights</h3>
      <ul className="ai-insights">
        {aiInsights.map((insight) => (
          <li key={insight}>{insight}</li>
        ))}
      </ul>
      <button type="button" className="btn-insights">
        View All Insights
        <ChevronRight size={16} />
      </button>
    </section>
  );
}
