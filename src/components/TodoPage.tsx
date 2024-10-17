/**
 * @todo YOU HAVE TO IMPLEMENT THE DELETE AND SAVE TASK ENDPOINT, A TASK CANNOT BE UPDATED IF THE TASK NAME DID NOT CHANGE, YOU'VE TO CONTROL THE BUTTON STATE ACCORDINGLY
 */
import { Check, Delete } from '@mui/icons-material';
import {
  Box, Button, Container, IconButton, TextField, Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch.ts';
import { Task } from '../index';

const TodoPage = () => {
  const api = useFetch();
  const [ tasks, setTasks ] = useState<Task[]>([]);

  const handleFetchTasks = async () => setTasks(await api.get('/tasks'));

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`);
      await handleFetchTasks(); // Rafraîchir la liste des tâches après la suppression
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche', error);
    }
  };

  const handleUpdate = async (task: Task, newName: string) => {
    try {
      await api.put(`/tasks/${task.id}`, { name: newName });
      await handleFetchTasks(); // Rafraîchir après la mise à jour
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche', error);
    }
  };
  const handleSave = async () => {
    const newTask = { name: 'Nouvelle tâche' }; // Exemple de nouvelle tâche
    try {
      await api.post('/tasks', newTask);
      await handleFetchTasks(); // Rafraîchir la liste après l'ajout
    } catch (error) {
      console.error("Erreur lors de l'ajout de la tâche", error);
    }
  };

  useEffect(() => {
    (async () => {
      handleFetchTasks();
    })();
  }, []);

  return (
    <Container>
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="h2">HDM Todo List</Typography>
      </Box>

      <Box justifyContent="center" mt={5} flexDirection="column">
        {
          tasks.map((task) => (
            <Box display="flex" justifyContent="center" alignItems="center" mt={2} gap={1} width="100%">
              <TextField
                size="small"
                value={task.name}
                onChange={(e) => setTasks(tasks.map((t) => (t.id === task.id ? { ...t, name: e.target.value } : t)))}
                fullWidth
                sx={{ maxWidth: 350 }}
              />
              <Box>
                <IconButton color="success" onClick={() => handleUpdate(task, task.name)}>
                  <Check />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(task.id)}>
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          ))
        }

        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <Button variant="outlined" onClick={handleSave}>Ajouter une tâche</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default TodoPage;
