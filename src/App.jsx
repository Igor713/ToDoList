import { useState, useEffect } from 'react'
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from 'react-icons/bs'
import { Form, Button, Table } from 'react-bootstrap'
import './App.scss'

const App = () => {

  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [todos, setTodos] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const res = await fetch('http://localhost:5000/todos')
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.log(err))

      setLoading(false)

      setTodos(res)
    }

    loadData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const todo = {
      id: Math.random(),
      title,
      time,
      completed: false
    }

    await fetch('http://localhost:5000/todos', {
      method: 'POST',
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    setTodos((prev) => [...prev, todo])

    setTitle('')
    setTime('')
  }

  const handleEdit = async (todo) => {
    todo.completed = !todo.completed

    const data = await fetch(`http://localhost:5000/todos/${todo.id}`, {
      method: 'PUT',
      body: JSON.stringify(todo),
      headers: {
        'Content-type': 'application/json'
      }
    })

    setTodos((prev) => prev.map((item) => (item.id === data.id ? (item = data) : item)))
  }

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/todos/${id}`, {
      method: 'DELETE',
    })

    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  if (loading) {
    return <p>Carregando...</p>
  }

  return (
    <div className='app'>
      <Form onSubmit={handleSubmit}>
        <h2>Nova tarefa</h2>
        <Form.Group className="mb-3">
          <Form.Label>Insira a tarefa a ser executada</Form.Label>
          <Form.Control type='text'
            name='title'
            onChange={(e) => setTitle(e.target.value)}
            value={title || ''}
            required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Horário que será executado</Form.Label>
          <Form.Control
            type='text'
            name='time'
            onChange={(e) => setTime(e.target.value)}
            value={time || ''}
            required />
        </Form.Group>
        <Button variant="primary" type="submit">
          Criar tarefa
        </Button>
      </Form>

      <div className="todo-container">
        <h2>Lista de tarefas</h2>
        <Table striped>
          <thead>
            <tr>
              <th>Título</th>
              <th>Tempo</th>
              <th>Finalizar</th>
              <th>Excluir</th>
            </tr>
          </thead>
          <tbody>
            {todos.length !== 0 && todos.map((item, index) => (
              <tr key={index}>
                <td className={item.completed ? 'active' : ''}>{item.title}</td>
                <td>{item.time}</td>
                <td onClick={() => handleEdit(item)}>
                  {!item.completed ? <BsBookmarkCheck /> : <BsBookmarkCheckFill className='fill' />}
                </td>
                <td>
                  <BsTrash className='trash' onClick={() => handleDelete(item.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {todos.length === 0 && <h4>Não há tarefas!</h4>}
      </div>
    </div>
  )
}

export default App


