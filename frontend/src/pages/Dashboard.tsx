import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import type { AppDispatch, RootState } from '../store';
import type { Task } from '../store/slices/taskSlice';
import { createTask, updateTask } from '../store/slices/taskSlice';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const { user } = useSelector((state: RootState) => state.auth);

  const handleOpen = () => {
    setSelectedTask(undefined);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTask(undefined);
  };

  const handleTaskSubmit = (values: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedTask) {
      dispatch(updateTask({ id: selectedTask._id, taskData: values }));
    } else {
      // The `user` object might be null, so we must add a check.
      if (user) {
        dispatch(createTask({ 
          ...values, 
          assignedTo: { 
            _id: user._id, 
            username: user.username, 
            email: user.email 
          } 
        }));
      }
    }
    handleClose();
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setOpen(true);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Tasks
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          New Task
        </Button>
      </Box>

      <TaskList onEditTask={handleEditTask} />

      {user && (
        <TaskForm
          open={open}
          onClose={handleClose}
          onSubmit={handleTaskSubmit}
          task={selectedTask}
          currentUser={{
            _id: user._id,
            username: user.username,
            email: user.email
          }}
        />
      )}
    </Box>
  );
};

export default Dashboard;