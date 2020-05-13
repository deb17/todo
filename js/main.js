const addUpd = (e) => {
  const ele = document.querySelector('#todo')
  const op = e.target.textContent
  if (op === 'Create') {
    todos.splice(0, 0, {
      id: uuidv4(),
      text: ele.value,
      completed: false,
      status: 'Created',
      date: Date.now(),
    })
  } else if (op === 'Update') {
    const todo = todos.find((todo) => {
      return todo.id === updateId
    })
    updateId = null
    todo.text = ele.value
    todo.status = 'Updated'
    todo.date = Date.now()
    document.querySelector('#submit').textContent = 'Create'
    const cancel = document.querySelector('#cancel')
    document.querySelector('#part-1').removeChild(cancel)
    todos.sort((a, b) => b.date - a.date)
  }
  render()
  save()
  ele.value = ''
}

const render = () => {
  const list = document.querySelector('#list')
  list.innerHTML = ''
  if (todos.length === 0) {
    document.querySelector('#part-2').innerHTML =
      '<h3>There are no todos yet.</h3>'
    return
  }
  todos.forEach((todo) => {
    const li = document.createElement('li')
    li.innerHTML =
      '<span class="li-text">' +
      todo.text +
      '</span>' +
      '<span class="li-date">' +
      ` ${todo.status}: ` +
      moment(todo.date).fromNow() +
      '</span>'
    li.dataset.id = todo.id
    const e1 = document.createElement('img')
    e1.src = './img/edit.svg'
    e1.title = 'Edit'
    e1.addEventListener('click', updateTodo)
    li.appendChild(e1)
    const e2 = document.createElement('img')
    e2.src = './img/x.svg'
    e2.title = 'Delete'
    e2.addEventListener('click', deleteTodo)
    li.appendChild(e2)
    const cbox = document.createElement('input')
    cbox.type = 'checkbox'
    cbox.title = 'Done'
    if (todo.completed) {
      cbox.checked = true
      const span = li.querySelector('.li-text')
      span.style.textDecoration = 'line-through'
    }
    cbox.addEventListener('change', completed)
    li.appendChild(cbox)
    list.appendChild(li)
  })
}

const deleteTodo = (e) => {
  const id = e.target.parentNode.dataset.id
  todos = todos.filter((todo) => {
    return todo.id !== id
  })
  render()
  save()
}

const updateTodo = (e) => {
  const id = e.target.parentNode.dataset.id
  const todo = todos.find((todo) => {
    return todo.id === id
  })
  updateId = id
  document.querySelector('#todo').value = todo.text
  document.querySelector('#submit').textContent = 'Update'
  const cancel = document.createElement('button')
  cancel.textContent = 'Cancel'
  cancel.id = 'cancel'
  cancel.addEventListener('click', cancelUpdate)
  document.querySelector('#part-1').appendChild(cancel)
}

const cancelUpdate = () => {
  document.querySelector('#submit').textContent = 'Create'
  const cancel = document.querySelector('#cancel')
  document.querySelector('#part-1').removeChild(cancel)
  document.querySelector('#todo').value = ''
}

const completed = (e) => {
  const id = e.target.parentNode.dataset.id
  const todo = todos.find((todo) => {
    return todo.id === id
  })
  if (e.target.checked) {
    todo.completed = true
  } else {
    todo.completed = false
  }
  render()
  save()
}
const save = () => {
  localStorage.setItem('todos', JSON.stringify(todos))
}

document.querySelector('#submit').addEventListener('click', addUpd)

data = localStorage.getItem('todos')
if (data) {
  todos = JSON.parse(data)
} else {
  todos = []
}

render()
updateId = null
