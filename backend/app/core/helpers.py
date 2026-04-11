from fastapi import HTTPException
from sqlalchemy.orm import Session


def get_or_404(db: Session, model, record_id: int, usuario_id: int, detail: str = "Recurso no encontrado"):
    record = db.query(model).filter(
        model.id == record_id,
        model.usuario_id == usuario_id
    ).first()

    if not record:
        raise HTTPException(status_code=404, detail=detail)

    return record
