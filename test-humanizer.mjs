import { humanizer } from "./shared/humanizer.js";
const cases = [
  ["Administered", "The drug was administered to 40 patients. The vaccine was administered by nurses."],
  ["Allowed", "Users are allowed to edit the file. The system was allowed to restart."],
  ["Rather", "We chose tea rather than coffee. The results were rather surprising."],
  ["Range", "We collected a wide range of information. There are a wide range of options."],
  ["Significant", "This is the most significant change. It is highly significant."],
  ["Cutting", "The app uses cutting-edge technology and state-of-the-art design."],
  ["Quarterly", "The quarterly report was published. We meet quarterly."],
  ["Elderly", "The program supports the elderly and adolescents."],
  ["Facilitate", "The tool facilitates collaboration and facilitates the process."],
  ["Role", "AI plays a key role in modern society."],
  ["Magnitude", "Performance improved by orders of magnitude."],
  ["However", "However, remote work also presents challenges."],
  ["And", "It enables people to connect. And it allows teams to collaborate."]
];
for (const [n, t] of cases) {
  console.log(n.padEnd(12), "->", humanizer.humanize(t, "medium"));
}
