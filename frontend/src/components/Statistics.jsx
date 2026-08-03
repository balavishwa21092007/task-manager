function Statistics({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;

  return (
    <div className="statistics">
      <div className="stat-card">
        <h3>Total Tasks</h3>
        <p>{total}</p>
      </div>

      <div className="stat-card">
        <h3>Completed</h3>
        <p>{completed}</p>
      </div>

      <div className="stat-card">
        <h3>Pending</h3>
        <p>{pending}</p>
      </div>
    </div>
  );
}

export default Statistics;

