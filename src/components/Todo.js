import React, { useEffect, useReducer, useMemo } from "react"
import { Fragment } from "react"
import axios from "axios";
import List from "./List";
import { useFormInput } from "../hooks/forms";

const Todo = props =>{
    
    const todoInput = useFormInput();

    const todoListReducer = (state, action) =>{
        switch(action.type){
            case 'ADD':
                return state.concat(action.payload);
            case 'SET':
                return action.payload
            case 'REMOVE':
                return state.filter((todo)=> todo.id !== action.payload);
            default:
                return state;
        }
    }      

    const [todoList, dispatch] = useReducer(todoListReducer, [])
    
    useEffect(()=>{
        axios.get('https://newlist-237af-default-rtdb.firebaseio.com/todos.json').then(result=>{
            console.log(result);
            const todoData = result.data;
            const todos = []
            for (let key in todoData){
                todos.push({id: key, name: todoData[key].name})
            }
            dispatch({type: 'SET', payload: todos})
            
        })  
        return () => {
            console.log('Cleanup')
        } 
        
    }, [])
    const mouseMoveHandler = event =>{
            console.log(event.clientX, event.clientY);
        }
    
    useEffect(()=>{
        document.addEventListener('mousemove', mouseMoveHandler);
        return () =>{
            document.removeEventListener('mousemove', mouseMoveHandler)
        }
    }, []);


    const todoAddHandler = () =>{
        const todoName = todoInput.value;
        axios.post('https://newlist-237af-default-rtdb.firebaseio.com/todos.json', {name: todoName})
        .then(res=>{
            const todoItem = {id: res.data.name, name: todoName}
            dispatch({type: 'ADD', payload: todoItem})
        }).catch(err=>{
            console.log(err)
        })
    }
    const todoRemoveHandler = todoId =>{
        axios.delete(`https://newlist-237af-default-rtdb.firebaseio.com/todos/${todoId}.json`)
        .then(res=>{
            dispatch({type:'REMOVE', payload: todoId})
        })
        .catch((err)=> console.log(err))
    }

    return(<Fragment>
        <input 
        type='text' 
        placeholder='todo'
        onChange={todoInput.onChange}
        value={todoInput.value}
        style= {{backgroundColor: todoInput.validity? 'transparent': 'red' }}
        />
        <button onClick={todoAddHandler} type='button'>Add</button>
        {useMemo(()=> (<List items={todoList} onClick={todoRemoveHandler} />), [todoList])} 
    </Fragment>
    )

}

export default Todo;