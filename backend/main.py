from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
import schemas
from database import Base, engine, get_db

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


@app.get("/")
def home():
    return {"message": "Task Manager API is running"}


@app.post("/tasks", response_model=schemas.TaskResponse)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    new_task = models.Task(
    title=task.title,
    completed=False,
)

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task


@app.get("/tasks", response_model=list[schemas.TaskResponse])
def get_tasks(db: Session = Depends(get_db)):
    return db.query(models.Task).all()


@app.put("/tasks/{task_id}", response_model=schemas.TaskResponse)
def update_task(task_id: int, task: schemas.TaskUpdate, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()

    if db_task is None:
        return {"error": "Task not found"}

    db_task.title = task.title
    db_task.completed = task.completed

    db.commit()
    db.refresh(db_task)

    return db_task


@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()

    if task is None:
        return {"error": "Task not found"}

    db.delete(task)
    db.commit()

    return {"message": "Task deleted successfully"}