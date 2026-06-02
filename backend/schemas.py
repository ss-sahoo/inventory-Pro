from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# Product schemas
class ProductBase(BaseModel):
    name: str
    sku: str
    price: float
    quantity: int

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = None

class Product(ProductBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Customer schemas
class CustomerBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: str

class CustomerCreate(CustomerBase):
    pass

class Customer(CustomerBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Order Item schemas
class OrderItemBase(BaseModel):
    product_id: int
    quantity: int

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: int
    unit_price: float
    product: Product

    class Config:
        from_attributes = True

# Order schemas
class OrderBase(BaseModel):
    customer_id: int

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class Order(OrderBase):
    id: int
    total_amount: float
    status: str
    created_at: datetime
    customer: Customer
    items: List[OrderItem]

    class Config:
        from_attributes = True