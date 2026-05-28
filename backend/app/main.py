from app.tasks import classify_ticket_task
from app.services.ai_classifier import classify_ticket
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.services.embedding_service import generate_embedding

from app.db.database import Base, engine, SessionLocal
from app.models.ticket import Ticket
from app.schemas.ticket import TicketCreate

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SupportFlowAI")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/tickets")
def get_tickets(db: Session = Depends(get_db)):

    tickets = db.query(Ticket).all()

    response = []

    for ticket in tickets:

        response.append({
            "id": ticket.id,
            "title": ticket.title,
            "description": ticket.description,
            "priority": ticket.priority,
            "category": ticket.category,
            "status": ticket.status
        })

    return response

@app.post("/tickets")
def create_ticket(ticket: TicketCreate, db: Session = Depends(get_db)):

    db_ticket = Ticket(
        title=ticket.title,
        description=ticket.description
    )

    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)

    classify_ticket_task.delay(
        db_ticket.id,
        db_ticket.description
    )

    return {
        "message": "Ticket created successfully",
        "ticket_id": db_ticket.id
    }

@app.get("/tickets")
def get_tickets(db: Session = Depends(get_db)):
    return db.query(Ticket).all()
