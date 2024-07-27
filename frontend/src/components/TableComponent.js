import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';


// return number with thousand separators. 1000000=>1.000.000
function numberWithSeparators(number) {
  if (number == null) return 0;
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableCellGame = styled(TableCell)(({ theme }) => ({
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

const TableComponent = ({ data, pageNumber }) => {
  return (
    <Box sx={{ boxShadow: 20 }}>
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
              <StyledTableCell style={{ width: '500px', fontSize: '25px', fontWeight: 'bold' }}
              >Game</StyledTableCell>
              <StyledTableCell style={{ width: '100px', fontSize: '22px', fontWeight: 'bold' }}
                align='right'>Current</StyledTableCell>
              <StyledTableCell style={{ width: '160px', fontSize: '22px', fontWeight: 'bold' }}
                align='right'>Daily High</StyledTableCell>
              <StyledTableCell style={{ width: '170px', fontSize: '22px', fontWeight: 'bold' }}
                align='right'>Daily Low</StyledTableCell>
            </StyledTableRow>
          </TableHead>

          <TableBody>
            {data?.length !== 0 && data.map((item, index) => (
              <StyledTableRow
                key={item.gameid}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <StyledTableCellGame component='th' scope='row'
                  style={{ fontSize: '18px' }}>
                  {data?.length === 10 ? (((pageNumber - 1) * 10) + index + 1) + '. ' : ""}
                  {item.gamename}
                </StyledTableCellGame>

                <StyledTableCell style={{ fontSize: '17px' }}
                  align='right'>
                  {numberWithSeparators(item?.playercount)}
                </StyledTableCell>

                <StyledTableCell style={{ fontSize: '17px' }}
                  align='right'>
                  {numberWithSeparators(item?.peak)}
                </StyledTableCell>

                <StyledTableCell style={{ fontSize: '17px' }}
                  align='right'>
                  {numberWithSeparators(item?.bottom)}
                </StyledTableCell>

              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
};

export default TableComponent;