---
title: Async Initialization in Node.js
date: 2021-06-30
use_math: true
---

Tasks that are trivial in traditional synchronous programming can become more complicated when applied to asynchronous programming. A typical example is trying to use a component that requires an asynchronous initialization step. In this case, we have the inconvenience of delaying any attempt to use the component until the initialization completes. 

**Dealing with asynchronously initialized components**

One of the reasons for the existence of synchronous APIs in the Node.js core modules and many npm packages is because they are handy to use for implementing initialization tasks. For simple programs, using synchronous APIs at initialization time can streamline things a lot and the drawbacks associated with their use
remain contained because they are used only once, which is when the program or a particular component is initialized.

Unfortunately, this is not always possible. A synchronous API might not always
be available, especially for components using the network during their initialization phase to, for example, perform handshake protocols or to retrieve configuration parameters. This is the case for many database drivers and clients for middleware systems such as message queues.

Let's consider an example where a module called db is used to interact with a remote database. The db module will accept API requests only after the connection and handshake with the database server have been successfully completed. Therefore, no queries or other commands can be sent until the initialization phase is complete.

```javascript
import { EventEmitter } from 'events'
class DB extends EventEmitter {
    connected = false
    connect () {
        // simulate the delay of the connection
        setTimeout(() => {
            this.connected = true
            this.emit('connected')
        }, 500) 
    }
    async query (queryString) {
        if (!this.connected) {
            throw new Error('Not connected yet')
        }
    console.log(`Query executed: ${queryString}`)
  }
}

export const db = new DB()
```

This is a typical example of an asynchronously initialized component. Under these assumptions, we usually have two quick and easy solutions to this problem, which we can call local initialization check and delayed startup. Let's analyze them in more detail.

**Local initialization check**

The first solution makes sure that the module is initialized before any of its APIs are invoked; otherwise, we wait for its initialization. This check has to be done every time we want to invoke an operation on the asynchronous module:

```javascript 
import { once } from 'events'
import { db } from './db.js'

db.connect()
async function updateLastAccess () {
  if (!db.connected) {
    await once(db, 'connected')
  }
  await db.query(`INSERT (${Date.now()}) INTO "LastAccesses"`)
}
updateLastAccess()

setTimeout(() => {
  updateLastAccess()
}, 600)

```

As already anticipated, any time we want to invoke the query() method on the db component, we have to check if the module is initialized; otherwise, we wait for its initialization by listening for the 'connected' event. A variation of this technique performs the check inside the query() method itself, which shifts the burden of the boilerplate code from the consumer to the provider of the service.

**Delayed startup**

The second quick and dirty solution to the problem of asynchronously initialized components involves delaying the execution of any code relying on the asynchronously initialized component until the component has finished its initialization routine. We can see an example of such a technique in the following code fragment:

```javascript
import { db } from './db.js'
import { once } from 'events'
async function initialize () {
  db.connect()
  await once(db, 'connected')
}
async function updateLastAccess () {
  await db.query(`INSERT (${Date.now()}) INTO "LastAccesses"`)
}

initialize()
  .then(() => {
    updateLastAccess()
    setTimeout(() => {
      updateLastAccess()
    }, 600)
})
```

As we can see from the preceding code, we first wait for the initialization to complete, and then we proceed with executing any routine that uses the db object.

The main disadvantage of this technique is that it requires us to know, in advance, which components will make use of the asynchronously initialized component, which makes our code fragile and exposed to mistakes. One solution to this problem is delaying the startup of the entire application until all the asynchronous services are initialized. This has the advantage of being simple and effective; however, it can add a significant delay to the overall startup time of the application and moreover, it won't take into account the case in which the asynchronously initialized component has to be reinitialized.

As we will see in the next section, there is a third alternative that allows us to transparently and efficiently delay every operation until the asynchronous initialization step has completed.

**Pre-initialization queues**

Another recipe to make sure that the services of a component are invoked only after the component is initialized involves the use of queues and the Command pattern. The idea is to queue the method invocations (only those requiring the component to be initialized) received while the component is not yet initialized, and then execute them as soon as all the initialization steps have been completed.

Let's see how this technique can be applied to our sample db component:

