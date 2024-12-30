import uuid
import os
from typing import Any, Optional

from fastapi import Form, APIRouter, HTTPException
from sqlmodel import func, select, or_
from pyfa_converter_v2 import PyFaDepends


from app.core.config import settings
from app.api.deps import CurrentUser, SessionDep
from app.models import Item, ItemCreate, ItemPublic, ItemsPublic, ItemUpdate, Message

router = APIRouter(prefix="/items", tags=["items"])

root_directory = os.getcwd()

@router.get("/", response_model=ItemsPublic)
def read_items(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
) -> Any:
    """
    Retrieve items.
    """

    if current_user.is_superuser:
        count_statement = select(func.count()).select_from(Item)
        count = session.exec(count_statement).one()
        statement = select(Item).offset(skip).limit(limit)
        items = session.exec(statement).all()
    else:
        count_statement = (
            select(func.count())
            .select_from(Item)
            .where(or_(Item.owner_id == current_user.id, Item.is_public == True))
        )
        count = session.exec(count_statement).one()
        statement = (
            select(Item)
            .where(or_(Item.owner_id == current_user.id, Item.is_public == True))
            .order_by(Item.is_public)
            .offset(skip)
            .limit(limit)
        )
        items = session.exec(statement).all()

    return ItemsPublic(data=items, count=count)


@router.get("/{id}", response_model=ItemPublic)
def read_item(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Any:
    """
    Get item by ID.
    """
    item = session.get(Item, id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if not current_user.is_superuser and (item.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return item



@router.post("/", response_model=ItemPublic)
async def create_item(
    *, session: SessionDep, current_user: CurrentUser, item_in: ItemCreate = PyFaDepends(Form, ItemCreate)
) -> Any:
    """
    Create new item.
    """
    unique_filename = f"{uuid.uuid4()}_{item_in.file.filename}"
    file_location = os.path.join(settings.UPLOAD_DIR, "source", unique_filename)

    file_content = await item_in.file.read()

    with open(os.path.join(root_directory, file_location), "wb") as f:
        f.write(file_content)

    res_file_location = os.path.join(settings.UPLOAD_DIR, "result", unique_filename)

    with open(os.path.join(root_directory, res_file_location), "wb") as f:
        f.write(file_content)

    item = Item.model_validate(item_in, update={"owner_id": current_user.id, "source_url": file_location, "result_url": res_file_location })

    session.add(item)
    session.commit()
    session.refresh(item)
    return item


@router.put("/{id}", response_model=ItemPublic)
def update_item(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID,
    item_in: ItemUpdate,
) -> Any:
    """
    Update an item.
    """
    item = session.get(Item, id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if not current_user.is_superuser and (item.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    update_dict = item_in.model_dump(exclude_unset=True)
    item.sqlmodel_update(update_dict)
    session.add(item)
    session.commit()
    session.refresh(item)
    return item


@router.delete("/{id}")
def delete_item(
    session: SessionDep, current_user: CurrentUser, id: uuid.UUID
) -> Message:
    """
    Delete an item.
    """
    item = session.get(Item, id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if not current_user.is_superuser and (item.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    session.delete(item)
    session.commit()
    return Message(message="Item deleted successfully")
