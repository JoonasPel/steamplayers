import Button from '@mui/material/Button';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Stack from "@mui/material/Stack"
import {createTheme} from "@mui/material/styles";
import { ThemeProvider } from '@emotion/react';

const theme = createTheme({
  palette: {
    primary: {
      main: "#e8a3ff",
    },
  },
})

const PageNavigation = ({changePage, buttonsDisabled, pageNumber}) => {
  return (
    <div style={{ display: 'flex' }}>
      
      <ThemeProvider theme={theme}>

        <Stack direction="row" spacing={1}>

          <Button variant="inlined" startIcon={<ArrowBackIosIcon />}
            onClick={()=>changePage(-1)}
            disabled={buttonsDisabled || pageNumber==1}
          >EARLIER PAGE</Button>

          <Button variant="inlined" endIcon={<ArrowForwardIosIcon />}
            onClick={()=>changePage(1)} disabled={buttonsDisabled}
            id='nextpagebtn'
          >NEXT PAGE</Button>

        </Stack>

      </ThemeProvider>

    </div>
  )
};
export default PageNavigation;
