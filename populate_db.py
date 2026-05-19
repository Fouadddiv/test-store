import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myshop_backend.settings')
django.setup()

from api.models import Product

products = [
    {
        "name": "labtop",
        "description": "ASUS D540Y laptop with 4GB RAM and 256GB SSD",
        "image_url": "asusLab.jpg",
        "price": 1200.00
    },
    {
        "name": "screene",
        "description": "19-inch LED screen with VGA and HDMI ports.",
        "image_url": "ecront.jpg",
        "price": 300.00
    },
    {
        "name": "smarte tv",
        "description": "Google TV Smart TV with vibrant display and sleek design.",
        "image_url": "streemTv.jpg",
        "price": 800.00
    },
    {
        "name": "reelm c72",
        "description": "Realme C72 with large display and strong battery.",
        "image_url": "reelm.jpg",
        "price": 450.00
    },
    {
        "name": "twinBox",
        "description": "Twin Box with internet and TV support.",
        "image_url": "twinBox.jpg",
        "price": 150.00
    },
    {
        "name": "M20 Pro Earbuds",
        "description": "Wireless earbuds with deep bass and long battery life.",
        "image_url": "m20Pro.jpg",
        "price": 75.00
    }
]

for prod in products:
    Product.objects.get_or_create(
        name=prod['name'],
        description=prod['description'],
        image_url=prod['image_url'],
        price=prod['price']
    )

print("Database populated successfully!")
