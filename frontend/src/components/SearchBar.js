import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import { useState } from 'react';

const SearchBar = ({executeSearch}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleTextChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleKeyUp = (event) => {
    if (event?.key === "Enter") {
      executeSearch(searchQuery);
    }
  };

  return (
    <>
      <TextField
        id="filled-search"
        label="Find Game"
        type="search"
        variant="filled"
        value={searchQuery}
        onChange={handleTextChange}
        onKeyUp={handleKeyUp}
      />
    </>
  )
};

export default SearchBar;