```javascript
import { EventEmitter } from 'events'
class DB extends EventEmitter {
    connected = false
    commandsQueue = []
    async query (queryString) {
        if (!this.connected) {
            console.log(`Request queued: ${queryString}`)
            return new Promise( (resolve, reject) => {
                    const command = () => {
                        this.query(queryString)
                            .then(resolve, reject)
                    }
                    this.commandsQueue.push(command)
                }
            )
        }
        console.log(`Query executed: ${queryString}`)
    }
    connect () {
        // simulate the delay of the connection
        setTimeout(() => {
            this.connected = true
            this.emit('connected')
            this.commandsQueue.forEach(command => command())
            this.commandsQueue = []
        }, 500) 
    }
}

export const db = new DB()
```

The technique described here consists of two parts:

- If the component has not been initialized—which, in our case, is when the connected property is false—we create a command from the parameters received with the current invocation and push it to the commandsQueue array. When the command is executed, it will run the original query() method again and forward the result to the Promise we are returning to the caller.

- When the initialization of the component is completed—which, in our case, means that the connection with the database server is established—we go through the commandsQueue, executing all the commands that have been previously queued.

With the DB class we just implemented, there is no need to check if the component is initialized before invoking its methods. In fact, all the logic is embedded in the component itself and any consumer can just transparently use it without worrying about its initialization status.

We can also improve the modularity using a State pattern with two states.

- The first state implements all the methods that require the component to be initialized, and it's activated only when there is a successful initialization. Each of these methods implements its own business logic without worrying about the initialization status of the db component

- The second state is activated before the initialization has completed and it implements the same methods as the first state, but their only role here is to add a new command to the queue using the parameters passed to the invocation.

Let's see how we can apply the structure we just described to our db component. First, we create the InitializedState, which implements the actual business logic of our component:

```javascript
class InitializedState {
  async query (queryString) {
    console.log(`Query executed: ${queryString}`)
  }
}
```

As we can see, the only method that we need to implement in the InitializedState class is the query() method, which will print a message to the console when it receives a new query.

Next, we implement the QueuingState, the core of our recipe. This state implements the queuing logic:

```javascript
const METHODS_REQUIRING_CONNECTION = ['query']
const deactivate = Symbol('deactivate')

class QueuingState {
  constructor (db) {
    this.db = db
    this.commandsQueue = []
    METHODS_REQUIRING_CONNECTION.forEach(methodName => {
      this[methodName] = function (...args) {
        console.log('Command queued:', methodName, args)
        return new Promise((resolve, reject) => {
          const command = () => {
            db[methodName](...args)
              .then(resolve, reject)
          }
          this.commandsQueue.push(command)
        })
    } })
  }
  [deactivate] () {
        this.commandsQueue.forEach(command => command())
        this.commandsQueue = []
    } 
}
```

The QueuingState is mostly built dynamically at creation time. For each method that requires an active connection, we create a new method for the current instance, which queues a new command representing the function invocation. When the command is executed at a later time, when a connection is established, the result of the invocation of the method on the db instance is forwarded to the caller (through the returned promise).

The other important part of this state class is [deactivate](). This method is invoked when the state is deactivated (which is when the component is initialized) and it executes all the commands in the queue. Note how we used a Symbol to name the method. This will avoid any name clashes in the future if we add more methods to the state (for example, what if we need to decorate a hypothetical deactivate() method of the DB class?).

And therefore :

```javascript
class DB extends EventEmitter {
  constructor () {
    super()
    this.state = new QueuingState(this)
  }
  async query (queryString) {
    return this.state.query(queryString)
  }
  connect () {
    // simulate the delay of the connection
    setTimeout(() => {
        this.connected = true
        this.emit('connected')
        const oldState = this.state
        this.state = new InitializedState(this)
        oldState[deactivate] && oldState[deactivate]()
        }, 500) 
    }
}
export const db = new DB()
```

- In the constructor, we initialize the current state of the instance. It's going to be the QueuingState as the asynchronous initialization of the component hasn't been completed yet.

- The only method of our class implementing some (stub) business logic is the query() method. Here, all we have to do is invoke the homonymous method on the currently active state.

- Finally, when we establish the connection with the database (initialization complete), we switch the current state to the InitializedState and we deactivate the old one. The effect of deactivating the QueuedState, as we've seen previously, is that any command that had been queued is now executed.

We can immediately see how this approach allows us to reduce the boilerplate and, at the same time, create a class that is purely business logic (the InitializedState) free from any repetitive initialization check.
The approach we've just seen will only work if we can modify the code of our asynchronously initialized component. In all those cases in which we can't make modifications to the component, we will need to create a wrapper or proxy, but the technique will be mostly similar to what we've seen here.