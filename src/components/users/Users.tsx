
import { useEffect, useState } from 'react';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, TablePagination, CircularProgress } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { User } from '../../interfaces/User.interface';
import { Link } from 'react-router-dom';
import { getUsers } from '../../services/ServiceHandler';
import './Users.css'

const useStyles = makeStyles({
  nameColumn: {
    width: '40%',
  },
  emailColumn: {
    width: '40%',
  },
});

interface IndexedUser extends User {
  [key: string]: any;
}

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(4);
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const classes = useStyles();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response?.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error fetching users. Please try again.');
      setLoading(false);
    }
  };

  const handleSort = (property: string) => {
    const isAsc = sortBy === property && sortOrder === 'asc';
    setSortBy(property);
    setSortOrder(isAsc ? 'desc' : 'asc');
  };

  const sortedUsers = users?.sort((a:IndexedUser, b:IndexedUser) => {
    const aValue = a[sortBy].toLowerCase();
    const bValue = b[sortBy].toLowerCase();

    if (aValue < bValue) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderTableHeader = () => {
    return (
      <TableHead>
        <TableRow>
          <TableCell className="table-cell-col" onClick={() => handleSort('name')}>
            Name {sortBy === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
          </TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Address</TableCell>
        </TableRow>
      </TableHead>
    );
  };

  const renderTableContent = () => {
    return (
      <TableBody>
        {slicedUsers.length ? (
          slicedUsers.map((user: User) => (
            <TableRow key={user.id}>
              <TableCell className={classes.nameColumn}>
                <Link to={`/users/${user.id}/posts`}>{user.name}</Link>
              </TableCell>
              <TableCell className={classes.emailColumn}>{user.email}</TableCell>
              <TableCell><p className='address-wrapper'>{`${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}`}</p></TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3}>{loading ? <CircularProgress /> : 'No users found.'}</TableCell>
          </TableRow>
        )}
      </TableBody>
    );
  };

  const renderUsersTable = () => {
    return (
      <TableContainer component={Paper}>
        <Table>
          {renderTableHeader()}
          {renderTableContent()}
        </Table>
      </TableContainer>
    );
  };

  const renderTablePaginationInfo = () => {
    return (
      <TablePagination
        rowsPerPageOptions={[4, 8, 12]}
        component="div"
        count={sortedUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    );
  };

  const slicedUsers = sortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div>
      {error ? (
        <div>{error}</div>
      ) : (
        <>
          {renderUsersTable()}
          {renderTablePaginationInfo()}
        </>
      )}
    </div>
  );
};

export default UserTable;
