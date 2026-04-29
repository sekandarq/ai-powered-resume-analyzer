const usageRows = [
  {
    scenario: "Short resume + short JD",
    cost: "~$0.015-$0.020",
    analyses: "~12-16",
  },
  {
    scenario: "Typical resume + normal JD",
    cost: "~$0.020-$0.030",
    analyses: "~8-12",
  },
  {
    scenario: "Long resume + long JD",
    cost: "~$0.035-$0.050",
    analyses: "~5-7",
  },
];

const UsageCostTable = ({ className = "" }: { className?: string }) => (
  <div className={`usage-cost-table ${className}`}>
    <div className="usage-cost-row usage-cost-head">
      <span>Scenario</span>
      <span>Estimated cost</span>
      <span>Analyses from $0.25</span>
    </div>
    {usageRows.map((row) => (
      <div className="usage-cost-row" key={row.scenario}>
        <span>{row.scenario}</span>
        <span>{row.cost}</span>
        <span>{row.analyses}</span>
      </div>
    ))}
  </div>
);

export default UsageCostTable;
