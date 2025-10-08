import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TablePagination,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment';
import type { RootState } from '../store';
import type { Task } from '../store/slices/taskSlice';
import { fetchTasks, deleteTask } from '../store/slices/taskSlice';

const priorityColors = {
  low: 'info',
  medium: 'warning',
  high: 'error',
} as const;

const statusColors = {
  pending: 'warning',
  'in-progress': 'info',
  completed: 'success',
} as const;

interface TaskListProps {
  onEditTask: (task: Task) => void;
}

const TaskList = ({ onEditTask }: TaskListProps) => {
  const dispatch = useDispatch();
  const { tasks = [], totalPages = 1, currentPage = 1 } = useSelector((state: RootState) => 
    state.tasks as { tasks: Task[]; totalPages: number; currentPage: number; }
  );
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchTasks({ page: currentPage, limit: rowsPerPage }) as any);
  }, [dispatch, currentPage, rowsPerPage]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    dispatch(fetchTasks({ page: newPage + 1, limit: rowsPerPage }) as any);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    dispatch(fetchTasks({ page: 1, limit: parseInt(event.target.value, 10) }) as any);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await dispatch(deleteTask(id) as any);
    }
  };

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task: Task) => (
              <TableRow key={task._id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>
                  {moment(task.dueDate).format('MMM DD, YYYY')}
                </TableCell>
                <TableCell>
                  <Chip
                    label={task.priority}
                    color={priorityColors[task.priority]}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={task.status}
                    color={statusColors[task.status]}
                    size="small"
                  />
                </TableCell>
                <TableCell>{task.assignedTo.username}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      size="small"
                      onClick={() => onEditTask(task)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(task._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalPages * rowsPerPage}
        rowsPerPage={rowsPerPage}
        page={currentPage - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TaskList;