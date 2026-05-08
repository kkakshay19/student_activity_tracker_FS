from pydantic import BaseModel, Field


class ActivityCreate(BaseModel):

    name: str = Field(..., min_length=2, max_length=50)

    activity: str = Field(..., min_length=2, max_length=100)

    hours: float = Field(..., gt=0)


class ActivityResponse(ActivityCreate):

    id: int

    class Config:
        from_attributes = True