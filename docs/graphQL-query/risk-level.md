### Example risk level queries and mutations

#### Query `getUserRiskLevel`

Request

- without `userId`

```
getUserRiskLevel {
    id
    riskLevel {
      id
      description
      riskLevel
    }
    userId
  }
```

- with `userId`

```
getUserRiskLevel(userId: $userId) {
    id
    riskLevel {
      id
      description
      riskLevel
    }
    userId
  }
```

Successful response

```json
{
  "data": {
    "getUserRiskLevel": {
      "id": "793baef2-ae1d-4225-91ca-f2d5434aedd3",
      "riskLevel": {
        "id": "73ed9dbc-927b-4e0e-8aa2-008ae32cc844",
        "description": "description",
        "riskLevel": 0
      },
      "userId": "815077c3-2892-4bca-a060-0fbc046956d5"
    }
  }
}
```

Failed responses

- User risk level not found

```json
{
  "errors": [
    {
      "message": "User risk level not found",
      "extensions": {
        "code": "NOT_FOUND_ERROR"
      }
    }
  ],
  "data": null
}
```

- Forbidden - user does not have access to the resource

```json
{
  "errors": [
    {
      "message": "Forbidden",
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ],
  "data": null
}
```

- User not found

```json
{
  "errors": [
    {
      "message": "User not found",
      "extensions": {
        "code": "NOT_FOUND_ERROR"
      }
    }
  ],
  "data": null
}
```

- Unauthenticated

```json
{
  "errors": [
    {
      "message": "Unauthorized",
      "extensions": {
        "code": "UNAUTHENTICATED",
        "response": {
          "statusCode": 401,
          "message": "Unauthorized"
        }
      }
    }
  ],
  "data": null
}
```
