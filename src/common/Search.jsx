/* eslint-disable react/prop-types */
import { CiSearch } from "react-icons/ci";

function Search({ query, setQuery }) {
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div
      className={`relative flex-1 text-base text-[#B2B9C7] bg-[#04131F] rounded-xl px-3 py-[13px]`}
    >
      <CiSearch className="absolute text-[24px] top-1/2 right-2 -translate-y-1/2 text-[#8E8E93]" />

      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="message id, tx hash, origin, chain id, client..."
        className={`border-none flex w-full rounded-md text-base bg-[#04131F] text-white outline-none placeholder:text-[#B2B9C7]`}
      />
    </div>
  );
}

export default Search;
