import React from 'react'

const Filter = ({ filters, onFilterChange, onSortChange, onSearchChange }) => {
    const handleFilterChange = (filterName, e) => {
        onFilterChange(filterName, e.target.value);
    };
    
    const handleSearchChange = (e) => {
        onSearchChange(e.target.value);
    };
    
    const handleSortChange = (e) => {
        onSortChange(e.target.value);
    };
    
  return (
    <div className="flex flex-col gap-4 mb-4 p-4 bg-white-100 shadow-xl rounded-md h-screen text-gray-500">
    <label className="text-lg font-semibold text-black">Filter Events</label>
    <div className="flex flex-col gap-4">
      <label className="text-bold-sm text-black">Location</label>
      <input
        type="text"
        placeholder="e.g., Mumbai"
        value={filters.location}
        onChange={(e) => handleFilterChange('location', e)}
        className="border p-2 rounded-md"
      />
    </div>
    <div className="flex flex-col gap-4">
      <label className="text-bold-sm text-black">Category</label>
      <select
        value={filters.category}
        onChange={(e) => handleFilterChange('category', e)}
        className="border p-2 rounded-md "
      >
       <option value="" disabled>Select a category</option>
        <option value="event">Event</option>
        <option value="workshop">Workshop</option>
        <option value="conference">Conference</option>
      </select>
    </div>
    <div className="flex flex-col gap-4 ">
      <label className="text-bold-sm text-black">Keyword Search</label>
      <input
        type="text"
        placeholder="Enter keywords"
        value={filters.keyWordSearch}
        onChange={handleSearchChange}
        className="border p-2 rounded-md"
      />
    </div>
    <div className="flex flex-col gap-4">
      <label className="text-bold-sm text-black">Sort By</label>
      <select 
        value={filters.sort}
        onChange={handleSortChange}
        className="border p-2 rounded-md "
      >
        <option value="" >Sort by</option>
        <option value="oldest">Oldest</option>
        <option value="newest">Newest</option>
      </select>
    </div>
  </div>
  )
}

export default Filter;