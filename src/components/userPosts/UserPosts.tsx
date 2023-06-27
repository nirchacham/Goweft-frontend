import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, TextField, TablePagination, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Post } from '../../interfaces/Post.interface';
import { getUserPosts, deleteUserPost } from '../../services/ServiceHandler';
import './UserPosts.css';

const useStyles = makeStyles({
  deleteColumn: {
    cursor: 'pointer',
  },
});

const UserPosts = () => {
  const { userId } = useParams();

  const [posts, setPosts] = useState<Post[]>([]);
  const [deletedPostIds, setDeletedPostIds] = useState<number[]>([]);
  const [data,setData] = useState<Map<number,Post>>(new Map());

  const [totalPosts, setTotalPosts] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const classes = useStyles();

  useEffect(() => {
    fetchPosts(page,rowsPerPage);
  }, [userId]);

  const fetchPosts = async (page:number, pageSize:number) => {
    
    setLoading(true);
    setError('');

    try {
      const response = await getUserPosts(userId as string,page,pageSize);
      const map = data;
      response?.data.posts.forEach((post:Post)=>{
        if(!map.has(post.id) && !deletedPostIds.includes(post.id)) {
          map.set(post.id,post);
        }
      });
      const fetchedPosts = Array.from(map.values());
      setPosts(fetchedPosts);
      setTotalPosts(response?.data.totalPosts)
    } catch (error) {
      setError('Error fetching posts');
      console.error('Error fetching posts:', error);
    }

    setLoading(false);
  };

  const handleDeletePost = async (postId: number) => {
    try {
      setLoading(true);
      await deleteUserPost(postId);
      setPosts((prevPosts) => prevPosts.filter((post: Post) => post.id !== postId));
      setDeletedPostIds((prevDeletedPostIds) => [...prevDeletedPostIds, postId]);
      setTotalPosts((prevTotalPosts)=>prevTotalPosts - 1);
      setLoading(false);

      if(slicedPosts.length===1 && page > 0) {
        setPage((prevPage)=>prevPage - 1);
      }
      else if (slicedPosts.length===1 && page === 0 && totalPosts > 1) {
        fetchPosts(0,rowsPerPage);
      }

    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = event.target.value;
    setSearchText(searchText);
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
    // if(newPage>page)
      fetchPosts(newPage,rowsPerPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderTableHeader = () => {
    return (
      <TableHead>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>Body</TableCell>
          <TableCell>Action</TableCell>
        </TableRow>
      </TableHead>
    );
  };

  const renderTableContent = () => {
    return (
      <TableBody>
        {slicedPosts.length ? (
          slicedPosts.map((post: Post) => (
            <TableRow key={post.id}>
              <TableCell>{post.title}</TableCell>
              <TableCell>{post.body}</TableCell>
              <TableCell>
                <DeleteIcon className={classes.deleteColumn} onClick={() => handleDeletePost(post.id)} />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3}>Posts were not found</TableCell>
          </TableRow>
        )}
      </TableBody>
    );
  };

  const renderTable = () => {
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
        count={totalPosts}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    );
  };

  const renderFilterPosts = () => {
    return (
      <div className='post-search-field'>
        <TextField
          label="Search"
          variant="outlined"
          value={searchText}
          onChange={handleSearchTextChange}
        />
    </div>
    )
  }

  const renderMainContent = () => {
    return (
      loading ? (
        <div className='circular-progress-container'> <CircularProgress /> </div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <>
          {renderTable()}
          {renderTablePaginationInfo()}
        </>
      )
    )
  }

  const filteredPosts = useMemo(() => {
    return posts.filter((post: Post) =>
      post.title.toLowerCase().includes(searchText.toLowerCase())
      && !deletedPostIds.includes(post.id)
    );
  }, [posts, searchText, deletedPostIds]);

  const slicedPosts = searchText.length ?
   filteredPosts.slice(0, filteredPosts.length) : 
   filteredPosts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
  return (
    <div className='posts-table-wrapper'>
      {renderFilterPosts()}
      {renderMainContent()}
    </div>
  );
};

export default UserPosts;

