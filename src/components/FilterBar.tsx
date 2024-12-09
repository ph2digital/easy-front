
import React from 'react';

const FilterBar: React.FC = () => {
  return (
    <div className="filter-bar">
      <label>
        Period:
        <select>
          <option value="today">Today</option>
          <option value="this_week">This Week</option>
          <option value="this_month">This Month</option>
        </select>
      </label>
      <label>
        Platform:
        <select>
          <option value="all">All</option>
          <option value="web">Web</option>
          <option value="mobile">Mobile</option>
        </select>
      </label>
      <label>
        Status:
        <select>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </label>
    </div>
  );
};

export default FilterBar;