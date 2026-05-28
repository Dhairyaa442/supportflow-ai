from app.tasks import classify_ticket_task
from app.services.ai_classifier import classify_ticket
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.services.embedding_service import generate_embedding
from sqlalchemy import func

from fastapi.middleware.cors import CORSMiddleware

from app.db.database import Base, engine, SessionLocal
from app.models.ticket import Ticket
from app.schemas.ticket import TicketCreate

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SupportFlowAI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.get("/tickets/similar")
def find_similar_tickets(
    query: str,
    db: Session = Depends(get_db)
):

    embedding = generate_embedding(query)

    sql = text("""
        SELECT
            id,
            title,
            description,
            priority,
            category,
            embedding <=> CAST(:embedding AS vector) AS distance
        FROM tickets
        WHERE embedding IS NOT NULL
        ORDER BY distance
        LIMIT 5
    """)

    results = db.execute(
        sql,
        {
            "embedding": str(embedding)
        }
    )

    return [dict(row._mapping) for row in results]

@app.post("/tickets/recommendation")
def get_recommendation(
    description: str,
    db: Session = Depends(get_db)
):

    embedding = generate_embedding(description)

    sql = text("""
        SELECT
            id,
            title,
            category,
            resolution,
            embedding <=> CAST(:embedding AS vector) AS distance
        FROM tickets
        WHERE embedding IS NOT NULL
          AND resolution IS NOT NULL
        ORDER BY distance
        LIMIT 1
    """)

    result = db.execute(
        sql,
        {
            "embedding": str(embedding)
        }
    ).first()

    if not result:
        return {
            "message": "No recommendations found"
        }

    return {
        "similar_ticket_id": result.id,
        "title": result.title,
        "category": result.category,
        "recommended_resolution": result.resolution,
        "distance": result.distance
    }

@app.post("/tickets/{ticket_id}/resolution")
def add_resolution(
    ticket_id: int,
    resolution: str,
    db: Session = Depends(get_db)
):

    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id
    ).first()

    if not ticket:
        return {"message": "Ticket not found"}

    ticket.resolution = resolution

    db.commit()

    return {"message": "Resolution added"}

@app.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):

    total_tickets = db.query(Ticket).count()

    security = db.query(Ticket).filter(
        Ticket.category == "Security"
    ).count()

    billing = db.query(Ticket).filter(
        Ticket.category == "Billing"
    ).count()

    technical = db.query(Ticket).filter(
        Ticket.category == "Technical"
    ).count()

    high_priority = db.query(Ticket).filter(
        Ticket.priority == "HIGH"
    ).count()

    open_tickets = db.query(Ticket).filter(
        Ticket.status == "OPEN"
    ).count()

    return {
        "total_tickets": total_tickets,
        "security": security,
        "billing": billing,
        "technical": technical,
        "high_priority": high_priority,
        "open_tickets": open_tickets
    }