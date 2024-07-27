import axios from 'axios';
import fetcher from '../utils/cacher';
import { useEffect, useState } from "react";
import '../App.css';
// components
import TableComponent from "./TableComponent";
import TrendingTable from "./TrendingTable";
import PageNavigation from "./PageNavigation";
import SearchBar from './SearchBar';
import Stack from "@mui/material/Stack";
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';


const url =
  "https://jlxkrysich.execute-api.eu-north-1.amazonaws.com/prod/data";
const searchUrl =
  "https://jlxkrysich.execute-api.eu-north-1.amazonaws.com/prod/search";

const MainComponent = () => {
  const [data, setData] = useState([]);
  const [aff, setAff] = useState([]);
  const [trendingData, setTrendingData] = useState([]);
  const [pageNumber, setPageNumber] = useState([1]);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("xl"));

  /**
   * returns true if successful, otherwise false
   */
  const fetchData = async (page) => {
    const response = await fetcher(url+"/?page="+page);
    if (!response) return false;
    const parsedData = response.data.map(
      item => JSON.parse(item));
    const sortedData = parsedData.sort(
      (a,b)=> b?.playercount - a?.playercount);
    setData(sortedData);
    return true;
  };

  /**
   * returns true if successful, otherwise false
   */
  const fetchTrending = async () => {
    const response = await fetcher(url+"/?trending=1");
    if (!response) return false;
    const parsedData = JSON.parse(response.data);
    setTrendingData(parsedData);
    return true;
  };

  /**
   * returns true if successful, otherwise false
   */
  const fetchbySearchQuery = async (query) => {
    const response = await fetcher(searchUrl+"/?query="+query);
    if (!response) return false;
    const parsedData = response.map(item => JSON.parse(item));
    const removedDuplicates = [...new Map(parsedData.map(game =>
      [game.gameid, game])).values()];
    setData(removedDuplicates);
    return true;
  };

  useEffect(() => {
    fetchData(pageNumber);
    fetchTrending();
  }, []);

  const changePage = async (param) => {
    setButtonsDisabled(true);
    let newPageNumber = parseInt(pageNumber) + param;
    newPageNumber = newPageNumber > 0 ? newPageNumber : 1;
    if (newPageNumber == pageNumber) { 
      setButtonsDisabled(false);
      return;
    }
    let isSuccesful = await fetchData(newPageNumber);
    if (isSuccesful) { setPageNumber(newPageNumber); }
    setButtonsDisabled(false);
  }

  return (
    <main className='App-main'
    style={matches ? { overflowY: "hidden" } : {}}>
      <Stack direction={matches ? "column" : "row"} spacing={5}
      padding={5}>
        <Stack spacing={1} alignItems="flex-end">
          <SearchBar executeSearch={fetchbySearchQuery}/>
          <TableComponent data={data} pageNumber={pageNumber}/>
          <PageNavigation changePage={changePage} 
            buttonsDisabled={buttonsDisabled} pageNumber={pageNumber}/>
        </Stack>
        <Stack>
          {matches ? "" : <div style={{ height: "65px"}} />}
          <TrendingTable data={trendingData} aff={aff}/>
        </Stack>
      </Stack>
    </main>
  );
};
export default MainComponent;