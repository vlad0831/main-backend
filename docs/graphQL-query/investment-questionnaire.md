### Example investment questionnaire queries and mutations

#### Query `getAllQuestionnaire`

#### Request

- without `id`

```
query Query {
  getAllQuestionnaire {
    id
    name
    options {
      description
      option
      id
      order
    }
    order
    question
  }
}
```

#### Successful Response

```json
{
  "data": {
    "getAllQuestionnaire": [
      {
        "id": "4c6103d1-1c2d-4ced-a9c7-c9359b3112f1",
        "name": "investor level",
        "options": [
          {
            "description": "I have a deep understanding of markets and investing",
            "option": "Expert",
            "id": "8409f949-7f2a-44d9-9a2f-e4f662cb06a3",
            "order": 3
          },
          {
            "description": "I have a pretty good understanding of how markets work and I've invested before",
            "option": "Experienced",
            "id": "2bced96f-40f1-4bd2-93d2-79285c818fea",
            "order": 2
          },
          {
            "description": "I know the basics, but could definitely use some help",
            "option": "Beginner",
            "id": "73e50f4b-9383-4e57-8219-c5b0a4bfc335",
            "order": 1
          },
          {
            "description": "This is my first time investing but excited to get started",
            "option": "Newbie",
            "id": "9b5c9f98-fc3b-4c42-9543-e34d230a6063",
            "order": 0
          }
        ],
        "order": 1,
        "question": "How would you describe yourself as an investor?"
      },
      {
        "id": "c45cd24a-e316-4ac7-ab4e-9aa548d00e0a",
        "name": "investment goal",
        "options": [
          {
            "description": "Managing the volatility of my money is the priority over growth",
            "option": "Super conservative",
            "id": "9f02cc0a-007b-4036-9c9c-4ea921496908",
            "order": 4
          },
          {
            "description": "Still looking for growth but I tend to play it safe",
            "option": "Conservative",
            "id": "4dacda4b-927a-4884-a7d6-468ab2448ee4",
            "order": 3
          },
          {
            "description": "I want to balance growth and stability of my money equally",
            "option": "Not too hot, not too cold",
            "id": "6e49b5ab-fbac-4880-9a47-e41bf63f4ccd",
            "order": 2
          },
          {
            "description": "I am willing to weather market ups and downs to try an get higher returns",
            "option": "Growth potential",
            "id": "9fea53db-6fbb-4a23-aed1-1170adfa9b44",
            "order": 1
          },
          {
            "description": "I am seeking high return potential and I am willing to accept more market risk",
            "option": "To the moon",
            "id": "b4c63691-3b41-4a55-a909-225099b67a58",
            "order": 0
          }
        ],
        "order": 2,
        "question": "What is your goal for investing with Allio?"
      }
    ]
  }
}
```
