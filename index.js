// update
const formTemplate = function() {
    /*
    更新框模板
    */
    let form = `
        <div id='id-todo-edit-form'>
            <input placeholder=" update todo" style="width: 200px; height: 34px; font-size: 20px;" id='id-input-update' class="tao-input">
            <button style="font-size: 29px;" id='id-button-update' class="tao-button">update</button>
        </div>
    `
    return form
}

const updateToDB = function (oldValue, newValue) {
    /*
    更新 todo 到 localStorage
    */
    var array = todosFromDB()
    for (let i = 0; i < array.length; i++) {
        if (array[i].tittle == oldValue) {
            array[i].tittle = newValue
        }
    }
    localStorage.todos = JSON.stringify(array)
}

const updateToSpan = function (self) {
    /*
    更新页面 todo
    */
    let cell = self.parentElement.parentElement
    let span = cell.querySelector('.todo-tittle')
    return span
}

const removeUpdateForm = function () {
    /*
    移除更新框
    */
    let form = e('#id-todo-edit-form')
    form.remove()
}

const getUpdateValue = function () {
    /*
    获取更新框数据
    */
    let input = e('#id-input-update')
    let newValue = input.value
    return newValue
}

const updateTodo = function (event) {
    /*
    更新 todo
    */
    let newValue = getUpdateValue()
    let self = event.target
    let span = updateToSpan(self)
    let oldValue = span.innerHTML
    //
    span.innerHTML = newValue
    removeUpdateForm()
    // 同步更新至数据库
    updateToDB(oldValue, newValue)
}

const editTodo = function (event) {
    /*
    添加编辑框
    */
    let self = event.target
    if (self.classList.contains('button-edit')) {
        if (e('#id-button-update') == null) {
            let form = formTemplate()
            self.parentElement.insertAdjacentHTML('beforeend', form)
            // 插入更新框后，给更新按钮绑定函数
            let updateBtn = e('#id-button-update')
            bindEvent(updateBtn, 'click', updateTodo)

        }
    }
}

// add
const inertToList = function (t) {
    /*
    向新建页面插入数据
    */
    let list = e('#id-div-todolist')
    list.insertAdjacentHTML('beforeend', t)
}

const todoTemplate = function(value) {
    /*
    todo 模板
    */
    let t = `
        <div class="todo-cell">
            <button style="font-size: 28px;" class="button-delete tao-button">delete</button>
            <button style="font-size: 28px; margin-left:3px;" class="button-edit tao-button">edit</button>
            <span class="todo-tittle">${value}</span>
        </div>
    `
    return t
}

const getAddValue = function () {
    /*
    从输入框读取数据
    */
    let input = e('#id-input-todo')
    let value = input.value
    input.value = 1
    return value
}

const addToDB = function (value) {
    /*
    向 localStorage 添加 todo
    */
    let t = {
        tittle: value,
    }
    let todos = todosFromDB()
    todos.push(t)
    localStorage.todos = JSON.stringify(todos)
}

const clearAddInput = function () {
    /*
    清空输入框
    */
    let input = e('#id-input-todo')
    input.value = ''
    log(input.value)
}

const addTodo = function () {
    /*
    添加 todo
    */
    let value = getAddValue()
    let t = todoTemplate(value)
    inertToList(t)
    addToDB(value)
    clearAddInput()
}

// delete
const deleteToSpan = function (self) {
    /*
    从 页面 删除 todo
    */
    let cell = self.parentElement
    let span = cell.querySelector('.todo-tittle')
    return span
}

const deleteFromDB = function (value) {
    /*
    从 localStorage 删除 todo
    */
    let todos = todosFromDB()
    for (let i = 0; i < todos.length; i++) {
        if (todos[i].tittle == value) {
            todos.splice(i, 1)
            break
        }
    }
    localStorage.todos = JSON.stringify(todos)
}

const deleteTodo = function (event) {
    /*
    删除 todo
    */
    let self = event.target
    if (self.classList.contains('button-delete')) {
        // 从页面删除
        self.parentElement.remove()
        // 从数据库删除
        let span = deleteToSpan(self)
        let value = span.innerHTML
        deleteFromDB(value)
    }
}

// init
const todosFromDB = function () {
    /*
    读取 localStorage
    */
    if (localStorage.todos == null) {
        localStorage.todos = '[]'
    }
    let todos = JSON.parse(localStorage.todos)
    return todos
}

const initList = function () {
    /*
    向新建页面插入数据
    */
    let todos = todosFromDB()
    for (let i = 0; i < todos.length; i++) {
        let t = todoTemplate(todos[i].tittle)
        inertToList(t)
    }
}

// SPA
const pushState = function(pageName) {
    /*
    给浏览器历史记录添加数据
    */
    let url = 'todo.html?page=' + pageName
    let state = {
        page: pageName,
    }
    history.pushState(state, 'title', url)
    document.title = pageName
}

const showCreate = function () {
    clearactive()
    let create = e('#id-div-todo-create')
    create.classList.add('active')
    pushState('create')
}

const inertToInfo = function (t) {
    /*
    详情页面插入数据
    */
    let list = e('#id-div-todo-info')
    list.insertAdjacentHTML('beforeend', t)
}

const initInfo = function () {
    /*
    初始化详情页数据
    */
    let info = e('#id-div-todo-info')
    info.innerHTML = ''
    let todos = todosFromDB()
    for (let i = 0; i < todos.length; i++) {
        let t = todos[i].tittle + '<br>'
        inertToInfo(t)
    }
}

const showInfo = function () {
    /*
    显示详情页面
    */
    clearactive()
    let info = e('#id-div-todo-info')
    info.classList.add('active')
    initInfo()
    pushState('info')
}

const showPage = function (pageNmae) {
    /*
    根据地址参数初始化页面
    */
    clearactive()
    let selector = '#id-div-todo-' + pageNmae
    let page = e(selector)
    page.classList.add('active')
    initInfo()
}

// main
const initApp = function() {
    /*
    根据地址初始化页面
    */
    let query = location.search
    let [k, v] = query.slice(1).split('=')
    let page = 'create'
    let validPages = ['create', 'info']
    if (k == 'page') {
        if (validPages.includes(v)) {
            page = v
        }
    }
    let pageName = page
    showPage(pageName)
}

const bindEvents = function () {
    let addBtn = e('#id-button-add')
    bindEvent(addBtn, 'click', addTodo)
    let list = e('#id-div-todolist')
    bindEvent(list, 'click', deleteTodo)
    bindEvent(list, 'click', editTodo)
    let createBtn = e('#id-button-create-todo')
    bindEvent(createBtn, 'click', showCreate)
    let infoBtn = e('#id-button-todo-info')
    bindEvent(infoBtn, 'click', showInfo)
    // 监听前进后退
    window.addEventListener("popstate", function(e) {
        let state = e.state;
        let pageName = state.page
        showPage(pageName)
    })
}

const __main = function () {
    /*
    程序入口
    */
    initApp()
    initList()
    bindEvents()
}

__main()
