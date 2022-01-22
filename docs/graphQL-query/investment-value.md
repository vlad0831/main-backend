### Example risk level queries and mutations

#### Query `getUserInvestmentValue`

#### Request

- without `userId`

```
getUserInvestmentValue {
    id
    investmentValue {
      id
      investmentValue
      description
    }
    userId
  }
```

- with `userId`

```
getUserInvestmentValue(userId: $userId) {
    id
    investmentValue {
      id
      investmentValue
      description
    }
    userId
  }
```
