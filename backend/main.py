from fastapi import FastAPI, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
import schemas

from database import engine, SessionLocal

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Student Activity Tracker API",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Database Dependency
def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# Home Route
@app.get("/")
def home():
    return {
        "message": "Student Activity Tracker API Running"
    }


# Add New Activity
@app.post("/activities", status_code=status.HTTP_201_CREATED)
def add_activity(
    activity: schemas.ActivityCreate,
    db: Session = Depends(get_db)
):

    new_activity = models.Activity(
        name=activity.name,
        activity=activity.activity,
        hours=activity.hours
    )

    db.add(new_activity)
    db.commit()
    db.refresh(new_activity)

    return {
        "message": "Activity added successfully",
        "data": {
            "name": new_activity.name,
            "activity": new_activity.activity,
            "hours": new_activity.hours
        }
    }


# Get All Activities
@app.get("/activities")
def get_activities(db: Session = Depends(get_db)):

    activities = db.query(models.Activity).all()

    activity_list = []

    for activity in activities:
        activity_list.append({
            "name": activity.name,
            "activity": activity.activity,
            "hours": activity.hours
        })

    return {
        "count": len(activity_list),
        "activities": activity_list
    }


# Get Summary Data
@app.get("/summary")
def get_summary(db: Session = Depends(get_db)):

    activities = db.query(models.Activity).all()

    total_entries = len(activities)

    total_hours = sum(activity.hours for activity in activities)

    user_hours = {}

    for activity in activities:

        if activity.name not in user_hours:
            user_hours[activity.name] = 0

        user_hours[activity.name] += activity.hours

    most_active_user = "No activities yet"

    if user_hours:
        most_active_user = max(user_hours, key=user_hours.get)

    return {
        "total_entries": total_entries,
        "total_hours": total_hours,
        "most_active_user": most_active_user
    }