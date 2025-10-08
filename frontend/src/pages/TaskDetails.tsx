import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Button,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment';
import type { AppDispatch, RootState } from '../store';
import { fetchTaskById, deleteTask } from '../store/slices/taskSlice';

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

const TaskDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentTask: task, loading } = useSelector((state: RootState) => state.tasks);

  useEffect(() => {
    if (id) {
      dispatch(fetchTaskById(id));
    }
  }, [dispatch, id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await dispatch(deleteTask(id!));
      navigate('/');
    }
  };

  if (loading || !task) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back
        </Button>
        <Box>
          <Button
            startIcon={<EditIcon />}
            onClick={() => navigate(`/task/${id}/edit`)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            startIcon={<DeleteIcon />}
            color="error"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {task.title}
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <Box>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Status
              </Typography>
              <Chip
                label={task.status}
                color={statusColors[task.status]}
                size="small"
              />
            </Box>

            <Box>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Priority
              </Typography>
              <Chip
                label={task.priority}
                color={priorityColors[task.priority]}
                size="small"
              />
            </Box>

            <Box>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Due Date
              </Typography>
              <Typography>
                {moment(task.dueDate).format('MMMM DD, YYYY')}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Assigned To
              </Typography>
              <Typography>{task.assignedTo.username}</Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Description
            </Typography>
            <Typography paragraph>
              {task.description}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Created by {task.createdBy.username} on{' '}
              {moment(task.createdAt).format('MMMM DD, YYYY')}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default TaskDetails;