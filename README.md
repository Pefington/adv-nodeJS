# NodeJS Shop

```mermaid

---
title: DB Diagram
---

erDiagram

    USER ||--o{ ORDER : "places"
    ORDER }o--|| CART : "contains"
    CART ||--|{ PRODUCT : "contains"

    USER ||--o{ PRODUCT : "adds to shop"

```
