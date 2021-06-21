import React,{useEffect, useState} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: 1,
    textAlign: 'center',
    color: 'white',
  },  
});

function Pairs() {
    const classes = useStyles();

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [rows, setRows] = useState([]);    

    useEffect(() => {
        fetch("http://localhost:8080/rest/pairs",{
            headers: new Headers({
                'Authorization': 'Bearer 12345678'
              })
            })
          .then(res => res.json())
          .then(
            (result) => {
              setIsLoaded(true);
              setRows(result);
            },
            (error) => {
              setIsLoaded(true);
              setError(error);
            }
          )
      }, [])    

    if (error) {
        return <div>Error: {error.message}</div>;
      } else if (!isLoaded) {
        return <div>Loading...</div>;
      } else {
        return (
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Paper className={classes.paper}>
                            <TableContainer component={Paper}>
                                <Table className={classes.table} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell align="right">Name</TableCell>
                                            <TableCell align="right">Status</TableCell>
                                            <TableCell align="right">MinSL</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row) => (
                                            <TableRow key={row.id}>
                                                <TableCell component="th" scope="row">{row.id}</TableCell>
                                                <TableCell align="right">{row.name}</TableCell>
                                                <TableCell align="right">{row.status ? 'true' : 'false'}</TableCell>
                                                <TableCell align="right">{row.minsl}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
          );
      }   


}

export default Pairs