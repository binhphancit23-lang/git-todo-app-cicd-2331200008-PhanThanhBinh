const { TodoService } = require('../../js/model');

describe('TodoService Unit Tests', () => {
    let service;

    beforeEach(() => {
        // TodoService is a singleton, so reset its state between tests.
        service = new TodoService();
        service.todos = [];
        service.observers = [];
    });

    test('should add a new todo', () => {
        service.addTodo('Buy groceries');

        expect(service.todos).toHaveLength(1);
        expect(service.todos[0]).toEqual({
            id: expect.any(Number),
            text: 'Buy groceries',
            completed: false
        });
    });

    test('should toggle the completed state of a todo', () => {
        service.addTodo('Finish assignment');
        const todoId = service.todos[0].id;

        service.toggleTodoComplete(todoId);
        expect(service.todos[0].completed).toBe(true);

        service.toggleTodoComplete(todoId);
        expect(service.todos[0].completed).toBe(false);
    });

    test('should remove a todo', () => {
        service.addTodo('Clean the room');
        const todoId = service.todos[0].id;

        service.removeTodo(todoId);

        expect(service.todos).toHaveLength(0);
    });

    test('should not add a todo if text is empty', () => {
        service.addTodo('');

        expect(service.todos).toHaveLength(0);
    });

    test('should notify observers when a todo is added, toggled, or removed', () => {
        const snapshots = [];
        const observer = {
            update: jest.fn(todos => {
                snapshots.push(todos.map(todo => ({ ...todo })));
            })
        };
        service.addObserver(observer);

        service.addTodo('Read a book');
        const todoId = service.todos[0].id;
        service.toggleTodoComplete(todoId);
        service.removeTodo(todoId);

        expect(observer.update).toHaveBeenCalledTimes(3);
        expect(snapshots).toEqual([
            [{ id: todoId, text: 'Read a book', completed: false }],
            [{ id: todoId, text: 'Read a book', completed: true }],
            []
        ]);
    });

    test('should return the current todo list', () => {
        service.addTodo('Review pull request');

        expect(service.getTodos()).toBe(service.todos);
        expect(service.getTodos()[0].text).toBe('Review pull request');
    });
});