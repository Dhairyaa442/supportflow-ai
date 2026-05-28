from app.worker import celery
from app.services.ai_classifier import classify_ticket
from app.services.embedding_service import generate_embedding

from app.db.database import SessionLocal
from app.models.ticket import Ticket


@celery.task(name="app.tasks.classify_ticket_task")
def classify_ticket_task(ticket_id: int, description: str):

    classification = classify_ticket(description)

    embedding = generate_embedding(description)

    db = SessionLocal()

    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id
    ).first()

    if ticket:

        ticket.priority = classification["priority"]

        ticket.category = classification["category"]

        ticket.embedding = embedding

        db.commit()

    db.close()