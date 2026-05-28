from openai import OpenAI
from dotenv import load_dotenv
import os
import json

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


def classify_ticket(description: str):

    prompt = f"""
    Analyze this support ticket.

    Return JSON only in this format:

    {{
        "priority": "LOW | MEDIUM | HIGH",
        "category": "Billing | Technical | Account | Security",
        "sentiment": "Neutral | Frustrated | Angry"
    }}

    Ticket:
    {description}
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    content = response.choices[0].message.content

    return json.loads(content)
