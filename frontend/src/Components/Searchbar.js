function SearchBar({
  search,
  setSearch,
  surpriseMe
}) {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search books..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <button onClick={surpriseMe}>
        Surprise Me
      </button>
    </div>
  );
}

export default SearchBar;