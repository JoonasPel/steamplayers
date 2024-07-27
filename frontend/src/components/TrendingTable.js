import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link } from '@mui/material';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableCellGameName = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '300px',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const TrendingTable = ({data, aff}) => {
  const [salePercentages, setSalePercentages] = useState({});

  useEffect(() => {
    let tempSales = {};
    for (let gameAff of aff) {
      const id = gameAff?.gameid;
      if (!data.find(x => x.gameid == id)) { continue; }
      const sale = (gameAff.retailprice - gameAff.price) / (gameAff.retailprice );
      if (isFinite(sale)) { tempSales[id] = Math.floor(sale*100); }   
    }
    setSalePercentages(tempSales);
  }, [aff]);

  return (
    <Box sx={{boxShadow: 20}}>
      <TableContainer component={Paper}
        sx={{
          width: '100%',
          margin: '0 auto',
        }}
      >
        <Table sx={{ minWidth: 100 }}
          size="small" aria-label="a dense table"
        >
          <TableHead>
            <StyledTableRow>
              <StyledTableCell style={{ width: '300px', fontSize: '25px', fontWeight: 'bold' }}
                >Trending Today</StyledTableCell>
              <StyledTableCell style={{ width: '190px', fontSize: '22px', fontWeight: 'bold' }}
                align='right'>{"Growth \u{1F4C8}"}</StyledTableCell>
            </StyledTableRow>
          </TableHead>

          <TableBody>
            {data && data.map((item) => (
              <StyledTableRow 
                key={item.gameid}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <StyledTableCellGameName style={{ fontSize: '17px'}}
                  component='th' scope='row'>
                  {item.gamename}
                </StyledTableCellGameName>

                <StyledTableCell style={{color: "green", fontSize: '18px'}}
                  align='right'>
                  {Math.round(item?.increase*100)}%
                </StyledTableCell>

              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
};

export default TrendingTable;