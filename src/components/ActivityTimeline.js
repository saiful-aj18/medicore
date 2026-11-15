import { activity } from "../data/dashboard";

export default function ActivityTimeline() {
  return (
    <section className="card span-4">
      <div className="card-head">
        <h2>Activity timeline</h2>
      </div>
      <ul className="timeline">
        {activity.map((item) => (
          <li key={item.text}>
            <span>
              {item.text}
              <time>{item.time}</time>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
